package image

type getUntaggedImagesByTagsRequest struct {
	TagIDs []int `json:"tag_ids" example:"[10, 20, 30]" ja:"タグIDのリスト" validate:"required,min=1"`
}
