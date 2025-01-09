CREATE TABLE IF NOT EXISTS images
(
    id         SERIAL PRIMARY KEY NOT NULL,
    image_path      VARCHAR(255)        NOT NULL,
    display_flag  BOOLEAN             NOT NULL DEFAULT false,
    created_at TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP           NULL

    CONSTRAINT chk_image_path CHECK (image_path <> '')
);

COMMENT ON TABLE images IS '画像テーブル';
COMMENT ON COLUMN images.id IS 'ID';
COMMENT ON COLUMN images.image_path IS '画像パス';
COMMENT ON COLUMN images.display_flag IS '表示フラグ';
COMMENT ON COLUMN images.created_at IS '登録日時';
COMMENT ON COLUMN images.updated_at IS '更新日時';
COMMENT ON COLUMN images.deleted_at IS '削除日時';
