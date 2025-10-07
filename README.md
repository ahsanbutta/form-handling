## Form handling with React + Firebase Auth + MongoDB

### Prerequisites
- Node 18+
- MongoDB running locally or a cloud URI
- Firebase project with Web App created

### Client setup
1. Copy `.env.example` to `.env` and fill Firebase keys and `VITE_API_BASE_URL`.
2. Install deps: `npm install`
3. Run client: `npm run dev`

### Server setup
1. Go to `server/` and install deps: `npm install`
2. Set env vars in `server/.env`:
   - `MONGODB_URI=mongodb://127.0.0.1:27017/form_handling`
   - For Firebase Admin, use Application Default Credentials, e.g. set `GOOGLE_APPLICATION_CREDENTIALS` to your service account JSON path, or run on a host with ADC configured.
3. Start server: `npm run dev`

### Flow
- Signup creates a Firebase user and posts a profile to the server using the ID token.
- Login fetches the profile from the server using the ID token.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
