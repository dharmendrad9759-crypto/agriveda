import os
import math
import subprocess
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
output_dir = os.path.join("public", "videos", "wheat-stages")
os.makedirs(output_dir, exist_ok=True)

# Map 10 stages to source images and cinematic parameters
STAGE_SOURCES = [
    {
        "id": "stage-1-germination",
        "img": "public/images/wheat-stages/stage-1-germination.jpg",
        "focus": (0.5, 0.55), # center on embryo & radicle
        "zoom": 1.15,
        "sway": 0.003, # minimal underground
        "sunlight": 0.08,
    },
    {
        "id": "stage-2-cri",
        "img": "public/images/wheat-stages/stage-2-cri.jpg",
        "focus": (0.5, 0.6), # crown roots at soil line
        "zoom": 1.12,
        "sway": 0.008,
        "sunlight": 0.10,
    },
    {
        "id": "stage-3-tillering",
        "img": "public/images/wheat-stages/stage-3-tillering.jpg",
        "focus": (0.5, 0.45), # tillering canopy
        "zoom": 1.14,
        "sway": 0.015,
        "sunlight": 0.12,
    },
    {
        "id": "stage-4-stem_elongation",
        "img": "public/images/wheat-stages/stage-4-stem_elongation.jpg",
        "focus": (0.5, 0.5), # stem nodes
        "zoom": 1.12,
        "sway": 0.012,
        "sunlight": 0.10,
    },
    {
        "id": "stage-5-booting",
        "img": "public/images/wheat-stages/stage-5-booting.jpg",
        "focus": (0.5, 0.45), # swollen flag leaf sheath
        "zoom": 1.14,
        "sway": 0.016,
        "sunlight": 0.12,
    },
    {
        "id": "stage-6-heading",
        "img": "public/images/wheat-stages/stage-6-heading.jpg",
        "focus": (0.5, 0.4), # emerged green spike
        "zoom": 1.15,
        "sway": 0.020,
        "sunlight": 0.14,
    },
    {
        "id": "stage-7-flowering",
        "img": "public/images/wheat-stages/stage-7-flowering.jpg",
        "focus": (0.5, 0.45), # spikelets & yellow anthers
        "zoom": 1.16,
        "sway": 0.018,
        "sunlight": 0.15,
    },
    {
        "id": "stage-8-milking",
        "img": "public/images/wheat-stages/stage-8-milking.jpg",
        "focus": (0.5, 0.5), # plump milky grains
        "zoom": 1.14,
        "sway": 0.018,
        "sunlight": 0.12,
    },
    {
        "id": "stage-9-dough",
        "img": "public/images/wheat-stages/stage-9-dough.jpg",
        "focus": (0.5, 0.5), # amber transition
        "zoom": 1.15,
        "sway": 0.022,
        "sunlight": 0.15,
    },
    {
        "id": "stage-10-ripening",
        "img": "public/images/wheat-stages/stage-10-ripening.jpg",
        "focus": (0.5, 0.45), # golden wheat heads
        "zoom": 1.18,
        "sway": 0.025,
        "sunlight": 0.18,
    },
]

# Video properties
FPS = 30
DURATION_SEC = 4
TOTAL_FRAMES = FPS * DURATION_SEC
TARGET_W = 1280
TARGET_H = 720

def generate_video_for_stage(stage):
    stage_id = stage["id"]
    img_path = stage["img"]
    out_path = os.path.join(output_dir, f"{stage_id}.mp4")

    if not os.path.exists(img_path):
        print(f"Skipping {stage_id}, image not found: {img_path}")
        return

    print(f"Rendering cinematic documentary loop for {stage_id}...")

    # Load and fit source image to high-res canvas
    base_im = Image.open(img_path).convert("RGB")
    im_w, im_h = base_im.size

    # Calculate crop to fit 16:9 aspect ratio cleanly
    aspect = TARGET_W / TARGET_H
    if im_w / im_h > aspect:
        new_w = int(im_h * aspect)
        left = (im_w - new_w) // 2
        base_im = base_im.crop((left, 0, left + new_w, im_h))
    else:
        new_h = int(im_w / aspect)
        top = (im_h - new_h) // 2
        base_im = base_im.crop((0, top, im_w, top + new_h))

    # Resize to 1400x788 so we have border room for camera push-in and sway
    render_canvas = base_im.resize((1500, int(1500 / aspect)), Image.Resampling.LANCZOS)
    canv_w, canv_h = render_canvas.size

    # Prepare FFmpeg pipe process
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{TARGET_W}x{TARGET_H}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        out_path,
    ]

    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    fx, fy = stage["focus"]
    max_zoom = stage["zoom"]
    sway_amp = stage["sway"]
    sun_amp = stage["sunlight"]

    # Generate smooth looping frames
    for f in range(TOTAL_FRAMES):
        # Progress 0.0 -> 1.0 -> 0.0 (smooth sine loop so start matches end perfectly!)
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        t = (math.sin(phase - math.pi / 2) + 1.0) / 2.0  # 0 -> 1 -> 0

        # Current zoom level
        zoom = 1.0 + (max_zoom - 1.0) * t

        # Subtle organic wind sway (XY displacement)
        sway_x = math.sin(phase * 1.5) * sway_amp * canv_w
        sway_y = math.cos(phase * 1.0) * sway_amp * 0.4 * canv_h

        # Compute crop box centered at focus point
        cur_w = canv_w / zoom
        cur_h = canv_h / zoom

        center_x = (canv_w * fx) + sway_x
        center_y = (canv_h * fy) + sway_y

        # Clamp boundaries
        crop_left = max(0, min(canv_w - cur_w, center_x - cur_w / 2))
        crop_top = max(0, min(canv_h - cur_h, center_y - cur_h / 2))
        crop_right = crop_left + cur_w
        crop_bottom = crop_top + cur_h

        cropped = render_canvas.crop((crop_left, crop_top, crop_right, crop_bottom))
        frame = cropped.resize((TARGET_W, TARGET_H), Image.Resampling.BILINEAR)

        # Subtle golden sunlight breathing shimmer
        light_boost = 1.0 + math.sin(phase) * sun_amp
        if light_boost != 1.0:
            enhancer = ImageEnhance.Brightness(frame)
            frame = enhancer.enhance(light_boost)

        pipe.stdin.write(frame.tobytes())

    pipe.stdin.close()
    pipe.wait()
    file_size_kb = os.path.getsize(out_path) // 1024
    print(f"Generated {out_path} ({file_size_kb} KB)")

def main():
    print("Starting generation of 10 cinematic wheat documentary videos...")
    for stage in STAGE_SOURCES:
        generate_video_for_stage(stage)
    print("All 10 stage videos generated successfully!")

if __name__ == "__main__":
    main()
