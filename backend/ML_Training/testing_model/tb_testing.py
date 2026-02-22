import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

# ===============================
# 1️⃣ Load Trained Model
# ===============================
model_path = r"D:\Main project\Tuberculosis_data_set\tuberculosis_model.h5"
model = load_model(model_path)
IMG_SIZE = 224  # same as training

# ===============================
# 2️⃣ Prediction Function
# ===============================
def predict_image(img_path, threshold=0.85):
    """
    Predict whether a chest X-ray image is Normal or Tuberculosis.
    Rejects unrelated images if confidence is below threshold.
    """
    if not os.path.exists(img_path):
        print("❌ Error: Image path does not exist.")
        return

    # Load and preprocess image
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make prediction
    pred_prob = model.predict(img_array)[0][0]  # sigmoid output

    # Determine confidence
    confidence = max(pred_prob, 1 - pred_prob)

    # Reject low-confidence images
    if confidence < threshold:
        print("❌ Invalid image. Please upload a valid chest X-ray image.")
        return

    # Map prediction to class
    if pred_prob > 0.5:
        print(f"🩺 Prediction: Tuberculosis ({confidence*100:.2f}% confidence)")
    else:
        print(f"🩺 Prediction: Normal ({confidence*100:.2f}% confidence)")

# ===============================
# 3️⃣ Example Usage
# ===============================
if __name__ == "__main__":
    test_image_path = r"D:\Main project\Tuberculosis_data_set\TB_Chest_Radiography_Database_split\val\Tuberculosis\Tuberculosis-192.png"
    predict_image(test_image_path)