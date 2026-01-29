import argparse, json, os, pathlib
import yaml
from logger import log_run
from dotenv import load_dotenv

load_dotenv(dotenv_path=pathlib.Path(__file__).resolve().parent.parent / ".env")

import openai

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROMPTS_DIR = ROOT / "prompts"
INPUTS_DIR = ROOT / "inputs"
OUTPUTS_DIR = ROOT / "outputs"

def load_prompt(pid: str):
    with open(PROMPTS_DIR / f"{pid}.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

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


def interactive():
    all_prompts = [p.stem for p in PROMPTS_DIR.glob("*.yaml")]
    if not all_prompts:
        print("No prompts found.")
        return

    print("=== Run Single Prompt ===\n")
    for idx, pid in enumerate(all_prompts, 1):
        print(f"{idx}. {pid}")
    print()

    try:
        sel = int(input("Select prompt: ")) - 1
        if sel < 0 or sel >= len(all_prompts):
            print("Invalid choice.")
            return
    except:
        print("Invalid input.")
        return

    pid = all_prompts[sel]
    prompt_meta = load_prompt(pid)

    template = prompt_meta.get("template", "")
    user_input = input("Enter input: ").strip()
    prompt_text = template.replace("{input}", user_input)

    try:
        output_text = call_openai(prompt_text)
        status = "success"
    except Exception as e:
        output_text = f"ERROR: {e}"
        status = "error"

    OUTPUTS_DIR.mkdir(exist_ok=True)
    out_file = OUTPUTS_DIR / f"{pid}.out.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"output": output_text, "model": "gpt-4o", "status": status}, f, indent=2)

    try:
        log_run(pid, {"input": user_input}, {"output": output_text}, status, "gpt-4o")
    except:
        pass

    print("\n=== Prompt Output ===\n")
    print(output_text)
    print("\n=== End ===")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt_id", nargs="?", default=None)
    parser.add_argument("--input", help="Path to input JSON")
    parser.add_argument("--model", default="gpt-4o")
    parser.add_argument("--no-log", action="store_true")
    args = parser.parse_args()

    if not args.prompt_id:
        interactive()
        return

    pid = args.prompt_id
    prompt_meta = load_prompt(pid)
    input_data = json.load(open(args.input, "r", encoding="utf-8")) if args.input else {}
    template = prompt_meta.get("template", "")
    prompt_text = template.replace("{input}", input_data.get("input", ""))

    try:
        output_text = call_openai(prompt_text, args.model)
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
        except:
            pass

    print(output_text)

if __name__ == "__main__":
    main()
