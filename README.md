AIModelOps

1) Copy .env.example to .env and set OPENAI_API_KEY
2) pip install -r runner/requirements.txt
3) uvicorn runner.main:app --reload
4) cd frontend
5) npm install
6) npm run dev

CLI examples:
python runner/run_prompt.py summarize --input inputs/summarize.json
python runner/run_prompt_chain.py prompt_chains/diagnose_resolve_tighten.yaml @draft.txt
python runner/run_batch.py --prompt summarize --limit 100
