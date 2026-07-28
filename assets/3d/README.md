# Rotem.z 3D Character

Current live asset path: `assets/3d/rotem-z-rabbit.glb`

Visual brief:

- rabbit mascot with dark shirt, light pants, sunglasses, and a clean stage presence
- runtime idle, walk, and side-position movement driven by scroll
- English/LTR points toward the left-side content
- Hebrew/RTL mirrors toward the right-side content

Web constraints:

- keep the production GLB visually faithful first; optimize only after visual comparison
- centered origin at feet
- neutral forward-facing pose
- real idle, walk, and pointing gestures via Skeleton/Bones when a future rigged asset is available
- baked or optimized materials
- no external texture paths

The site currently renders a procedural Three.js character when this GLB is absent. Once the final GLB is ready, place it at the path above and the loader will replace the procedural character automatically.

To enable the live GLB, update `assets/3d/character-manifest.json`:

```json
{
    "ready": true,
    "model": "assets/3d/rotem-z-rabbit.glb"
}
```
