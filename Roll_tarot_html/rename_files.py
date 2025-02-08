import os


def rename_tarot_files():
    image_dir = "images"

    # 重命名规则
    rename_rules = {
        'Waite%E2%80%93Smith_Tarot_Roses_and_Lilies_cropped.jpg': 'card-back.jpg',
        'Tarot_Nine_of_Wands.jpg': 'Wands09.jpg'
    }

    # 重命名小阿尔卡纳牌
    for filename in os.listdir(image_dir):
        old_path = os.path.join(image_dir, filename)

        # 处理特殊文件
        if filename in rename_rules:
            new_filename = rename_rules[filename]
            new_path = os.path.join(image_dir, new_filename)
            if not os.path.exists(new_path):
                os.rename(old_path, new_path)
                print(f"重命名: {filename} -> {new_filename}")
            else:
                print(f"目标文件已存在，跳过: {new_filename}")


if __name__ == "__main__":
    print("开始重命名文件...")
    rename_tarot_files()
    print("重命名完成！")
