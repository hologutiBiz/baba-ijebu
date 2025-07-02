from bs4 import BeautifulSoup
import json
import glob
import os

# Position labels
POSITION_LABELS = ["first", "second", "center", "forth", "last"]

def extract_draws_from_table(table):
    draws = []
    year = table.find('caption').text.strip() or "unknown"

    for row in table.select("tbody tr"):
        serial_tag = row.find('td', class_='serial-num')
        serial = serial_tag.text.strip() if serial_tag and serial_tag.text.strip() else "E"

        week_tag = row.find('td', class_='days')
        week = week_tag.text.strip() if week_tag and week_tag.text.strip() else ""

        winning = [td.text.strip() for td in row.find_all('td', class_='winning')]
        machine = [td.text.strip() for td in row.find_all('td', class_='machine')]

        draw = {
            "serialNumber": serial,
            "date": week,
            "winningNumbers": [
                {"position": f"{pos}_box_winning", "number": num}
                for pos, num in zip(POSITION_LABELS, winning)
            ],
            "machineNumbers": [
                {"position": f"{pos}_box_machine", "number": num}
                for pos, num in zip(POSITION_LABELS, machine)
            ]
        }
        draws.append((year, draw))
    return draws

def process_html_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    game_name = os.path.splitext(os.path.basename(filepath))[0].lower()
    game_json = {}

    for table in soup.find_all("table"):
        draws = extract_draws_from_table(table)
        for year, draw in draws:
            game_json.setdefault(year, []).append(draw)

    return {game_name: game_json}

# Convert all HTML files in /data and output JSON to /json_output
os.makedirs("json_output", exist_ok=True)
html_files = glob.glob("GAMES/*.html")

for file in html_files:
    game_data = process_html_file(file)
    game_name = list(game_data.keys())[0]
    output_path = f"json_output/{game_name}.json"

    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(game_data, out, indent=4)

    print(f"✅ Converted: {game_name}.html → {game_name}.json")
