CREATE TABLE runs (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    prompt_id     NVARCHAR(100) NOT NULL,
    input_json    NVARCHAR(MAX) NOT NULL,
    output_json   NVARCHAR(MAX) NOT NULL,
    status        NVARCHAR(20)  NOT NULL,
    model         NVARCHAR(50)  NOT NULL,
    ts            DATETIME2     DEFAULT SYSUTCDATETIME()
);
