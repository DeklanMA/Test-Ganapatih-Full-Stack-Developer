package models

import "time"

type Post struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    UserID    uint      `json:"user_id"`
    Content   string    `gorm:"size:200" json:"content"`
    CreatedAt time.Time `json:"created_at"`
}

type Posts struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    UserID    uint      `json:"user_id"`
    Username  string    `gorm:"column:username" json:"username"` 
    Content   string    `gorm:"size:200" json:"content"`
    CreatedAt time.Time `json:"created_at"`
}
