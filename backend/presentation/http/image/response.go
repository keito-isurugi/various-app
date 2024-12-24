package image

type getImageResponse struct {
	Image imageResponseModel `json:"images"`
}

type imageResponseModel struct {
	ID          int    `json:"id"`
	ImagePath   string `json:"image_path"`
	DisplayFlag bool `json:"display_flag"`
}
