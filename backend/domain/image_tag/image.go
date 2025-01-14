package image_tag

import "time"

type ImageTag struct {
	ID        int
	ImageID   int
	TagID     int
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

type ListImageTags []ImageTag

func NewImageTag(
	id int,
	imageID int,
	tagID int,
	createdAt time.Time,
	updatedAt time.Time,
) *ImageTag {
	return &ImageTag{
		ID:        id,
		ImageID:   imageID,
		TagID:     tagID,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
}

type UpdateMultipleImageTags struct {
	ImageIDs []int
	TagIDs   []int
}
