/**
 * 汽水音乐福利任务测试脚本
 * 测试广告退出功能
 */

auto.waitFor();
console.show();

const TAG = "[测试]";

function main() {
    log(TAG, "=== 福利任务测试 ===");
    
    // 进入APP
    ensureInApp();
    
    // 进入福利中心
    enterWelfareCenter();
    
    // 测试看广告任务
    doWatchAdTask();
    
    log(TAG, "=== 测试完成 ===");
}

/**
 * 确保在汽水音乐APP
 */
function ensureInApp() {
    log(TAG, "切换到汽水音乐...");
    if (currentPackage() !== "com.luna.music") {
        launchApp("汽水音乐");
        log(TAG, "等待6秒开屏广告...");
        sleep(6000);
    }
    log(TAG, "已在汽水音乐");
}

/**
 * 进入福利中心
 */
function enterWelfareCenter() {
    log(TAG, "进入福利中心...");
    let welfare = text("福利").findOnce();
    if (welfare) {
        welfare.click();
    } else {
        click(device.width * 0.6, device.height * 0.95);
    }
    sleep(2000);
    log(TAG, "已进入福利中心");
}

/**
 * 看广告任务（完整流程）
 */
function doWatchAdTask() {
    log(TAG, "\n=== 开始看广告任务 ===");
    
    // 1. 点击"去完成"
    log(TAG, "点击'去完成'按钮...");
    click(920, 1190);
    sleep(2000);
    
    // 2. 观看35秒
    log(TAG, "观看广告35秒...");
    for (let i = 0; i < 35; i++) {
        sleep(1000);
        if (i % 5 === 0) {
            log(TAG, "已观看 " + i + " 秒...");
        }
    }
    log(TAG, "35秒观看完成");
    
    // 3. 关闭第一个广告（尝试多种方式）
    log(TAG, "\n=== 关闭第一个广告 ===");
    closeAd();
    
    sleep(2000);
    
    // 4. 处理"再看一个"弹框
    log(TAG, "\n=== 处理奖励弹框 ===");
    if (textContains("再看一个").exists() || textContains("1900").exists()) {
        log(TAG, "检测到连续广告弹框");
        
        // 点击"领取奖励"
        click(540, 1260);
        log(TAG, "点击'领取奖励'，继续看第二个广告...");
        
        sleep(2000);
        
        // 5. 观看第二个35秒
        log(TAG, "观看第二个广告35秒...");
        for (let i = 0; i < 35; i++) {
            sleep(1000);
            if (i % 5 === 0) {
                log(TAG, "第二个广告已观看 " + i + " 秒...");
            }
        }
        
        // 6. 关闭第二个广告
        log(TAG, "\n=== 关闭第二个广告 ===");
        closeAd();
    }
    
    log(TAG, "✅ 看广告任务完成！");
}

/**
 * 关闭广告（多种方式尝试）
 */
function closeAd() {
    log(TAG, "尝试关闭广告...");
    
    // 方式1：Gemini给的"继续观看"坐标
    log(TAG, "尝试点击继续观看 (1000, 165)...");
    click(1000, 165);
    sleep(1000);
    
    // 检查是否还在广告页面
    if (isInAdPage()) {
        log(TAG, "还在广告页面，尝试其他方式...");
        
        // 方式2：找"关闭"文字按钮
        let closeBtn = text("关闭").findOnce() || desc("关闭").findOnce();
        if (closeBtn) {
            log(TAG, "找到'关闭'按钮，点击...");
            closeBtn.click();
            sleep(1000);
        }
    }
    
    // 方式3：找"坚持退出"
    if (text("坚持退出").exists()) {
        log(TAG, "找到'坚持退出'按钮...");
        let exitBtn = text("坚持退出").findOnce();
        if (exitBtn) {
            exitBtn.click();
            log(TAG, "点击坚持退出");
            sleep(1000);
        }
    }
    
    // 方式4：点击右上角固定位置（备选）
    if (isInAdPage()) {
        log(TAG, "尝试点击右上角...");
        click(device.width * 0.92, device.height * 0.06);
        sleep(1000);
    }
    
    // 方式5：按返回键
    if (isInAdPage()) {
        log(TAG, "尝试返回键...");
        back();
        sleep(1000);
    }
    
    // 检查结果
    if (isInAdPage()) {
        log(TAG, "⚠️ 可能还在广告页面，请手动处理或截图");
    } else {
        log(TAG, "✅ 已退出广告页面");
    }
}

/**
 * 判断是否还在广告页面
 */
function isInAdPage() {
    // 如果有这些元素，说明还在广告页
    let adIndicators = ["广告", "关闭", "继续观看", "跳过"];
    for (let text of adIndicators) {
        if (textContains(text).exists() || desc(text).exists()) {
            return true;
        }
    }
    // 检查当前包名
    return currentPackage() !== "com.luna.music";
}

// 启动
main();
