# 从element源码学习如何开发 vue 通用组件
> 问题:用vue.js封装一个通用组件Input. 要求： 
  + 属性: 
    - type:默认text,可选text、textarea;
    - value: 可使用v-model双向绑定；
    - max-length
    - readonly;
  + 事件：
    - on-change
    - on-enter
  + 定义：
    - slot:prepend 定义前置内容

## 最简单的[footer](https://github.com/ElemeFE/element/blob/dev/packages/footer/src/main.vue)开始

PART1: footer功能部分
`packages/footer/src/main.vue`
```vue
<template>
  <footer class="el-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'ElFooter',
    componentName: 'ElFooter',
    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
```
PART2: 组件注册
`element/packages/footer/index.js`
```javascript
import Footer from './src/main';

/* istanbul ignore next */
Footer.install = function(Vue) {
  Vue.component(Footer.name, Footer);
};

export default Footer;
```
## input组件
涉及可配置属性
`element/packages/input/src/input.vue`

[npm link](https://docs.npmjs.com/cli/link)
> First, npm link in a package folder will create a symlink in the global folder
 {prefix}/lib/node_modules/<package> that links to the package where the npm link command was executed. (see npm-config for the value of prefix). 
It will also link any bins in the package to {prefix}/bin/{name}.