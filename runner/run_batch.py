import os, csv, subprocess, argparse, json
from datetime import datetime
from logger import log_run
from pathlib import Path
from dotenv import load_dotenv
import openai


load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")


INPUT_CSV = "inputs/batch_input.csv"
PROMPT_DIR = "prompts"
OUT_DIR = "outputs"
LOG_CSV = os.path.join(OUT_DIR, "batch_output.csv")
MODEL = "gpt-4.1"

os.makedirs(OUT_DIR, exist_ok=True)

def interactive():
    all_prompts = sorted([p.stem for p in Path(PROMPT_DIR).glob("*.yaml")])
    if not all_prompts:
        print("No prompt files found.")
        return

    print("=== Run Batch Prompt ===\n")
    for i, pid in enumerate(all_prompts, 1):
        print(f"{i}. {pid}")
    print()
    try:
        sel = int(input("Select prompt: ")) - 1
        if sel < 0 or sel >= len(all_prompts):
            print("Invalid selection.")
            return
    except:
        print("Invalid input.")
        return

    prompt_id = all_prompts[sel]
    try:
        limit = int(input("How many rows to run (Enter for all): ") or "0")
    except:
        limit = 0

    cmd = [
        "python", "runner/run_batch.py",
        "--prompt", prompt_id,
    ]
    if limit > 0:
        cmd += ["--limit", str(limit)]

    subprocess.run(cmd)

def call_openai(
    prompt, 
    model=None, 
    temperature=None, 
    top_p=None, 
    system_prompt=None
):
    from config import (
        DEFAULT_MODEL, 
        DEFAULT_TEMPERATURE, 
        DEFAULT_TOP_P, 
        DEFAULT_SYSTEM_PROMPT
    )
    model = model or DEFAULT_MODEL
    temperature = temperature if temperature is not None else DEFAULT_TEMPERATURE
    top_p = top_p if top_p is not None else DEFAULT_TOP_P
    system_prompt = system_prompt or DEFAULT_SYSTEM_PROMPT

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature,
        top_p=top_p,
    )
    return response.choices[0].message.content.strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--prompt", type=str, required=False)
    args = parser.parse_args()

    if not args.prompt:
        interactive()
        return

    with open(INPUT_CSV, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if args.limit:
        rows = rows[:args.limit]

    prompt_id = args.prompt

    file_exists = os.path.exists(LOG_CSV)
    with open(LOG_CSV, "a", newline='', encoding="utf-8") as logf:
        writer = csv.writer(logf)
        if not file_exists:
            writer.writerow(["timestamp", "input_json", "prompt", "model", "output", "status"])

        for row in rows:
            input_file = os.path.join("inputs", "__tmp_input.json")
            with open(input_file, "w", encoding="utf-8") as f:
                json.dump(row, f)

            row_id = row.get("id") or datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
            output_file = os.path.join(OUT_DIR, f"{prompt_id}_{row_id}.out.json")
            start = datetime.utcnow().isoformat()

            try:
                subprocess.run([
                    "python", "runner/run_prompt.py",
                    prompt_id,
                    "--input", input_file,
                    "--output", output_file,
                    "--model", MODEL
                ], check=True)

                with open(output_file, encoding="utf-8") as outf:
                    output_data = json.load(outf)

                log_run(prompt_id, row, output_data, "success", MODEL)
                writer.writerow([start, json.dumps(row), prompt_id, MODEL, output_data.get("output", ""), "success"])

            except Exception as e:
                writer.writerow([start, json.dumps(row), prompt_id, MODEL, f"ERROR: {e}", "fail"])

    print("Batch complete. Output CSV saved.")
