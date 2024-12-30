-- テーブル作成
CREATE TABLE IF NOT EXISTS image_tags
(
    id          SERIAL PRIMARY KEY NOT NULL,
    image_id    INT                 NOT NULL,
    tag_id      INT                 NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP           NULL,
    
    -- 外部キー制約
    CONSTRAINT fk_image FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
    
    -- 一意制約
    CONSTRAINT uq_image_tag UNIQUE (image_id, tag_id)
);

-- コメント追加
COMMENT ON TABLE image_tags IS '画像, タグ中間テーブル';
COMMENT ON COLUMN image_tags.id IS 'ID';
COMMENT ON COLUMN image_tags.image_id IS '画像ID';
COMMENT ON COLUMN image_tags.tag_id IS 'タグID';
COMMENT ON COLUMN image_tags.created_at IS '登録日時';
COMMENT ON COLUMN image_tags.updated_at IS '更新日時';
COMMENT ON COLUMN image_tags.deleted_at IS '削除日時';