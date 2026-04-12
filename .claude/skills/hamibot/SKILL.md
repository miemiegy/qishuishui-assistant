---
name: hamibot
description: Hamibot 安卓自动化专家，支持两种方式：1) 在设备上运行 JavaScript 脚本（控件操作、触摸、OCR、HTTP 等）；2) 通过 CLI 命令行远程控制设备（执行代码、文件管理、截图、模拟输入等）。当用户提到 Hamibot、Auto.js、安卓自动化、模拟点击、自动刷广告、远程控制 Android、CLI 控制手机、批量操作多设备等场景时，必须优先使用此技能。
---

# Hamibot 安卓自动化

Hamibot 是基于 Auto.js 的 Android 自动化平台，提供两种方式：

1. **脚本开发** - 在设备上运行 JavaScript 自动化脚本
2. **CLI 远程控制** - 通过命令行远程操控已连接的设备

## 快速选择

| 场景 | 推荐方式 |
|------|----------|
| 编写自动点击、刷广告脚本 | **脚本开发** |
| 批量控制多台设备 | **CLI** |
| 临时执行简单命令 | **CLI** |
| 复杂的逻辑判断和 UI 交互 | **脚本开发** |
| 截图、文件传输 | **CLI** |

## 快速开始

脚本基础框架：

```javascript
auto.waitFor();
console.show();

// 主循环
while (!isStopped()) {
    // 你的逻辑
    sleep(1000);
}
```

## 核心模块速查

