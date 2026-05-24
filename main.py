import numpy as np
import cv2
import tensorflow as tf
import os
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

IMG_SIZE = 256
MODEL_PATH = "final_unet.keras"

# =========================
# 🔥 ADD THIS: dice_loss
# =========================
def dice_loss(y_true, y_pred, smooth=1):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)

    intersection = tf.reduce_sum(y_true * y_pred)
    return 1 - (2. * intersection + smooth) / (
        tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) + smooth
    )

# =========================
# LOAD MODEL (FIXED)
# =========================
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"dice_loss": dice_loss}
)

# =============================
# PREPROCESS
# =============================
def preprocess(img):
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    return img

# =============================
# PREDICT MASK
# =============================
def predict_mask(img):
    inp = preprocess(img)
    pred = model.predict(inp[np.newaxis, ...], verbose=0)[0, :, :, 0]

    # threshold
    return (pred > 0.5).astype(np.uint8)

# =============================
# CLASSIFY LEFT / RIGHT
# =============================
def classify(mask):
    coords = np.where(mask == 1)

    # กันเคสไม่มี mask
    if len(coords[1]) < 50:
        return "UNKNOWN"

    x_mean = np.mean(coords[1])

    return "LEFT" if x_mean < IMG_SIZE / 2 else "RIGHT"

# =============================
# LOAD + PREDICT
# =============================
def evaluate_folder(folder):
    y_true, y_pred = [], []

    print("\n🚀 START EVALUATION...\n")

    files = [f for f in os.listdir(folder) if f.lower().endswith((".jpg", ".jpeg", ".png"))]

    print(f"📦 Total files: {len(files)}\n")

    for file in files:
        path = os.path.join(folder, file)

        img = cv2.imread(path)
        if img is None:
            continue

        mask = predict_mask(img)
        pred = classify(mask)

        name = file.lower()

        if "left" in name:
            true = "LEFT"
        elif "right" in name:
            true = "RIGHT"
        else:
            true = "UNKNOWN"

        y_true.append(true)
        y_pred.append(pred)

        print(f"{file} → TRUE: {true} | PRED: {pred}")

    return np.array(y_true), np.array(y_pred)

# =============================
# REPORT
# =============================
def full_report(y_true, y_pred):

    labels = ["LEFT", "RIGHT"]

    mask = (y_true != "UNKNOWN")
    y_true = y_true[mask]
    y_pred = y_pred[mask]

    print("\n============================")
    print("📊 FINAL REPORT")
    print("============================")

    acc = accuracy_score(y_true, y_pred)
    print(f"\n🎯 Accuracy: {acc:.4f}")

    cm = confusion_matrix(y_true, y_pred, labels=labels)
    print("\n📌 Confusion Matrix:")
    print(cm)

    print("\n📌 Classification Report:")
    print(classification_report(y_true, y_pred, target_names=labels))

    print("\n📌 Per-Class Accuracy:")

    for i, label in enumerate(labels):
        tp = cm[i, i]
        total = np.sum(cm[i, :])
        print(f"{label}: {tp/total:.4f}" if total > 0 else f"{label}: 0")

    print("\n============================")
    print("✅ DONE")
    print("============================")

# =============================
# RUN
# =============================
if __name__ == "__main__":

    folder = r"C:\leftright\dataset\test"

    y_true, y_pred = evaluate_folder(folder)

    full_report(y_true, y_pred)