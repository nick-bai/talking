# RongCloud Web IM Widget for Angular

---

**Web IM Widget for Angular** 是一个angular插件。通信部分依赖 `RongIMLib`。  
支持IE9+、Chrome、Firefox等

```
npm install -g typescript@1.6.0beta tsd grunt-cli bower
```

如有必要，使用 `sudo npm`

### 安装依赖库

在项目根目录下执行：

```
npm install
bower install
tsd install
```

### 编译开发代码

```
grunt build
```

### 发布正式代码

```
grunt release
```

### 编译demo

```
grunt demo
```

### 启动demo服务

```
grunt connect:demo
```

## 文件结构说明
```
  |-----------------------
  |  demo实例
  |            [demo/aa]用户aa
  |            [demo/bb]用户bb
  |            [demo/cc]用户cc
  |            [demo/kefu]客服示例
  |            [demo/lib]引用js库
  |            [demo/widget]插件所需文件
  |            [demo/index]
  |------------------------
  |  dist插件资源目录
  |				[dist/css]样式资源
  |				[dist/images]图片资源
  |				[dist/RongIMWidget.full.js]包含jQuery库和其他js帮助库
  |				[dist/RongIMWidget.js]不包含jQuery库，包含样式功能辅助库
  |				[dist/RongIMWidget.tidy.js]不包含辅助插件库
  |-----------------------
  |  doc文档说明
  |				[doc/开发文档]
  |				[doc/客服]关于客服使用的说明
  |-----------------------
  |  src源码
  |				[]
  |
  |-----------------------
  | vendor辅助js插件库
  |
```
