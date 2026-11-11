# Crop Intelligence Hub overlays

Add extras **only** when a field photo, CIBRC label, or dossier already states them.

```
data/hub/priorityOverlays.ts   // crop:problem → fieldCheckHi, lookAlikes, dontDoHi, localAliases
```

Do not invent PHI days, IRAC groups, or look-alikes. If unknown, omit the field — the UI shows a gap, not a guess.

New crop: add problems in `data/crop-curative-problems.ts` + medicines in `lib/crops/cropProblemMedicines.ts`, then optional overlay here.
