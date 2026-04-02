/**
 * 汽水音乐福利任务 - 完整版
 * 流程：主界面 → 打开汽水音乐 → 等待6秒 → 点击福利 → 看广告赚金币
 */

auto.waitFor();
console.show();

const TAG = "[福利任务]";

// ==================== 主函数 ====================
function main() {
    log(TAG, "=== 开始福利任务 ===");

    // 1. 切到主界面
    goToHome();

    // 2. 打开汽水音乐
    openQishuiMusic();

    // 3. 进入福利中心
    enterWelfareCenter();

    // 4. 执行看广告任务
    doWatchAdTask();

    log(TAG, "=== 任务完成 ===");
}

// ==================== 步骤1：切到主界面 ====================
function goToHome() {
    log(TAG, "【步骤1】切到主界面");
    home();
    sleep(1000);
    log(TAG, "✅ 已回主界面");
}

// ==================== 步骤2：打开汽水音乐 ====================
function openQishuiMusic() {
    log(TAG, "【步骤2】打开汽水音乐");

    // 找图标点击
    let icon = text("汽水音乐").findOnce();
    if (icon) {
        icon.click();
        log(TAG, "点击图标");
    } else {
        click(device.width / 2, device.height * 0.35);
        log(TAG, "坐标点击");
    }

    // 等待6秒开屏广告
    log(TAG, "等待6秒...");
    for (let i = 1; i <= 6; i++) {
        sleep(1000);
        log(TAG, "已等待 " + i + " 秒");
    }

    log(TAG, "✅ 汽水音乐已打开");
}

// ==================== 步骤3：进入福利中心 ====================
function enterWelfareCenter() {
    log(TAG, "【步骤3】进入福利中心");

    // Gemini 提供的精确坐标
    click(755, 2280);
    log(TAG, "点击福利 (755, 2280)");

    sleep(2000);
    log(TAG, "✅ 已进入福利中心");
}

// ==================== 步骤4：看广告任务 ====================
function doWatchAdTask() {
    log(TAG, "【步骤4】看广告赚金币");

    // 点击"去完成"
    log(TAG, "点击'去完成' (920, 1190)");
    click(920, 1190);
    sleep(2000);

    // 观看35秒
    log(TAG, "观看广告35秒...");
    for (let i = 0; i < 35; i++) {
        sleep(1000);
        if (i % 5 === 0) {
            log(TAG, "已观看 " + i + " 秒");
        }
    }

    // 关闭广告
    log(TAG, "关闭广告 (1000, 165)");
    click(1000, 165);
    sleep(2000);

    // 处理"再看一个"弹框
    if (textContains("再看一个").exists()) {
        log(TAG, "发现连续广告，点击领取奖励 (540, 1260)");
        click(540, 1260);
        sleep(2000);

        // 再看35秒
        log(TAG, "第二个广告35秒...");
        for (let i = 0; i < 35; i++) {
            sleep(1000);
            if (i % 5 === 0) {
                log(TAG, "第二个广告 " + i + " 秒");
            }
        }

        // 关闭
        click(1000, 165);
        sleep(2000);
    }

    log(TAG, "✅ 看广告任务完成！");
}

// 启动
main();