| 模块 | 用途 | 关键函数 |
|------|------|----------|
| [无障碍服务](#无障碍服务) | 初始化权限 | `auto.waitFor()` |
| [控件操作](#控件操作) | 查找/点击 UI 元素 | `text().findOne().click()` |
| [触摸操作](#触摸操作) | 坐标点击、滑动 | `click(x,y)`, `swipe()` |
| [设备信息](#设备信息) | 屏幕尺寸、电量 | `device.width/height` |
| [应用操作](#应用操作) | 启动/关闭应用 | `launchApp()`, `killApp()` |
| [图像处理](#图像处理) | 截图、找色、找图 | `captureScreen()`, `findColor()` |
| [OCR](#ocr文字识别) | 文字识别 | `ocr.recognize()` |
| [HTTP](#http请求) | 网络请求 | `http.get/postJson()` |
| [文件操作](#文件操作) | 读写文件 | `files.read/write()` |
| [存储](#存储) | 本地数据存储 | `storages.create()` |

## 无障碍服务

所有控件操作都需要无障碍服务：

- `auto()` - 检查并启用，未启用则跳转设置（会停止脚本）
- `auto.waitFor()` - 等待启用后继续运行（**推荐**）
- `auto.setMode('fast')` - 快速模式，启用控件缓存

## 控件操作

### 选择器（链式调用）

```javascript
// 文本匹配
text("确定")           // 完全匹配
textContains("领")     // 包含
textStartsWith("继续") // 开头
textEndsWith("奖励")   // 结尾

// 其他属性
desc("关闭")           // 描述
id("btn_ok")           // ID
className("Button")    // 类名
clickable(true)        // 是否可点击
enabled(true)          // 是否启用
bounds(0,0,100,100)    // 边界范围
```

### 查找方法

```javascript
.findOne()           // 阻塞直到找到
.findOne(5000)       // 阻塞，超时5秒返回null
.findOnce()          // 立即返回，找不到为null
.find()              // 返回 UiCollection
.exists()            // 判断是否存在
.waitFor()           // 等待出现
```

### 控件操作

```javascript
let btn = text("确定").findOne();
btn.click();           // 点击
btn.longClick();       // 长按
btn.setText("hello");  // 输入文本
btn.getText();         // 获取文本

// 获取位置
let b = btn.bounds();
click(b.centerX(), b.centerY());
```

### 常用代码模式

**等待并点击：**
```javascript
text("确定").findOne().click();
// 或带超时
let btn = text("确定").findOne(3000);
if (btn) btn.click();
```

**查找多个：**
```javascript
let buttons = className("Button").find();
buttons.forEach(btn => {
    log(btn.getText());
});
```

## 触摸操作

用于游戏或没有控件的场景（需 root 或 Android 7.0+）：

```javascript
// 基础操作
click(x, y);                           // 点击坐标
longClick(x, y);                       // 长按
press(x, y, 1000);                     // 按压1秒

// 滑动
swipe(x1, y1, x2, y2, 500);           // 滑动500ms
gesture(1000, [x1,y1], [x2,y2]);      // 自定义手势

// 多指
pinchClose(x1,y1,x2,y2, 500);         // 双指捏合
pinchOpen(x1,y1,x2,y2, 500);          // 双指张开
```

## 设备信息

```javascript
// 屏幕尺寸（用于相对坐标）
let w = device.width;
let h = device.height;
click(w * 0.92, h * 0.065);  // 点击右上角

// 其他信息
device.model       // 型号
device.brand       // 品牌
device.sdkInt      // SDK版本

// 音量控制
device.setMusicVolume(15);
device.vibrate(500);
device.wakeUp();
device.keepScreenOn(60000);  // 保持亮屏1分钟
```

## 应用操作

```javascript
// 启动/关闭
launchApp("汽水音乐");
killApp("com.tencent.qqmusic");
forceStopApp("com.example.app");

// 获取当前应用
currentPackage();   // 包名
currentActivity();  // Activity名

// 应用信息
getAppName("com.tencent.mm");
getPackageName("微信");
```

## 图像处理

### 截图

```javascript
// 申请权限（只需一次）
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}

let img = captureScreen();
images.save(img, "/sdcard/screen.png");
```

### 找色

```javascript
let img = captureScreen();
let point = findColor(img, "#FF0000", {
    threshold: 4  // 色差阈值
});
if (point) {
    click(point.x, point.y);
}

// 多点找色
findMultiColors(img, "#FF0000", [
    [10, 20, "#00FF00"],
    [30, 40, "#0000FF"]
]);
```

### 找图

```javascript
let template = images.read("/sdcard/button.png");
let result = findImage(captureScreen(), template, {
    threshold: 0.9,                    // 相似度阈值
    region: [0, 0, device.width, 300]  // 搜索区域
});
if (result) click(result.x, result.y);
```

## OCR文字识别

```javascript
let img = captureScreen();
let result = ocr.recognize(img);

// 结果结构
result.forEach(item => {
    log("文字:", item.text);
    log("位置:", item.bounds);
    log("置信度:", item.confidence);
});

// 只获取文字
let text = ocr.recognizeText(img);
```

## HTTP请求

```javascript
// GET
let res = http.get("https://api.example.com/data");
log(res.body.string());

// POST JSON
http.postJson("https://api.example.com/save", {
    name: "test",
    value: 123
});

// POST 文件
http.postMultipart("https://api.example.com/upload", {
    file: open("/sdcard/1.png")
});
```

## 文件操作

```javascript
// 读取
let content = files.read("/sdcard/test.txt");
let bytes = files.readBytes("/sdcard/1.bin");

// 写入
files.write("/sdcard/out.txt", "hello");
files.append("/sdcard/log.txt", "new line\n");

// 路径操作
files.exists(path);
files.create(path);
files.remove(path);
files.copy(from, to);
files.move(from, to);
files.listDir("/sdcard");
```

## 存储

```javascript
let storage = storages.create("my_data");

// 读写
storage.put("count", 100);
let count = storage.get("count", 0);  // 默认0

// 其他
storage.remove("count");
storage.clear();
storage.contains("count");
```

## 实用函数

```javascript
// 随机延时（防检测）
sleep(random(4000, 7000));

// 剪贴板
setClip("复制的内容");
let text = getClip();

// Toast提示
toast("操作完成");
toastLog("带日志的提示");

// 退出脚本
exit();

// 检查是否被要求停止
if (isStopped()) {
    log("脚本被要求停止");
    break;
}
```

## 完整示例：自动刷广告

```javascript
auto.waitFor();
console.show();

const CONFIG = {
    adDuration: 35000,
    checkInterval: 2000,
    maxRetry: 3
};

function main() {
    log("脚本启动");
    
    while (!isStopped()) {
        try {
            // 找"继续领"按钮
            let btn = textContains("继续领").findOnce()
                || textContains("领时长").findOnce();
            
            if (btn) {
                log("找到按钮，点击");
                btn.click();
                watchAd();
            } else {
                log("未找到按钮，等待...");
            }
            
            sleep(random(4000, 7000));
        } catch (e) {
            log("错误:", e.message);
        }
    }
    
    log("脚本结束");
}

function watchAd() {
    // 等待广告播放
    sleep(CONFIG.adDuration);
    
    // 关闭广告（多种方式尝试）
    let closeBtn = desc("关闭").findOnce()
        || text("关闭").findOnce()
        || textContains("跳过").findOnce();
    
    if (closeBtn) {
        closeBtn.click();
    } else {
        // 尝试点击右上角
        click(device.width * 0.92, device.height * 0.065);
    }
    
    // 处理"继续看"或"退出"
    sleep(1000);
    let exitBtn = text("坚持退出").findOnce();
    if (exitBtn) exitBtn.click();
    
    let continueBtn = text("领取奖励").findOnce();
    if (continueBtn) {
        continueBtn.click();
        watchAd();  // 递归处理连续广告
    }
}

main();
```

## 更多模块

- **UI**: `ui.layout()` 创建界面，`dialogs` 显示对话框
- **多线程**: `threads.start()` 启动线程
- **定时器**: `setInterval()`, `setTimeout()`
- **Shell**: `shell()` 执行命令
- **Canvas**: 绘制图形
- **加密**: `aes`, `base64`, `hasher` (MD5/SHA)
- **媒体**: `media.playMusic()`
- **传感器**: `sensors.register("accelerometer")`

## 最佳实践

1. **随机延迟**：`sleep(random(3000, 5000))` 避免被检测
2. **相对坐标**：使用 `device.width/height` 适配不同屏幕
3. **异常处理**：用 try-catch 包裹不确定的操作
4. **超时机制**：查找元素时设置合理的超时时间
5. **日志记录**：使用 `console.show()` 和 `log()` 方便调试

---

# Hamibot CLI 远程控制

通过命令行远程操控 Android 设备，适合批量操作和临时命令。

## 安装与登录

```bash
# 安装
npm install -g hamibot

# 登录（账号密码）
hamibot login

# 或 Token 登录（推荐用于 CI/CD）
hamibot login -t hmp_xxxxxxxxxxxx
```

**环境变量免登录：**
```bash
export HAMIBOT_TOKEN=hmp_xxxxxxxxxxxx
export HAMIBOT_DEFAULT_DEVICE=device-id
hamibot exec -c 'toast("Hi")'
```

## CLI 核心命令速查

| 命令 | 用途 | 示例 |
|------|------|------|
| `hamibot devices` | 查看设备列表 | `hamibot devices` |
| `hamibot exec` | 执行代码 | `hamibot exec -c 'toast("Hello")'` |
| `hamibot input tap` | 点击屏幕 | `hamibot input tap 500 500` |
| `hamibot input swipe` | 滑动 | `hamibot input swipe 500 1500 500 500` |
| `hamibot screenshot` | 截图 | `hamibot screenshot -o ./screen.png` |
| `hamibot file download` | 下载文件 | `hamibot file download /sdcard/1.png ./` |
| `hamibot file upload` | 上传文件 | `hamibot file upload ./1.js /sdcard/` |
| `hamibot launch` | 启动应用 | `hamibot launch com.example.app` |
| `hamibot info screen` | 屏幕信息 | `hamibot info screen` |

## CLI 设备管理

```bash
# 列出所有设备
hamibot devices

# 查看设备详情
hamibot devices info <deviceId>

# 设置默认设备
hamibot config defaultDevice <deviceId>

# 多设备并行操作（同时控制多台）
hamibot input tap 500 500 -d device-A -d device-B
```

## CLI 代码执行

```bash
# 直接执行代码
hamibot exec -c 'toast("Hello from CLI!")'

# 从文件执行
hamibot exec -f ./script.js

# 通过管道传入
echo 'toast("Hello")' | hamibot exec

# 指定设备执行
hamibot exec -c 'click(500, 500)' -d my-device
```

## CLI 输入控制

```bash
# 点击坐标
hamibot input tap 500 500
hamibot input click 500 500    # 同上

# 长按（默认 1 秒）
hamibot input longtap 500 500
hamibot input longtap 500 500 --duration 2000

# 滑动
hamibot input swipe 500 1500 500 500 --duration 300

# 自定义手势路径（多点）
hamibot input gesture 500 100 200 300 400 500 600 700
```

## CLI 文件管理

```bash
# 列出目录（默认 /sdcard）
hamibot file ls
hamibot file ls /sdcard/Download

# 下载文件到本地
hamibot file download /sdcard/screenshot.png
hamibot file download /sdcard/1.png ./my-image.png

# 上传文件到设备
hamibot file upload ./local.txt /sdcard/

# 查看文件内容
hamibot file cat /sdcard/log.txt
```

## CLI 截图

```bash
# 截图保存到当前目录（使用时间戳命名）
hamibot screenshot

# 指定输出路径
hamibot screenshot -o ./screen.png

# 截图后自动打开
hamibot screenshot --open
```

## CLI 应用控制

```bash
# 启动应用
hamibot launch com.tencent.mm

# 启动指定 Activity
hamibot launch com.example.app --activity .MainActivity

# 查看应用信息
hamibot info app com.tencent.mm

# 列出已安装应用
hamibot info apps
hamibot info apps --system    # 包含系统应用
```

## CLI 设备信息

```bash
# 屏幕尺寸与密度
hamibot info screen

# 电池状态
hamibot info battery
```

## CLI 全局选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `-d, --device <id>` | 指定设备（可多次使用） | `-d device-A -d device-B` |
| `-j, --json` | JSON 格式输出 | `hamibot devices -j` |
| `--debug` | 调试日志 | `--debug hamibot` |

## CLI 与脚本对比示例

**场景：点击屏幕右上角**

脚本方式（在设备上运行）：
```javascript
auto.waitFor();
click(device.width * 0.92, device.height * 0.065);
```

CLI 方式（远程执行）：
```bash
# 方式1：直接执行代码
hamibot exec -c 'click(device.width * 0.92, device.height * 0.065)'

# 方式2：直接指定坐标
hamibot input tap 1035 70    # 假设 1080x1920 屏幕
```

## CLI 批量操作示例

**批量截图所有设备：**
```bash
for device in $(hamibot devices -j | jq -r '.[].id'); do
    hamibot screenshot -d $device -o ./screenshot-${device}.png
done
```

**多台设备同时点击：**
```bash
hamibot input tap 500 500 -d device1 -d device2 -d device3
```

**批量安装脚本到多设备：**
```bash
for device in device-A device-B device-C; do
    hamibot exec -f ./auto-click.js -d $device &
done
wait
```
