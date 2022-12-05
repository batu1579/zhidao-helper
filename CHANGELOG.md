# Change Log

所有对 "hamibot-types" 的更改都会记录在这个文件中。

文档格式基于 [Keep a Changelog] ，
此项目遵循 [语义化版本号] 。

## [Unreleased]

### Fixed

- 修复上传到 hamibot 控制台的日志不完整的问题

## [1.1.0] - 2022-12-04

### Added

- 添加学期末自动填写调查问卷的功能
- 添加手动运行模式

### Fixed

- 修复预计学习时间超过 25 分钟被弹窗打断的问题

## [1.0.0] - 2022-12-04

### Added

- 添加运行模式选择：

  - `auto` - 自动模式（尽量全自动完成）
  - `manual` - 手动模式（需要手动开启课程页面）

- 添加自动解锁手机的功能
- 添加自动模式运行时自动静音并且调低亮度（结束时恢复）
- 添加模拟用户手指点按控件的函数
- 添加自动调速功能（自动调到 `1.5x` ）
- 添加自动回答弹题功能（单选题和判断题）

### Fixed

- 修复配置选项无法通过验证的问题
- 修复无法发送日志到远端的问题

## [0.0.1] - 2022-09-28

- initial release

<!-- Links -->

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[语义化版本号]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->

[unreleased]: https://github.com/batu1579/zhidao-helper/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/batu1579/zhidao-helper/compare/v1.0.0..v1.1.0
[1.0.0]: https://github.com/batu1579/zhidao-helper/compare/v0.0.1..v1.0.0
[0.0.1]: https://github.com/batu1579/zhidao-helper/releases/tag/v0.0.1
