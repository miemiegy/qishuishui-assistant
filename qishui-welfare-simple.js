/**
 * 汽水音乐福利任务 - 简化版
 * 流程：主界面 → 打开汽水音乐 → 等待6秒 → 点击福利
 */

auto.waitFor();
console.show();

// 第1步：切到主界面
log("第1步：切到主界面");
home();
sleep(1000);

// 第2步：打开汽水音乐
log("第2步：打开汽水音乐");
let icon = text("汽水音乐").findOnce();
if (icon) {
    icon.click();
    log("点击汽水音乐图标");
} else {
    click(device.width / 2, device.height * 0.35);
    log("尝试坐标点击");
}

// 等待6秒，每秒打印日志
log("等待6秒开屏广告...");
for (let i = 1; i <= 6; i++) {
    sleep(1000);
    log("已等待 " + i + " 秒");
}
log("开屏广告结束");

// 第3步：点击福利按钮（Gemini精确坐标）
log("第3步：点击福利按钮 (755, 2280)");
click(755, 2280);
sleep(2000);

log("完成！进入福利中心");
