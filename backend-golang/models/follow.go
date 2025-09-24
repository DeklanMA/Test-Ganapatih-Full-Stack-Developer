package models

import "time"

type Follow struct {
	FollowerID uint `gorm:"primaryKey"`
	FolloweeID uint `gorm:"primaryKey"`
	CreatedAt  time.Time
}
