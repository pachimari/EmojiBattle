import json
import os
import sys


def convert_json_to_md(json_file_path):
    """
    将LLM聊天JSON文件转换为Markdown格式

    Args:
        json_file_path (str): JSON文件的路径
    """
    try:
        # 读取JSON文件
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 获取输出文件路径（与JSON文件同目录，但扩展名为.md）
        output_path = os.path.splitext(json_file_path)[0] + '.md'

        # 写入Markdown文件
        with open(output_path, 'w', encoding='utf-8') as f:
            messages = data.get('messages', [])
            for message in messages:
                role = message.get('role', '')
                content = message.get('content', '')

                # 写入角色和内容，保持原有的换行格式
                f.write(f'role: {role}\n')
                f.write(f'content: {content}\n')
                f.write('\n---\n\n')  # 添加分隔符

        print(f'成功将 {json_file_path} 转换为 {output_path}')
        return True

    except json.JSONDecodeError:
        print(f'错误：{json_file_path} 不是有效的JSON文件')
        return False
    except Exception as e:
        print(f'处理文件 {json_file_path} 时发生错误：{str(e)}')
        return False


def main():
    # 如果文件被拖拽到脚本上运行
    if len(sys.argv) > 1:
        for file_path in sys.argv[1:]:
            if file_path.lower().endswith('.json'):
                convert_json_to_md(file_path)
            else:
                print(f'跳过非JSON文件：{file_path}')
    else:
        print('使用方法：')
        print('1. 将JSON文件拖拽到此Python脚本上')
        print('2. 或在命令行中运行：python json_to_md_converter.py <json文件路径>')


if __name__ == '__main__':
    main()
