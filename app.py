import io
import json
import os
import base64
import time
from typing import Dict, Any, Tuple, Optional, List
from huggingface_hub import hf_hub_download

import cv2
import numpy as np
try:
    import keras
except Exception:
     from tensorflow import keras
import torch
import torch.nn.functional as F
import timm

from PIL import Image
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from torchvision import transforms

# =========================
# DEVICE / PATHS
# =========================
DEVICE = torch.device("cpu")
CONFIG_PATH = "config.json"

# ลด overhead บน CPU ให้ inference นิ่งขึ้น
try:
    torch.set_num_threads(max(1, min(4, os.cpu_count() or 1)))
    torch.set_num_interop_threads(1)
except Exception:
    pass

# โหมด Grad-CAM:
# - "fast"    = ใช้ heatmap แบบเร็ว เหมาะกับ demo / local
# - "medical" = ใช้ Grad-CAM จริง แต่ช้ากว่า
GRADCAM_MODE = os.getenv("GRADCAM_MODE", "fast").lower()

# =========================
# DOWNLOAD MODELS FROM HUGGING FACE
# =========================

BINARY_PATH = hf_hub_download(
    repo_id="threewoone67-dr/dr-binary-classifier",
    filename="binary_model.pth"
)

SEVERITY_PATH = hf_hub_download(
    repo_id="threewoone67-dr/dr-severity-classifier",
    filename="severity_model.pth"
)

EYE_MODEL_PATH = hf_hub_download(
    repo_id="threewoone67-dr/dr-eye-side-classifier",
    filename="eye_classifier_accuracy_95 (1).h5"
)
# ค่า default: output 0 = Left Eye, output 1 = Right Eye
# ถ้าโมเดล .h5 เป็น sigmoid 1 output จะตีความว่า <0.5 = Left Eye, >=0.5 = Right Eye
EYE_LABELS = ["Left Eye", "Right Eye"]

# =========================
# CONFIG
# =========================
with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    config = json.load(f)

IMG_SIZE = int(config["img_size"])
MEAN = config["normalization"]["mean"]
STD = config["normalization"]["std"]

binary_cfg = config["binary"]
severity_cfg = config["severity"]

binary_names = binary_cfg.get("target_names", ["No_DR", "DR"])
severity_names = severity_cfg.get("target_names", ["No_DR", "Mild", "Moderate", "Severe", "PDR"])

transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD),
])

# =========================
# CHECKPOINT LOADER
# =========================
def _clean_state_dict(sd: Dict[str, Any]) -> Dict[str, torch.Tensor]:
    cleaned: Dict[str, torch.Tensor] = {}
    prefixes = ["module.", "model.", "net.", "network.", "_orig_mod."]

    for k, v in sd.items():
        if not torch.is_tensor(v):
            continue
        nk = str(k)
        changed = True
        while changed:
            changed = False
            for p in prefixes:
                if nk.startswith(p):
                    nk = nk[len(p):]
                    changed = True
        cleaned[nk] = v

    return cleaned


def _collect_state_dict_candidates(obj: Any, path: str = "ckpt") -> List[Tuple[str, Dict[str, torch.Tensor]]]:
    candidates: List[Tuple[str, Dict[str, torch.Tensor]]] = []

    if isinstance(obj, dict):
        tensor_items = {k: v for k, v in obj.items() if torch.is_tensor(v)}
        if tensor_items:
            candidates.append((path, _clean_state_dict(tensor_items)))

        preferred_keys = [
            "model",
            "state_dict",
            "model_state_dict",
            "net",
            "network",
            "ema",
            "ema_state_dict",
            "state_dict_ema",
            "model_ema",
            "module",
        ]

        for key in preferred_keys:
            if key in obj:
                candidates.extend(_collect_state_dict_candidates(obj[key], f"{path}.{key}"))

        # เผื่อ checkpoint ใช้ชื่ออื่น
        for key, value in obj.items():
            if key not in preferred_keys and isinstance(value, dict):
                candidates.extend(_collect_state_dict_candidates(value, f"{path}.{key}"))

    return candidates


def _score_candidate(model_state: Dict[str, torch.Tensor], candidate: Dict[str, torch.Tensor]) -> Tuple[int, int, int]:
    matched = 0
    shape_mismatch = 0
    total_expected = len(model_state)

    for k, expected_tensor in model_state.items():
        if k in candidate:
            if tuple(candidate[k].shape) == tuple(expected_tensor.shape):
                matched += 1
            else:
                shape_mismatch += 1

    return matched, shape_mismatch, total_expected


