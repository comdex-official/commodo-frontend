module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  globals: {
    process: "readonly",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["prettier"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    curly: ["warn", "multi-line", "consistent"],
    "no-bitwise": "warn",
    "no-console": "off",
    "no-param-reassign": "warn",
    "no-shadow": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "prefer-const": "warn",
    radix: ["warn", "always"],
    "spaced-comment": ["warn", "always"],
    "react/no-unescaped-entities": ["warn", { forbid: [">", "}"] }],
    "react/prop-types": "warn",
  },
  overrides: [],
};
