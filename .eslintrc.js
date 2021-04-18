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
  rules: {
    "import/no-unresolved": [2, { ignore: ["foundry"] }],
    "no-console": "off",
  },
};
