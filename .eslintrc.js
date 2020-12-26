module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential', // 对应的是eslint-plugin-vue， eslint适配到vue单文件组件中去校验。
    '@vue/standard', // 对应的是@vue/eslint-config-standard包。
    '@vue/typescript/recommended' // 让eslint去校验ts的代码，而不是使用tslint校验ts
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0
  }
}

// 修改规则套路， 去extends中去找对应的包，然后去GitHub上找文档。按照文档去配置
