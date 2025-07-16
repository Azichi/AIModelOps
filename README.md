# AIModelOps

End-to-end LLM pipeline for building, editing, chaining, and batch-running prompts—through a modern UI or CLI.

---

## Stack

- **Frontend**: React + Chakra UI + Vite + Tauri (TypeScript)
- **Backend**: FastAPI + Python 3.11
- **Model Execution**: OpenAI (via `openai` Python SDK)
- **Database**: SQLite or SQL Server (ODBC)
- **Prompt Format**: YAML (single or chained)
- **Packaging**: Docker (runner + frontend containers)

---

## Project Structure

```text
AIModelOps/
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── requirements.txt
├── run.ps1
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── test.yml
├── cli/
│   └── aimo_cli.ps1
├── db/
│   └── schema.sql
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── chains.ts
│   │   ├── data.ts
│   │   ├── main.tsx
│   │   ├── PromptContext.tsx
│   │   ├── prompts.ts
│   │   ├── theme.ts
│   │   ├── types.ts
│   │   ├── vite-env.d.ts
│   │   └── components/
│   │       ├── BatchRunner.tsx
│   │       ├── Confirm.tsx
│   │       ├── PromptCards.tsx
│   │       ├── PromptForm.tsx
│   │       └── Sidebar.tsx
│   └── src-tauri/
│       ├── .gitignore
│       ├── build.rs
│       ├── Cargo.lock
│       ├── Cargo.toml
│       ├── tauri.conf.json
│       ├── capabilities/
│       │   └── default.json
│       └── src/
│           ├── lib.rs
│           └── main.rs
├── inputs/
│   ├── sql_gen.json
│   └── summarize.json
├── outputs/
├── prompts/
│   ├── analyze.yaml
│   ├── diagnose.yaml
│   ├── extract.yaml
│   ├── report.yaml
│   ├── resolve.yaml
│   └── tighten.yaml
├── prompt_chains/
│   ├── diagnose_resolve_tighten.yaml
│   └── extract_analyze_report.yaml
├── runner/
│   ├── config.py
│   ├── Dockerfile
│   ├── logger.py
│   ├── main.py
│   ├── requirements.txt
│   ├── run_batch.py
│   ├── run_prompt.py
│   └── run_prompt_chain.py
```


## Setup

### Backend

Install dependencies:  
pip install -r requirements.txt

Run API server:  
uvicorn runner.main:app --reload

### Frontend

cd frontend  
npm install  
npm run dev

---

## CLI Usage

Run single prompt:  
python runner/run_prompt.py summarize --input inputs/summarize.json

Run prompt chain:  
python runner/run_prompt_chain.py prompt_chains/diagnose_resolve_tighten.yaml @draft.txt

Run batch:  
python runner/run_batch.py --prompt summarize --limit 100

---

## API Endpoints

**POST /run-single**  
Fields:  
- prompt_id (str)  
- model (optional, default: gpt-4o)  
- input_file (UploadFile)

**POST /run-chain**  
Fields:  
- chain_file (UploadFile)  
- message (str)  
- model (optional, default: gpt-4o)

**POST /run-batch**  
Fields:  
- csv (UploadFile)  
- prompt (str)  
- limit (int)

Returns:  
- stdout  
- stderr  
- log_path (CSV)

---

## YAML Prompt Format

Single prompt example:  
template: |  
    Summarize this in 2–3 sentences:  
    {input}

Chain format:  
prompt_chain:  
  - name: diagnose  
    prompt_file: prompts/diagnose.yaml  
  - name: resolve  
    prompt_file: prompts/resolve.yaml  
  - name: tighten  
    prompt_file: prompts/tighten.yaml

---

## Config Highlights (runner/config.py)

- DEFAULT_MODEL = "o3"  
- AVAILABLE_MODELS = [gpt-3.5-turbo, gpt-4, gpt-4o, gpt-4.1, gpt-4.5, gpt-4.1-nano, o4-mini, o3]  
- DEFAULT_SYSTEM_PROMPT = clipped, direct instruction style  
- .env loads OpenAI key and SQL connection string

---

## UI Flow

- Sidebar → select category  
- PromptCards → list prompts or chains  
- PromptForm → fill variables and preview  
- Output shown in right panel  
- Batch mode → upload CSV and select prompt  
- Chain mode → input message and run sequence

---

## Logging

All runs stored in `runs` table:  
- prompt_id  
- input_json  
- output_json  
- status  
- model  
- ts (timestamp)
