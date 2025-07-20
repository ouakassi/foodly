# Copilot Instructions for Foodly

Welcome, AI coding agents! This guide summarizes the essential architecture, workflows, and conventions for the Foodly codebase to help you be productive immediately.

---

## Big Picture Architecture

- **Frontend:**

  - Located in `client/` (React, Vite, Tailwind CSS, ShadCN UI).
  - Modular structure: `components/`, `pages/`, `hooks/`, `constants/`.
  - Dashboard features in `client/src/pages/Dashboard/` (Orders, Products, Users, Analytics).
  - State managed via React hooks and custom hooks (e.g., `useAxiosFetch`).
  - Forms use `react-hook-form` and `yup` for validation.
  - API endpoints and config centralized in `client/src/constants/`.

- **Backend:**
  - Not present in this repo, but API endpoints are referenced (Node.js/Express, Sequelize, JWT, Stripe/PayPal).

---

## Developer Workflows

- **Start Dev Server:**
  - From `client/`: `npm install` then `npm run dev`
- **Build:**
  - `npm run build`
- **Lint:**
  - `npm run lint`
- **Testing:**
  - No tests by default; add in `client/src/__tests__/` if needed.

---

## Project-Specific Patterns

- **Component Structure:**
  - Pages in `pages/`, reusable UI in `components/`.
  - Consistent layouts via `ContentContainer`.
- **Data Fetching:**
  - All API calls use `useAxiosFetch`.
  - Pagination, filtering, sorting via URL search params.
- **Forms:**
  - Use `react-hook-form` + `yup` schemas (see `utils/validation.js`).
- **UI/UX:**
  - Icons from `react-icons`, dialogs for details/editing, tooltips/popovers for actions.
- **Error Handling:**
  - API errors surfaced via toast notifications (`sonner`).

---

## Integration Points

- **API Integration:**
  - All data flows through endpoints in `constants/`.
  - Image uploads via `/api/upload`.
- **Navigation:**
  - Uses `react-router-dom` and navigation helpers (`useNavigate`).

---

## Examples

- **Product Creation:**
  - See `CreateProductPage.jsx` for form, validation, image upload, category management.
- **Order Management:**
  - See `OrdersPage.jsx` for filtering, pagination, dialogs, table patterns.

---

For more details, see:

- `client/src/pages/Dashboard/Orders/OrdersPage.jsx`
- `client/src/pages/Dashboard/Products/CreateProductPage.jsx`
- `client/src/components/`
- `client/src/constants/`
- `client/src/hooks/useAxiosFetch.jsx`

---

**Feedback:**
If any section is unclear or incomplete, please specify which part needs clarification or expansion!
