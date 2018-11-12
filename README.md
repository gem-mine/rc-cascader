## JS组件开发说明

> 离线应用与颗粒组件

## 介绍

### 什么是离线应用？

- 将 H5 应用中的 HTML、JS、CSS、图片、字体、等静态资源缓存在手机上的 H5 应用，就称之为离线应用。
- 离线应用不会缓存数据，如果开发人员要做数据的缓存，要自己实现（建议把数据存存储在 [Bridge.require("sdp.localstorage")](http://reference.sdp.nd/appfactory/userguide/light/js-sdk/dao.html) 里,因为 HTML 的 localstorage 有空间限制）

### 离线应用的优点是什么？

- 减少请求远程资源，加速页面加载。
- 减少流量

### 什么是颗粒组件？

- 颗粒组件是离线应用的一种开发方式，他继承离线应用的所有特征和优点。
- 颗粒组件是比业务组件粒度更小的一种 H5 组件，它由一个布局页（page）和多个颗粒（widget）组合成一个 HTML 页面，相比之前的业务组件有更好的灵活度。



## 项目说明

本项目包含了离线应用和颗粒组件两个模板，方法大家借鉴使用。

### 目录说明

```
./
├── cli/                       // 命令脚本
├── config/                    // 离线应用配置参数
├── doc/                       // 项目使用到技术文档
├── mock/                      // 存放 mock 数据
├── src/                       // 离线应用的项目代码
├── test/                      // 测试用例
├── develop/                   // 开发环境下的颗粒打包程序
├── page-common/               // 颗粒组件的 `布局页`（page）
├── widget-1/                  // 颗粒组件的 `颗粒`（widget）
├── i18n.js                    // 开发环境下颗粒组件的 i18n 文件加载代码
└── webpack.config.babel.js    // 离线应用的 webpack 配置文件
```


### 颗粒组件常用命令

```bash
# 开启颗粒服务器，地址为 ：http://localhost:3000/ 或 http://localhost:3100/
npm run dev:widget

```

### 离线常用命令

```bash
# start a mocking server at localhost:3001
npm run mock

# serve with hot reload at localhost:3000
npm run dev

# eslint, stylelint, unit and e2e test
npm test

# compile files for production with minification
npm run compile

# test, clean, and compile
npm run build

# serve dist, like production
npm start

```
