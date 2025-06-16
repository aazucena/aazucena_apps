import type { PlopTypes } from "@turbo/gen";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new Astro component to the internal UI library
  plop.setGenerator("astro-ui", {
    description: "Adds a new astro UI file",
    prompts: [
      {
        type: "list",
        name: "type",
        choices: ["components", "layout", "utils", "integration"],
        message: "What is the file type?",
      },
      {
        type: "list",
        name: "componentType",
        choices: ["none", "blog", "common", "elements", "widgets"],
        message: "What is the component file type?",
        when: (answers) => answers.type === "components",
      },
      {
        type: "input",
        name: "name",
        message: "What is the name of the file?",
      },
    ],
    actions: (answers) => {
      if (answers!.type === "components" && answers!.componentType !== "none") {
        return [
          {
            type: "add",
            path: "src/{{type}}/{{componentType}}/{{kebabCase name}}.astro",
            templateFile: "templates/{{type}}.hbs",
          }
        ]
      } else if (answers!.type === "integration") {
        return [
          {
            type: "addMany",
            destination: "vendors/{{kebabCase name}}",
            base: `templates`,
            templateFiles: `templates/integration/**/*.hbs`
          },
          {
            type: "append",
            path: "package.json",
            pattern: /"exports": {(?<insertion>)/g,
            template: `"./{{type}}/{{kebabCase name}}": "./src/{{type}}/{{kebabCase name}}/index.ts",`,
          },
          {
            type: "append",
            path: "package.json",
            pattern: /"exports": {(?<insertion>)/g,
            template: `"./{{kebabCase name}}": "./src/{{type}}/{{kebabCase name}}/index.ts",`,
          },
        ]
      } else {
        const fileExt = answers!.type === "utils" ? "ts" : "astro";
        return [
          {
            type: "add",
            path: `src/{{type}}/{{kebabCase name}}.${fileExt}`,
            templateFile: "templates/{{type}}.hbs",
          },
          {
            type: "append",
            path: "package.json",
            pattern: /"exports": {(?<insertion>)/g,
            template: `"./{{type}}/{{kebabCase name}}": "./src/{{type}}/{{kebabCase name}}.${fileExt}",`,
          },
        ]
      }
    },
  });
}
