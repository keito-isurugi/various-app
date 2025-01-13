package image_tag

type getImageTagResponse struct {
	ImageTag imageTagResponseModel `json:"image_tags"`
}

type imageTagResponseModel struct {
	ID      int `json:"id"`
	ImageID int `json:"image_id"`
	TagID   int `json:"tag_id"`
}
