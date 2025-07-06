import argparse, json, os, datetime, sqlite3, pathlib, sys
import yaml
from jinja2 import Template
from dotenv import load_dotenv
load_dotenv()

try:
    import openai
except ImportError:
    openai = None

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROMPTS_DIR = ROOT / "prompts"
INPUTS_DIR = ROOT / "inputs"
OUTPUTS_DIR = ROOT / "outputs"
DB_PATH = ROOT / "db" / "prompts.db"

def load_prompt(pid: str):
    with open(PROMPTS_DIR / f"{pid}.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def load_input(pid: str, path=None):
    path = pathlib.Path(path) if path else INPUTS_DIR / f"{pid}.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def render_template(template_str: str, data: dict):
    return Template(template_str).render(**data)


def call_openai(prompt: str, model="gpt-4o"):
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip()

def log_run(pid, inp, out, status, model):
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                prompt_id TEXT,
                input_json TEXT,
                output_json TEXT,
                status TEXT,
                model TEXT,
                ts TEXT
            ) """
    )
    conn.execute(
        "INSERT INTO runs(prompt_id, input_json, output_json, status, model, ts) VALUES (?,?,?,?,?,?)",
        (pid, json.dumps(inp), json.dumps(out), status, model, datetime.datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt_id")
    parser.add_argument("--input", help="Path to input JSON")
    parser.add_argument("--model", default="gpt-4o-mini")
    parser.add_argument("--no-log", action="store_true")
    args = parser.parse_args()

    pid = args.prompt_id
    prompt_meta = load_prompt(pid)
    input_data = load_input(pid, args.input)

    rendered_prompt = render_template(prompt_meta["template"], input_data)


    try:
        output_text = call_openai(rendered_prompt, args.model)
        status = "success"
    except Exception as e:
        output_text = f"ERROR: {e}"
        status = "error"

    OUTPUTS_DIR.mkdir(exist_ok=True)
    out_file = OUTPUTS_DIR / f"{pid}.out.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"output": output_text, "model": args.model, "status": status}, f, indent=2)

    if not args.no_log:
        try:
            log_run(pid, input_data, {"output": output_text}, status, args.model)
        except Exception as _:
            pass

    print(output_text)

if __name__ == "__main__":
    main()
