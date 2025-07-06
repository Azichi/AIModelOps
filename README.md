### AIModelOps

Full-stack prompt management platform built for automating LLM workflows.


### Structure

```tree
AIModelOps/
├── runner/
│   ├── run_prompt.py
│   ├── run_prompt_chain.py
│   ├── validate.py
│   └── config.py
├── prompt_chains/
│   └── extract_analyze_report.yaml
├── prompts/
│   ├── extract.yaml
│   ├── analyze.yaml
│   └── report.yaml
├── db/
│   ├── prompts.db
│   └── schema.sql
├── frontend/
├── cli/
├── requirements.txt
├── package.json
├── README.md
├── run_mac.sh
├── run_linux.sh
├── run_windows.bat
```

### Stack

- **Frontend**: React (w/ Chakra UI), Tauri, TypeScript
- **Scripting**: Node.js + Python
- **CI/CD**: To be added

### Setup

```bash
cd frontend
npm install
npm run dev
```

### Instructions

```bash
pip install -r requirements.txt
```
