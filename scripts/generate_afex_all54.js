const fs = require("fs");
const path = require("path");

const root = process.cwd();
const seedsDir = path.join(root, "data", "afex-seeds");
const outputRoot = path.join(root, "wasi-upload-afex-all54");
const generatedOn = "2026-03-23";
const familyCode = "AFEX";
const familyName = "Africa Export Index Family";
const continentComparisonCurrency = "USD";

const seedFiles = fs
  .readdirSync(seedsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

const regions = seedFiles.map((file) => JSON.parse(fs.readFileSync(path.join(seedsDir, file), "utf8")));
const countries = regions.flatMap((region) =>
  region.countries.map((country) => ({
    ...country,
    subfamily_code: region.subfamily_code,
    subfamily_name: region.subfamily_name
  }))
);

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function fullName(country) {
  return `${country} Raw Export Index Fund`;
}

function benchmarkName(country) {
  return `${country} Raw Export Index`;
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function transportBasisNote(model) {
  if (model === "landlocked_corridor_model") {
    return "Use outbound export tonnage across road, rail, air, border-post, and transit-corridor flows rather than seaborne loading.";
  }
  if (model === "island_export_model") {
    return "Use outbound export tonnage across maritime and air flows, with an explicit diversification caution where the raw-material base is narrow.";
  }
  return "Use outbound export tonnage across port-led export flows and official trade statistics.";
}

function comparisonCurrencyNote(member) {
  if (member.regional_comparison_currency) {
    return `Publish the country in ${member.base_currency}, allow regional comparison in ${member.regional_comparison_currency}, and publish a continent-wide comparison series in ${continentComparisonCurrency}.`;
  }
  return `Publish the country in ${member.base_currency} and publish a continent-wide comparison series in ${continentComparisonCurrency}.`;
}

function validationStatus(member) {
  if (member.detail_level === "detailed_prototype_ready") {
    return "preferred_detailed_package_exists";
  }
  if (member.preferred_existing_package) {
    return "preferred_regional_starter_package_exists";
  }
  return "under_research";
}

function existingPackageNote(member) {
  if (!member.preferred_existing_package) {
    return "";
  }
  return member.preferred_existing_package.replace(/\\/g, "/");
}

function buildJson(member) {
  return {
    schema_version: "1.0",
    package_name: `${member.code} Fund Characteristics`,
    generated_on: generatedOn,
    status: "proposed_pre_launch",
    detail_level: member.detail_level,
    scope_definition: "54_sovereign_african_states_build",
    platform_note: "Prepared as a generic structured upload package for a 54-country Africa buildout because a public WASI/ASI Intelligence import schema could not be verified.",
    fund_identity: {
      fund_name: `${member.code} Fund`,
      short_name: member.code,
      full_name: fullName(member.country),
      benchmark_name: benchmarkName(member.country),
      benchmark_ticker: member.code,
      vehicle_stage: "concept_and_platform_profile",
      fund_status: "not_yet_constituted",
      target_domicile: member.country,
      iso3: member.iso3,
      base_currency: member.base_currency,
      regional_comparison_currency: member.regional_comparison_currency || "",
      continental_comparison_currency: continentComparisonCurrency,
      asset_class: "commodity_export_economy_reference_fund",
      strategy_type: "rules_based_index_tracking",
      reference_region: member.country
    },
    fund_family: {
      family_code: familyCode,
      family_name: familyName,
      subfamily_code: member.subfamily_code,
      subfamily_name: member.subfamily_name,
      family_role: member.family_role,
      shared_family_rule: "Each country fund keeps its own export methodology while staying aligned to a continent-wide naming, governance, and packaging structure.",
      comparison_currency_note: comparisonCurrencyNote(member)
    },
    investment_objective: {
      primary_objective: `Track the evolution of the main raw materials exported from ${member.country} through a transparent, rules-based benchmark.`,
      family_objective: "Enable continent-wide comparison inside AFEX while preserving country-specific export logic."
    },
    benchmark_methodology: {
      index_name: benchmarkName(member.country),
      index_code: member.code,
      methodology_model: member.methodology_model,
      weighting_method: "trailing_20_year_average_export_tonnage_weighting",
      transport_basis_note: transportBasisNote(member.methodology_model),
      reconstitution_frequency: "annual",
      rebalancing_frequency: "quarterly",
      pricing_method: "reference_commodity_prices_in_local_currency_with_optional_regional_and_usd_comparison_series",
      methodology_status: member.detail_level === "detailed_prototype_ready"
        ? "country_prototype_available"
        : "starter_profile_needs_country_trade_validation"
    },
    candidate_constituent_universe: member.candidate_constituents.map((name) => ({
      name,
      status: "candidate"
    })),
    country_context: {
      subfamily_code: member.subfamily_code,
      regional_links: member.regional_links,
      special_note: member.special_note
    },
    research_and_validation: {
      validation_status: validationStatus(member),
      preferred_existing_package: existingPackageNote(member),
      caution: "This all-54 library is a scalable continental starter set. Official country trade statistics, benchmark rules, and legal review should be completed before institutional launch."
    },
    regulatory_positioning: {
      generic_note: "Country-specific legal and securities review is required before launch. Do not assume one regulatory regime applies across all 54 sovereign states.",
      microfinance_separation_note: "The fund vehicle should remain separate from any microfinance balance sheet."
    }
  };
}

function buildMarkdown(member, json) {
  const links = member.regional_links.length
    ? member.regional_links.map((item) => `- \`${item}\``).join("\n")
    : "- `None specified`";

  return `# ${member.code} Fund Characteristics\n\n## Status\n\n- Stage: \`proposed_pre_launch\`\n- Detail level: \`${member.detail_level}\`\n- Scope: \`54 sovereign African states build\`\n- Country: \`${member.country}\`\n\n## Core Identity\n\n- Fund name: \`${json.fund_identity.fund_name}\`\n- Full name: \`${json.fund_identity.full_name}\`\n- Benchmark: \`${json.fund_identity.benchmark_name}\`\n- Fund family: \`${familyCode}\`\n- Regional subfamily: \`${member.subfamily_code}\`\n- Base currency: \`${json.fund_identity.base_currency}\`\n- Regional comparison currency: \`${json.fund_identity.regional_comparison_currency || "none"}\`\n- Continental comparison currency: \`${json.fund_identity.continental_comparison_currency}\`\n\n## Methodology Model\n\n- Model: \`${member.methodology_model}\`\n- Weighting: \`trailing 20-year average export tonnage\`\n- Transport note: ${json.benchmark_methodology.transport_basis_note}\n- Current status: \`${json.benchmark_methodology.methodology_status}\`\n\n## Candidate Raw-Material Universe\n\n${member.candidate_constituents.map((item) => `- \`${item}\``).join("\n")}\n\n## Regional Links\n\n${links}\n\n## Special Note\n\n- ${member.special_note}\n\n## Validation Note\n\n- This package is part of the all-54 AFEX starter library.\n- It should be validated with official country trade statistics before institutional launch.\n${json.research_and_validation.preferred_existing_package ? `- Preferred existing package: \`${json.research_and_validation.preferred_existing_package}\`` : ""}\n`;
}

