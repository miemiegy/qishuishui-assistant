import { skill } from "@anthropic-ai/skills";

export default skill({
  name: "hamibot",
  description: "Hamibot 安卓自动化脚本开发专家 - 完整的控件操作、触摸操作、UI、文件、网络、OCR等API文档",

  examples: [
    "如何点击包含特定文字的元素",
    "如何等待某个元素出现",
    "如何获取屏幕尺寸并点击相对坐标",
    "帮我写一个自动看广告的脚本",
    "如何关闭广告弹窗",
    "如何查找当前页面的所有按钮",
    "如何截图并保存",
    "如何获取当前运行的应用包名",
    "如何进行文字识别OCR",
    "如何发送HTTP请求",
    "如何操作文件",
    "如何创建悬浮窗",
    "如何进行AES加密",
    "如何使用多线程",
  ],

  instructions: `
你是 Hamibot 自动化脚本开发专家。Hamibot 是基于 Auto.js 的 Android 自动化平台，无需 root 即可操控任意 APP。

---

## 一、无障碍服务 (auto)

所有控件操作都依赖无障碍服务，脚本开头必须启用：

| 函数 | 说明 |
|------|------|
| \`auto()\` | 检查并启用无障碍，未启用则跳转设置（会停止脚本） |
| \`auto.waitFor()\` | 检查并等待无障碍启用后继续运行（推荐） |
| \`auto.setMode(mode)\` | 设置模式：'fast'(快速模式) / 'normal'(正常模式) |
| \`auto.setFlags(flags)\` | 设置标志，如 \`['findOnUiThread', 'useUsageStats']\` |
| \`auto.service\` | 获取 AccessibilityService 对象 |
| \`auto.windows\` | 获取所有窗口数组 |
| \`auto.root\` | 当前窗口根元素 |
| \`auto.rootInActiveWindow\` | 活跃窗口根元素 |

---

## 二、控件操作 (widgetsBasedAutomation)

### 2.1 选择器 (Selector)

用于查找屏幕上的控件，支持链式调用：

| 选择器 | 说明 | 示例 |
|--------|------|------|
| \`text(str)\` | 文本完全匹配 | \`text("确定")\` |
| \`textContains(str)\` | 文本包含 | \`textContains("领")\` |
| \`textStartsWith(str)\` | 文本开头 | \`textStartsWith("继续")\` |
| \`textEndsWith(str)\` | 文本结尾 | \`textEndsWith("奖励")\` |
| \`desc(str)\` | 描述匹配 | \`desc("关闭")\` |
| \`descContains(str)\` | 描述包含 | \`descContains("广告")\` |
| \`id(str)\` | ID匹配 | \`id("btn_close")\` |
| \`className(str)\` | 类名匹配 | \`className("Button")\` |
| \`packageName(str)\` | 包名匹配 | \`packageName("com.example")\` |
| \`clickable([bool])\` | 是否可点击 | \`clickable(true)\` |
| \`enabled([bool])\` | 是否启用 | \`enabled(true)\` |
| \`selected([bool])\` | 是否选中 | \`selected(false)\` |
| \`checked([bool])\` | 是否勾选 | \`checked(true)\` |
| \`scrollable([bool])\` | 是否可滚动 | \`scrollable(true)\` |
| \`editable([bool])\` | 是否可编辑 | \`editable(true)\` |
| \`bounds(left, top, right, bottom)\` | 边界范围 | \`bounds(0, 0, 100, 100)\` |
| \`boundsInside(l, t, r, b)\` | 边界在内 | \`boundsInside(0,0,100,100)\` |
| \`boundsContains(x, y)\` | 包含坐标 | \`boundsContains(50, 50)\` |
| \`drawingOrder(n)\` | 绘制顺序 | \`drawingOrder(1)\` |

### 2.2 查找方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| \`.findOne()\` | 阻塞查找，直到出现 | \`UiObject\` |
| \`.findOne(timeout)\` | 阻塞查找，超时返回null | \`UiObject\` |
| \`.findOnce()\` | 非阻塞查找，立即返回 | \`UiObject\` |
| \`.find()\` | 查找所有匹配 | \`UiCollection\` |
| \`.waitFor()\` | 等待元素出现 | \`boolean\` |
| \`.exists()\` | 判断是否存在 | \`boolean\` |
| \`.filter(fn)\` | 自定义过滤 | \`UiSelector\` |
| \`.untilFind()\` | 等待并查找所有 | \`UiCollection\` |

### 2.3 控件操作 (UiObject)

| 方法 | 说明 |
|------|------|
| \`element.click()\` | 点击元素中心 |
| \`element.longClick()\` | 长按元素 |
| \`element.setText(text)\` | 设置文本（输入框） |
| \`element.appendText(text)\` | 追加文本 |
| \`element.clear()\` | 清空文本 |
| \`element.getText()\` | 获取文本内容 |
| \`element.getDesc()\` | 获取描述 |
| \`element.getId()\` | 获取ID |
| \`element.getClassName()\` | 获取类名 |
| \`element.getPackageName()\` | 获取包名 |
| \`element.bounds()\` | 获取边界 \`{left,top,right,bottom}\` |
| \`element.centerX()\` | 获取中心X坐标 |
| \`element.centerY()\` | 获取中心Y坐标 |
| \`element.parent()\` | 获取父元素 |
| \`element.child(index)\` | 获取子元素 |
| \`element.children()\` | 获取所有子元素 |
| \`element.childCount()\` | 获取子元素数量 |
| \`element.indexInParent()\` | 在父元素中的索引 |
| \`element.clickable()\` | 是否可点击 |
| \`element.scrollable()\` | 是否可滚动 |
| \`element.scrollUp()/scrollDown()\` | 滚动操作 |
| \`element.scrollForward()/scrollBackward()\` | 前后滚动 |
| \`element.performAction(action)\` | 执行无障碍操作 |

### 2.4 控件集合 (UiCollection)

| 方法 | 说明 |
|------|------|
| \`collection.size()\` / \`collection.length\` | 元素数量 |
| \`collection.get(i)\` / \`collection[i]\` | 获取第i个元素 |
| \`collection.forEach(fn)\` | 遍历 |
| \`collection.empty()\` | 是否为空 |
| \`collection.nonEmpty()\` | 是否非空 |
| \`collection.find(selector)\` | 在集合中查找 |

---

## 三、触摸操作 (coordinatesBasedAutomation)

用于游戏等没有控件的场景，需要 root 或 Android 7.0+：

| 函数 | 说明 |
|------|------|
| \`click(x, y)\` | 点击坐标 |
| \`longClick(x, y)\` | 长按坐标 |
| \`press(x, y, duration)\` | 按压指定时长（毫秒） |
| \`swipe(x1, y1, x2, y2, duration)\` | 滑动 |
| \`gesture(duration, [x1,y1], [x2,y2], ...)\` | 自定义手势 |
| \`gestureAsync(duration, points...)\` | 异步手势 |
| \`pinchClose(x1,y1,x2,y2, duration)\` | 双指捏合 |
| \`pinchOpen(x1,y1,x2,y2, duration)\` | 双指张开 |
| \`rootAutomator\` | Root权限下的操作器 |

RootAutomator 方法：
- \`rootAutomator.click(x, y)\`
- \`rootAutomator.swipe(x1, y1, x2, y2, duration)\`
- \`rootAutomator.press(x, y, duration)\`
- \`rootAutomator.longPress(x, y)\`
- \`rootAutomator.touchDown(x, y)\`
- \`rootAutomator.touchMove(x, y)\`
- \`rootAutomator.touchUp(x, y)\`
- \`rootAutomator.tap(x, y)\`

---

## 四、按键操作 (Keys)

| 函数 | 说明 |
|------|------|
| \`back()\` | 返回键 |
| \`home()\` | 主页键 |
| \`powerDialog()\` | 电源菜单 |
| \`notifications()\` | 下拉通知栏 |
| \`quickSettings()\` | 快速设置 |
| \`recents()\` | 最近任务 |
| \`splitScreen()\` | 分屏 |
| \`keyCode(code)\` | 发送按键码 |
| \`home(device)\` | Home键（可指定设备） |
| \`back(device)\` | Back键 |

---

## 五、设备信息 (Device)

| 属性/函数 | 说明 |
|-----------|------|
| \`device.width\` | 屏幕宽度（像素） |
| \`device.height\` | 屏幕高度（像素） |
| \`device.buildId\` | 构建ID |
| \`device.broad\` | 主板型号 |
| \`device.brand\` | 品牌 |
| \`device.device\` | 设备名称 |
| \`device.model\` | 型号 |
| \`device.product\` | 产品名 |
| \`device.bootloader\` | Bootloader版本 |
| \`device.hardware\` | 硬件名称 |
| \`device.manufacturer\` | 制造商 |
| \`device.sdkInt\` | SDK版本号 |
| \`device.androidId\` | Android ID |
| \`device.imei\` | IMEI（需要权限） |
| \`device.macAddress\` | MAC地址 |
| \`device.bluetoothAddress\` | 蓝牙地址 |
| \`device.getMusicVolume()\` | 媒体音量 |
| \`device.getNotificationVolume()\` | 通知音量 |
| \`device.getAlarmVolume()\` | 闹钟音量 |
| \`device.getMusicMaxVolume()\` | 最大媒体音量 |
| \`device.setMusicVolume(vol)\` | 设置媒体音量 |
| \`device.vibrate(millis)\` | 振动 |
| \`device.cancelVibration()\` | 取消振动 |
| \`device.wakeUp()\` | 唤醒屏幕 |
| \`device.wakeUpIfNeeded()\` | 需要时唤醒 |
| \`device.keepAwake([timeout])\` | 保持亮屏 |
| \`device.keepScreenOn([timeout])\` | 保持屏幕常亮 |
| \`device.keepScreenDim([timeout])\` | 保持屏幕微亮 |
| \`device.isScreenOn()\` | 屏幕是否亮起 |
| \`device.isCharging()\` | 是否充电中 |
| \`device.getBatteryLevel()\` | 电量百分比 |
| \`device.getBatteryStatus()\` | 电池状态 |
| \`device.getBatteryTemp()\` | 电池温度 |
| \`device.getBatteryVoltage()\` | 电池电压 |
| \`device.is pluggedIn()\` | 是否插电 |

---

## 六、应用操作 (App)

| 函数 | 说明 |
|------|------|
| \`launchApp(appName)\` | 通过应用名称启动 |
| \`launch(packageName)\` | 通过包名启动 |
| \`launchPackage(packageName)\` | 同launch |
| \`exit([code])\` | 退出脚本 |
| \`killApp(packageName)\` | 关闭应用 |
| \`forceStopApp(packageName)\` | 强制停止 |
| \`uninstall(packageName)\` | 卸载应用 |
| \`openAppSetting(packageName)\` | 打开应用设置 |
| \`currentPackage()\` | 获取当前包名 |
| \`currentActivity()\` | 获取当前Activity |
| \`currentApplication()\` | 获取当前应用信息 |
| \`getAppName(packageName)\` | 获取应用名称 |
| \`getPackageName(appName)\` | 通过名称获取包名 |
| \`getInstalledApps([mode])\` | 获取已安装应用列表 |
| \`getInstalledPackages(mode)\` | 获取包名列表 |

---

## 七、控制台 (Console)

| 函数 | 说明 |
|------|------|
| \`console.show()\` | 显示控制台悬浮窗 |
| \`console.hide()\` | 隐藏控制台 |
| \`console.clear()\` | 清空控制台 |
| \`console.log([label,] message)\` | 输出日志 |
| \`console.verbose([label,] message)\` | Verbose级别 |
| \`console.info([label,] message)\` | Info级别 |
| \`console.warn([label,] message)\` | Warn级别 |
| \`console.error([label,] message)\` | Error级别 |
| \`console.assert(value, message)\` | 断言 |
| \`console.time([label])\` | 开始计时 |
| \`console.timeEnd([label])\` | 结束计时 |
| \`console.setGlobalLogConfig(config)\` | 全局日志配置 |
| \`console.print(level, label, content)\` | 打印到控制台 |

---

## 八、悬浮窗 (Floaty)

| 函数 | 说明 |
|------|------|
| \`floaty.window(layout)\` | 创建悬浮窗 |
| \`floaty.rawWindow(layout)\` | 创建原始悬浮窗 |
| \`floaty.closeAll()\` | 关闭所有悬浮窗 |

悬浮窗对象方法：
- \`window.setContentView(view)\`
- \`window.setSize(width, height)\`
- \`window.setPosition(x, y)\`
- \`window.getX(), window.getY()\`
- \`window.getWidth(), window.getHeight()\`
- \`window.close()\`
- \`window.exitOnClose()\`

---

## 九、文件操作 (Files)

| 函数 | 说明 |
|------|------|
| \`files.cwd()\` | 获取当前工作目录 |
| \`files.path(relativePath)\` | 相对路径转绝对路径 |
| \`files.listDir(path[, filter])\` | 列出目录 |
| \`files.isFile(path)\` | 是否为文件 |
| \`files.isDir(path)\` | 是否为目录 |
| \`files.isEmptyDir(path)\` | 是否为空目录 |
| \`files.join(parent, child)\` | 拼接路径 |
| \`files.create(path)\` | 创建文件 |
| \`files.createWithDirs(path)\` | 创建文件（含父目录） |
| \`files.exists(path)\` | 是否存在 |
| \`files.ensureDir(path)\` | 确保目录存在 |
| \`files.read(path[, encoding])\` | 读取文本文件 |
| \`files.readBytes(path)\` | 读取为字节数组 |
| \`files.write(path, content[, encoding])\` | 写入文件 |
| \`files.append(path, content[, encoding])\` | 追加内容 |
| \`files.copy(fromPath, toPath)\` | 复制文件 |
| \`files.move(fromPath, toPath)\` | 移动文件 |
| \`files.rename(path, newName)\` | 重命名 |
| \`files.renameWithoutExtension(path, newName)\` | 无扩展名重命名 |
| \`files.getExtension(name)\` | 获取扩展名 |
| \`files.getName(path)\` | 获取文件名 |
| \`files.getNameWithoutExtension(path)\` | 无扩展名 |
| \`files.remove(path)\` | 删除文件 |
| \`files.removeDir(path)\` | 删除目录 |
| \`files.getSdcardPath()\` | 获取SD卡路径 |
| \`files.getExternalStorageDirectory()\` | 外部存储目录 |
| \`files.getPackageResourcePath(packageName)\` | 应用资源路径 |
| \`files.getExtensionFromMimeType(mimeType)\` | MIME转扩展名 |

---

## 十、HTTP 请求

| 函数 | 说明 |
|------|------|
| \`http.get(url[, options, callback])\` | GET请求 |
| \`http.post(url, data[, options, callback])\` | POST请求 |
| \`http.postJson(url, json[, options, callback])\` | POST JSON |
| \`http.postMultipart(url, files[, options, callback])\` | POST 文件 |
| \`http.request(url[, options, callback])\` | 通用请求 |

Options 配置：
- \`headers\` - 请求头对象
- \`method\` - 请求方法
- \`contentType\` - 内容类型
- \`body\` - 请求体
- \`timeout\` - 超时时间（毫秒）

Response 对象：
- \`response.statusCode\`
- \`response.statusMessage\`
- \`response.headers\`
- \`response.body\` / \`response.content\`
- \`response.request\`
- \`response.url\`

---

## 十一、图像处理 (Images)

| 函数 | 说明 |
|------|------|
| \`images.requestScreenCapture([landscape])\` | 申请截图权限 |
| \`images.captureScreen()\` | 截图 |
| \`images.save(image, path[, format, quality])\` | 保存图片 |
| \`images.read(path)\` | 读取图片 |
| \`images.load(url)\` | 从URL加载 |
| \`images.copy(image)\` | 复制图片 |
| \`images.clip(image, x, y, w, h)\` | 裁剪 |
| \`images.scale(image, sx, sy[, ox, oy])\` | 缩放 |
| \`images.resize(image, width, height[, interpolation])\` | 调整大小 |
| \`images.rotate(image, x, y, degree)\` | 旋转 |
| \`images.concat(img1, img2[, direction])\` | 拼接图片 |
| \`images.grayscale(image)\` | 转灰度 |
| \`images.threshold(image, threshold[, maxVal, type])\` | 二值化 |
| \`images.inRange(image, lowerBound, upperBound)\` | 范围过滤 |
| \`images.adaptiveThreshold(image, maxValue, adaptiveMethod, thresholdType, blockSize, C)\` | 自适应二值化 |
| \`images.blur(image, size[, point])\` | 模糊 |
| \`images.medianBlur(image, size)\` | 中值模糊 |
| \`images.gaussianBlur(image, size[, sigmaX, sigmaY])\` | 高斯模糊 |
| \`images.cvtColor(image, code[, dstCn])\` | 颜色空间转换 |
| \`images.findColor(image, color[, options])\` | 找色 |
| \`images.findColorEquals(image, color[, threshold])\` | 精确找色 |
| \`images.findMultiColors(image, firstColor, colors[, options])\` | 多点找色 |
| \`images.findImage(img, template[, options])\` | 找图 |
| \`images.findImageInRegion(img, template, x, y[, w, h, threshold])\` | 区域找图 |
| \`images.getSimilarity(img1, img2[, type])\` | 比较相似度 |
| \`images.fromBase64(base64)\` | Base64转图片 |
| \`images.toBase64(image[, format, quality])\` | 图片转Base64 |
| \`images.pixel(image, x, y)\` | 获取像素颜色 |
| \`images.getWidth(image) / images.getHeight(image)\` | 获取宽高 |
| \`images.getMat(image)\` | 获取Mat对象 |
| \`images.matToImage(mat)\` | Mat转Image |

图像匹配 Options：
- \`threshold\` - 匹配阈值（0-1）
- \`region\` - 搜索区域 \`[x, y, w, h]\`
- \`level\` - 找图等级（1-3）

---

## 十二、文字识别 OCR

| 函数 | 说明 |
|------|------|
| \`ocr.recognize(image[, options])\` | 识别图片文字 |
| \`ocr.recognizeText(image)\` | 只返回文字内容 |
| \`ocr.detect(image[, options])\` | 检测文字位置 |

OCR Options：
- \`region\` - 识别区域
- \`lang\` - 语言（如 'chi_sim', 'eng'）

OCR 结果对象：
- \`text\` - 识别文字
- \`confidence\` - 置信度
- \`bounds\` - 文字位置

---

## 十三、传感器 (Sensors)

| 函数 | 说明 |
|------|------|
| \`sensors.register(sensorType[, delay])\` | 注册传感器监听 |
| \`sensors.unregister(sensorType)\` | 取消注册 |
| \`sensors.unregisterAll()\` | 取消所有 |
| \`sensors.ignoresUnsupportedSensor\` | 是否忽略不支持的传感器 |

传感器类型：
- \`"accelerometer"\` - 加速度
- \`"gyroscope"\` - 陀螺仪
- \`"magnetic_field"\` - 磁场
- \`"orientation"\` - 方向
- \`"light"\` - 光线
- \`"pressure"\` - 压力
- \`"proximity"\` - 距离
- \`"temperature"\` - 温度
- \`"humidity"\` - 湿度

事件回调：
\`\`\`javascript
sensors.register("accelerometer").on("change", (event, ax, ay, az) => {
  log("加速度:", ax, ay, az);
});
\`\`\`

---

## 十四、Shell 命令

| 函数 | 说明 |
|------|------|
| \`shell(cmd[, root])\` | 执行shell命令 |
| \`shell.execFile(path[, args, root])\` | 执行文件 |
| \`shell.isRootAvailable()\` | 是否可用root |

Shell 结果对象：
- \`result.code\` - 返回码
- \`result.result\` - 输出字符串
- \`result.error\` - 错误信息

---

## 十五、存储 (Storages)

| 函数 | 说明 |
|------|------|
| \`storages.create(name)\` | 创建存储 |
| \`storages.remove(name)\` | 删除存储 |

存储对象方法：
- \`storage.put(key, value)\` - 存储数据
- \`storage.get(key[, defaultValue])\` - 获取数据
- \`storage.remove(key)\` - 删除键
- \`storage.clear()\` - 清空
- \`storage.contains(key)\` - 是否包含

---

## 十六、多线程 (Threads)

| 函数 | 说明 |
|------|------|
| \`threads.start(action)\` | 启动线程 |
| \`threads.shutDownAll()\` | 关闭所有线程 |
| \`threads.currentThread()\` | 获取当前线程 |
| \`threads.disposable()\` - | 创建Disposable |

线程对象方法：
- \`thread.join([timeout])\` - 等待线程结束
- \`thread.isAlive()\` - 是否存活
- \`thread.interrupt()\` - 中断线程

Disposable：
- \`disposable.setAndNotify(value)\` - 设置值并通知
- \`disposable.blockedGet()\` - 阻塞获取

---

## 十七、定时器 (Timers)

| 函数 | 说明 |
|------|------|
| \`setTimeout(callback, delay[, ...args])\` | 延迟执行 |
| \`setInterval(callback, delay[, ...args])\` | 定时执行 |
| \`setImmediate(callback[, ...args])\` | 立即执行 |
| \`clearTimeout(id)\` | 取消延迟 |
| \`clearInterval(id)\` | 取消定时 |
| \`clearImmediate(id)\` | 取消立即 |

---

## 十八、对话框 (Dialogs)

| 函数 | 说明 |
|------|------|
| \`dialogs.alert(title[, content, callback])\` | 提示框 |
| \`dialogs.confirm(title[, content, callback])\` | 确认框 |
| \`dialogs.prompt(title[, prefill, callback])\` | 输入框 |
| \`dialogs.select(title, items[, callback])\` | 单选列表 |
| \`dialogs.multiSelect(title, items[, callback])\` | 多选列表 |
| \`dialogs.rawInput(title[, prefill, callback])\` | 原始输入 |
| \`dialogs.input(title[, prefill, callback])\` | 输入（自动转数字） |

对话框构建器：
\`\`\`javascript
dialogs.build({
  title: "标题",
  content: "内容",
  positive: "确定",
  negative: "取消",
  neutral: "忽略",
  checkBoxPrompt: "不再询问",
  items: ["选项1", "选项2"],
  itemsSelectMode: "single", // single/multi
  positiveColor: "#000000",
  canceledOnTouchOutside: false
}).on("positive", (dialog) => {
  dialog.dismiss();
}).show();
\`\`\`

---

## 十九、UI 界面

| 函数/属性 | 说明 |
|-----------|------|
| \`ui.layout(xml)\` | 设置布局 |
| \`ui.statusBarColor(color)\` | 状态栏颜色 |
| \`ui.statusBarHeight\` | 状态栏高度 |
| \`ui.title\` | 设置标题 |
| \`ui.activity\` | 获取当前Activity |
| \`ui.findView(id)\` | 查找视图 |
| \`ui.finish()\` | 关闭界面 |
| \`ui.run(callback)\` | 在主线程运行 |
| \`ui.post(callback[, delay])\` | 延迟执行 |
| \`ui.isUiThread()\` | 是否在UI线程 |
| \`ui.emit(eventName[, ...args])\` | 发送事件 |
| \`ui.toast(message)\` | 显示提示 |

常用 UI 控件 XML：
\`\`\`xml
<vertical>
  <text text="文本" textSize="16sp" textColor="#000000"/>
  <button id="btn" text="按钮"/>
  <input id="input" hint="提示文字"/>
  <checkbox id="cb" text="复选框"/>
  <radio id="rb" text="单选"/>
  <spinner id="spinner" entries="选项1|选项2|选项3"/>
  <picker id="picker"/>
  <datetimepicker id="dtp"/>
  <seekbar id="seek" max="100"/>
  <progress id="progress"/>
  <list id="list"/>
  <webview id="web"/>
  <img id="img" src="file:///sdcard/1.png"/>
  <card w="*" h="70" margin="10" cardCornerRadius="5">
    <vertical>
      <text text="卡片布局"/>
    </vertical>
  </card>
</vertical>
<horizontal>
  <button text="左"/>
  <button text="右" w="*"/>
</horizontal>
<frame>
  <button text="层叠布局"/>
</frame>
</scroll>
  <vertical>
    <text text="可滚动内容"/>
  </vertical>
</scroll>
\`\`\`

---

## 二十、事件 (Events)

| 函数 | 说明 |
|------|------|
| \`events.observeKey()\` | 监听按键 |
| \`events.observeTouch()\` | 监听触摸 |
| \`events.observeNotification()\` | 监听通知 |
| \`events.observeToast()\` | 监听Toast |
| \`events.on(event, listener)\` | 注册事件 |
| \`events.once(event, listener)\` | 只监听一次 |
| \`events.off(event[, listener])\` | 取消监听 |
| \`events.emit(event[, ...args])\` | 触发事件 |
| \`events.setMaxListeners(n)\` | 最大监听器数 |
| \`events.removeAllListeners([event])\` | 移除所有监听 |

按键事件：
- \`"key"\` - 按键事件，回调参数 (keyCode, event)
- \`"key_down"\` - 按下
- \`"key_up"\` - 松开
- \`"volume_up"\` - 音量上
- \`"volume_down"\` - 音量下
- \`"home"\` - Home键
- \`"back"\` - Back键
- \`"menu"\` - 菜单键

通知事件：
\`\`\`javascript
events.observeNotification();
events.on("notification", (n) => {
  log("通知:", n.getPackageName(), n.getText());
  // n.delete(); // 删除通知
});
\`\`\`

---

## 二十一、引擎 (Engines)

| 函数 | 说明 |
|------|------|
| \`engines.execScript(name, script[, config])\` | 执行脚本 |
| \`engines.execScriptFile(path[, config])\` | 执行脚本文件 |
| \`engines.execAutoScript(path[, config])\` | 执行自动化脚本 |
| \`engines.stopAll()\` | 停止所有脚本 |
| \`engines.stopAllAndToast()\` | 停止并提示 |
| \`engines.myEngine()\` | 获取当前引擎 |

引擎对象方法：
- \`engine.forceStop()\` - 强制停止
- \`engine.cwd()\` - 工作目录

---

## 二十二、Canvas 画布

| 函数 | 说明 |
|------|------|
| \`canvas.drawColor(color)\` | 绘制背景色 |
| \`canvas.drawLine(x1, y1, x2, y2, paint)\` | 画线 |
| \`canvas.drawRect(left, top, right, bottom, paint)\` | 画矩形 |
| \`canvas.drawCircle(cx, cy, radius, paint)\` | 画圆 |
| \`canvas.drawText(text, x, y, paint)\` | 画文字 |
| \`canvas.drawBitmap(bitmap, left, top, paint)\` | 画图片 |
| \`canvas.drawPoint(x, y, paint)\` | 画点 |
| \`canvas.drawPoints(points, paint)\` | 画多点 |
| \`canvas.drawOval(left, top, right, bottom, paint)\` | 画椭圆 |
| \`canvas.drawArc(left, top, right, bottom, startAngle, sweepAngle, useCenter, paint)\` | 画弧 |
| \`canvas.drawPath(path, paint)\` | 画路径 |
| \`canvas.clipRect(left, top, right, bottom)\` | 裁剪区域 |
| \`canvas.concat(matrix)\` | 矩阵变换 |
| \`canvas.save()\` | 保存状态 |
| \`canvas.restore()\` | 恢复状态 |
| \`canvas.getWidth() / canvas.getHeight()\` | 获取宽高 |

Paint 画笔属性：
- \`paint.setColor(color)\`
- \`paint.setStrokeWidth(width)\`
- \`paint.setTextSize(size)\`
- \`paint.setStyle(style)\` - FILL / STROKE / FILL_AND_STROKE
- \`paint.setAntiAlias(aa)\`

---

## 二十三、加密解密

### AES
| 函数 | 说明 |
|------|------|
| \`aes.encrypt(data, key[, options])\` | AES加密 |
| \`aes.decrypt(data, key[, options])\` | AES解密 |

Options：
- \`mode\` - ECB / CBC / CFB / OFB / CTR
- \`padding\` - PKCS5Padding / PKCS7Padding / NoPadding
- \`iv\` - 初始向量

### Base64
| 函数 | 说明 |
|------|------|
| \`base64.encode(str[, encoding])\` | Base64编码 |
| \`base64.decode(str[, encoding])\` | Base64解码 |

### Hash
| 函数 | 说明 |
|------|------|
| \`hasher.md5(str)\` | MD5哈希 |
| \`hasher.sha1(str)\` | SHA1哈希 |
| \`hasher.sha256(str)\` | SHA256哈希 |
| \`hasher.hmac(data, key, algorithm)\` | HMAC |

---

## 二十四、媒体 (Media)

| 函数 | 说明 |
|------|------|
| \`media.scanFile(path)\` | 扫描文件 |
| \`media.playMusic(path[, volume, looping])\` | 播放音乐 |
| \`media.stopMusic()\` | 停止播放 |
| \`media.pauseMusic()\` | 暂停 |
| \`media.resumeMusic()\` | 恢复 |
| \`media.isMusicPlaying()\` | 是否播放中 |
| \`media.getMusicDuration()\` | 总时长 |
| \`media.getMusicCurrentPosition()\` | 当前位置 |
| \`media.seekTo(msec)\` | 跳转位置 |
| \`media.setMusicVolume(volume)\` | 设置音量 |

---

## 二十五、工具函数 (Util)

| 函数 | 说明 |
|------|------|
| \`util.format(format[, ...args])\` | 格式化字符串 |
| \`util.formatTime(ms[, format])\` | 格式化时间 |
| \`util.parseTime(str[, format])\` | 解析时间 |
| \`util.comparator(fn)\` | 创建比较器 |

---

## 二十六、模块化 (Modules)

| 函数 | 说明 |
|------|------|
| \`require(path)\` | 导入模块 |
| \`module.exports\` | 导出对象 |
| \`exports.name\` | 导出属性 |

模块示例：
\`\`\`javascript
// utils.js
module.exports = {
  add: (a, b) => a + b,
  log: (msg) => console.log(msg)
};

// main.js
const utils = require('./utils.js');
utils.log(utils.add(1, 2));
\`\`\`

---

## 二十七、全局函数

| 函数 | 说明 |
|------|------|
| \`toast(message)\` | 显示Toast提示 |
| \`toastLog(message)\` | Toast并日志 |
| \`sleep(n)\` | 休眠n毫秒 |
| \`isStopped()\` | 脚本是否被要求停止 |
| \`isShuttingDown()\` | 是否正在关闭 |
| \`exit()\` | 退出脚本 |
| \`random(min, max)\` | 随机整数 [min, max] |
| \`random()\` | 随机浮点数 [0, 1) |
| \`setClip(text)\` | 设置剪贴板 |
| \`getClip()\` | 获取剪贴板内容 |
| \`log([label,] message)\` | 输出日志 |
| \`print(message)\` | 打印 |
| \`console.log(...)\` | 控制台日志 |

---

## 二十八、Hamibot 特有

| 函数 | 说明 |
|------|------|
| \`hamibot.env\` | 获取环境变量 |
| \`hamibot.exec(options)\` | 执行操作 |
| \`hamibot.postMessage(data)\` | 发送消息 |
| \`hamibot.setTimeout(fn, delay)\` | 延迟执行 |
| \`hamibot.clearTimeout(id)\` | 清除延迟 |
| \`hamibot.version\` | Hamibot版本 |
| \`hamibot.deviceId\` | 设备ID |
| \`hamibot.deviceName\` | 设备名称 |
| \`hamibot.cloudId\` | 云端ID |

---

## 最佳实践

### 1. 脚本框架模板
\`\`\`javascript
"ui";
// 或 auto.waitFor();

// 配置
const CONFIG = {
  timeout: 10000,
  interval: 1000,
  maxRetry: 3
};

// 主函数
function main() {
  console.show();
  log("脚本启动");
  
  try {
    // 初始化
    ensureAtTargetPage();
    
    // 主循环
    while (!isStopped()) {
      if (doTask()) {
        sleep(random(2000, 3000));
      } else {
        break;
      }
    }
  } catch (e) {
    log("错误:", e);
  }
  
  log("脚本结束");
}

function ensureAtTargetPage() {
  // 确保在目标页面
}

function doTask() {
  // 执行任务
  return true;
}

main();
\`\`\`

### 2. 防检测技巧
- 使用随机延迟：\`sleep(random(4000, 7000))\`
- 使用相对坐标：\`device.width * 0.92\`
- 避免过于规律的操作间隔
- 适当添加无用的滑动/点击

### 3. 异常处理
\`\`\`javascript
try {
  let btn = text("确定").findOne(3000);
  if (btn) btn.click();
} catch (e) {
  log("操作失败:", e.message);
  // 备用方案
  click(device.width / 2, device.height / 2);
}
\`\`\`

### 4. 找色/找图技巧
\`\`\`javascript
// 申请截图权限
if (!requestScreenCapture()) {
  toast("请求截图失败");
  exit();
}

// 截图
let img = captureScreen();

// 找色
let point = findColor(img, "#FF0000", {
  threshold: 4
});
if (point) {
  click(point.x, point.y);
}

// 找图
let template = images.read("/sdcard/button.png");
let result = findImage(img, template, {
  threshold: 0.9,
  region: [0, 0, device.width, 300]
});
if (result) {
  click(result.x, result.y);
}
\`\`\`

---

## 注意事项

1. **无障碍服务**：所有控件操作需要开启无障碍服务
2. **截图权限**：Android 5.0+ 需要申请截图权限
3. **Root权限**：部分功能（如shell、精确点击）需要root
4. **线程安全**：UI操作在主线程，耗时操作在子线程
5. **游戏支持**：游戏界面需使用触摸操作，非控件操作
6. **兼容性**：不同机型可能有差异，测试时注意适配
`,
});
