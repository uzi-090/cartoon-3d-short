# Acting, camera and deterministic animation

## Make the action explain the story

Give an important event an intention, anticipation, contact/action, consequence and settle when it needs them. Use whole-body pose, gaze and a visible observer. Blinks and sine bobbing are secondary, not substitutes for acting. A deliberate hold can support suspense, comprehension or a joke.

Define action phases as functions of frame/time so seeking or rendering frames out of order gives the same pose. Use Remotion's `useCurrentFrame()` as the animation clock. Do not accumulate transforms, advance simulation using wall time, call unseeded randomness per frame, or integrate motion inside a render callback. The starter uses a render callback only to draw a frame whose state is already derived from its index.

Ease gestures into and out of their semantic state. A useful envelope is `smooth((t-start)/in) * (1-smooth((t-(end-out))/out))`, with clamped smoothstep. Blend both hand positions and arm control points. Changing the action name abruptly without blending can pop an elbow or prop even when the hand path seems smooth.

## Contact and props

Derive prop attachment from the actual painted hand anchor, including artwork flip and billboard/world rotation. Canvas coordinates are top-origin; convert with `(sole - y) / canvasHeight * planeHeight`, not a second UV flip. Use a small depth offset to order hand and prop intentionally.

Check the whole reach, grip, lift, carry, release and rest sequence at native detail and normal speed. Props should settle on their actual supports after release. Avoid teleporting a receiver from cradle to ear, hands sliding through a cup or broad hidden intervals where the story's object disappears behind the torso. A motivated insert may explain an object before a reaction cut.

Walk with plausible support phases and a planted stance. Motion can be stylized, but root travel and contact must agree enough to avoid conspicuous sliding. Design view changes before extra facial detail.

## Camera as information

State the purpose of each move: reveal evidence, preserve contact, change power/scale, inspect a relationship or follow a choice. Mix travel, reframing, inserts and holds as the story needs. Avoid a universal opening rush, creeping hold, shake, roll or fixed cut interval.

Establish geography economically. Important objects and reactions need readable space and enough time. A close crop that hides the cause of an event is not cinematic clarity. Check near objects across the full path, not only at keyframes; camera movement can turn a modest prop into a blocking blob.

For cuts, compare outgoing/incoming frames and short sequences around them. Preserve action direction, prop state, facing and ownership unless the story intentionally changes them. Reveal the discovery before its explanatory narration when that creates a useful viewer inference; don't create confusion by withholding necessary context.

Depth of field follows the story target. Keep evidence and faces sharp when they must be read; use sharp establishing shots where geography matters. Focus should remain correct during both subject and camera movement.
