import os
import sys
from pathlib import Path
from docx import Document
import argparse


def convert_docx_to_md(input_file, output_file=None):
    """
    将 docx 文件转换为 markdown 格式（仅提取文本内容）
    :param input_file: 输入的 docx 文件路径
    :param output_file: 输出的 markdown 文件路径（可选）
    """
    try:
        # 如果没有指定输出文件，则使用相同的文件名，但扩展名改为.md
        if output_file is None:
            output_file = str(Path(input_file).with_suffix('.md'))

        # 读取 docx 文件
        doc = Document(input_file)

        # 提取文本内容
        markdown_content = []

        for paragraph in doc.paragraphs:
            # 跳过空段落
            if not paragraph.text.strip():
                continue

            # 处理标题样式
            if paragraph.style and paragraph.style.name and paragraph.style.name.startswith('Heading'):
                try:
                    level = paragraph.style.name[-1]  # 获取标题级别
                    markdown_content.append(
                        '#' * int(level) + ' ' + paragraph.text)
                except (ValueError, IndexError):
                    # 如果无法解析标题级别，就作为普通段落处理
                    markdown_content.append(paragraph.text)
            else:
                markdown_content.append(paragraph.text)

            # 添加空行
            markdown_content.append('')

        # 处理表格
        for table in doc.tables:
            for row in table.rows:
                row_content = []
                for cell in row.cells:
                    row_content.append(cell.text.strip())
                markdown_content.append('| ' + ' | '.join(row_content) + ' |')
            markdown_content.append('')

        # 写入转换后的内容到 markdown 文件
        with open(output_file, 'w', encoding='utf-8') as md_file:
            md_file.write('\n'.join(markdown_content))

        print(f'转换成功！\n输入文件: {input_file}\n输出文件: {output_file}')

    except Exception as e:
        print(f'转换过程中出现错误: {str(e)}')


def main():
    parser = argparse.ArgumentParser(
        description='将 Word docx 文件转换为 Markdown 格式')
    parser.add_argument('input_file', help='输入的 docx 文件路径')
    parser.add_argument('-o', '--output', help='输出的 markdown 文件路径（可选）')

    args = parser.parse_args()
    convert_docx_to_md(args.input_file, args.output)


if __name__ == '__main__':
    main()
