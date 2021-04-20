module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    $: "readonly",
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle": "off",
  },
};
