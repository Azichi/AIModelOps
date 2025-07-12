from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from subprocess import run, Popen, PIPE
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# ---- RUN SINGLE PROMPT ----
@app.post("/run-single")
async def run_single(prompt_id: str = Form(...), model: str = Form("gpt-4o"), input_file: UploadFile = File(None)):
    input_arg = []
    if input_file:
        temp_path = f"/tmp/{input_file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await input_file.read())
        input_arg = ["--input", temp_path]
    cmd = [sys.executable, "runner/run_prompt.py", prompt_id, "--model", model] + input_arg
    result = run(cmd, stdout=PIPE, stderr=PIPE)
    output = result.stdout.decode()
    if input_file:
        os.remove(temp_path)
    return JSONResponse({"output": output, "stderr": result.stderr.decode()})

# ---- RUN CHAIN ----
@app.post("/run-chain")
async def run_chain(chain_file: UploadFile = File(...), message: str = Form(...), model: str = Form("gpt-4o")):
    temp_chain = f"/tmp/{chain_file.filename}"
    with open(temp_chain, "wb") as f:
        f.write(await chain_file.read())
    cmd = [sys.executable, "runner/run_prompt_chain.py", temp_chain, message, model]
    result = run(cmd, stdout=PIPE, stderr=PIPE)
    os.remove(temp_chain)
    return JSONResponse({"output": result.stdout.decode(), "stderr": result.stderr.decode()})

# ---- RUN BATCH ----
from fastapi import UploadFile

@app.post("/run-batch")
async def run_batch(prompt: str = Form(...), limit: int = Form(...), csv: UploadFile = File(...)):
    temp_path = "inputs/batch_input.csv"
    with open(temp_path, "wb") as f:
        f.write(await csv.read())

    proc = run([
        "python", "runner/run_batch.py",
        "--prompt", prompt,
        "--limit", str(limit)
    ], stdout=PIPE, stderr=PIPE)

    return JSONResponse({
        "stdout": proc.stdout.decode(),
        "stderr": proc.stderr.decode(),
        "log_path": "outputs/batch_output.csv"
    })

