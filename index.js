// =====================================================================
// 汽水音乐任务自动化脚本 (包名安全锁 + 接口化触点闭环版)
// 适配版本: 汽水音乐 21.7.0 / 华为 Mate40 主力机
// =====================================================================

// =====================================================================
// 1. 初始化
// =====================================================================
auto.waitFor();
console.show();
log("🚀 [系统启动] Hamibot 汽水音乐自动化任务脚本启动");

var APP_PACKAGE = "com.luna.music";

// =====================================================================
// 2. 底层通用触点驱动接口 (TouchCore)
// =====================================================================
var TouchCore = {
    /**
     * 坐标点击触点（带包名安全校验）
     */
    tap: function (name, x, y) {
        if (currentPackage() !== APP_PACKAGE) {
            log("🛑 [安全拦截] 当前不在汽水音乐前台 (当前: " + currentPackage() + ")，拒绝点击「" + name + "」");
            return false;
        }
        log("👉 [触点:TAP] 点击「" + name + "」 目标: (" + Math.round(x) + ", " + Math.round(y) + ")");
        var success = click(x, y);
        sleep(500);
        return success;
    },

    /**
     * 控件点击触点
     */
    clickWidget: function (name, widget) {
        if (!widget) {
            log("⚠ [触点:WIDGET] 控件「" + name + "」未找到，跳过点击");
            return false;
        }
        if (currentPackage() !== APP_PACKAGE) {
            log("🛑 [安全拦截] 当前不在汽水音乐前台，拒绝点击控件「" + name + "」");
            return false;
        }
        var b = widget.bounds();
        log("👉 [触点:WIDGET] 点击控件「" + name + "」 区域: [" + b.left + "," + b.top + "][" + b.right + "," + b.bottom + "]");

        var curr = widget;
        for (var i = 0; curr && i < 5; i++) {
            if (curr.clickable && curr.clickable()) {
                return curr.click();
            }
            curr = curr.parent();
        }
        return click(b.centerX(), b.centerY());
    },

    /**
     * 系统返回键触点
     */
    back: function (reason) {
        log("🔙 [触点:BACK] 触发系统返回键 back()，原因: " + reason);
        var success = back();
        sleep(1000);
        return success;
    },

    /**
     * 系统桌面键触点
     */
    home: function (reason) {
        log("🏠 [触点:HOME] 触发返回桌面 home()，原因: " + reason);
        var success = home();
        sleep(1000);
        return success;
    },

    /**
     * 流程等待
     */
    sleepWithLog: function (reason, ms) {
        log("⏳ [等待] " + reason + "，等待 " + (ms / 1000).toFixed(1) + " 秒...");
        sleep(ms);
    }
};

