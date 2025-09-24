package models

import "time"

type UserSession struct {
	ID           uint      `gorm:"primaryKey"`
	UserID       uint
	RefreshToken string    `gorm:"uniqueIndex"`
	ExpiresAt    time.Time
	CreatedAt    time.Time
}