def _is_head_key(key: str) -> bool:
    key = key.lower()
    head_words = ["classifier", "head", "fc", "last_linear", "classif"]
    return any(w in key for w in head_words)


def load_torch_model(model_path: str, model_name: str, num_classes: int, name: str = "MODEL"):
    print(f"\n===== LOADING {name} =====")
    print(f"{name} PATH =", model_path)
    print(f"{name} EXISTS =", os.path.exists(model_path))
    print(f"{name} ARCH =", model_name)
    print(f"{name} NUM_CLASSES =", num_classes)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"{name} file not found: {model_path}")

    model = timm.create_model(
        model_name,
        pretrained=False,
        num_classes=num_classes,
    )

    model_state = model.state_dict()

    ckpt = torch.load(model_path, map_location=DEVICE, weights_only=False)
    candidates = _collect_state_dict_candidates(ckpt)

    if not candidates:
        raise RuntimeError(f"{name} checkpoint has no tensor state_dict candidates")

    best = None
    for cand_name, cand_sd in candidates:
        matched, shape_mismatch, total_expected = _score_candidate(model_state, cand_sd)
        print(f"{name} candidate {cand_name}: matched={matched}/{total_expected}, shape_mismatch={shape_mismatch}, tensors={len(cand_sd)}")
        if best is None or matched > best[1]:
            best = (cand_name, matched, shape_mismatch, cand_sd)

    best_name, matched, shape_mismatch, best_sd = best
    print(f"{name} SELECTED CHECKPOINT KEY =", best_name)
    print(f"{name} BEST MATCH = {matched}/{len(model_state)}")

    # โหลดเฉพาะ key ที่ชื่อและ shape ตรง เพื่อกัน weight ผิด architecture เข้าไป
    filtered = {}
    skipped_shape = []
    for k, v in best_sd.items():
        if k in model_state and tuple(v.shape) == tuple(model_state[k].shape):
            filtered[k] = v
        elif k in model_state:
            skipped_shape.append((k, tuple(v.shape), tuple(model_state[k].shape)))

    missing, unexpected = model.load_state_dict(filtered, strict=False)

    missing_head = [k for k in missing if _is_head_key(k)]
    match_ratio = matched / max(1, len(model_state))

    print(f"{name} MATCH RATIO = {match_ratio:.3f}")
    print(f"{name} MISSING KEYS =", len(missing))
    print(f"{name} UNEXPECTED KEYS =", len(unexpected))
    print(f"{name} SKIPPED SHAPE =", len(skipped_shape))
    print(f"{name} MISSING SAMPLE =", missing[:10])
    print(f"{name} SHAPE SAMPLE =", skipped_shape[:5])

    # ถ้าเยอะมาก แปลว่า config/model_name ไม่ตรงกับไฟล์จริง ห้ามฝืนใช้ เพราะผลจะมั่ว
    if match_ratio < 0.70:
        raise RuntimeError(
            f"{name} weight mismatch: checkpoint does not match config model_name. "
            f"Fix config.json {name.lower()} model_name or use the correct .pth file."
        )

    # ถ้าหัว classifier ไม่เข้า ผล class/confidence จะมั่วแน่นอน
    if missing_head:
        raise RuntimeError(
            f"{name} classifier head not loaded: {missing_head[:10]}. "
            f"Check num_classes or checkpoint file."
        )

    model.to(DEVICE)
    model.eval()
    print(f"{name} LOADED OK")
    return model


binary_model = load_torch_model(
    BINARY_PATH,
    binary_cfg["model_name"],
    int(binary_cfg["num_classes"]),
    name="BINARY"
)

severity_model = load_torch_model(
    SEVERITY_PATH,
    severity_cfg["model_name"],
    int(severity_cfg["num_classes"]),
    name="SEVERITY"
)

# =========================
# EYE MODEL
# =========================
eye_model = None
try:
    print("\n===== LOADING EYE MODEL =====")
    print("EYE MODEL PATH =", EYE_MODEL_PATH)
    print("EYE EXISTS =", os.path.exists(EYE_MODEL_PATH))

    if os.path.exists(EYE_MODEL_PATH):
        eye_model = keras.models.load_model(EYE_MODEL_PATH, compile=False)
        print("EYE MODEL LOADED OK")
    else:
        print("EYE MODEL NOT FOUND")

