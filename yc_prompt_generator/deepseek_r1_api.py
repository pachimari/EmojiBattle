import json
import requests
import os

# 读取配置文件
with open('config.json', 'r') as f:
    config = json.load(f)
    api_key = config['DEEPSEEK_API_KEY']

# API配置
url = "https://api.deepseek.com/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}


def chat_with_deepseek(prompt):
    # 请求体
    data = {
        "model": "deepseek-reasoner",
        "messages": [{"role": "user", "content": prompt}],
        "stream": True,
        "temperature": 0.7
    }

    # 创建输出文件
    output_file = "deepseek_response.txt"
    history_file = "history.json"

    # 初始化历史记录
    history_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "prompt": prompt,
        "response": "",
        "reasoning_chain": "",
        "status": "success",
        "error": None
    }

    try:
        # 设置超时时间为30秒
        with requests.post(url, headers=headers, json=data, stream=True, timeout=30) as response:
            if response.status_code == 200:
                full_response = ""
                reasoning_chain = ""

                with open(output_file, 'a', encoding='utf-8') as f:
                    for line in response.iter_lines():
                        if line:
                            decoded_line = line.decode('utf-8')
                            if decoded_line.startswith("data:"):
                                json_data = json.loads(decoded_line[5:])
                                if "choices" in json_data:
                                    content = json_data["choices"][0]["delta"].get(
                                        "content", "")
                                    reasoning = json_data["choices"][0]["delta"].get(
                                        "reasoning", "")

                                    print(content, end="", flush=True)
                                    f.write(content)
                                    full_response += content
                                    reasoning_chain += reasoning

                # 更新历史记录
                history_entry["response"] = full_response
                history_entry["reasoning_chain"] = reasoning_chain

            else:
                history_entry["status"] = "failed"
                history_entry["error"] = f"API请求失败，状态码：{response.status_code}"
                print(history_entry["error"])

    except requests.Timeout:
        history_entry["status"] = "timeout"
        history_entry["error"] = "API请求超时"
        print("请求超时，请稍后重试")

    except Exception as e:
        history_entry["status"] = "error"
        history_entry["error"] = str(e)
        print(f"发生错误：{str(e)}")

    finally:
        # 保存历史记录
        if os.path.exists(history_file):
            with open(history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)
        else:
            history = []

        history.append(history_entry)

        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    user_input = input("请输入你的问题：")
    chat_with_deepseek(user_input)
