# J. Lawson Software & Media — Booking Tool

A responsive, static booking page for **J. Lawson Software & Media**. It is intentionally built without a server or database so it can be hosted directly on GitHub Pages.

## What is included

The page turns the lead email into a focused conversion experience: a local-business positioning statement, service cards, a three-step discovery-call request flow, the supplied J. Lawson logo, and a mobile-friendly visual system based on the logo’s blue and charcoal palette.

The booking flow collects:

1. The type of project: website, booking system, custom software, or maintenance.
2. A preferred date and time.
3. The lead’s name, email address, and project context.

When the visitor finishes, the page creates a formatted request. It can open the visitor’s email app if an inbox is configured, or copy the request to the clipboard when no inbox has been configured yet.

## Configure before publishing

Open `app.js` and edit the `CONFIG` object near the top:

```js
const CONFIG = {
  BUSINESS_EMAIL: "you@example.com",
  BOOKING_URL: "",
};
```

Use `BUSINESS_EMAIL` for the inbox where requests should be sent. `BOOKING_URL` is optional; add a Google Calendar appointment schedule, Calendly, or another scheduler URL if you want the header CTA to open a live calendar.

The current default intentionally leaves both values blank so the site is safe to preview before the final inbox and calendar are chosen.

## Publish to GitHub Pages

### Option A — New repository

1. Create a new GitHub repository, such as `booking-tool`.
2. Upload the contents of this folder to the repository’s `main` branch.
3. Open **Settings → Pages** in that repository.
4. Set the source to **GitHub Actions**.
5. Push to `main` or run the **Deploy booking tool to GitHub Pages** workflow manually.

The included `.github/workflows/pages.yml` deploys the static files automatically.

### Option B — Add it to the existing showcase

To publish it at a path such as `https://seabears25.github.io/design-showcase/booking/`, copy the contents of this folder into a `booking/` directory inside the existing `design-showcase` repository. The relative asset paths are already written for that layout.

## Important limitation of GitHub Pages

GitHub Pages is static hosting. It cannot safely receive form submissions or keep an appointment database by itself. This build avoids pretending it can: it creates a complete request and hands it to the visitor’s email app or clipboard. For a fully automated version later, connect the form to a hosted form endpoint or move the booking data layer to a small backend.

## Local preview

From this folder, run any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
