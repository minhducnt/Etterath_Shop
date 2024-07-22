package responses

import "time"

type Coupon struct {
	CouponID         uint      `json:"coupon_id" gorm:"primaryKey;not null"`
	CouponName       string    `json:"coupon_name" gorm:"unique;not null" binding:"required,min=0,max=256"`
	CouponCode       string    `json:"coupon_code" gorm:"unique;not null"`
	ExpireDate       time.Time `json:"expire_date" gorm:"not null"`
	Description      string    `json:"description" gorm:"not null" binding:"required,min=6,max=256"`
	DiscountRate     uint      `json:"discount_rate" gorm:"not null" binding:"required,numeric,min=1,max=100"`
	MinimumCartPrice uint      `json:"minimum_cart_price" gorm:"not null" binding:"required,numeric,min=1"`
	Image            string    `json:"image" binding:"omitempty"`
	BlockStatus      bool      `json:"block_status" gorm:"not null"`
	CreatedAt        time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type UserCoupon struct {
	CouponID   uint   `json:"coupon_id"`
	CouponCode string `json:"coupon_code" `
	CouponName string `json:"coupon_name"`

	ExpireDate       time.Time `json:"expire_date"`
	Description      string    `json:"description"`
	DiscountRate     uint      `json:"discount_rate"`
	MinimumCartPrice uint      `json:"minimum_cart_price"`
	Image            string    `json:"image" binding:"required"`
	BlockStatus      bool      `json:"block_status"`

	Used   bool      `json:"used"`
	UsedAt time.Time `json:"used_at"`
}
