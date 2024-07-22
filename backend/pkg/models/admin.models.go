package models

import "time"

type Admin struct {
	ID         uint      `json:"id" gorm:"primaryKey;not null"`
	UserName   string    `json:"user_name" gorm:"not null" binding:"required,min=0,max=15"`
	DayOfBirth time.Time `json:"day_of_birth" binding:"omitempty"`
	Email      string    `json:"email" gorm:"not null" binding:"required,email"`
	FullName   string    `json:"full_name" binding:"omitempty"`
	Password   string    `json:"password" gorm:"not null" binding:"required,min=5,max=30"`
	CreatedAt  time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt  time.Time `json:"updated_at"`
}
