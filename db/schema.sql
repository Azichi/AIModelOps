IF OBJECT_ID('runs', 'U') IS NOT NULL
    DROP TABLE runs;

CREATE TABLE runs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    prompt_id NVARCHAR(255),
    input_json NVARCHAR(MAX),
    output_json NVARCHAR(MAX),
    status NVARCHAR(100),
    model NVARCHAR(100),
    ts DATETIME
);
