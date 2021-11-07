from PIL import Image
import numpy as np
from os import listdir

def crop(png_image_name):
    pil_image = Image.open(png_image_name)
    np_array = np.array(pil_image)
    blank_px = pil_image.getpixel((0,0))
    #blank_px = [255, 255, 255, 0]
    mask = np_array != blank_px
    coords = np.argwhere(mask)
    x0, y0, z0 = coords.min(axis=0)
    x1, y1, z1 = coords.max(axis=0) + 1
    cropped_box = np_array[x0:x1, y0:y1, z0:z1]
    pil_image = Image.fromarray(cropped_box, 'RGBA')
    print(pil_image.width, pil_image.height)
    pil_image.save(png_image_name)
    print(png_image_name)

for f in listdir('.'):
    if f.endswith('.png'):
        crop(f)