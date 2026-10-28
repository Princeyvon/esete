import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Esete Agro",
  version: packageJson.version,
  copyright: `© ${currentYear}, Esete Agro.`,
  meta: {
    title: "Esete Agro | Quality Products for Better Farming",
    description:
      "Agricultural inputs shop in Merkato Gojam bernda murtem, Addis Ababa, Ethiopia. Certified herbicides, insecticides, fungicides, fertilizers, knapsack sprayers, and seeds.",
  },
};
