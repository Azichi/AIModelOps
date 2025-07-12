import yaml
import os
import openai
import sys
from pathlib import Path
from dotenv import load_dotenv
from logger import log_run
import re

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

ROOT = Path(__file__).resolve().parent.parent
PROMPTS_DIR = ROOT / "prompts"
OUTPUTS_DIR = ROOT / "outputs"
CHAIN_DIR = ROOT / "prompt_chains"

from config import (
    DEFAULT_MODEL,
    DEFAULT_SYSTEM_PROMPT,
    GLOBAL_STYLE_SETTINGS
)

def load_prompt_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def call_openai(prompt, model=None, system_prompt=None):
    model = model or DEFAULT_MODEL
    system_prompt = system_prompt or DEFAULT_SYSTEM_PROMPT
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

import re

def fill_template(template, variables):
    def replacer(match):
        var = match.group(1)
        return str(variables.get(var, f"{{{var}}}")) 
    return re.sub(r"{(\w+)}", replacer, template)


def run_chain(chain_path, message):
    with open(chain_path, "r", encoding="utf-8") as f:
        chain = yaml.safe_load(f)["prompt_chain"]

    results = {}
    input_text = message

    for step in chain:
        pid = step["name"]
        prompt_template = load_prompt_file(step["prompt_file"])

        if pid == "diagnose":
            variables = {
                "input": input_text,
                "global_style_settings": GLOBAL_STYLE_SETTINGS
            }
        elif pid == "resolve":
            variables = {
                "current_draft": results["diagnose"],
                "diagnose_json": results["diagnose"],
                "global_style_settings": GLOBAL_STYLE_SETTINGS
            }
        elif pid == "tighten":
            variables = {
                "draft_v2": results["resolve"],
                "global_style_settings": GLOBAL_STYLE_SETTINGS
            }
        else:
            variables = {
                "input": input_text,
                "global_style_settings": GLOBAL_STYLE_SETTINGS
            }

        prompt = fill_template(prompt_template, variables)
        output = call_openai(prompt)

        results[pid] = output
        input_text = output

        log_run(
            prompt_id=pid,
            input_data=variables,
            output_data={"output": output},
            status="success",
            model=DEFAULT_MODEL
        )

        OUTPUTS_DIR.mkdir(exist_ok=True)
        with open(OUTPUTS_DIR / f"{pid}.out.txt", "w", encoding="utf-8") as f_out:
            f_out.write(output)

    print("\n=== FINAL OUTPUT ===\n")
    print(input_text)
    print("\n=== END ===")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python run_prompt_chain.py prompt_chains/chain.yaml @draft.txt")
        sys.exit(1)

    chain_path = sys.argv[1]
    draft_arg = sys.argv[2]

    if not draft_arg.startswith("@"):
        print("Provide draft as @filename.txt")
        sys.exit(1)

    infile = draft_arg[1:]
    if not os.path.exists(infile):
        print("File not found.")
        sys.exit(1)

    with open(infile, "r", encoding="utf-8") as f:
        message = f.read()

    run_chain(chain_path, message)
