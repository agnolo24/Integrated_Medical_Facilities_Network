import os
import shutil
from sklearn.model_selection import train_test_split

# 🔹 Original dataset path
source_dir = r"D:\Main project\Tuberculosis_data_set\TB_Chest_Radiography_Database"

# 🔹 New split dataset path
base_dir = r"D:\Main project\Tuberculosis_data_set\TB_Chest_Radiography_Database_split"

classes = ["Normal", "Tuberculosis"]

for cls in classes:
    print(f"Processing {cls}...")

    # Create train, val, test folders
    os.makedirs(os.path.join(base_dir, "train", cls), exist_ok=True)
    os.makedirs(os.path.join(base_dir, "val", cls), exist_ok=True)
    os.makedirs(os.path.join(base_dir, "test", cls), exist_ok=True)

    # Get all image names
    images = os.listdir(os.path.join(source_dir, cls))

    # 🔹 First split: 10% test
    train_val_imgs, test_imgs = train_test_split(
        images,
        test_size=0.1,
        random_state=42
    )

    # 🔹 Second split: 20% validation (from remaining 90%)
    train_imgs, val_imgs = train_test_split(
        train_val_imgs,
        test_size=0.222,  # 0.222 ≈ 20% of total
        random_state=42
    )

    # 🔹 Copy files
    for img in train_imgs:
        shutil.copy(
            os.path.join(source_dir, cls, img),
            os.path.join(base_dir, "train", cls, img)
        )

    for img in val_imgs:
        shutil.copy(
            os.path.join(source_dir, cls, img),
            os.path.join(base_dir, "val", cls, img)
        )

    for img in test_imgs:
        shutil.copy(
            os.path.join(source_dir, cls, img),
            os.path.join(base_dir, "test", cls, img)
        )

    print(f"{cls} completed!")

print("\n✅ Dataset successfully split into train, val, and test folders.")