from nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
from datetime import datetime
import json
from .prompt_gen import generate_prompt
import sys
import os
import requests
from requests.exceptions import Timeout, RequestException

# 添加ComfyUI根目录到Python路径
comfy_path = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(comfy_path)


class PromptGeneratorNode:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "user_input": ("STRING", {
                    "multiline": True,
                    "default": "请输入中文描述"
                }),
            },
            "optional": {
                "api_key": ("STRING", {
                    "multiline": False,
                    "default": ""
                }),
                "timeout": ("INT", {
                    "default": 30,
                    "min": 5,
                    "max": 120,
                    "step": 1
                }),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "generate"
    CATEGORY = "utility"

    def generate(self, user_input, api_key="", timeout=30):
        print("\n[Prompt Generator] 开始生成 Prompt...")
        print(f"[Prompt Generator] 用户输入: {user_input}")
        print(f"[Prompt Generator] 超时设置: {timeout}秒")

        # 设置临时环境变量
        original_api_key = os.getenv("DEEPSEEK_API_KEY")
        if api_key.strip():
            os.environ["DEEPSEEK_API_KEY"] = api_key.strip()
            print("[Prompt Generator] 使用输入框中的 API Key")
        else:
            print("[Prompt Generator] 使用配置文件中的 API Key")

        try:
            print("[Prompt Generator] 正在调用 API...")
            # 调用prompt_gen.py中的generate_prompt函数，禁用流式输出，添加超时
            result, prompt_tokens, completion_tokens = generate_prompt(
                user_input,
                history=None,
                prompt_keys=['system'],
                stream=False,
                timeout=timeout
            )
            print(f"[Prompt Generator] API 调用成功！")
            print(
                f"[Prompt Generator] Token 使用情况: 输入 {prompt_tokens}, 输出 {completion_tokens}, 总计 {prompt_tokens + completion_tokens}")

            # 提取最终prompt
            if "最终Prompt：" in result:
                final_prompt = result.split("最终Prompt：")[-1].strip()
            else:
                final_prompt = result

            print("\n[Prompt Generator] 生成的完整结果:")
            print(result)
            print("\n[Prompt Generator] 最终 Prompt:")
            print(final_prompt)

            # 保存对话历史到本地文件
            self.save_conversation(
                user_input, result, prompt_tokens, completion_tokens)
            print("[Prompt Generator] 对话历史已保存")

            return (final_prompt,)

        except Timeout:
            error_msg = f"[Prompt Generator] 错误: API 调用超时（{timeout}秒）"
            print(error_msg)
            return (error_msg,)
        except RequestException as e:
            error_msg = f"[Prompt Generator] 错误: API 请求失败 - {str(e)}"
            print(error_msg)
            return (error_msg,)
        except Exception as e:
            error_msg = f"[Prompt Generator] 错误: {str(e)}"
            print(error_msg)
            return (error_msg,)
        finally:
            # 恢复原始环境变量
            if original_api_key:
                os.environ["DEEPSEEK_API_KEY"] = original_api_key
            elif api_key.strip():
                del os.environ["DEEPSEEK_API_KEY"]

    def save_conversation(self, user_input, result, prompt_tokens, completion_tokens):
        """保存对话历史到本地文件"""
        try:
            # 确保存储目录存在
            base_dir = os.path.dirname(os.path.abspath(__file__))
            history_dir = os.path.join(base_dir, 'conversation_history')
            os.makedirs(history_dir, exist_ok=True)

            # 准备对话记录
            conversation = {
                "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S"),
                "user_input": user_input,
                "response": result,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": prompt_tokens + completion_tokens
            }

            # 保存到文件
            history_path = os.path.join(
                history_dir, 'conversation_history.json')

            # 读取现有历史记录
            history = []
            if os.path.exists(history_path):
                with open(history_path, 'r', encoding='utf-8') as f:
                    history = json.load(f)

            # 添加新记录
            history.append(conversation)

            # 保存更新后的历史
            with open(history_path, 'w', encoding='utf-8') as f:
                json.dump(history, f, ensure_ascii=False, indent=2)

        except Exception as e:
            print(f"保存对话历史时出错：{str(e)}")


# 注册节点到ComfyUI
NODE_CLASS_MAPPINGS["PromptGeneratorNode|pysssss"] = PromptGeneratorNode
NODE_DISPLAY_NAME_MAPPINGS["PromptGeneratorNode|pysssss"] = "Prompt Generator"
