# Research-grade crop dossiers — integration log

User-provided Volume 1 (Paddy, Maize, Potato, Onion, Chilli) and Volume 2 (Chilli, Cucumber, Groundnut, …) technical dossiers were structured into runtime data:

| Slug | File | Notes |
|------|------|--------|
| chilli | `data/dossiers/chilli.ts` | Full Vol.2 chilli modules |
| cucumber | `data/dossiers/cucumber.ts` | Vol.2 cucumber |
| moongfali | `data/dossiers/moongfali.ts` | Groundnut (Vol.2; truncated paste → core modules) |
| paddy | `data/dossiers/paddy.ts` | Vol.1 paddy |
| maize | `data/dossiers/maize.ts` | Vol.1 maize |
| potato | `data/dossiers/potato.ts` | Vol.1 potato |

**Wire:** `lib/crops/researchDossierBridge.ts` → last merge in `getCropManagementProfile`.

**UI:** Pest/Disease tabs show dossier cards + legal banner when `dossierSource` present.

**Not yet structured as full TS dossiers:** soybean, sugarcane, onion, cauliflower, shimla mirch PDFs (PDF text extract empty in tooling — need re-export or paste).

**Legal:** Every overlay carries label-mandatory / no illegal mix notes.