function buildReadme(member) {
  return `# ${member.code} Upload Package\n\nThis folder contains the ${member.code} country package inside the AFEX all-54 sovereign-state library.\n\n## Files\n\n- ${slugify(member.code)}_fund_characteristics.json\n- ${slugify(member.code)}_fund_characteristics.md\n\n## Notes\n\n- Country: ${member.country}\n- Subfamily: ${member.subfamily_code}\n- Detail level: ${member.detail_level}\n- Family: ${familyCode}\n`;
}

function buildManifest() {
  const bySubfamily = regions.map((region) => ({
    subfamily_code: region.subfamily_code,
    subfamily_name: region.subfamily_name,
    country_count: region.countries.length,
    country_codes: region.countries.map((country) => country.code)
  }));

  return {
    schema_version: "1.0",
    package_name: "AFEX All 54 Sovereign-State Library",
    generated_on: generatedOn,
    family_code: familyCode,
    family_name: familyName,
    scope_definition: "54_sovereign_african_states_build",
    comparison_currency: continentComparisonCurrency,
    country_count: countries.length,
    subfamilies: bySubfamily,
    detailed_profiles: countries.filter((country) => country.detail_level === "detailed_prototype_ready").map((country) => country.code),
    starter_profiles: countries.filter((country) => country.detail_level !== "detailed_prototype_ready").map((country) => country.code),
    sovereignty_note: "This library follows the 54-sovereign-state interpretation of Africa. The African Union has 55 member states, including the Sahrawi Arab Democratic Republic.",
    note: "CIREX and BUREX retain the strongest existing country packages. Many other countries remain starter profiles pending country-level trade validation.",
    official_reference_urls: [
      "https://au.int/en/overview",
      "https://www.un.org/en/about-us/member-states#africanstates"
    ]
  };
}

function buildManifestMarkdown(manifest) {
  return `# AFEX All 54 Sovereign-State Library\n\n## Summary\n\n- Family: \`${manifest.family_code}\`\n- Country count: \`${manifest.country_count}\`\n- Continental comparison currency: \`${manifest.comparison_currency}\`\n- Scope: \`54 sovereign African states\`\n\n## Important Scope Note\n\n- This build follows the \`54\` sovereign-state interpretation of Africa\n- The African Union currently has \`55\` member states, including the Sahrawi Arab Democratic Republic\n\n## Subfamilies\n\n${manifest.subfamilies.map((item) => `- \`${item.subfamily_code}\` | ${item.subfamily_name} | ${item.country_count} countries`).join("\n")}\n\n## Detailed Country Packages\n\n${manifest.detailed_profiles.map((code) => `- \`${code}\``).join("\n")}\n\n## Upload Guidance\n\n1. Upload the umbrella \`AFEX\` family package once it exists.\n2. Upload the all-54 library manifest.\n3. Upload country packages region by region.\n4. Prefer the existing detailed \`CIREX\` and \`BUREX\` packages when available.\n`;
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

for (const member of countries) {
  const memberDir = path.join(outputRoot, slugify(member.code));
  const json = buildJson(member);
  const md = buildMarkdown(member, json);
  const readme = buildReadme(member);

  writeFile(path.join(memberDir, `${slugify(member.code)}_fund_characteristics.json`), JSON.stringify(json, null, 2));
  writeFile(path.join(memberDir, `${slugify(member.code)}_fund_characteristics.md`), md);
  writeFile(path.join(memberDir, "README.md"), readme);
}

const manifest = buildManifest();
writeFile(path.join(outputRoot, "afex_all54_manifest.json"), JSON.stringify(manifest, null, 2));
writeFile(path.join(outputRoot, "afex_all54_manifest.md"), buildManifestMarkdown(manifest));
writeFile(
  path.join(outputRoot, "README.md"),
  `# AFEX All 54 Library\n\nThis folder contains starter upload packages for 54 sovereign African country export-index funds.\n\n## Subfamilies\n\n${manifest.subfamilies.map((item) => `- ${item.subfamily_code} | ${item.subfamily_name} | ${item.country_count} countries`).join("\n")}\n\n## Important Scope Note\n\n- This library follows the 54-sovereign-state interpretation of Africa.\n- The African Union has 55 member states, including the Sahrawi Arab Democratic Republic.\n`
);

console.log(`Generated ${countries.length} country packages in ${outputRoot}`);
