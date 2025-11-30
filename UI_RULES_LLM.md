# UI Rules — LLM Agent

> **Scope:** These rules apply only to *UI creation* performed by the LLM agent. They do **not** govern backend logic, routing, data fetching, business rules or non-UI behaviour.

---

## 1. High-level directive

* **Always prefer existing components.** When asked to produce UI code, layouts or designs, the agent must first search the project's component library and reuse components instead of inventing new ones.
* **Design inspiration sources (in priority order):**

  1. Apple Liquid UI (look and feel)
  2. Android 16 Material UI Kit (Material 3 / Android 16 guidelines)
  3. The attached image(s) supplied by the user
  4. Always create Moblie versin and desktop version mobile version hides in desktop and desktop version hides in mobile. and desktop version should be responsive. and same for mobile version.
  5. desktop version should be industry standard and mobile version should be industry standard. and designed specifically for mobile and desktop.
  6. always create seperate CSS, JS/TS (TypeScript is preferred) and Vue files for each component. and page and provide comments for reuse in other projects.
* If any of the three sources conflict, the agent should reconcile by following the **project's primary theme** (if available), otherwise follow Apple Liquid UI first then Android 16.

## 2. Component discovery order

1. **Project root component registry** — search the canonical component index (if present).
2. **`@liquid-ui-kit\Liquid-UI-Kit`**** directory** (exact path) — inspect this directory for matching components.
3. **Local ********************`components/`******************** or ********************`ui/`******************** folders** inside the current working module.
4. **Design tokens or theme files** (colors, spacing, typography) to ensure consistent styling.

> If the agent finds one or more matching components at any step, it must reuse them and stop searching further.

## 3. When a component does not exist

* **Create a new component only if no suitable existing component is found.**
* New components must:

  * Be placed under the same logical path as other UI components (e.g., `components/ui/` or `@liquid-ui-kit\Liquid-UI-Kit` depending on repository conventions).
  * Follow the project's naming conventions (PascalCase for React components, kebab-case for files if the project uses that). Example: `Card`, `LiquidButton`, `ProfileAvatar`.
  * Use existing design tokens (colors, spacing, radii, elevation/shadow tokens, type scale) from the project theme. Do **not** hardcode raw colors, sizes, or fonts.
  * Be responsive by default and support small / medium / large breakpoints.
  * Include accessibility attributes: `aria-*`, keyboard focus states, and sufficient color contrast.
  * Expose a small, pragmatic props surface: `children`, `variant`, `size`, `disabled`, `onClick` (or equivalents for the framework in use).
  * Include a short documentation block (JSDoc/TSDoc or component README) describing props, usage examples, and visual variants.

## 4. Visual & interaction rules

* **Theme:** Follow Apple Liquid UI’s soft translucency, subtle depth, and motion language while respecting Material Android 16’s motion and layout guidelines when applicable.
* **Typography:** Use theme type scales. For components inspired by Apple Liquid UI, prefer larger line-heights and relaxed letter-spacing for headings; for Android Material influence, keep readable, compact body text.
* **Color & elevation:** Use semantic tokens (e.g., `bg-primary`, `text-muted`, `elevation-100`). Implement subtle backdrop blur or frosted glass when Apple Liquid UI inspiration applies and is supported by the platform.
* **Motion:** Small, performant animations for state changes (hover, press, entry). Respect reduced-motion preferences.

## 5. Implementation guidance (code-level)

* **Props & API:** Components must be composable and avoid coupling to business logic. Keep components dumb (presentational) and accept callbacks for behaviour.
* **Testing:** Add basic visual regression or snapshot test suggestions (e.g., Storybook story, Jest snapshot) when creating new components.

## 6. File & documentation standards

* **Documentation:** Every new component must include a one-paragraph description and a small example snippet in the file header or in an adjacent `README.md`.
* **Stories / Examples:** Add a Storybook story or a demo page showing the main variants (`default`, `primary`, `disabled`, `loading`) where applicable.
* **Versioning:** If the repository uses a component versioning scheme, follow it. Otherwise, add a `@since YYYY-MM-DD` tag in the component header.

## 7. Accessibility & localization

* Ensure components are keyboard navigable and screen-reader friendly.
* All visible text must be localizable; avoid hard-coded strings inside components. Use the project’s i18n utilities or provide keys as props.
* Support right-to-left layout if the project indicates RTL requirements.

## 8. Performance & bundle considerations

* Prefer tree-shakeable component exports.
* Lazy-load heavy or rarely-used components.
* Avoid large runtime dependencies; prefer composition of small primitives.

## 9. Examples / Templates

* **Reusing an existing button:** If `PrimaryButton` exists, use it. Example usage:

```jsx
<PrimaryButton onClick={handleSave}>Save</PrimaryButton>
```

* **Creating a new ********************`LiquidCard`******************** when none exists:**

  * File: `components/ui/LiquidCard.tsx`
  * Expose props: `title?: string`, `children: ReactNode`, `footer?: ReactNode`, `elevation?: number`.
  * Documentation header with example and `@since` tag.

## 10. Decision logging

* When the agent creates a new component, it must add a short log comment in the PR or code: `// created-by-llm-agent: reason = "no existing component found"; date = YYYY-MM-DD`.

## 11. Out-of-scope

* Do not modify core themes or design tokens unless explicitly instructed.

---

### Quick checklist for every UI task

*

---

*End of UI Rules (for LLM Agent)*
