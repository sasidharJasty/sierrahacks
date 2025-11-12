# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Portal (Supabase) setup

This project includes a simple Portal page for user Login / Signup using Supabase.

1. Install the Supabase client in the `frontend` folder:

```bash
cd frontend
npm install @supabase/supabase-js
```

2. Provide your Supabase credentials using Vite env variables. Create a `.env` file in the `frontend` folder with:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

3. Start the dev server and visit `/portal` for the login/signup UI.

Notes:
- The Supabase client lives at `src/lib/supabaseClient.js` and reads the `VITE_...` env vars.
- The Portal page is `src/pages/Portal.jsx` and uses `supabase.auth.signUp`, `supabase.auth.signInWithPassword` and `supabase.auth.signOut`.

Admin scan page
----------------

An admin QR scanner page is available at `/admin/scan` which uses the device camera to scan the QR and display the user's profile and dietary info, and lets admins save meal check-ins (breakfast/lunch/dinner) to the `checkins` table.

Before using the admin page, run the SQL file `db/create_checkins.sql` in your Supabase SQL editor to create the `checkins` table.

The admin scanner component lives at `src/pages/AdminScan.jsx` and uses the `html5-qrcode` library.
