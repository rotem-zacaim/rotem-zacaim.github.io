# Rotem.z 3D Character

Final asset path: `assets/3d/rotem-z-rabbit.glb`

Visual brief:

- stylized premium grey rabbit mascot
- dark sunglasses
- black shirt with readable `rotem.z`
- white pants
- light sneakers
- confident, cool, slightly pointing pose
- not childish, not toy-like, not branded as Maya

Web constraints:

- GLB under 4 MB after compression
- centered origin at feet
- neutral forward-facing pose
- one short idle animation when available
- baked or optimized materials
- no external texture paths

The site currently renders a procedural Three.js character when this GLB is absent. Once the final GLB is ready, place it at the path above and the loader will replace the procedural character automatically.

To enable the final GLB, update `assets/3d/character-manifest.json`:

```json
{
    "ready": true,
    "model": "assets/3d/rotem-z-rabbit.glb"
}
```
