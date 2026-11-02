# Shared Limitless theme backgrounds

The unified theme CSS expects these four WebP files in this directory:

- `limitless-dark-desktop.webp` — 1920 × 1080
- `limitless-dark-mobile.webp` — 1080 × 1920
- `limitless-light-desktop.webp` — 1920 × 1080
- `limitless-light-mobile.webp` — 1080 × 1920

They are one shared pair of visual themes for the whole site. Desktop/mobile are separate compositions, not CSS crops.

The images must be added before this branch is merged or deployed. The CSS deliberately uses root-relative `/themes/shared/` URLs so the same files resolve from the hub, Probability, Metallurgy, Maths Trainer, and the Bookkeys iframe.
