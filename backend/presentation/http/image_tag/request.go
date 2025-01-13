package image_tag

type registerImageTagRequest struct {
	ImageID int `param:"image_id" example:"1" ja:"画像ID" validate:"required"`
	TagID   int `param:"tag_id" example:"タグ名" ja:"タグID" validate:"required"`
}

type updateImageTagRequest struct {
	ID   int    `param:"id" example:"1" ja:"タグID" validate:"required"`
	Name string `json:"name" example:"タグ名" ja:"タグ名" validate:"required,max=255"`
}
