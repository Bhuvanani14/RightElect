Testing
=======

Purpose
-------
Quick reference for running lint/build/smoke tests locally and in CI, and how to add unit/e2e tests.

Smoke tests (quick)
-------------------
- Installs: run `npm install` at project root (adds `node-fetch`).
- Run the smoke script which probes deployed endpoints or a local server:

```bash
# use deployed URL from env or default Cloud Run URL
DEPLOYED_URL=https://rightelect-server-139878808531.us-central1.run.app npm run smoke
# or
npm run smoke
```

What the smoke test does
- Calls: `/`, `/api/parliament`, `/api/states`, `/api/election-info`, `/api/nearest-booth`
- Prints HTTP status and short summaries (counts / results lengths) for quick verification.

Lint & Build
------------
Run lint and build locally to find issues before CI/deploy:

```bash
npm run lint
npm run build
```

Adding Unit Tests
-----------------
Recommended approaches:
- Frontend: use `vitest` + `@testing-library/react` for component/unit tests.
- Backend: use `jest` or `vitest` + `supertest` to test Express endpoints.

Example quick backend test (outline):
1. Add `jest`, `ts-jest`, `supertest` as devDependencies in `server/` package.
2. Add a test file `server/tests/parliament.test.ts` that spins up the Express app and calls `/api/parliament` using `supertest`.

CI Integration
--------------
- CI should run `npm ci`, `npm run lint`, `npm run build`, and `npm run smoke` (with `DEPLOYED_URL` secret configured) as smoke verification.
- For Cloud Build, include a build step that runs the smoke script against the just-deployed revision (or use GitHub Actions with `DEPLOYED_URL` repo secret).

Next steps you can ask me to do
- Add a test framework (Vitest/Jest) and a couple of unit tests.
- Add server-side `supertest` tests and wire them into `server/package.json`.
- Wire tests into CI workflow (GitHub Actions / Cloud Build) and add secret `DEPLOYED_URL` for smoke tests.
