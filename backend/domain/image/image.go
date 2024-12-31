package image

import "time"

type Image struct {
	ID          int
	ImagePath   string
	DisplayFlag bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
}

type ListImages []Image

func NewImage(
	id int,
	imagePath string,
	displayFlag bool,
	createdAt time.Time,
	updatedAt time.Time,
) *Image {
	return &Image{
		ID:          id,
		ImagePath:   imagePath,
		DisplayFlag: displayFlag,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}
}

// func (i *Image) ID() int {
// 	return i.id
// }

// func (i *Image) ImagePath() string {
// 	return i.imagePath
// }

// func (i *Image) DisplayFlag() bool {
// 	return i.displayFlag
// }