module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      // 'plugin:vue/vue3-essential',
      // "plugin:vue/essential",
      // "plugin:vue/strongly-recommended",
      "plugin:vue/recommended",
      "eslint:recommended",
    ],
    parserOptions: {
      parser: "babel-eslint",
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": "warn",
      "vue/max-attributes-per-line": [
        2,
        {
          singleline: 20,
          multiline: {
            max: 1,
            allowFirstLine: false,
          },
        },
      ],
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/no-v-html": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "never",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],
      "vue/require-default-prop": "off"
    },
  };
  
// module.exports = {
//     root: true,
//     parserOptions: {
//         parser: "babel-eslint",
//     },
//     env: {
//         browser: true,
//     },
//     extends: [
//         // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//         // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//         "plugin:vue/essential",
//         // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//     ],
//     // required to lint *.vue files
//     plugins: ["vue"],
//     // add your custom rules here
//     rules: {
//         // allow async-await
//         "vue/html-indent": "off",
//         "vue/component-name-in-template-casing": "0",
//         "vue/require-default-prop": "off",
//         "generator-star-spacing": "off",
//         // allow debugger during development
//         "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
//         "vue/no-use-v-if-with-v-for": [
//             "error",
//             {
//                 allowUsingIterationVar: false,
//             },
//         ],
//         "vue/return-in-computed-property": [
//             "error",
//             {
//                 treatUndefinedAsUnspecified: false,
//             },
//         ],
//         "vue/no-unused-components": [
//             "error",
//             {
//                 ignoreWhenBindingPresent: true,
//             },
//         ],
//         "vue/attribute-hyphenation": [
//             "error",
//             "always",
//             {
//                 ignore: [],
//             },
//         ],
//         "vue/component-name-in-template-casing": [
//             "error",
//             "kebab-case",
//             {
//                 ignores: [],
//             },
//         ],
//         "vue/html-closing-bracket-newline": [
//             "error",
//             {
//                 singleline: "never",
//                 multiline: "always",
//             },
//         ],
//         "vue/html-closing-bracket-spacing": [
//             "error",
//             {
//                 startTag: "never",
//                 endTag: "never",
//                 selfClosingTag: "always",
//             },
//         ],

//         "vue/html-quotes": ["error", "double"],
//         "vue/html-self-closing": 0,
//         "vue/max-attributes-per-line": 0,
//         "vue/multiline-html-element-content-newline": [
//             "error",
//             {
//                 ignoreWhenEmpty: true,
//                 ignores: ["pre", "textarea"],
//             },
//         ],
//         "vue/mustache-interpolation-spacing": ["error", "always"],
//         "vue/name-property-casing": ["error", "kebab-case"],
//         "vue/no-multi-spaces": [
//             "error",
//             {
//                 ignoreProperties: false,
//             },
//         ],
//         "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
//         "vue/no-template-shadow": ["error"],
//         "vue/prop-name-casing": ["error", "camelCase"],
//         "vue/require-default-prop": ["error"],
//         "vue/v-bind-style": ["error", "shorthand"],
//         "vue/v-on-style": ["error", "shorthand"],
//         "vue/attributes-order": 0,
//         "vue/order-in-components": [
//             "error",
//             {
//                 order: [
//                     "el",
//                     "name",
//                     "parent",
//                     "functional",
//                     ["delimiters", "comments"],
//                     ["components", "directives", "filters"],
//                     "extends",
//                     "mixins",
//                     "inheritAttrs",
//                     "model",
//                     ["props", "propsData"],
//                     "data",
//                     "computed",
//                     "watch",
//                     "LIFECYCLE_HOOKS",
//                     "methods",
//                     ["template", "render"],
//                     "renderError",
//                 ],
//             },
//         ],
//         "vue/this-in-template": ["error", "never"],
//     },
// };
