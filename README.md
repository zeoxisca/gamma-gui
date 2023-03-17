# GAMMA-GUI （Xray POC generator)

## 描述
本项目开源网页版代码，试用：https://poc.xray.cool 。

https://stack.chaitin.com/tool/detail?id=91

release 中有 本地版本

## Online 版本

### 技术内容

使用 react + antdesign 开发

本人业余前端，前端业余，本项目只为降低 poc 编写的入门成本

### 运行

安装依赖：`npm i`

编译：`npm run build`

开发调试： `npm start`

### 配置

项目中使用 proxy， 在package.json中配置

项目检查规则请求可以自行修改为自定义的接口

### view
![img.png](img.png)

## 本地版
本地版接入gamma，实现了本地poc自测、格式校验。
### view
编写poc
![编写界面](https://user-images.githubusercontent.com/30494892/222369659-cd88aae2-6c96-4d77-bc5d-9e735021c5ef.png)
目标测试
![目标测试](https://user-images.githubusercontent.com/30494892/222369793-0e439fbf-a281-4cf8-b29d-69a529e8ca43.png)

### todo
- [x] 失败结果展示
- [x] 代码历史版本
- [ ] 代码历史版本对比
- [ ] 本地 poc 管理
- [ ] ...
