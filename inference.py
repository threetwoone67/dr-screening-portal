import cv2
import numpy as np
import tensorflow as tf

IMG_SIZE = 256

model = tf.keras.models.load_model("model/unet.keras")

def predict_side(img_path):

    img = cv2.imread(img_path)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0

    pred = model.predict(img[np.newaxis, ...])[0, :, :, 0]

    mask = (pred > 0.5).astype(np.uint8)

    coords = np.where(mask == 1)

    if len(coords[1]) == 0:
        return "UNKNOWN"

    x_center = np.mean(coords[1])

    if x_center < IMG_SIZE / 2:
        return "LEFT"
    else:
        return "RIGHT"

print(predict_side("test.jpg"))