package tag

type registerTagRequest struct {
	Name string `json:"name" example:"タグ名" ja:"タグ名" validate:"required,max=255"`
}

type updateTagRequest struct {
	ID    int    `param:"id" example:"1" ja:"タグID" validate:"required"`
	Name string `json:"name" example:"タグ名" ja:"タグ名" validate:"required,max=255"`
}
