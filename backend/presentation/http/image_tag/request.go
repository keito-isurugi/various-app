package image_tag

type registerImageTagRequest struct {
	ImageID int `param:"image_id" example:"1" ja:"画像ID" validate:"required"`
	TagID   int `param:"tag_id" example:"タグ名" ja:"タグID" validate:"required"`
}

type updateMultipleImageTagsRequest struct {
	ImageIDs []int `json:"image_ids" example:"[1, 2, 3]" ja:"画像IDのリスト" validate:"required,min=1"`
	TagIDs   []int `json:"tag_ids" example:"[10, 20, 30]" ja:"タグIDのリスト" validate:"required,min=1"`
}
