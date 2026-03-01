import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np

# ===============================
# Paths
# ===============================
model_path = r"D:\Main project\COVID_classification_model.h5"
image_path = r"C:\Users\diane\OneDrive\Pictures\photo_2024-05-01_17-24-52.jpg"  # Replace with your test image path

# ===============================
# Load model
# ===============================
model = load_model(model_path)
print("Model loaded successfully!")

# ===============================
# Parameters
# ===============================
IMG_SIZE = 224
CLASSES = ["COVID", "Lung_Opacity", "Normal", "Viral Pneumonia"]

# ===============================
# Load and preprocess image
# ===============================
img = load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))  # loads as RGB
img_array = img_to_array(img)
img_array = img_array / 255.0  # normalize
img_array = np.expand_dims(img_array, axis=0)  # add batch dimension

# ===============================
# Predict
# ===============================
pred = model.predict(img_array)
pred_class = CLASSES[np.argmax(pred)]
confidence = np.max(pred)

print(f"Predicted class: {pred_class}")
print(f"Confidence: {confidence:.2f}")