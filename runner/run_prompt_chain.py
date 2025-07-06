import yaml
import pathlib
import openai
import os

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROMPTS_DIR = ROOT / "prompts"
OUTPUTS_DIR = ROOT / "outputs"

openai.api_key = os.getenv("OPENAI_API_KEY")

def load_prompt_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def call_openai(prompt, model="gpt-4o"):
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip()

def run_prompt_chain(message: str, chain_path: str, model: str = "gpt-4o"):
    with open(chain_path, "r", encoding="utf-8") as f:
        chain = yaml.safe_load(f)["prompt_chain"]

    results = {}

    for i, step in enumerate(chain):
        name = step["name"]
        prompt_path = step["prompt_file"]
        prompt_template = load_prompt_file(prompt_path)

        if "input_from" in step:
            input_text = results[step["input_from"]]
        elif i == 0:
            input_text = message
        else:
            raise ValueError(f"No input for step '{name}'")

        prompt = prompt_template.replace("{input}", input_text.strip())
        output = call_openai(prompt, model)
        results[name] = output

        OUTPUTS_DIR.mkdir(exist_ok=True)
        out_path = OUTPUTS_DIR / f"{name}.out.txt"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(output)

    return results