except Exception as e:
    print("EYE MODEL LOAD ERROR:", e)
    eye_model = None


# =========================
# WARMUP
# =========================
def warmup_models():
    """รัน dummy inference 1 รอบตอนเปิด server เพื่อลด delay รอบแรก"""
    try:
        dummy_pil = Image.new("RGB", (IMG_SIZE, IMG_SIZE), (0, 0, 0))
        dummy_tensor = preprocess_image(dummy_pil).to(DEVICE)

        with torch.inference_mode():
            _ = binary_model(dummy_tensor)
            _ = severity_model(dummy_tensor)

        if eye_model is not None:
            dummy_eye = np.zeros((1, 224, 224, 3), dtype="float32")
            _ = eye_model.predict(dummy_eye, verbose=0)

        print("MODEL WARMUP OK")
    except Exception as e:
        print("MODEL WARMUP SKIPPED:", e)


# =========================
# API
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    return transform(image).unsqueeze(0)


def percent(x: float) -> float:
    """คืนค่าเป็น percent 0-100 สำหรับหน้าเว็บ"""
    return round(float(x) * 100.0, 2)


def predict_eye_side(image: Image.Image):
    """ทำนายตาซ้าย/ขวาด้วยโมเดล Keras .h5

    รองรับทั้งโมเดลแบบ:
    - softmax 2 class: output shape = (1, 2)
    - sigmoid 1 class: output shape = (1, 1)
    """
    try:
        if eye_model is None:
            return "Unknown", 0.0

        # โมเดลแยกตาซ้าย/ขวาส่วนใหญ่เทรนที่ 224x224 + rescale 0-1
        img = image.convert("RGB").resize((224, 224))
        arr = np.array(img).astype("float32") / 255.0
        arr = np.expand_dims(arr, axis=0)

        raw_pred = eye_model.predict(arr, verbose=0)
        pred = np.array(raw_pred).reshape(-1)

        if pred.size == 0:
            return "Unknown", 0.0

        # กรณี sigmoid 1 output
        if pred.size == 1:
            score = float(pred[0])
            if score >= 0.5:
                return "Right Eye", score
            return "Left Eye", 1.0 - score

        # กรณี softmax / probability 2 class หรือมากกว่า
        idx = int(np.argmax(pred))
        conf = float(pred[idx])
        label = EYE_LABELS[idx] if idx < len(EYE_LABELS) else f"Eye class {idx}"

        return label, conf

    except Exception as e:
        print("EYE PREDICTION ERROR:", e)
        return "Unknown", 0.0


def encode_rgb_image_to_base64(rgb_img):
    ok, buffer = cv2.imencode(".jpg", cv2.cvtColor(rgb_img, cv2.COLOR_RGB2BGR))
    if not ok:
        return ""
    encoded = base64.b64encode(buffer).decode("utf-8")
    return "data:image/jpeg;base64," + encoded


def make_simple_heatmap(image: Image.Image):
    try:
        img = np.array(image.convert("RGB"))
        img = cv2.resize(img, (420, 420))

        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        enhanced = cv2.merge((l, a, b))
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)

        green = enhanced[:, :, 1]
        green = cv2.GaussianBlur(green, (31, 31), 0)
        heatmap = cv2.normalize(green, None, 0, 255, cv2.NORM_MINMAX)
        heatmap = 255 - heatmap
        heatmap = cv2.GaussianBlur(heatmap, (25, 25), 0)

        colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
        overlay = cv2.addWeighted(enhanced, 0.62, colored, 0.38, 0)

        return encode_rgb_image_to_base64(overlay)

    except Exception as e:
        print("SIMPLE HEATMAP ERROR:", e)
        return ""


_SEVERITY_GRADCAM_LAYER = None


def find_last_conv_layer(model):
    global _SEVERITY_GRADCAM_LAYER

    if _SEVERITY_GRADCAM_LAYER is not None:
        return _SEVERITY_GRADCAM_LAYER

    last_name = None
    last_conv = None
    for name, module in model.named_modules():
        if isinstance(module, torch.nn.Conv2d):
            last_name = name
            last_conv = module

    _SEVERITY_GRADCAM_LAYER = last_conv
    print("GRADCAM TARGET LAYER =", last_name)
    return last_conv


