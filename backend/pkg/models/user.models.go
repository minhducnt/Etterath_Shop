package models

import "time"

type User struct {
	ID          uint      `json:"id" gorm:"primaryKey;unique"`
	DayOfBirth  time.Time `json:"day_of_birth" binding:"omitempty"`
	GoogleImage string    `json:"google_profile_image"`
	FirstName   string    `json:"first_name" binding:"omitempty,min=2,max=256"`
	LastName    string    `json:"last_name" binding:"omitempty,min=1,max=256"`
	UserName    string    `json:"user_name" gorm:"not null;unique" binding:"required,min=0,max=256"`
	Email       string    `json:"email" gorm:"unique;not null" binding:"required,email"`
	Phone       string    `json:"phone" gorm:"unique" binding:"required,min=8,max=12"`
	Password    string    `json:"password" binding:"required"`
	Verified    bool      `json:"verified" gorm:"default:true"`
	BlockStatus bool      `json:"block_status" gorm:"not null;default:false"`
	CreatedAt   time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// many to many join
type UserAddress struct {
	ID        uint `json:"id" gorm:"primaryKey;unique"`
	UserID    uint `json:"user_id" gorm:"not null"`
	User      User
	AddressID uint `json:"address_id" gorm:"not null"`
	Address   Address
	IsDefault bool `json:"is_default"`
}

type Address struct {
	ID            uint   `json:"id" gorm:"primaryKey;unique"`
	Name          string `json:"name" gorm:"not null" binding:"required,min=2,max=256"`
	PhoneNumber   string `json:"phone_number" gorm:"not null" binding:"required,min=10,max=10"`
	DetailAddress string `json:"detail_address" gorm:"not null" binding:"required"`
	Commune       string `json:"commune" gorm:"not null"`
	District      string `json:"district" gorm:"not null" binding:"required"`
	Province      string `json:"province" gorm:"not null"`
	Pincode       uint   `json:"pincode" binding:"omitempty,numeric,min=6,max=6"`
	CountryID     uint   `json:"country_id" gorm:"not null" binding:"required"`
	Country       Country
	CreatedAt     time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Country struct {
	ID          uint   `json:"id" gorm:"primaryKey;unique;"`
	CountryName string `json:"country_name" gorm:"unique;not null"`
}

// Wish List
type WishList struct {
	ID            uint `json:"id" gorm:"primaryKey;not null"`
	UserID        uint `json:"user_id" gorm:"not null"`
	User          User
	ProductItemID uint `json:"product_item_id" gorm:"not null"`
	ProductItem   ProductItem
}

type Cart struct {
	ID              uint `json:"id" gorm:"primaryKey;not null"`
	UserID          uint `json:"user_id" gorm:"not null"`
	TotalPrice      uint `json:"total_price" gorm:"not null"`
	AppliedCouponID uint `json:"applied_coupon_id"`
	DiscountAmount  uint `json:"discount_amount"`
}

type CartItem struct {
	ID            uint `json:"id" gorm:"primaryKey;not null"`
	CartID        uint `json:"cart_id"`
	Cart          Cart
	ProductItemID uint        `json:"product_item_id" gorm:"not null"`
	ProductItem   ProductItem `json:"-"`
	Qty           uint        `json:"qty" gorm:"not null"`
}

// wallet start
// for ENUM Data type
type Wallet struct {
	ID          uint `json:"wallet_id" gorm:"primaryKey;not null"`
	UserID      uint `json:"user_id" gorm:"not null"`
	User        User `json:"-"`
	TotalAmount uint `json:"total_amount" gorm:"not null"`
}

type TransactionType string

const (
	Debit  TransactionType = "DEBIT"
	Credit TransactionType = "CREDIT"
)

type Transaction struct {
	TransactionID   uint            `json:"transaction_id" gorm:"primaryKey;not null"`
	WalletID        uint            `json:"wallet_id" gorm:"not null"`
	Wallet          Wallet          `json:"-"`
	TransactionDate time.Time       `json:"transaction_time" gorm:"not null"`
	Amount          uint            `json:"amount" gorm:"not null"`
	TransactionType TransactionType `json:"transaction_type" gorm:"not null"`
}

// wallet end
