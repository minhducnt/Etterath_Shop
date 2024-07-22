package requests

import (
	"mime/multipart"
	"time"
)

type Coupon struct {
	CouponName       string                `json:"coupon_name" binding:"required,min=0,max=25"`
	Description      string                `json:"description"  binding:"omitempty,min=6,max=100000"`
	ExpireDate       time.Time             `json:"expire_date" binding:"required"`
	DiscountRate     uint                  `json:"discount_rate"  binding:"required,numeric,min=1,max=100"`
	MinimumCartPrice uint                  `json:"minimum_cart_price"  binding:"required,numeric,min=1"`
	Image            *multipart.FileHeader `json:"image" binding:"omitempty"`
	BlockStatus      bool                  `json:"block_status"`
}
type EditCoupon struct {
	CouponID         uint                  `json:"coupon_id"`
	CouponName       string                `json:"exp" binding:"required,min=0,max=25"`
	Description      string                `json:"description"  binding:"omitempty,min=6,max=100000"`
	ExpireDate       time.Time             `json:"expire_date" binding:"required"`
	DiscountRate     uint                  `json:"discount_rate"  binding:"required,numeric,min=1,max=100"`
	MinimumCartPrice uint                  `json:"minimum_cart_price"  binding:"required,numeric,min=1"`
	Image            *multipart.FileHeader `json:"image" binding:"omitempty"`
	BlockStatus      bool                  `json:"block_status"`
}

type ApplyCoupon struct {
	CouponCode string `json:"coupon_code" binding:"required"`
}
