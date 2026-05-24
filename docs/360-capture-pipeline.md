# 360° Photogrammetry Capture Pipeline

Ops-runnable spec for producing 360° spin image sequences and optional 3D scans of catalog watches.

> **Audience**: Studio ops team. CTO owns the technical spec; CMO owns production scheduling.
> **Goal**: Produce 360° assets for 20+ watches using a repeatable, documented process.

---

## 1. Equipment

### Turntable Rig

| Component | Recommended | Budget Alternative |
|---|---|---|
| Turntable | Foldio360 Smart (auto 10° increments) | DIY stepper motor + Arduino + A4988 driver |
| Camera | Sony A7R V (61 MP) or Canon R5 | iPhone 15 Pro (ProRAW 48 MP) |
| Lens | 90–100 mm macro (Sony FE 90 mm f/2.8) | Kit lens at 85 mm+ equivalent |
| Tripod | Manfrotto 055 + geared head | Any sturdy tripod with ball head |
| Tethering | USB-C to laptop (Capture One / Lightroom) | Camera timer + SD card reader |
| Riser | Clear acrylic disc (5 cm height) | Glass shelf from IKEA |

The turntable must rotate in precise **10° increments** to produce **36 evenly spaced frames** per revolution. The Foldio360 does this via app control. For DIY rigs, calibrate with a protractor base plate and verify with a test shoot.

### Lighting Setup

| Component | Recommended | Notes |
|---|---|---|
| Key light | Godox SL150II (×2) with softbox | 45° left and right of camera |
| Fill | Godox SL60W or reflector panel | Opposite side, –1 stop from key |
| Polarizer sheets | Linear polarizer film (×2) | Mount over each light source |
| Lens filter | Circular polarizer (CPL) | Mount on camera lens, rotate 90° to lights |
| Light tent | Foldio3 or Orangemonkie capsule | Optional — useful for consistent backgrounds |
| Backdrop | Matte white seamless paper | Or matte black for dark-dial watches |

#### Cross-Polarization (Critical)

Watches and jewelry are highly reflective. Cross-polarization eliminates specular reflections:

1. Tape linear polarizer film over each light source.
2. Mount circular polarizer on camera lens.
3. Rotate lens polarizer 90° relative to light polarizers.
4. Verify: reflections on metal surfaces disappear in live view.

> **Exception — gemstone sparkle**: For watches with prominent gemstones, capture two passes:
> one cross-polarized (for clean geometry) and one unpolarized (for sparkle appearance).

---

## 2. Camera Settings

| Setting | Value | Rationale |
|---|---|---|
| ISO | 100 (lowest native) | Minimize noise on fine textures |
| Aperture | f/11 – f/16 | Maximize depth of field for entire watch |
| Shutter | Remote/tethered trigger, 2 s timer | Eliminate vibration |
| Format | RAW (14-bit) | Maximum latitude for post-processing |
| White balance | Manual, gray-card calibration per session | Consistency across all 36 frames |
| Focus | Manual, focus-peaking on dial center | Do not auto-focus between frames |
| Color space | Adobe RGB | Convert to sRGB in export |

Lock all settings before starting the rotation. Do not touch the camera between frames.

---

## 3. Capture Protocol

### Pre-Shoot Checklist

- [ ] Turntable leveled (bubble level)
- [ ] Watch placed on acrylic riser, centered
- [ ] Camera locked on tripod, level with watch mid-height
- [ ] Gray card shot taken for white balance reference
- [ ] Cross-polarization verified in live view
- [ ] Focus locked on watch dial
- [ ] Test frame reviewed at 100% zoom for sharpness

### 360° Spin Capture (Flat Image Sequence)

