package requests

import "time"

type Login struct {
	UserName string `json:"user_name" binding:"omitempty,min=0,max=256"`
	Phone    string `json:"phone" binding:"omitempty,min=10,max=10"`
	Email    string `json:"email" binding:"omitempty,email"`
	Password string `json:"password" binding:"required,min=5,max=30"`
}

type Admin struct {
	UserName   string    `json:"user_name"`
	DayOfBirth time.Time `json:"day_of_birth" binding:"omitempty"`
	Email      string    `json:"email"`
	FullName   string    `json:"full_name"`
	UpdatedAt  time.Time `json:"updated_at" binding:"omitempty"`
	Password   string    `json:"password" binding:"omitempty,min=5,max=30"`
}

type RefreshToken struct {
	RefreshToken string `json:"refresh_token" binding:"min=10"`
}
