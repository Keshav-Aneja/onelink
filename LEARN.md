# Learning Resources

## React Portals & CSS Stacking Context

### React Portals
React Portals allow you to render child components into a different part of the DOM tree, outside of the parent component's hierarchy. This is essential for modals, tooltips, and dropdowns that need to "break free" from their parent containers.

**Resources:**
- Official React docs: [Portals - React](https://react.dev/reference/react-dom/createPortal)
- Search term: "React createPortal tutorial"

**Example:**
```tsx
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body // Render directly to body
  );
};
```

### CSS Stacking Context
A stacking context is a 3D conceptualization of HTML elements along the z-axis. Understanding stacking contexts is crucial for properly managing z-index values.

**Resources:**
- MDN Web Docs: [The stacking context - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
- Search term: "CSS stacking context z-index"

**Key Concept:**
The `isolate` property (and other CSS properties like `position: fixed`, `opacity < 1`, `transform`, etc.) creates a **new stacking context**, which means z-index values are only compared within that context, not globally.

### The Problem We Solved

**Before (Dialog trapped in stacking context):**
```
document.body
  └─ GlowCard (has `isolate` class) ← Creates NEW stacking context
      └─ DeleteButton
          └─ ConfirmDialog (z-index: 9999) ← Trapped inside GlowCard's context!
```

Even with `z-index: 9999`, the dialog couldn't escape because it's compared only against siblings **within** the GlowCard's isolated stacking context.

**After (Portal solution):**
```
document.body
  ├─ GlowCard (isolated context)
  │   └─ DeleteButton
  └─ ConfirmDialog (z-index: 9999) ← Now at body level, globally on top!
```

The portal renders the dialog directly under `document.body`, outside any isolated contexts, so its z-index works globally.

### Implementation
See [confirm-dialog.tsx](apps/web/src/components/dialogs/confirm-dialog.tsx) for the implementation using `createPortal`.

**Key reading order**:
1. Start with React Portals (practical implementation)
2. Then CSS Stacking Context (conceptual understanding)
