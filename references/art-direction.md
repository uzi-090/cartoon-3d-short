# Graphic characters in a dimensional world

## Establish a coherent visual family

Default to broad authored bean heads, small rounded torsos, thin flowing stick limbs, tiny dot palms and flat feet. Faces, hair, costumes and silhouettes are original. Complexity, forced angularity or anatomical joints do not inherently improve quality. Preserve approved anatomy while refining lighting, color, material, expressions and motion.

Compare art at equal visible head size and at phone size. Card rectangle dimensions and unqualified anatomy ratios do not describe the visible character. Author the front, three-quarter and back views that the actual camera path requires. Face visibility, costume asymmetry, gear side and gaze must agree with the intended facing. A billboard can turn toward the lens while the art changes to the intended view; a front face surviving a back view is a defect.

The bundled `characters.ts` shows a Canvas2D albedo/normal/roughness/ink-map approach. It is a starting library, not a required cast. Its authored plane origin is sole-ground, world Y is up, front is +Z, and hand groups are anchored to the painted dot palms. Create new character designs and meaningful poses for the story.

## Color, light and material

Choose a restrained set of dominant, supporting and focal colors for each scene. Put important evidence and the character against a useful immediate surround. Judge color allocation and form before raising global contrast or saturation. A dim cool face or a pale floor can work; there is no universal bright/warm-face target.

Use motivated key/fill/rim light and purposeful shadow color. If a local lamp, screen or moving source matters, prove its behavior with fixed camera and exposure: toggle, move and rotate it with actor, ground, two materials and an occluder present. Character shading, light mesh, receivers and shadows must share source pose, state, falloff and appropriate occlusion. A glowing mesh plus fixed painted pool or scene-wide retint is insufficient.

Inspect final shader code when a material fails to respond. Accumulated diffuse light can be discarded by a custom overwrite. Keep local contributions through stylization and preserve dark ink cores. The actor example deliberately preserves calculated `outgoingLight` outside the ink mask; avoid replacing it with a global painted face tint.

Distinguish broad cloth/skin form, selective metal glints, wood grain and earth variation. Everything should not share the same plastic gloss. Construction and broad material marks matter more than random noise or invisible microdetail.

## Set, contact, ink and depth

Build a selected set/material proof with blur, fog, bloom and weather disabled. It should already show useful scale, support, overlaps and focal hierarchy. Background depth comes from perspective, layers, light, material and composition; selective blur helps after those relationships exist. Sparse inserts and sharp wide shots can be valid.

Align texture marks with construction: grain follows boards, seams follow panels, terrain marks follow the ground. Keep story objects legible in the final portrait crop. Recheck the camera path for blocking props, huge cut-off foreground blobs and railings through faces.

Design contour hierarchy: important silhouettes and faces can be stronger than seams/grain; shadow-side weight may differ from bright-side weight. World ink should identify silhouettes, depth jumps and selected creases rather than every coplanar join or the horizon. Graphic cards already carry ink; put them on the excluded layer to avoid rectangle/double outlines.

Inspect support, contact shadows, form shading and cast shadows separately. Feet and props meet their supports; lifted feet should not keep identical planted blobs. Avoid stale, swimming or unexpectedly solid alpha shadows. The starter uses PCF shadows; test alternatives before accepting them.

Add lens effects selectively. Scale pixel-based ink/blur parameters with output resolution. Keep bloom on motivated bright sources and avoid heavy grain that obscures art or inflates compressed output. No template values or global image statistics certify a good look.
