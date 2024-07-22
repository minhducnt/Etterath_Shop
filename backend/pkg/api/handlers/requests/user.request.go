package requests

import "time"

type UserSignUp struct {
	UserName        string     `json:"user_name"  binding:"required,min=0,max=256"`
	FirstName       string     `json:"first_name"  binding:"required,min=2,max=256"`
	LastName        string     `json:"last_name"  binding:"required,min=1,max=256"`
	Email           string     `json:"email" binding:"required,email"`
	Phone           string     `json:"phone" binding:"required,min=8,max=12"`
	DayOfBirth      *time.Time `json:"day_of_birth" binding:"omitempty"`
	Password        string     `json:"password"  binding:"required,eqfield=ConfirmPassword"`
	ConfirmPassword string     `json:"confirm_password" binding:"required"`
}

// for address add address
type Address struct {
	Name          string `json:"name" binding:"required,min=2,max=256"`
	PhoneNumber   string `json:"phone_number" binding:"required,min=10,max=10"`
	DetailAddress string `json:"detail_address" binding:"required"`
	Commune       string `json:"commune"`
	District      string `json:"district" binding:"required"`
	Province      string `json:"province"`
	Pincode       uint   `json:"pincode" binding:"required"`
	CountryID     uint   `json:"country_id" binding:"required"`
	IsDefault     *bool  `json:"is_default"`
}
type EditAddress struct {
	ID            uint   `json:"address_id" binding:"required"`
	Name          string `json:"name" binding:"required,min=2,max=256"`
	PhoneNumber   string `json:"phone_number" binding:"required,min=10,max=10"`
	DetailAddress string `json:"detail_address" binding:"required"`
	Commune       string `json:"commune"`
	District      string `json:"district" binding:"required"`
	Province      string `json:"province"`
	Pincode       uint   `json:"pincode" binding:"required"`
	CountryID     uint   `json:"country_id" binding:"required"`

	IsDefault *bool `json:"is_default"`
}

// user side
type Cart struct {
	UserID        uint `json:"-"`
	ProductItemID uint `json:"product_item_id" binding:"required"`
}

type UpdateCartItem struct {
	UserID        uint `json:"-"`
	ProductItemID uint `json:"product_item_id" binding:"required"`
	Count         uint `json:"count" binding:"omitempty,gte=1"`
}

type EditUser struct {
	UserName        string    `json:"user_name"  binding:"required,min=0,max=256"`
	FirstName       string    `json:"first_name"  binding:"required,min=2,max=256"`
	LastName        string    `json:"last_name"  binding:"required,min=1,max=256"`
	DayOfBirth      time.Time `json:"day_of_birth"  binding:"omitempty"`
	Email           string    `json:"email" binding:"required,email"`
	Phone           string    `json:"phone" binding:"required,min=10,max=10"`
	Password        string    `json:"password"  binding:"omitempty,eqfield=ConfirmPassword"`
	ConfirmPassword string    `json:"confirm_password" binding:"omitempty"`
}
