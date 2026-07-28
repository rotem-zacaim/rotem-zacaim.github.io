# Rotem 3D Character

Current live asset path: `assets/3d/rotem-z-rabbit.glb`

Current state:

- the production site loads this GLB through `assets/3d/character-manifest.json`
- the procedural Three.js rabbit is fallback only if the GLB fails or the manifest is disabled
- the current GLB is visually usable but not rigged enough for real walk/hand animation
- current scroll/pointer behavior is whole-model/procedural movement

Visual brief:

- rabbit mascot with dark shirt, light pants, sunglasses, and a clean stage presence
- keep the original black shirt and skull emblem
- do not add `rotem.z` or any other runtime text to the shirt
- do not add fake hands, fake pointer arms, or invented limb geometry
- runtime idle and side-position movement driven by scroll
- English/LTR points toward the left-side content
- Hebrew/RTL mirrors toward the right-side content

Web constraints:

- keep the production GLB visually faithful first; optimize only after visual comparison
- centered origin at feet
- neutral forward-facing pose
- real idle, walk, and pointing gestures via Skeleton/Bones when a future rigged asset is available
- real pointing must use the character's actual hand/bones, not an overlay
- baked or optimized materials
- no external texture paths

The live GLB is enabled with `assets/3d/character-manifest.json`:

```json
{
    "ready": true,
    "model": "assets/3d/rotem-z-rabbit.glb"
}
```
