import os
import requests
from bs4 import BeautifulSoup
import time
import re


def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"创建目录: {path}")


def download_image(url, file_path):
    # 如果文件已存在，跳过下载
    if os.path.exists(file_path):
        print(f"文件已存在，跳过下载: {file_path}")
        return True

    try:
        print(f"正在下载图片: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, stream=True, headers=headers)
        print(f"响应状态码: {response.status_code}")

        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                f.write(response.content)
            print(f"成功下载: {file_path}")
            time.sleep(0.2)  # 只在成功下载后添加0.2秒的短暂延迟
            return True
    except Exception as e:
        print(f"下载失败: {url}, 错误: {str(e)}")
    return False


def get_full_size_image_url(thumb_url):
    # 将缩略图URL转换为原始大小图片URL
    return re.sub(r'/\d+px-', '/1200px-', thumb_url)


def crawl_minor_arcana():
    # 小阿尔卡纳牌的URL列表
    minor_arcana_urls = [
        # 权杖
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Wands01.jpg/1200px-Wands01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Wands02.jpg/1200px-Wands02.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Wands03.jpg/1200px-Wands03.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Wands04.jpg/1200px-Wands04.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Wands05.jpg/1200px-Wands05.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Wands06.jpg/1200px-Wands06.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Wands07.jpg/1200px-Wands07.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Wands08.jpg/1200px-Wands08.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Tarot_Nine_of_Wands.jpg/1200px-Tarot_Nine_of_Wands.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Wands10.jpg/1200px-Wands10.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Wands11.jpg/1200px-Wands11.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Wands12.jpg/1200px-Wands12.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Wands13.jpg/1200px-Wands13.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Wands14.jpg/1200px-Wands14.jpg",

        # 圣杯
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Cups01.jpg/1200px-Cups01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Cups02.jpg/1200px-Cups02.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cups03.jpg/1200px-Cups03.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cups04.jpg/1200px-Cups04.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cups05.jpg/1200px-Cups05.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cups06.jpg/1200px-Cups06.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cups07.jpg/1200px-Cups07.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Cups08.jpg/1200px-Cups08.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Cups09.jpg/1200px-Cups09.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Cups10.jpg/1200px-Cups10.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Cups11.jpg/1200px-Cups11.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Cups12.jpg/1200px-Cups12.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Cups13.jpg/1200px-Cups13.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Cups14.jpg/1200px-Cups14.jpg",

        # 宝剑
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Swords01.jpg/1200px-Swords01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Swords02.jpg/1200px-Swords02.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Swords03.jpg/1200px-Swords03.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Swords04.jpg/1200px-Swords04.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Swords05.jpg/1200px-Swords05.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Swords06.jpg/1200px-Swords06.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Swords07.jpg/1200px-Swords07.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Swords08.jpg/1200px-Swords08.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Swords09.jpg/1200px-Swords09.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Swords10.jpg/1200px-Swords10.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Swords11.jpg/1200px-Swords11.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Swords12.jpg/1200px-Swords12.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/XIII_Swords.jpg/1200px-XIII_Swords.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Swords14.jpg/1200px-Swords14.jpg",

        # 钱币
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Pents01.jpg/1200px-Pents01.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pents02.jpg/1200px-Pents02.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pents03.jpg/1200px-Pents03.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pents04.jpg/1200px-Pents04.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Pents05.jpg/1200px-Pents05.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Pents06.jpg/1200px-Pents06.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pents07.jpg/1200px-Pents07.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pents08.jpg/1200px-Pents08.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Pents09.jpg/1200px-Pents09.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pents10.jpg/1200px-Pents10.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Pents11.jpg/1200px-Pents11.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pents12.jpg/1200px-Pents12.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Pents13.jpg/1200px-Pents13.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Pents14.jpg/1200px-Pents14.jpg",
    ]

    downloaded_count = 0
    for url in minor_arcana_urls:
        file_name = url.split('/')[-1].replace('1200px-', '')
        file_path = os.path.join("images", file_name)
        if download_image(url, file_path):
            downloaded_count += 1

    print(f"小阿尔卡纳牌下载完成，成功下载 {downloaded_count} 张图片")


def crawl_tarot_images():
    # 创建图片目录
    image_dir = "images"
    create_directory(image_dir)

    # 从维基百科爬取大阿尔卡纳牌图片
    base_url = "https://en.wikipedia.org/wiki/Rider-Waite_tarot_deck"
    print(f"正在访问页面: {base_url}")

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(base_url, headers=headers)
        print(f"页面响应状态码: {response.status_code}")

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            print("成功解析页面HTML")

            # 找到所有图片元素
            images = soup.find_all('img')
            print(f"找到 {len(images)} 个图片元素")

            downloaded_count = 0
            for img in images:
                if 'src' in img.attrs:
                    img_url = img['src']
                    if not img_url.startswith('http'):
                        img_url = 'https:' + img_url

                    # 只下载与塔罗牌相关的图片
                    if 'RWS_Tarot' in img_url:
                        # 获取大图URL
                        full_size_url = get_full_size_image_url(img_url)

                        # 提取干净的文件名
                        file_name = full_size_url.split(
                            '/')[-1].replace('1200px-', '')
                        file_path = os.path.join(image_dir, file_name)

                        # 下载图片
                        if download_image(full_size_url, file_path):
                            downloaded_count += 1

            print(f"大阿尔卡纳牌下载完成，成功下载 {downloaded_count} 张图片")

            # 下载小阿尔卡纳牌
            print("\n开始下载小阿尔卡纳牌...")
            crawl_minor_arcana()

    except Exception as e:
        print(f"爬取过程出错: {str(e)}")
        print(f"错误详情: {e.__class__.__name__}")


if __name__ == "__main__":
    print("开始爬取塔罗牌图片...")
    crawl_tarot_images()
    print("爬取完成！")
