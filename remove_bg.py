import os
from rembg import remove
from PIL import Image

input_path = r"C:\Users\HP\.gemini\antigravity\brain\c8079d6c-e65c-4091-8f1e-9def87c5516c\media__1778489014807.png"
output_path = r"d:\GS\public\logo.png"

try:
    input_image = Image.open(input_path)
    # The image has a faux-transparency checkerboard which might confuse rembg.
    # Rembg works surprisingly well but we'll see.
    output_image = remove(input_image)
    output_image.save(output_path)
    print("Background removed and saved successfully.")
except Exception as e:
    print(f"Error: {e}")
