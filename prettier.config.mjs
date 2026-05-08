/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  proseWrap: "preserve",
  endOfLine: "lf",
  useTabs: false,
  tabWidth: 2,
  overrides: [
    {
      files: ["*.astro", "*.html"],
      options: {
        parser: "astro",
        useTabs: true,
        tabWidth: 4,
      },
    },
    {
      files: ["*.json", "*.jsonc", "*.yaml", "*.yml", "*.md", "*.mdx", "*.svg"],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
