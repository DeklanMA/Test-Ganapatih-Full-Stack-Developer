package models

import "time"

type User struct {
    ID        uint      `gorm:"primaryKey"`
    Username  string    `gorm:"uniqueIndex;size:50"`
    Password  string    `gorm:"column:password_hash"`
    CreatedAt time.Time
}

type SuggestedUser struct {
	ID         uint   `json:"id"`
	Username   string `json:"username"`
	IsFollowed bool   `json:"is_followed"`
}