// =====================================================================
// 3. 业务触点接口层 (Touchpoints)
// =====================================================================
var Touchpoints = {
    // 导航触点
    Nav: {
        launchByPackage: function () {
            log("📱 [触点触发:导航] 通过官方绝对包名启动应用: " + APP_PACKAGE);
            app.launchPackage(APP_PACKAGE);
        },
        skipSplashAdWidget: function (btn) {
            log("🎯 [触点触发:开屏] 识别到「跳过」控件，触发跳过触点");
            return TouchCore.clickWidget("开屏跳过按钮", btn);
        },
        skipSplashAdByTopRight: function () {
            log("🎯 [触点触发:开屏] 盲点右上角跳过区域");
            return TouchCore.tap("开屏右上角跳过", device.width * 0.88, 140);
        },
        clickWelfareTab: function (tabWidget) {
            log("🎯 [触点触发:导航] 命中底部导航栏「福利」Tab");
            return TouchCore.clickWidget("底部福利Tab", tabWidget);
        }
    },

    // 状态确认触点 (闭环校验)
    Verify: {
        confirmAtWelfareCenter: function () {
            if (currentPackage() !== APP_PACKAGE) return false;
            var hasTitle = text("福利中心").exists();
            var hasButton = textContains("领时长").exists() || descContains("领时长").exists();
            var hasAnchor = descContains("今日畅听").exists();

            if (hasTitle || hasButton || hasAnchor) {
                var feature = hasTitle ? "「福利中心」顶部标题" : (hasButton ? "「领时长」按钮" : "「今日畅听」锚点");
                log("🎯 [触点确认:成功] ✔ 100% 确认已安全稳定进入「福利中心」 (命中特征: " + feature + ")");
                return true;
            }
            return false;
        },
        confirmTargetAchieved: function () {
            return textContains("恭喜获得第30日畅听").findOnce() || descContains("恭喜获得第30日畅听").findOnce();
        }
    },

    // 弹窗处理触点
    Popup: {
        dismissFreeListenDrawer: function () {
            log("🎯 [触点触发:弹窗] 触发关闭「看视频全天免费听」半屏抽屉");
            return TouchCore.tap("抽屉右上角关闭✕", device.width * 0.93, 1450);
        },
        dismissVipCard: function () {
            log("🎯 [触点触发:弹窗] 触发关闭「开通VIP」居中卡片弹窗");
            return TouchCore.tap("VIP卡片右上角关闭✕", 830, 815);
        },
        dismissWelfareDialog: function () {
            log("🎯 [触点触发:弹窗] 触发关闭「福利页活动/签到」居中弹窗");
            return TouchCore.tap("福利弹窗正下方关闭✕", device.width * 0.5, device.height * 0.72);
        }
    },

    // 任务入口触点
    Task: {
        clickClaimDurationWidget: function (widget) {
            log("🎯 [触点触发:任务] 通过文本/描述控件触发「领时长」");
            return TouchCore.clickWidget("领时长按钮", widget);
        },
        clickClaimDurationAnchor: function (anchorY) {
            var targetX = device.width * 0.85;
            log("🎯 [触点触发:任务] 通过「今日畅听」锚点触发「领时长」 目标X: " + Math.round(targetX) + ", Y: " + Math.round(anchorY));
            return TouchCore.tap("领时长(今日畅听锚点)", targetX, anchorY);
        },
        clickClaimDurationFallback: function () {
            log("🎯 [触点触发:任务] 使用卡片右侧固定坐标兜底触发「领时长」");
            return TouchCore.tap("领时长(卡片坐标兜底)", 920, 885);
        }
    },

    // 广告处理触点
    Ad: {
        exitLiveRoom: function () {
            log("🎯 [触点触发:广告] 检测到误入直播间，执行退出触点");
            return TouchCore.tap("直播间右上角退出", device.width * 0.92, device.height * 0.065);
        },
        closeByFeedback: function (feedbackBtn) {
            var targetX = device.width - 80;
            var targetY = feedbackBtn.bounds().centerY();
            log("🎯 [触点触发:广告] 通过「反馈」控件定位关闭广告，坐标: (" + targetX + ", " + targetY + ")");
            return TouchCore.tap("广告反馈右侧关闭", targetX, targetY);
        },
        closeByTopRight: function () {
            log("🎯 [触点触发:广告] 盲点右上角关闭广告");
            return TouchCore.tap("右上角关闭广告", device.width * 0.92, device.height * 0.065);
        },
        clickContinuousRewardArea: function () {
            log("🎯 [触点触发:广告] 连播奖励页盲点领取区域");
            return TouchCore.tap("广告奖励居中领取区域", device.width * 0.5, device.height * 0.55);
        },
        clickExitConfirm: function (exitBtn) {
            log("🎯 [触点触发:广告] 点击「坚持退出」按钮");
            return TouchCore.clickWidget("坚持退出按钮", exitBtn);
        }
    }
};

// =====================================================================
// 4. 包名前置安全锁
// =====================================================================
function ensureAppInForeground() {
    if (currentPackage() !== APP_PACKAGE) {
        log("🔒 [包名安全锁] 当前前台应用非汽水音乐 (当前: " + currentPackage() + ")，正在通过绝对包名拉起...");
        Touchpoints.Nav.launchByPackage();

        var start = new Date().getTime();
        while (new Date().getTime() - start < 6000) {
            if (currentPackage() === APP_PACKAGE) {
                log("✔ [包名安全锁] 汽水音乐已成功位于前台！");
                return true;
            }
            sleep(500);
        }
        log("❌ [包名安全锁] 启动超时，当前应用仍为: " + currentPackage());
        return false;
    }
    return true;
}

// =====================================================================
// 5. 独立弹窗排查逻辑（专弹专治）
// =====================================================================

function dismissFreeListenBottomPopup() {
    if (currentPackage() !== APP_PACKAGE) return false;
    var hasTitle = textContains("看视频全天免费听").exists() || descContains("看视频全天免费听").exists() || textContains("去看视频").exists();

    if (hasTitle) {
        log("🔍 [弹窗检测] 发现【看视频全天免费听】半屏抽屉弹窗");
        Touchpoints.Popup.dismissFreeListenDrawer();
        sleep(1000);

        if (textContains("看视频全天免费听").exists()) {
            TouchCore.back("半屏抽屉未关闭，返回键兜底");
        }
        return true;
    }
    return false;
}

function dismissVipPopup() {
    if (currentPackage() !== APP_PACKAGE) return false;
    var hasVip = textContains("开通VIP").exists() || descContains("VIP7天体验卡").exists() || descContains("立即开通").exists();

    if (hasVip) {
        log("🔍 [弹窗检测] 发现【开通VIP】居中营销卡片弹窗");
        Touchpoints.Popup.dismissVipCard();
        sleep(1000);

        if (textContains("开通VIP").exists()) {
            TouchCore.back("VIP弹窗未关闭，返回键兜底");
        }
        return true;
    }
    return false;
}

