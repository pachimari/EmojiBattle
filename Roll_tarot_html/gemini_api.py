import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "*"}})

# 配置API密钥
GOOGLE_API_KEY = ""  # 需要替换为实际的API密钥
genai.configure(api_key=GOOGLE_API_KEY)


def create_prompt(question, cards):
    # 构建提示词
    base_prompt = f"""你现在是一位专业的塔罗牌占卜师。用户抽到了以下三张塔罗牌，请根据这些牌的含义，为用户的问题提供一个详细的解读。
    
用户的问题是：{question}

抽到的牌是：
"""

    for i, card in enumerate(cards, 1):
        position = "过去" if i == 1 else "现在" if i == 2 else "未来"
        base_prompt += f"\n{i}. {position}位置：{card['name']}{'（逆位）' if card['isReversed'] else ''}，含义：{card['meaning']}"

    base_prompt += """

请按照以下格式进行解读：
1. 整体牌面分析（100字以内）
2. 详细解读：
   - 过去：（分析第一张牌与问题的关系）
   - 现在：（分析第二张牌与问题的关系）
   - 未来：（分析第三张牌与问题的关系）
3. 建议（100字以内）

注意：
- 解读要符合逻辑，前后连贯
- 语气要温和积极，给予建设性的建议
- 每个部分的分析要紧扣用户的问题
- 避免过于绝对的判断
"""
    return base_prompt


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        question = data.get('question')
        cards = data.get('cards')

        if not question or not cards or len(cards) != 3:
            return jsonify({'error': '参数不完整'}), 400

        # 创建提示词
        prompt = create_prompt(question, cards)

        # 调用Gemini API
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        # 返回结果
        return jsonify({
            'success': True,
            'prediction': response.text
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    app.run(port=5000)
