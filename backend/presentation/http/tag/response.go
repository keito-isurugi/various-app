package tag

type getTagResponse struct {
	Image tagResponseModel `json:"tag"`
}

type tagResponseModel struct {
	ID  int    `json:"id"`
	Name string `json:"name"`
}
