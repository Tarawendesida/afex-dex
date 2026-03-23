# AFEX-DEX — Africa Export Index Data Exchange

This repository contains the **AFEX All-54 Sovereign-State Library**: source code, seed data, and structured upload packages for 54 African country export-index funds.

## Repository Structure

```
afex-dex/
├── scripts/
│   └── generate_afex_all54.js     # Main generator
├── data/
│   └── afex-seeds/
│       ├── north_africa.json      # 6 countries (NAEX)
│       ├── west_africa.json       # 16 countries (WAEX)
│       ├── central_africa.json    # 8 countries (CAEX)
│       ├── east_africa.json       # 11 countries (EAEX)
│       └── southern_africa.json   # 13 countries (SAEX)
└── wasi-upload-afex-all54/
    ├── afex_all54_manifest.json
    ├── afex_all54_manifest.md
    ├── README.md
    └── <country_code>/            # 54 country packages
        ├── <code>_fund_characteristics.json
        ├── <code>_fund_characteristics.md
        └── README.md
```

## Fund Family

- **Family code:** `AFEX`
- **Family name:** Africa Export Index Family
- **Scope:** 54 sovereign African states
- **Continental comparison currency:** USD

## Subfamilies

| Code | Name | Countries |
|------|------|-----------|
| NAEX | North Africa Export Index Family | 6 |
| WAEX | West Africa Export Index Family | 16 |
| CAEX | Central Africa Export Index Family | 8 |
| EAEX | East Africa Export Index Family | 11 |
| SAEX | Southern Africa Export Index Family | 13 |

## Detailed Profiles

- `BUREX` — Burkina Faso (detailed prototype ready)
- `CIREX` — Côte d'Ivoire (detailed prototype ready)

## Generate Output

```bash
cd <project-root>
node scripts/generate_afex_all54.js
```

Output is written to `wasi-upload-afex-all54/`.

## Important Notes

- This library follows the **54-sovereign-state** interpretation of Africa.
- The African Union has 55 member states, including the Sahrawi Arab Democratic Republic.
- All packages are `proposed_pre_launch` starter profiles. Official country trade statistics, benchmark rules, and legal review are required before institutional launch.

## License

MIT
