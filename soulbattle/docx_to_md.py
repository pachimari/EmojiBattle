import os
import sys
from pathlib import Path
from docx import Document
import argparse


def convert_docx_to_md(input_file, output_file=None):
    """
    将 docx 文件转换为 markdown 格式（仅提取文本内容）
    :param input_file: 输入的 docx 文件路径
    :param output_file: 输出的 markdown 文件路径（可选）·
    """
    try:
        # 如果没有指定输出文件，则使用相同的文件名，但扩展名改为.md
        if output_file is None:
            output_file = str(Path(input_file).with_suffix('.md'))

        # 读取 docx 文件
        doc = Document(input_file)

        # 提取文本内容
        markdown_content = []

        # 遍历所有内容（段落和表格）
        for element in doc.element.body:
            if element.tag.endswith('p'):  # 处理段落
                # 获取段落文本
                text = ''
                for t in element.findall(".//w:t", {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}):
                    text += t.text if t.text else ''

                # 跳过空段落
                if not text.strip():
                    continue

                # 处理标题样式
                style_element = element.find(
                    ".//w:pStyle", {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'})
                if style_element is not None:
                    style_name = style_element.get(
                        '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val')
                    if style_name and style_name.startswith('Heading'):
                        try:
                            level = style_name[-1]  # 获取标题级别
                            markdown_content.append(
                                '#' * int(level) + ' ' + text)
                        except (ValueError, IndexError):
                            markdown_content.append(text)
                    else:
                        markdown_content.append(text)
                else:
                    markdown_content.append(text)

                # 添加空行
                markdown_content.append('')

            elif element.tag.endswith('tbl'):  # 处理表格
                rows = []
                # 收集所有单元格内容
                for row in element.findall(".//w:tr", {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}):
                    cells = []
                    for cell in row.findall(".//w:t", {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}):
                        cells.append(cell.text.strip() if cell.text else '')
                    if cells:  # 只添加非空行
                        rows.append(cells)

                if rows:
                    # 添加表头
                    markdown_content.append('| ' + ' | '.join(rows[0]) + ' |')
                    # 添加分隔行
                    markdown_content.append(
                        '| ' + ' | '.join(['---'] * len(rows[0])) + ' |')
                    # 添加数据行
                    for row in rows[1:]:
                        # 确保每行的单元格数量与表头一致
                        while len(row) < len(rows[0]):
                            row.append('')
                        markdown_content.append('| ' + ' | '.join(row) + ' |')
                    # 表格后添加空行
                    markdown_content.append('')

        # 写入转换后的内容到 markdown 文件
        with open(output_file, 'w', encoding='utf-8') as md_file:
            md_file.write('\n'.join(markdown_content))

        print(f'转换成功！\n输入文件: {input_file}\n输出文件: {output_file}')

    except Exception as e:
        print(f'转换过程中出现错误: {str(e)}')
        import traceback
        traceback.print_exc()


def main():
    parser = argparse.ArgumentParser(
        description='将 Word docx 文件转换为 Markdown 格式')
    parser.add_argument('input_file', help='输入的 docx 文件路径')
    parser.add_argument('-o', '--output', help='输出的 markdown 文件路径（可选）')

    args = parser.parse_args()
    convert_docx_to_md(args.input_file, args.output)


if __name__ == '__main__':
    main()
