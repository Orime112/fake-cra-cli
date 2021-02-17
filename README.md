# 环境准备

## mono repo 概念

```js
yarn global add lerna

lerna init

yarn


```

开启`workspaces`功能

`package.json`文件新增
```js
{
  "workspaces": [
    "packages/*"
  ]
}
```

新建子包
```
lerna create create-react-app2
```

查看当前工作空间
```
yarn workspaces info
```

经过一系列操作目前已经能够生成项目了
```js
yarn create-react-app <你的项目名>
```