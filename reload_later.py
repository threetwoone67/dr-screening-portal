
import json
import torch
import timm
from PIL import Image
from torchvision import transforms

DEVICE = torch.device("cpu")

EXPORT_DIR = "."
CONFIG_PATH = f"{EXPORT_DIR}/config.json"
BINARY_PATH = f"{EXPORT_DIR}/binary_model.pth"
SEVERITY_PATH = f"{EXPORT_DIR}/severity_model.pth"

with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

IMG_SIZE = config["img_size"]
MEAN = config["normalization"]["mean"]
STD = config["normalization"]["std"]

binary_cfg = config["binary"]
severity_cfg = config["severity"]

transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])

def load_model(model_path, model_name, num_classes):
    model = timm.create_model(model_name, pretrained=False, num_classes=num_classes)
    ckpt = torch.load(model_path, map_location=DEVICE, weights_only=False)

    if isinstance(ckpt, dict) and "model_state_dict" in ckpt:
        model.load_state_dict(ckpt["model_state_dict"])
    else:
        model.load_state_dict(ckpt)

    model.eval()
    return model

binary_model = load_model(
    BINARY_PATH,
    binary_cfg["model_name"],
    binary_cfg["num_classes"]
)

severity_model = load_model(
    SEVERITY_PATH,
    severity_cfg["model_name"],
    severity_cfg["num_classes"]
)

def predict_dr(image_path):
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0)

    with torch.no_grad():
        # Stage 1: Binary
        binary_logits = binary_model(x)
        binary_probs = torch.softmax(binary_logits, dim=1)
        binary_pred = torch.argmax(binary_probs, dim=1).item()
        binary_conf = float(binary_probs[0, binary_pred])

        binary_label = binary_cfg["target_names"][binary_pred]

        if binary_label == "No_DR":
            return {
                "binary_prediction": binary_label,
                "binary_confidence": binary_conf,
                "severity_prediction": "Not applicable",
                "severity_confidence": None
            }

        # Stage 2: Severity
        severity_logits = severity_model(x)
        severity_probs = torch.softmax(severity_logits, dim=1)
        severity_pred = torch.argmax(severity_probs, dim=1).item()
        severity_conf = float(severity_probs[0, severity_pred])

        severity_label = severity_cfg["target_names"][severity_pred]

        return {
            "binary_prediction": binary_label,
            "binary_confidence": binary_conf,
            "severity_prediction": severity_label,
            "severity_confidence": severity_conf
        }

if __name__ == "__main__":
    test_path = "test.jpg"   # เปลี่ยนเป็น path รูปที่ต้องการทดสอบ
    result = predict_dr(test_path)
    print(result)
