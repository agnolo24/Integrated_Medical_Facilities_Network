import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# ===============================
# 1️⃣ Load Trained Model
# ===============================
MODEL_PATH = r"D:\Main project\pneumonia_data_set\pneumonia_model.h5"
IMG_SIZE = 224

model = load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

# ===============================
# 2️⃣ Prediction Function
# ===============================
def predict_image(img_path, threshold=0.85):
    """
    Predict if a chest X-ray image is Normal or Pneumonia.
    Rejects unrelated images if confidence is below threshold.
    """
    if not os.path.exists(img_path):
        print("❌ Error: Image path does not exist.")
        return

    # Load and preprocess image
    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    pred_prob = model.predict(img_array)[0][0]
    confidence = max(pred_prob, 1 - pred_prob)

    # Reject low-confidence images
    if confidence < threshold:
        print("❌ Invalid image. Please upload a valid chest X-ray image.")
        return

    # Map prediction to class
    if pred_prob > 0.5:
        print(f"🩺 Prediction: Pneumonia ({confidence*100:.2f}% confidence)")
    else:
        print(f"🩺 Prediction: Normal ({confidence*100:.2f}% confidence)")

# ===============================
# 3️⃣ Example Usage
# ===============================
if __name__ == "__main__":
    test_image_path = r"D:\Main project\pneumonia_data_set\train\pneumonia\person6_bacteria_22.jpeg"
    predict_image(test_image_path)