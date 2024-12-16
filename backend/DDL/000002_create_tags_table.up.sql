CREATE TABLE IF NOT EXISTS tags
(
    id         SERIAL PRIMARY KEY NOT NULL,
    name      VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP           NULL

    CONSTRAINT chk_name CHECK (name <> ''),   -- 空文字禁止

    CREATE INDEX idx_tags_name ON tags (name);
);

COMMENT ON TABLE tags IS 'タグテーブル';
COMMENT ON COLUMN tags.id IS 'ID';
COMMENT ON COLUMN tags.name IS 'タグ名';
COMMENT ON COLUMN tags.created_at IS '登録日時';
COMMENT ON COLUMN tags.updated_at IS '更新日時';
COMMENT ON COLUMN tags.updated_at IS '削除日時';