/**
 * 弹窗 3：福利页签到/活动弹窗（正下方挂「✕」图标）
 * ---------------------------------------------------------------------
 * [待完善备注]：
 * 用户反馈进入「福利」中心时偶现此弹窗，特征为弹窗卡片居中，关闭按钮「✕」悬挂在弹框正下方。
 * 注意：必须确认已在福利中心（即存在「福利中心」顶部标题）但核心入口被遮挡时才判定！
 * 【TODO: 下次实际遇到此弹窗时，保留屏幕截图或 dump 控件树，再精准补充属性/坐标！】
 * ---------------------------------------------------------------------
 */
function dismissWelfarePopup() {
    if (currentPackage() !== APP_PACKAGE) return false;
    var atWelfareCenter = text("福利中心").exists();
    var canSeeEntry = desc("今日畅听").exists() || text("领时长").exists() || desc("领时长").exists();

    if (atWelfareCenter && !canSeeEntry) {
        log("🔍 [弹窗检测] 位于福利中心但核心入口不可见，检测到活动/签到弹窗遮挡");

        var closeBtn = text("关闭").findOnce() || desc("关闭").findOnce() || text("✕").findOnce();
        if (closeBtn) {
            log("🔍 [弹窗检测] 发现明确的「关闭」控件，触发点击");
            TouchCore.clickWidget("弹窗关闭控件", closeBtn);
            sleep(1200);
            return true;
        }

        log("🔍 [弹窗检测] 未识别到关闭控件，触发正下方挂载「✕」点击触点");
        Touchpoints.Popup.dismissWelfareDialog();
        sleep(1000);

        if (!Touchpoints.Verify.confirmAtWelfareCenter()) {
            TouchCore.back("福利浮层仍未退出，返回键兜底");
        }
        return true;
    }
    return false;
}

function handleKnownPopups() {
    if (dismissFreeListenBottomPopup()) return true;
    if (dismissVipPopup()) return true;
    if (dismissWelfarePopup()) return true;
    return false;
}

// =====================================================================
// 6. 冷启动与开屏广告处理 (等足10秒，优先点右上角跳过)
// =====================================================================
function launchAndSkipSplash() {
    Touchpoints.Nav.launchByPackage();

    log("⏳ [开屏检测] 开始检测 5 秒开屏广告 (设立 10 秒超时窗口，优先跳过)...");
    var startTime = new Date().getTime();
    var maxWaitMs = 10000;

    while (new Date().getTime() - startTime < maxWaitMs) {
        // 1. 查找跳过控件
        var skipBtn = textContains("跳过").findOnce() || descContains("跳过").findOnce();
        if (skipBtn) {
            Touchpoints.Nav.skipSplashAdWidget(skipBtn);
            TouchCore.sleepWithLog("跳过后等待主界面呈现", 1500);
            break;
        }

        // 2. 启动后 1.5~2.5 秒尝试右上角盲点跳过
        var elapsed = new Date().getTime() - startTime;
        if (elapsed >= 1500 && elapsed <= 2500) {
            Touchpoints.Nav.skipSplashAdByTopRight();
        }

        // 3. 底部导航栏已加载，说明开屏广告结束
        if (text("发现").exists() && (text("我的").exists() || text("福利").exists())) {
            log("✔ [开屏检测] 主界面导航已加载完毕，开屏广告已结束！");
            break;
        }

        sleep(600);
    }

    TouchCore.sleepWithLog("开屏阶段结束，缓冲检查启动弹窗", 1500);
    handleKnownPopups();
}

// =====================================================================
// 7. 页面状态与导航模块（确保稳定处于「福利」中心）
// =====================================================================
function ensureAtWelfarePage() {
    // 1. 先确保汽水音乐处于前台
    if (!ensureAppInForeground()) {
        return false;
    }

    // 2. 检查是否已经在福利中心
    if (Touchpoints.Verify.confirmAtWelfareCenter()) {
        dismissWelfarePopup();
        return true;
    }

    log("🔄 [状态校准] 当前未处于福利中心，开始执行导航流程");

    // 3. 清理全屏弹窗干扰
    handleKnownPopups();

    // 4. 定位并点击底部「福利」Tab
    log("🔍 [导航流程] 寻找底部导航栏的「福利」Tab...");
    var welfareTab = text("福利").findOne(4000) || id("com.luna.music:id/navigation_tab_commerce_coin").findOne(4000);

    if (welfareTab) {
        Touchpoints.Nav.clickWelfareTab(welfareTab);
        TouchCore.sleepWithLog("进入福利页后等待渲染", 3000);

        dismissWelfarePopup();

        // 5. 校验确认触点
        return Touchpoints.Verify.confirmAtWelfareCenter();
    }

    log("⚠ [状态校准] 未找到底部「福利」Tab，按返回键尝试恢复状态");
    TouchCore.back("寻找福利Tab失败恢复");
    return false;
}

