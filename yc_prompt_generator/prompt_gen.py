import os
import requests
from requests.exceptions import Timeout, RequestException
import json
from datetime import datetime


def get_api_key():
    """获取 API key"""
    # 1. 首先尝试从环境变量获取
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if api_key:
        return api_key

    # 2. 如果环境变量没有，尝试从配置文件读取
    try:
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
                return config.get('DEEPSEEK_API_KEY')
    except:
        pass

    return None


def load_prompt_sections(keys):
    """
    从配置文件中加载指定部分的提示词
    :param keys: 要加载的部分名称列表，如 ['system', 'style']
    :return: 拼接后的提示词内容
    """
    prompt_content = []
    try:
        # 使用绝对路径确保文件位置
        base_dir = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_dir, 'prompts_config.txt')

        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()

        current_section = None
        for line in content.split('\n'):
            if line.startswith('[') and line.endswith(']'):
                current_section = line[1:-1]
            elif current_section in keys:
                prompt_content.append(line)

        return '\n'.join(prompt_content)
    except Exception as e:
        print(f"加载提示词配置时出错: {str(e)}")
        return ""


def generate_prompt(user_input, history=None, prompt_keys=None, stream=False, timeout=30):
    """
    生成Prompt的核心函数
    :param user_input: 用户输入
    :param history: 对话历史
    :param prompt_keys: 要使用的提示词部分
    :param stream: 是否使用流式输出
    :param timeout: API 调用超时时间（秒）
    :return: 生成的prompt, 输入token数, 输出token数
    """
    try:
        # 构建消息列表
        messages = []

        # 添加系统提示
        if prompt_keys:
            system_prompt = load_prompt_sections(prompt_keys)
            messages.append({"role": "system", "content": system_prompt})

        # 添加历史记录
        if history:
            messages.extend(history)

        # 添加用户输入
        messages.append({"role": "user", "content": user_input})

        # API配置
        api_key = get_api_key()
        if not api_key:
            return "错误: 未找到 API Key，请在环境变量或 config.json 中设置 DEEPSEEK_API_KEY", 0, 0

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # API请求数据
        data = {
            "model": "deepseek-chat",
            "messages": messages,
            "stream": stream
        }

        # 发送请求
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers=headers,
            json=data,
            stream=stream,
            timeout=timeout  # 添加超时设置
        )

        if stream:
            collected_content = []
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8')
                    if line.startswith('data: '):
                        try:
                            json_str = line[6:]
                            if json_str.strip() == '[DONE]':
                                continue
                            chunk = json.loads(json_str)
                            if chunk['choices'][0]['delta'].get('content'):
                                content = chunk['choices'][0]['delta']['content']
                                print(content, end="", flush=True)
                                collected_content.append(content)
                        except json.JSONDecodeError:
                            continue

            result = ''.join(collected_content)
            prompt_tokens = len(''.join(str(m.get('content', ''))
                                for m in messages)) // 4
            completion_tokens = len(result) // 4
        else:
            response_json = response.json()
            result = response_json['choices'][0]['message']['content']
            prompt_tokens = response_json['usage']['prompt_tokens']
            completion_tokens = response_json['usage']['completion_tokens']

        return result, prompt_tokens, completion_tokens

    except requests.Timeout:
        raise Timeout("API 调用超时")
    except requests.RequestException as e:
        raise RequestException(f"API 请求失败: {str(e)}")
    except Exception as e:
        print(f"生成Prompt时出错: {str(e)}")
        return f"错误: {str(e)}", 0, 0


def save_conversation(user_input, generated_prompt, response_time, prompt_tokens, completion_tokens):
    """保存对话历史
    :param user_input: 用户输入
    :param generated_prompt: 生成的prompt
    :param response_time: 响应时间（秒）
    :param prompt_tokens: 输入token数量
    :param completion_tokens: 输出token数量
    """
    # 处理生成的prompt，创建纯英文版本
    if "最终Prompt：" in generated_prompt:
        # 找到"最终Prompt："之后的内容
        final_prompt = generated_prompt.split("最终Prompt：")[-1]
        # 去除多余的空格和换行
        final_prompt = final_prompt.strip()
        # 去除中文内容
        english_prompt = ''.join(
            [char for char in final_prompt if ord(char) < 128])
    else:
        english_prompt = generated_prompt

    # 确保存储目录存在
    base_dir = os.path.dirname(os.path.abspath(__file__))
    history_dir = os.path.join(base_dir, 'conversation_history')
    os.makedirs(history_dir, exist_ok=True)

    # 准备对话记录
    conversation = {
        "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S"),
        "user_input": user_input,
        "full_output": generated_prompt,  # 完整输出
        "english_prompt": english_prompt,  # 纯英文prompt
        "response_time": response_time,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": prompt_tokens + completion_tokens
    }

    # 保存到文件
    history_path = os.path.join(history_dir, 'conversation_history.json')
    try:
        # 如果文件存在，读取现有内容
        if os.path.exists(history_path):
            with open(history_path, 'r', encoding='utf-8') as f:
                history = json.load(f)
        else:
            history = []

        # 添加新记录
        history.append(conversation)

        # 保存更新后的历史
        with open(history_path, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"保存对话历史时出错：{str(e)}")


if __name__ == "__main__":
    print("当前API密钥：", get_api_key())
    print("开始对话会话（输入 'quit' 或 'exit' 结束对话，输入 'reset' 重置对话历史）")
    print("输入 'stream' 切换流式输出模式")

    messages_history = []  # 用于存储对话历史
    stream_mode = True    # 默认开启流式输出模式

    while True:
        user_input = input("\n请输入你的需求（中文）：").strip()

        # 检查是否退出或重置
        if user_input.lower() in ['quit', 'exit']:
            print("结束对话")
            break
        elif user_input.lower() == 'reset':
            messages_history = []
            print("对话历史已重置")
            continue
        elif user_input.lower() == 'stream':
            stream_mode = not stream_mode
            print(f"流式输出模式已{'开启' if stream_mode else '关闭'}")
            continue

        # 记录开始时间
        start_time = datetime.now()

        # 生成回复
        result, prompt_tokens, completion_tokens = generate_prompt(
            user_input,
            messages_history,
            prompt_keys=['system', 'example'],
            stream=stream_mode
        )

        # 计算响应时间
        response_time = (datetime.now() - start_time).total_seconds()

        if not stream_mode:
            print("\n生成的Prompt：")
            print(result)

        print(f"\n响应时间：{response_time:.2f}秒")
        print(
            f"Token使用情况：输入 {prompt_tokens}，输出 {completion_tokens}，总计 {prompt_tokens + completion_tokens}")

        # 更新对话历史
        messages_history.append({"role": "user", "content": user_input})
        messages_history.append({"role": "assistant", "content": result})

        # 保存对话历史到文件
        save_conversation(user_input, result, response_time,
                          prompt_tokens, completion_tokens)
