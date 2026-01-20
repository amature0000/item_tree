import json
import os

filename = "data.json"
if os.path.exists(filename):
    with open(filename, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = []

# ====

def get_items(column_name):
    print(f"\n--- {column_name} 입력 ---")
    print("각 아이템을 입력하세요.(입력 양식: 아이템#수량)")
    items = []
    while True:
        inp = input("> ").strip()
        if inp.lower() == "":
            break
        if "/" in inp:
            name, qty = inp.split("#", 1)
            item_str = f"{name.strip()} ×{qty.strip()}"
            items.append(item_str)
        else:
            items.append(inp)
    return items

def get_output():
    print("\n--- Output 입력 ---")
    inp = input("> ").strip()
    return [inp]

# ====

while True:
    # output, ingredients, tools, etc 입력
    output = get_output()
    ingredients = get_items("Ingredients")
    tools = get_items("Tools")
    etc = get_items("etc")

    # 입력한 데이터 추가
    entry = [ingredients, tools, etc, output]
    data.append(entry)

    cont = input("\n아무 단어나 입력하여 다음 아이템 작성: ").strip().lower()
    if cont == "":
        break

# json 저장
with open(filename, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("const data = ")
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write(";")

print(f"\n데이터가 '{filename}'에 저장되었습니다.")
