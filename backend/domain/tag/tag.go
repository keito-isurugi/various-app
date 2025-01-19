package tag

import "time"

type Tag struct {
	ID        int    `gorm:"primaryKey"`
	Name      string `gorm:"column:name"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

type ListTags []Tag

func NewTag(
	id int,
	name string,
	createdAt time.Time,
	updatedAt time.Time,
) *Tag {
	return &Tag{
		ID:        id,
		Name:      name,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
}
