import pandas as pd


def split_excel_to_csv(excel_file_path, output_directory):
    # 读取Excel文件
    excel_data = pd.ExcelFile(excel_file_path)

    # 遍历每个工作表
    for sheet_name in excel_data.sheet_names:
        # 检查工作表名称中是否包含“【废弃】”
        if "废弃" in sheet_name:
            print(f"跳过工作表 '{sheet_name}' 因为它被标记为废弃")
            continue

        # 读取工作表数据
        df = excel_data.parse(sheet_name)

        # 生成CSV文件路径
        csv_file_path = f"{output_directory}/{sheet_name}.csv"

        # 将数据写入CSV文件
        df.to_csv(csv_file_path, index=False)
        print(f"工作表 '{sheet_name}' 已保存为 '{csv_file_path}'")


# 示例用法
excel_file_path = 'soulbattle\武魂乱斗卡牌配置表.xlsx'
output_directory = 'soulbattle\subcsvs'
split_excel_to_csv(excel_file_path, output_directory)
