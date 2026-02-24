import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
IMG_BASE_DIR = Path(BASE_DIR).parent

def process_url(file_url):
    file_url = str(Path(file_url))
    img_path = str(IMG_BASE_DIR) + file_url
    return img_path

def tuberculosis(file_url, threshold=0.85):
    model_path = os.path.join(BASE_DIR, "tuberculosis_model.h5")

    model = load_model(model_path) 
    IMG_SIZE = 224  # same as training
    
    img_path = process_url(file_url)
    print("img : ",img_path)

    if not os.path.exists(img_path):
        print("❌ Error: Image path does not exist.",img_path)
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

def pneumonia(file_url, threshold=0.85):

    model_path = os.path.join(BASE_DIR, "pneumonia_model.h5")

    model = load_model(model_path) 
    IMG_SIZE = 224  # same as training
    
    img_path = process_url(file_url)
    print("img : ",img_path)

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
    # print("pred_prob",pred_prob)
    if pred_prob > 0.5:
        print(f"🩺 Prediction: Pneumonia ({confidence*100:.2f}% confidence)")
    else:
        print(f"🩺 Prediction: Normal ({confidence*100:.2f}% confidence)")