1. Set turntable to 0° (12 o'clock mark facing camera).
2. Trigger shutter (tethered or remote).
3. Rotate turntable 10°.
4. Repeat until 36 frames captured (0° through 350°).
5. Review all 36 frames on laptop for sharpness and consistent exposure.

**Naming convention for raw files** (rename in batch export):

```
{slug}_360_{angle}.jpg
```

Examples:
- `rolex-submariner_360_000.jpg`
- `rolex-submariner_360_010.jpg`
- `rolex-submariner_360_350.jpg`

Where `{slug}` is the URL-safe product slug and `{angle}` is the zero-padded 3-digit degree value.

### Multi-Ring Capture (Optional — for 3D Reconstruction)

For watches that also need full 3D models (GLB/USDZ), capture 3 elevation rings:

| Ring | Camera Elevation | Purpose |
|---|---|---|
| Low | 15–20° | Case sides, bracelet links |
| Mid | 40–45° | Dial, bezel, crown |
| High | 70–75° | Crystal top, case back |

This yields ~108 images per watch (3 × 36). Feed all into RealityCapture or Metashape. See `luxury-ar-commerce/PHOTOGRAMMETRY.md` for the full 3D reconstruction pipeline.

---

## 4. Post-Processing

### Step 1: RAW Development

1. Import RAW files into Lightroom or Capture One.
2. Apply gray-card white balance to first frame, sync to all 36.
3. Apply lens profile correction.
4. Export as **TIFF 16-bit** for further processing, or directly to JPEG if no background removal is needed.

### Step 2: Background Removal / Consistency

Option A — **Clean studio backdrop** (preferred):
- Shoot on pure white; use Levels adjustment to clip background to #FFFFFF.
- Apply identically to all 36 frames.

Option B — **AI background removal** (for imperfect setups):
- Use `rembg` CLI or Photoshop "Remove Background" action.
- Export with transparent background (PNG), then composite onto white.

### Step 3: Color Correction Chain

1. White balance correction (from gray card reference).
2. Exposure normalization (histogram match across all 36 frames).
3. Contrast and clarity adjustment (consistent per watch, not per frame).
4. Skin/bracelet tone check against physical reference.

### Step 4: Batch Export to Web-Optimized JPEGs

Final deliverable per watch: **36 JPEG files** at:

| Property | Value |
|---|---|
| Resolution | 1200 × 1200 px |
| Format | JPEG, quality 82 |
| File size target | ~30–50 KB each |
| Color space | sRGB |
| Naming | `{slug}_360_{angle}.jpg` |

Use the batch export script (see Section 5) to automate the resize + compress + rename step.

---

## 5. Batch Export Script

The script `scripts/360-batch-export.sh` automates the final export step using ImageMagick.

### Prerequisites

```bash
brew install imagemagick    # macOS
# or: sudo apt install imagemagick   # Linux
```

### Usage

```bash
./scripts/360-batch-export.sh <input-dir> <slug> <output-dir>
```

**Example:**

```bash
./scripts/360-batch-export.sh \
  ~/captures/rolex-submariner/raw-tiff \
  rolex-submariner \
  ~/captures/rolex-submariner/web
```

This reads all files from the input directory (sorted alphabetically), resizes to 1200×1200, compresses to JPEG quality 82, and names them `rolex-submariner_360_000.jpg` through `rolex-submariner_360_350.jpg`.

---

## 6. Optional: 3D Reconstruction (Photogrammetry → GLB/USDZ)

For watches that need AR Quick Look or 3D PDP viewer support, run the multi-ring captures through the reconstruction pipeline:

```
RAW (108 images, 3 rings)
  → Lightroom (white balance, lens correction → TIFF)
  → RealityCapture (align → dense cloud → mesh → texture)
  → Decimation (100K triangles for web, 50K for mobile)
  → GLB export + Draco + KTX2 compression
  → USDZ export via Reality Converter
```

Full details: `luxury-ar-commerce/PHOTOGRAMMETRY.md`

**Software recommendation**: RealityCapture for batch volume; Metashape for one-off complex items.

---

## 7. Quality Checklist (Per Watch)

### 360° Spin Images

- [ ] 36 frames present, named correctly (`{slug}_360_000.jpg` through `{slug}_360_350.jpg`)
- [ ] All frames 1200×1200 px, JPEG, sRGB
- [ ] Each file ≤ 50 KB
- [ ] Consistent white balance across all frames (no color shift during rotation)
- [ ] No reflections of equipment visible on watch surfaces
- [ ] Watch centered in frame, consistent position across all angles
- [ ] Background uniform (pure white #FFFFFF or pure black #000000)
- [ ] Dial text and indices legible at full resolution
- [ ] Crown, pushers, and clasp visible and sharp in relevant angles

### 3D Models (If Produced)

- [ ] GLB ≤ 4 MB, USDZ ≤ 5 MB
- [ ] No visible mesh seams
- [ ] AR scale matches physical dimensions
- [ ] Passes glTF Validator
- [ ] Opens in AR Quick Look on iOS 17+

---

## 8. Production Workflow Summary

```
Per watch (~45 min capture, ~30 min post-processing):

1. Setup (10 min)
   └── Place watch, level turntable, calibrate white balance, verify polarization

2. Capture (15 min)
   └── 36 frames at 10° increments
   └── (Optional) repeat for 2 additional elevation rings for 3D

3. Review (5 min)
   └── Check all frames on laptop for sharpness, exposure consistency

4. Post-process (20 min)
   └── RAW develop → background cleanup → color correct

5. Export (5 min)
   └── Run batch export script → verify naming and file sizes

6. QA (5 min)
   └── Run through quality checklist above
```

**Throughput target**: 8–10 watches per studio day (8 hours), assuming 360° spin only. With 3D reconstruction, expect 4–6 watches per day.

---

## 9. File Organization

```
captures/
  {slug}/
    raw/                    # Original RAW files from camera
    tiff/                   # Developed TIFFs (intermediate)
    web/                    # Final 1200×1200 JPEGs (deliverable)
      {slug}_360_000.jpg
      {slug}_360_010.jpg
      ...
      {slug}_360_350.jpg
    3d/                     # (Optional) 3D reconstruction outputs
      {slug}.glb
      {slug}.usdz
      {slug}-poster.webp
```

---

## References

- `luxury-ar-commerce/PHOTOGRAMMETRY.md` — Detailed 3D reconstruction pipeline, equipment comparison
- `luxury-ar-commerce/PERFORMANCE.md` — Asset size budgets, compression toolchain
- `luxury-ar-commerce/SKILL.md` — AR integration patterns for PDP pages
