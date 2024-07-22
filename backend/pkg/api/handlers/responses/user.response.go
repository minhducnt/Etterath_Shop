package responses

import "time"

// user details response
type User struct {
	ID          uint      `json:"id" copier:"must"`
	GoogleImage string    `json:"google_profile_image"`
	FirstName   string    `json:"first_name" copier:"must"`
	LastName    string    `json:"last_name" copier:"must"`
	Age         uint      `json:"age" copier:"must"`
	Email       string    `json:"email" copier:"must"`
	UserName    string    `json:"user_name" copire:"must"`
	Phone       string    `json:"phone" copier:"must"`
	Verified    bool      `json:"verified"`
	BlockStatus bool      `json:"block_status" copier:"must"`
	CreatedAt   time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CartItem struct {
	ProductItemId uint   `json:"product_item_id"`
	ProductName   string `json:"product_name"`
	Price         uint   `json:"price"`
	DiscountPrice uint   `json:"discount_price"`
	QtyInStock    uint   `json:"qty_in_stock"`
	Qty           uint   `json:"qty"`
	SubTotal      uint   `json:"sub_total"`
}

type Cart struct {
	CartItems       []CartItem
	AppliedCouponID uint `json:"applied_coupon_id"`
	TotalPrice      uint `json:"total_price"`
	DiscountAmount  uint `json:"discount_amount"`
}

// address
type Address struct {
	ID            uint   `json:"address_id"`
	Name          string `json:"name" binding:"required,min=2,max=256"`
	PhoneNumber   string `json:"phone_number" binding:"required,min=10,max=10"`
	DetailAddress string `json:"detail_address" binding:"required"`
	Commune       string `json:"commune"`
	District      string `json:"district" binding:"required"`
	Province      string `json:"province"`
	Pincode       uint   `json:"pincode" binding:"required"`
	CountryID     uint   `json:"country_id" binding:"required"`
	CountryName   string `json:"country_name"`

	IsDefault *bool `json:"is_default"`
}

// wish list response
type WishListItem struct {
	ID              uint                    `json:"wish_list_id"`
	ProductItemID   uint                    `json:"product_item_id"`
	Name            string                  `json:"product_name"`
	ProductID       uint                    `json:"product_id"`
	Price           uint                    `json:"price"`
	DiscountPrice   uint                    `json:"discount_price"`
	SKU             string                  `json:"sku"`
	QtyInStock      uint                    `json:"qty_in_stock"`
	VariationValues []ProductVariationValue `gorm:"-"`
}
