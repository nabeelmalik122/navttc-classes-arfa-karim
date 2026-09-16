# ?? QRVerse Studio

QRVerse is a futuristic, privacy-first, and highly customizable QR Code Generator tool. Designed for seamless client-side generation, it allows users to create stunning QR codes with unique gradients, shapes, custom branding, and various data types—all without sign-ups or analytical tracking.

---

## ?? Live Demo

?? **Deployment URL:** [Aapka Live Website Link Yahan Ayega]

---

## ? Features

* **27+ QR Code Types:** Supports URL, Plain Text, WiFi, Crypto Wallets, WhatsApp, vCard, Social Links (Instagram, TikTok, YouTube), and more.
* **Futuristic UI/UX:** Styled using Shadcn UI components and Tailwind CSS with a beautiful toggleable Light/Dark mode.
* **Advanced Customization:** Fully configurable background colors, gradients, dot styles, corner shapes, and custom logo scaling.
* **Client-Side Generation:** Generates codes directly in the browser for ultimate data privacy.
* **Instant Export:** High-quality exports available in `PNG` and `SVG` formats.
* **Recent History:** Keeps track of your recently generated codes locally.

---

## ??? Tech Stack & Technologies Used

### Frontend & Core

* **React 19** – Component-based modern user interface.
* **Vite** – Next-generation fast frontend tooling and dev server.
* **Tailwind CSS** – Utility-first CSS framework for slick styling.
* **Shadcn UI** – Highly accessible, premium raw UI primitives.

### Packages & Libraries

* **qr-code-styling** – For advanced canvas-based custom QR code rendering.
* **lucide-react** – Crisp and responsive modern icon set.
* **concurrently** – Manages monorepo workspace scripts seamlessly.

---

## ?? Project Structure

```text
apps/
+-- web/                # Main React + Vite Workspace
    +-- src/
        +-- components/ # Core QRStudio & Custom layout files
        ¦   +-- ui/     # Radix-based Shadcn components
        +-- hooks/      # Themes and responsive hooks
        +-- lib/        # Utility functions & categories
        +-- pages/      # Core application pages
```

## Author

Malik Nabeel Khattak
