# Design System Strategy: The Modern Scholar

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atheneum."** 

This is not a standard forum; it is a high-end editorial space for intellectual exchange. We are moving away from the "boxy" utility of traditional academic portals. Instead, we are building an environment that feels like a modern, sun-drenched library—quiet, prestigious, and deeply organized. 

The system breaks the "template" look through **intentional asymmetry**. We utilize wide gutters, offset headings, and overlapping "paper" layers to create a sense of physical depth. By pairing the technical precision of a sans-serif "frame" with the literary warmth of a scholarly serif, we signal that this is a place for both rigorous data and human conversation.

## 2. Colors: Tonal Depth & The Maroon Soul
Our palette is anchored by the prestigious Batangas State University Maroon and Gold, but it is executed through a lens of sophisticated Material 3 layering.

*   **Primary (#570000):** Used for brand weight, primary actions, and high-level navigation.
*   **Secondary (#735c00):** Reserved for "Golden Moments"—awards, highlighted scholarly contributions, or verified academic status.
*   **Tertiary (#00137f):** An intellectual blue used sparingly for technical links or metadata to differentiate from the primary narrative.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Standard UI relies on lines to separate content; this system relies on **Surface Tonal Shifts**. Boundaries are created by placing a `surface-container-low` (#f3f3f5) card against a `surface` (#f9f9fb) background. 

### Surface Hierarchy & Nesting
Think of the UI as stacked sheets of fine archival paper.
*   **Background (#f9f9fb):** The base table.
*   **Surface-Container-Low (#f3f3f5):** Large section wrappers (e.g., the forum feed area).
*   **Surface-Container-Lowest (#ffffff):** The individual "cards" or "threads" that float on top of the section.
This "nested" depth creates a natural hierarchy that feels organic and premium.

### The "Glass & Gradient" Rule
To add visual "soul," use subtle gradients. For hero sections or primary CTAs, transition from `primary` (#570000) to `primary_container` (#800000). For floating navigation overlays, use **Glassmorphism**: a semi-transparent `surface` color with a 12px backdrop blur to let the university colors "glow" through the interface.

## 3. Typography: The Editorial Voice
We utilize a dual-font strategy to balance modern accessibility with scholarly tradition.

*   **The Frame (Manrope):** Use Manrope for all UI elements—navigation, buttons, labels, and system status. It is technical, clean, and highly readable.
    *   *Display-LG (3.5rem):* For high-impact landing headers. Use tight letter-spacing (-0.02em).
    *   *Label-MD (0.75rem):* For metadata. Always uppercase with increased letter-spacing (+0.05em) for a refined "tag" feel.
*   **The Voice (Newsreader):** Use Newsreader for the "meat" of the forum—discussion posts, long-form articles, and title headings. 
    *   *Title-LG (1.375rem):* For thread titles. It feels like the headline of a scholarly journal.
    *   *Body-LG (1rem):* Optimized for long-form reading. Use a generous line-height (1.6) to ensure academic stamina during deep reading sessions.

## 4. Elevation & Depth
In this design system, shadows are an exception, not the rule. We prioritize **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (#ffffff) card sitting on a `surface-container-low` (#f3f3f5) section provides enough contrast to be felt without being seen.
*   **Ambient Shadows:** If an element must float (like a modal or a floating action button), use a shadow with a large blur (32px) and very low opacity (4%-6%). The shadow color should be a tinted version of `on-surface` (#1a1c1d) to ensure it feels like natural light hitting paper.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#e2bfb9) at **20% opacity**. It should be a hint of a boundary, never a hard cage.

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#570000) with `on_primary` (#ffffff) text. Use `DEFAULT` (0.5rem) roundedness.
*   **Secondary:** A "Ghost" style. No background, just a `primary` text label with a subtle `primary_container` background shift on hover.
*   **Shape:** Never use "Pill" shapes for primary buttons; keep them at `0.5rem` to maintain a formal, structured academic look.

### Cards & Thread Lists
*   **The Forbid Rule:** No horizontal dividers between list items. Use 24px of vertical white space and a subtle background shift on hover (`surface_container_high`) to define the hit area.
*   **Anatomy:** Thread titles use `newsreader` (Title-MD), while the "Posted in..." metadata uses `manrope` (Label-SM) in `on_surface_variant`.

### Input Fields
*   **Style:** Minimalist. Use a `surface_container_low` fill with a `0.5rem` radius. 
*   **Active State:** Instead of a heavy border, use a 2px bottom-stroke of `secondary` (#735c00) to signal focus, mimicking a highlighter under a line of text.

### Signature Component: The "Citation Block"
A custom component for the forum. A nested container using `surface_container_highest` with a 4px left-accent-bar of `primary`. Used for quoting other scholars or highlighting library resources.

## 6. Do's and Don'ts

### Do:
*   **Embrace Negative Space:** Give the typography room to breathe. Academic text is dense; the UI shouldn't be.
*   **Use Subtle Glassmorphism:** Use it on top navigation bars to maintain a sense of place as users scroll through long threads.
*   **Align to a Baseline Grid:** Ensure the `newsreader` body text follows a strict rhythm to mimic printed journals.

### Don't:
*   **Don't Use 100% Black:** Always use `on_surface` (#1a1c1d) for text to avoid "ink bleed" eye strain.
*   **Don't Overuse Gold:** Gold (#735c00) is a reward. If everything is gold, nothing is prestigious.
*   **Don't Use Hard Shadows:** Avoid the "floating box" look of 2014-era Material Design. Keep it flat, layered, and architectural.
*   **Don't Use High-Contrast Dividers:** If you need to separate content, use a 1px gap that reveals the `surface-container-high` background underneath.