export const prompts = [
  {
    name: "summarize",
    category: "Tekstanalyse",
    description: "Oppsummer en gitt tekst i 2–3 setninger.",
    input_spec: [
      { id: "text", label: "Tekst", type: "textarea" }
    ],
    template: "Oppsummer denne teksten i 2–3 setninger:\n---\n{{ text }}"
  },
  {
    name: "sql_gen",
    category: "Databaser",
    description: "Generer SQL-spørring basert på tabell og filter.",
    input_spec: [
      { id: "table", label: "Tabellnavn", type: "text" },
      { id: "columns", label: "Kolonner", type: "text" },
      { id: "filters", label: "Filtrering", type: "text" }
    ],
    template: "Skriv en parameterisert SQL-spørring for tabell {{ table }} med kolonner {{ columns }} og filter {{ filters }}."
  }
];