def make_medical_gradcam(image: Image.Image, model, target_class: int):
    try:
        model.eval()

        original = np.array(image.convert("RGB"))
        original_resized = cv2.resize(original, (420, 420))

        x = preprocess_image(image).to(DEVICE)
        x.requires_grad_(True)

        target_layer = find_last_conv_layer(model)
        if target_layer is None:
            return make_simple_heatmap(image)

        activations = []
        gradients = []

        def forward_hook(module, inputs, output):
            activations.append(output)

        def backward_hook(module, grad_input, grad_output):
            gradients.append(grad_output[0])

        handle_f = target_layer.register_forward_hook(forward_hook)
        handle_b = target_layer.register_full_backward_hook(backward_hook)

        output = model(x)
        score = output[0, target_class]

        model.zero_grad(set_to_none=True)
        score.backward()

        handle_f.remove()
        handle_b.remove()

        if not activations or not gradients:
            return make_simple_heatmap(image)

        acts = activations[0].detach()
        grads = gradients[0].detach()
        weights = torch.mean(grads, dim=(2, 3), keepdim=True)
        cam = torch.sum(weights * acts, dim=1).squeeze()
        cam = F.relu(cam).cpu().numpy()

        cam = cv2.resize(cam, (420, 420))
        cam = cam - cam.min()
        cam = cam / (cam.max() + 1e-8)
        cam = np.uint8(255 * cam)
        cam = cv2.GaussianBlur(cam, (15, 15), 0)

        colored = cv2.applyColorMap(cam, cv2.COLORMAP_JET)
        colored = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)
        overlay = cv2.addWeighted(original_resized, 0.62, colored, 0.38, 0)

        return encode_rgb_image_to_base64(overlay)

    except Exception as e:
        print("GRADCAM ERROR:", e)
        return make_simple_heatmap(image)



@app.on_event("startup")
def _startup_warmup():
    warmup_models()


# =========================
# FRONTEND / HEALTH CHECK
# =========================
@app.get("/api")
def api_root():
    return {"message": "DR API Running"}

@app.get("/")
def root():
    """Serve the frontend login page when available.

    If index.html is not present, keep a JSON health response so Render still works.
    """
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {"message": "DR API Running"}


