# Home Lab 3D Hero Replacement

Date: 2026-08-01
Status: User-selected direction, pending implementation plan
Target site: `about.rotem-dev.org`
Implementation repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d`

## Goal

Replace the current rabbit/character visual with a more professional and alive 3D hero scene.

The selected direction is **Home Lab / Server Rack**: a compact 3D server rack that represents Rotem's real project work, including Maya, Home Assistant, local AI model work, PT/security labs, and games.

This is a focused hero/background replacement. It should not redesign the entire site or change the already-approved projects-first structure.

## Visual Reference

Generated concept reference:

`C:\Users\rotem\.codex\generated_images\019fa950-c18b-7dd0-8b6a-07a2c4055a20\ig_09f2e2945d877058016a6d227668708191929dcd4164c5bce6.png`

The implementation should follow the same feeling: dark premium tech atmosphere, server rack as the main object, data lines, floating project modules, cyan/teal lighting, and clean space for title copy.

Requested improvements beyond the reference:

- Make the scene feel more alive with subtle blinking server LEDs.
- Add light atmospheric fog/haze, kept soft enough not to make the site muddy.
- Keep the look professional and technical, not childish or mascot-like.
- Remove the rabbit entirely from the hero experience.

## First Viewport

When the site first opens:

- The Home Lab 3D scene appears in the foreground as the main visual object.
- Existing hero content stays readable on top: Rotem name, bilingual Hebrew/English positioning, project-first CTAs, and navigation.
- The 3D rack should sit mostly on the visual side of the hero, leaving clean negative space for text.
- Floating project labels can appear around the rack, using concise labels such as `Maya`, `HA`, `Local AI`, `PT`, and `Games`.
- The first viewport should still hint that project content exists below.

## Scroll Behavior

When the visitor starts scrolling:

- The Home Lab scene transitions from a foreground hero object into a site background layer.
- The scene should become slightly larger or slower-moving to create depth, but not distract from reading.
- The scene becomes blurred and dimmed behind the content after the hero.
- The blur and opacity should be driven by scroll progress, not by abrupt section changes.
- Content sections must stay crisp, readable, and above the background layer.
- The background effect should continue through the upper project sections, then fade if it starts to reduce readability.

Recommended scroll state mapping:

- At top: foreground object, sharp, high opacity, minimal blur.
- Early scroll: object eases backward, starts dimming, slight parallax.
- Content scroll: object becomes background, blur increases, opacity decreases.
- Reduced-motion users: no parallax or movement; use a static dimmed background.

## Components

### `HeroScene`

Owns the visual replacement for the rabbit.

Responsibilities:

- Render the Home Lab server rack scene.
- Provide LED blinking/flicker animation.
- Render subtle fog/haze and data-line movement.
- Provide static fallback visuals if 3D rendering fails.
- Expose CSS classes or attributes for scroll-state styling.

### `ScrollSceneController`

Owns the transition from hero foreground to blurred site background.

Responsibilities:

- Observe scroll progress near the hero.
- Update CSS custom properties for scale, blur, opacity, and parallax offset.
- Avoid layout thrash by using requestAnimationFrame or passive scroll handling.
- Disable movement for `prefers-reduced-motion: reduce`.

### `ProjectModuleLabels`

Small floating visual labels around the rack.

Responsibilities:

- Represent key project areas without clutter.
- Optionally highlight related project cards on hover or click.
- Degrade gracefully on mobile by reducing label count or hiding nonessential labels.

## Implementation Notes

The site is currently a static frontend with `index.html`, `styles.css`, and `script.js`. The implementation should follow that structure unless there is a clear reason to split files.

Possible technical paths:

1. Use the existing visual layer and create the rack with CSS/DOM 3D-style elements.
2. If the repo already has a reliable Three.js pattern, render a lightweight procedural rack scene.
3. Use the generated image as inspiration only, not as the final foreground if it prevents the desired scroll/parallax behavior.

The first implementation should favor a robust, fast, responsive result over a heavy 3D asset pipeline.

## Mobile Behavior

On mobile:

- The rack should remain visible but not crowd the hero text.
- Reduce or hide floating labels if they overlap.
- Use lighter fog and fewer animated elements.
- Keep CTA buttons easy to tap.
- The scroll-to-background transition should be subtle and readable.

## Error Handling And Fallbacks

- If 3D/canvas fails, show a static CSS or image-based Home Lab background.
- If animation is unavailable, the hero still reads as a polished Home Lab scene.
- If the browser is low-powered or `prefers-reduced-motion` is enabled, disable parallax, fog movement, and LED flicker.
- No content should rely on the 3D scene to be understandable.

## Testing

Verify before release:

- Desktop first viewport: no rabbit, Home Lab visual visible, hero text readable.
- Mobile first viewport: no overlap between visual, title, language controls, CTAs, and project hint.
- Scroll transition: foreground scene becomes blurred/dimmed background smoothly.
- Reduced motion: scene remains static and readable.
- Project content: cards and text stay readable when the background is active.
- Performance: no obvious jank while scrolling.
- Regression: existing bilingual toggle, project detail buttons, timeline, and navigation still work.

## Out Of Scope

- Full site redesign.
- Real AI chatbot backend.
- Rewriting project content or timeline.
- Publishing/deploying before the implementation is reviewed and verified.
