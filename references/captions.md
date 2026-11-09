# Compact motion subtitles

Derive captions from the corrected voice recording. Use short natural phrase groups rather than flashing every word, unless the user requests word-by-word captions. Preserve the spoken meaning and punctuation. Make important emphasis rare and purposeful.

Use a readable font with proper glyph coverage for the chosen language. The starter uses a system sans-serif for an English demo; bundle a licensed font when exact typography matters. Size should remain readable on a phone while leaving characters and evidence dominant. The example is approximately 40 px at a 1080-wide working composition; tune using an actual preview rather than treating that as a universal target.

Prefer one line, or two short lines when necessary. Keep captions out of faces, hand contacts, labels and the payoff object. Platform UI varies, so check the intended viewing crop rather than relying only on a fixed safe-area percentage. Per-shot repositioning is valid when the default location covers evidence.

Use restrained opacity and small vertical movement for entry/exit. Avoid large elastic bouncing, constant scaling, excessive karaoke colors and a stack of decorative title boxes. A modest outline/shadow can preserve readability against changing scenery.

The starter component consumes groups of `{text,start,end,emphasis?,top?}`. Times use seconds in the original audio timeline. Review for omissions, overlaps, too-fast grouping and final-word truncation. Check with captions both on and off; captions must not conceal art problems or supply a story clue absent from the intended image.
