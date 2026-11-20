import os
import sys
import subprocess
import html
import urllib.request
import json

def main():
    bot_token = os.environ.get("BOT_TOKEN")
    chat_id = os.environ.get("CHAT_ID")
    event_name = os.environ.get("EVENT_NAME", "workflow_dispatch")
    repo = os.environ.get("REPOSITORY", "miemiegy/qishuishui-assistant")
    actor = os.environ.get("ACTOR", "miemiegy")

    if not bot_token or not chat_id:
        print("❌ 错误: 未设置 BOT_TOKEN 或 CHAT_ID")
        sys.exit(1)

    try:
        chat_id = int(chat_id)
    except ValueError:
        pass

    if event_name == "release":
        tag = os.environ.get("RELEASE_TAG", "")
        name = os.environ.get("RELEASE_NAME", "")
        url = os.environ.get("RELEASE_URL", f"https://github.com/{repo}/releases")
        body = os.environ.get("RELEASE_BODY", "")

        msg = f"🚀 <b>【汽水水助手】新版本发布！</b>\n\n"
        msg += f"🏷 <b>版本号</b>：<code>{html.escape(tag)}</code>\n"
        msg += f"📌 <b>发布标题</b>：{html.escape(name)}\n"
        msg += f"👤 <b>发布者</b>：{html.escape(actor)}\n\n"
        if body:
            msg += f"📋 <b>更新日志</b>：\n{html.escape(body)}\n\n"
        msg += f"🔗 <a href='{url}'>点击直达 GitHub Release 页面</a>"

    else:
        # workflow_dispatch 或指定 commit 模式
        target_sha = os.environ.get("INPUT_COMMIT_SHA", "").strip()
        extra_note = os.environ.get("INPUT_EXTRA_NOTE", "").strip()

        if not target_sha:
            # 留空则默认取当前 HEAD
            res = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True)
            target_sha = res.stdout.strip()

        # 解析指定 commit 的详情
        short_sha = subprocess.run(["git", "rev-parse", "--short", target_sha], capture_output=True, text=True, check=True).stdout.strip()
        subject = subprocess.run(["git", "log", "-1", "--pretty=format:%s", target_sha], capture_output=True, text=True, check=True).stdout.strip()
        body = subprocess.run(["git", "log", "-1", "--pretty=format:%b", target_sha], capture_output=True, text=True, check=True).stdout.strip()
        commit_author = subprocess.run(["git", "log", "-1", "--pretty=format:%an", target_sha], capture_output=True, text=True, check=True).stdout.strip()
        commit_date = subprocess.run(["git", "log", "-1", "--pretty=format:%ad", "--date=format:%Y-%m-%d %H:%M", target_sha], capture_output=True, text=True, check=True).stdout.strip()
        commit_url = f"https://github.com/{repo}/commit/{target_sha}"

        msg = f"📢 <b>【汽水水助手】代码提交动态</b>\n\n"
        if extra_note:
            msg += f"💬 <b>发布留言</b>：{html.escape(extra_note)}\n\n"

        msg += f"🏷 <b>Commit</b>：<code>{short_sha}</code> ({commit_date})\n"
        msg += f"✨ <b>{html.escape(subject)}</b>\n\n"

        if body:
            msg += f"📋 <b>详细变动信息</b>：\n{html.escape(body)}\n\n"

        msg += f"👤 <b>提交者</b>：{html.escape(commit_author)}\n"
        msg += f"🔗 <a href='{commit_url}'>查看完整代码变更</a>"

    payload = {
        "chat_id": chat_id,
        "text": msg,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            if data.get("ok"):
                print(f"✔ Telegram 消息推送成功！Message ID: {data['result']['message_id']}")
            else:
                print(f"❌ 推送失败: {data}")
                sys.exit(1)
    except Exception as e:
        print(f"❌ 网络请求异常: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