// =====================================================================
// 8. 「领时长」任务入口识别与触点调用
// =====================================================================
function clickClaimDurationButton() {
    if (!ensureAppInForeground()) return false;
    log("🔍 [入口查找] 正在定位「领时长」按钮触点...");

    // 1. 优先通过文本/描述匹配
    var textBtn = textContains("领时长").findOne(1500) || descContains("领时长").findOne(1500);
    if (textBtn) {
        return Touchpoints.Task.clickClaimDurationWidget(textBtn);
    }

    // 2. 尝试通过「今日畅听」水平锚点定位
    var anchor = desc("今日畅听").findOnce();
    if (anchor) {
        var anchorY = anchor.bounds().centerY();
        return Touchpoints.Task.clickClaimDurationAnchor(anchorY);
    }

    // 3. 兜底坐标盲点
    return Touchpoints.Task.clickClaimDurationFallback();
}

// =====================================================================
// 9. 广告处理流程（等待、直播间退出、跳过与连播）
// =====================================================================
function waitAndCloseAd() {
    TouchCore.sleepWithLog("等待广告加载初始化", 3000);

    while (true) {
        TouchCore.sleepWithLog(">>> 广告播放中 (等待35秒) <<<", 35000);

        // 检查并退出误入的直播间
        var zhiboBtn = textContains("更多直播").findOnce();
        if (zhiboBtn) {
            log("🚨 [广告状态] 检测到当前处于直播间，尝试退出");
            for (var i = 0; i < 3; i++) {
                Touchpoints.Ad.exitLiveRoom();
                sleep(600);

                if (textContains("更多直播").exists()) {
                    TouchCore.back("直播间领券弹窗拦截，返回键协助退出");
                } else {
                    log("✔ [广告状态] 已成功退出直播间");
                    break;
                }
            }
        }

        // 关闭广告触点
        var feedbackBtn = text("反馈").findOne(2000);
        if (feedbackBtn) {
            Touchpoints.Ad.closeByFeedback(feedbackBtn);
        } else {
            Touchpoints.Ad.closeByTopRight();
        }

        // 检查连播与奖励弹窗
        TouchCore.sleepWithLog("等待广告关闭后的弹窗响应", 3000);

        // 1. 连续奖励页检测
        var inRewardAdPage = currentActivity().indexOf("ExcitingVideoActivity") >= 0;
        if (inRewardAdPage) {
            log("🎁 [连播检测] 仍停留在广告奖励页，触发连续奖励触点");
            Touchpoints.Ad.clickContinuousRewardArea();
            sleep(2500);
            continue;
        }

        // 2. 退出确认弹窗检测
        var exitBtn = textContains("坚持退出").findOne(1000);
        if (exitBtn) {
            Touchpoints.Ad.clickExitConfirm(exitBtn);
            sleep(2000);
            break;
        }

        // 3. 检查是否已经回到福利中心
        if (Touchpoints.Verify.confirmAtWelfareCenter()) {
            log("🎉 [流程完成] 已安全返回福利中心页面");
            break;
        }

        log("🔄 [广告状态] 未检测到退出或奖励页，继续循环等待广告流程...");
    }
}

// =====================================================================
// 10. 自动化主循环
// =====================================================================
log("=========================================");
log("🎬 [自动化流程] 进入完整任务循环");
log("=========================================");

// 启动前先进入并确认福利中心
ensureAtWelfarePage();

while (true) {
    // 1. 达成目标检测
    if (Touchpoints.Verify.confirmTargetAchieved()) {
        log("🏆 [目标达成] 恭喜获得第30日畅听！任务圆满完成！");
        TouchCore.home("任务达成返回桌面");
        break;
    }

    // 2. 校准并确认处于福利中心
    if (!ensureAtWelfarePage()) {
        log("⚠ [循环检测] 未能稳定停留在福利中心，2秒后重试...");
        sleep(2000);
        continue;
    }

    // 3. 触发「领时长」触点进入广告
    clickClaimDurationButton();

    // 4. 处理广告播放与连播闭环
    waitAndCloseAd();

    // 5. 本轮结束随机休息
    var delayMs = random(4000, 7000);
    TouchCore.sleepWithLog("本轮广告流程结束，随机休息", delayMs);
}