@app.get("/model-status")
def model_status():
    return {
        "binary_model": {
            "path": BINARY_PATH,
            "loaded": binary_model is not None,
            "labels": binary_names,
        },
        "severity_model": {
            "path": SEVERITY_PATH,
            "loaded": severity_model is not None,
            "labels": severity_names,
        },
        "eye_model": {
            "path": EYE_MODEL_PATH,
            "loaded": eye_model is not None,
            "labels": EYE_LABELS,
        }
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    gradcam: str = Query(default=GRADCAM_MODE)
):
    total_t0 = time.perf_counter()

    # -------------------------
    # 1) Read image
    # -------------------------
    t0 = time.perf_counter()
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    original_size = image.size
    read_time = time.perf_counter() - t0

    # -------------------------
    # 2) Eye classifier (.h5)
    # -------------------------
    t0 = time.perf_counter()
    eye_side, eye_confidence = predict_eye_side(image)
    eye_time = time.perf_counter() - t0

    # -------------------------
    # 3) Preprocess once
    # -------------------------
    t0 = time.perf_counter()
    x = preprocess_image(image).to(DEVICE)
    prep_time = time.perf_counter() - t0

    # -------------------------
    # 4) Binary model (.pth)
    # -------------------------
    t0 = time.perf_counter()
    with torch.inference_mode():
        binary_logits = binary_model(x)
        binary_probs = torch.softmax(binary_logits, dim=1)
        binary_idx = int(torch.argmax(binary_probs, dim=1).item())
        binary_confidence = float(binary_probs[0, binary_idx].item())
    binary_time = time.perf_counter() - t0

    binary_label = binary_names[binary_idx] if binary_idx < len(binary_names) else str(binary_idx)

    # -------------------------
    # 5) Severity model (.pth)
    #    ถ้า Binary = No_DR ให้จบทันที ไม่ต้องรัน severity
    # -------------------------
    severity_time = 0.0
    severity_skipped = False

    if binary_label == "No_DR":
        severity_idx = 0
        severity_label = "No_DR"
        severity_confidence = binary_confidence
        severity_skipped = True
    else:
        t0 = time.perf_counter()
        with torch.inference_mode():
            severity_logits = severity_model(x)
            severity_probs = torch.softmax(severity_logits, dim=1)
            severity_idx = int(torch.argmax(severity_probs, dim=1).item())
            severity_confidence = float(severity_probs[0, severity_idx].item())
        severity_time = time.perf_counter() - t0
        severity_label = severity_names[severity_idx] if severity_idx < len(severity_names) else str(severity_idx)

    # -------------------------
    # 6) Heatmap / Grad-CAM
    #    default = fast เพื่อให้ผลออกไว
    #    ถ้าต้องการ Grad-CAM จริงให้เรียก /predict?gradcam=medical
    # -------------------------
    t0 = time.perf_counter()
    gradcam_mode = (gradcam or GRADCAM_MODE).lower().strip()

    if gradcam_mode in ["none", "off", "false", "0", "no"]:
        gradcam_image = ""
        gradcam_used = "none"
    elif gradcam_mode in ["medical", "real", "gradcam"]:
        gradcam_image = make_medical_gradcam(image, severity_model, target_class=severity_idx)
        gradcam_used = "medical"
    else:
        gradcam_image = make_simple_heatmap(image)
        gradcam_used = "fast"

    gradcam_time = time.perf_counter() - t0
    total_time = time.perf_counter() - total_t0

    timing = {
        "read_image_sec": round(read_time, 3),
        "eye_model_sec": round(eye_time, 3),
        "preprocess_sec": round(prep_time, 3),
        "binary_model_sec": round(binary_time, 3),
        "severity_model_sec": round(severity_time, 3),
        "severity_skipped": severity_skipped,
        "gradcam_sec": round(gradcam_time, 3),
        "gradcam_mode": gradcam_used,
        "total_sec": round(total_time, 3),
        "original_size": {"width": original_size[0], "height": original_size[1]},
    }

    print("========== PREDICT TIMING ==========")
    print(timing)
    print("BINARY RESULT =", binary_label, binary_confidence)
    print("SEVERITY RESULT =", severity_label, severity_confidence)
    print("EYE RESULT =", eye_side, eye_confidence)
    print("GRADCAM =", gradcam_used, "YES" if gradcam_image else "NO")

    return {
        "binary_result": binary_label,
        "binary_prediction": binary_idx,
        "binary_confidence": percent(binary_confidence),

        "severity_result": severity_label,
        "severity_prediction": severity_idx,
        "severity_confidence": percent(severity_confidence),

        "prediction": severity_label,
        "confidence": percent(severity_confidence),

        "eye_side": eye_side,
        "eye_confidence": percent(eye_confidence),

        "gradcam_image": gradcam_image,
        "heatmap_image": gradcam_image,
        "gradcam": gradcam_image,

        "timing": timing,

        "note": "Result from local 3-model DR pipeline. AI output is for screening support and should be confirmed by clinical assessment."
    }


# =========================
# STATIC FRONTEND FALLBACK
# =========================
_ALLOWED_STATIC_EXTENSIONS = {
    ".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".webp", ".txt", ".pdf", ".woff", ".woff2", ".ttf", ".map"
}

@app.get("/{path:path}")
def serve_frontend_file(path: str):
    """Serve frontend files from the project root.

    Examples:
    /dashboard.html, /style.css, /auth.js, /logo-new.jpg

    API routes above still take priority.
    Python/model/config files are not exposed.
    """
    clean_path = path.strip().lstrip("/")

    if not clean_path:
        clean_path = "index.html"

    # Prevent directory traversal and hidden/private files
    if ".." in clean_path or clean_path.startswith("."):
        return JSONResponse({"detail": "Not found"}, status_code=404)

    ext = os.path.splitext(clean_path)[1].lower()
    if ext not in _ALLOWED_STATIC_EXTENSIONS:
        return JSONResponse({"detail": "Not found"}, status_code=404)

    full_path = os.path.abspath(clean_path)
    root_dir = os.path.abspath(".")

    if not full_path.startswith(root_dir):
        return JSONResponse({"detail": "Not found"}, status_code=404)

    if os.path.isfile(full_path):
        return FileResponse(full_path)

    # For direct SPA-style routes, fall back to index.html when available
    if os.path.exists("index.html"):
        return FileResponse("index.html")

    return JSONResponse({"detail": "Not found"}, status_code=404)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
