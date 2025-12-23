package image

import (
	tagDomain "github.com/keito-isurugi/various-app/domain/tag"
	"time"
)

type Image struct {
	ID          int    `gorm:"primaryKey"`
	ImagePath   string `gorm:"column:image_path"`
	DisplayFlag bool   `gorm:"column:display_flag"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   *time.Time
	Tags        []tagDomain.Tag `gorm:"many2many:image_tags;joinForeignKey:ImageID;JoinReferences:TagID"`
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

type ListImagesNoTaggedTags struct {
	TagIDs []int
}
