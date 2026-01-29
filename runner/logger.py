import os, pyodbc, json
from datetime import datetime

CONN_STR = os.getenv(
    "AIMO_SQL_CONN",
    r"DRIVER={ODBC Driver 18 for SQL Server};SERVER=localhost\SQLEXPRESS;"
    r"DATABASE=prompts;Trusted_Connection=yes;Encrypt=no"
)

def log_run(prompt_id, input_data, output_data, status, model):
    conn = pyodbc.connect(CONN_STR)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO runs (prompt_id, input_json, output_json, status, model, ts)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        prompt_id,
        json.dumps(input_data),
        json.dumps(output_data),
        status,
        model,
        datetime.utcnow()
    ))
    conn.commit()
    conn.close()
