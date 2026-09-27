# Fitment Certificate Generator

React + Vite application for entering vehicle/owner/SLD/installer details and generating a 4-page A4 PDF.

## Run

```bash
npm install
npm run dev
```

Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## Features

- Vehicle details form
- Owner details form
- SLD details form
- Installer details form
- Automatic renewal date: installation date + 1 year - 1 day
- Certificate number auto-generation using browser localStorage
- Live certificate preview
- QR code for a certificate verification URL
- Four PDF copies:
  - Manufacturer Copy
  - Dealer/Distributor Copy
  - Customer Copy
  - Department Copy

## Next production steps

1. Replace the placeholder SYN logo with the authorized company logo.
2. Add a backend/database for certificate records.
3. Make certificate numbering server-side to prevent duplicates.
4. Create a public `/verify/:certificateNo` page backed by the database.
5. Add authentication and role permissions.
6. Add authorized signature/stamp image handling if required.
7. Fine-tune typography and spacing against the approved certificate artwork.
