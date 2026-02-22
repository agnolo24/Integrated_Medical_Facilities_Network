# ================================
# 1️⃣ Import Libraries
# ================================

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, models
from sklearn.utils.class_weight import compute_class_weight
import numpy as np
import os

# ================================
# 2️⃣ Define Dataset Paths
# ================================

base_dir = r"D:\Main project\Tuberculosis_data_set\TB_Chest_Radiography_Database_split"

train_dir = os.path.join(base_dir, "train")
val_dir = os.path.join(base_dir, "val")

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 10

# ================================
# 3️⃣ Data Generators
# ================================

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True,
    shear_range=0.2
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary'
)

# ================================
# 4️⃣ Handle Class Imbalance
# ================================

classes = train_generator.classes

class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(classes),
    y=classes
)

class_weights = dict(enumerate(class_weights))

print("Class Weights:", class_weights)

# ================================
# 5️⃣ Build Transfer Learning Model
# ================================

base_model = MobileNetV2(
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    include_top=False,
    weights='imagenet'
)

base_model.trainable = False  # Freeze pretrained layers

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ================================
# 6️⃣ Train Model
# ================================

history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    class_weight=class_weights
)

# ================================
# 7️⃣ Save the Model
# ================================

model_save_path = r"D:\Main project\Tuberculosis_data_set\tuberculosis_model.h5"
model.save(model_save_path)

print("\n✅ Model trained and saved successfully!")
print("Saved at:", model_save_path)