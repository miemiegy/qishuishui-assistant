/**
 * 汽水音乐福利中心自动化脚本 - 完整版
 * 功能：自动完成看广告赚金币任务
 */

auto.waitFor();
console.show();

const TAG = "[福利任务]";

// ==================== 主函数 ====================
function main() {
    log(TAG, "=== 开始执行福利任务 ===");

    // 1. 进入汽水音乐
    enterQishuiMusic();

    // 2. 进入福利中心
    enterWelfareCenter();

    // 3. 执行看广告任务
    doWatchAdTask();

    log(TAG, "=== 任务执行完毕 ===");
}

// ==================== 步骤1：进入汽水音乐 ====================
function enterQishuiMusic() {
    log(TAG, "【步骤1】进入汽水音乐...");

    // 如果不在汽水音乐，启动它
    if (currentPackage() !== "com.luna.music") {
        log(TAG, "启动汽水音乐...");
        launchApp("汽水音乐");
        sleep(6000); // 等待开屏广告
    }

    // 回到主界面（确保能看到底部导航栏）
    log(TAG, "回到主界面...");
    for (let i = 0; i < 3; i++) {
        back();
        sleep(300);
    }
    sleep(1000);

    log(TAG, "✅ 已进入汽水音乐主界面");
}

// ==================== 步骤2：进入福利中心 ====================
function enterWelfareCenter() {
    log(TAG, "【步骤2】进入福利中心...");

    // 找底部导航栏的"福利"按钮
    let welfareBtn = text("福利").findOnce();

    if (welfareBtn && welfareBtn.clickable()) {
        welfareBtn.click();
        log(TAG, "点击'福利'按钮");
    } else {
        // 如果没找到，点击底部第4个位置（福利通常在第4个）
        log(TAG, "用坐标点击福利位置");
        click(device.width * 0.6, device.height * 0.95);
    }

    sleep(2000);
    log(TAG, "✅ 已进入福利中心");
}

// ==================== 步骤3：看广告任务 ====================
function doWatchAdTask() {
    log(TAG, "【步骤3】开始看广告任务...");

    // 点击"去完成"按钮（看广告任务）
    log(TAG, "点击'去完成'...");
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
    log(TAG, "关闭广告...");
    click(1000, 165); // "继续观看"按钮位置
    sleep(2000);

    // 处理"再看一个"弹框
    if (textContains("再看一个").exists() || textContains("1900").exists()) {
        log(TAG, "发现连续广告，点击'领取奖励'...");
        click(540, 1260);
        sleep(2000);

        // 再看35秒
        log(TAG, "观看第二个广告35秒...");
        for (let i = 0; i < 35; i++) {
            sleep(1000);
            if (i % 5 === 0) {
                log(TAG, "第二个广告已观看 " + i + " 秒");
            }
        }

        // 关闭第二个广告
        click(1000, 165);
        sleep(2000);
    }

    log(TAG, "✅ 看广告任务完成！");
}

// 启动
main();
