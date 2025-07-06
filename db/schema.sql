
CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt_id TEXT,
    input_json TEXT,
    output_json TEXT,
    status TEXT,
    model TEXT,
    ts TEXT
);
