package models

import "time"

// represent a model of product
type Product struct {
	ID             uint      `json:"id" gorm:"primaryKey;not null"`
	Name           string    `json:"product_name" gorm:"not null" binding:"required,min=0,max=256"`
	Description    string    `json:"description" gorm:"not null" binding:"required,min=10,max=10000"`
	Properties     string    `json:"properties" binding:"omitempty"`
	CategoryID     uint      `json:"category_id" binding:"omitempty,numeric"`
	Category       Category  `json:"-"`
	BrandID        uint      `gorm:"not null"`
	Brand          Brand     `json:"-"`
	Price          uint      `json:"price" gorm:"not null" binding:"required,numeric"`
	PuschargePrice uint      `json:"puscharge_price" binding:"required,numeric"`
	DiscountPrice  uint      `json:"discount_price"`
	CreatedAt      time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// this for a specific variant of product
// like a product is a T-shirt and productItem is a T-shirt of large size
type Variation struct {
	ID               uint              `json:"variation_id"`
	CategoryID       uint              `json:"category_id"`
	Name             string            `json:"variation_name"`
	VariationOptions []VariationOption `gorm:"-"`
}

// this for a specific variant option of product
// like a product is a T-shirt and productItem is a T-shirt of large size
type VariationOption struct {
	ID          uint   `json:"variation_option_id"`
	VariationID uint   `json:"variation_id"`
	Value       string `json:"variation_value"`
}

type ProductItem struct {
	ID          uint `json:"id" gorm:"primaryKey;not null"`
	ProductID   uint `json:"product_id" gorm:"not null" binding:"required,numeric"`
	Product     Product
	QtyInStock  uint      `json:"qty_in_stock" gorm:"not null" binding:"required,numeric"`
	QtyOutStock uint      `json:"qty_out_stock" binding:"required,numeric"`
	SKU         string    `json:"sku" gorm:"unique;not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type ProductConfiguration struct {
	ProductItemID     uint `json:"product_item_id" binding:"required,numeric"`
	VariationOptionID uint `json:"variation_option_id" binding:"required,numeric"`
}

// for a products category main and sub category as self joining
type Category struct {
	ID         uint      `json:"-" gorm:"primaryKey;not null"`
	CategoryID uint      `json:"category_id"`
	Category   *Category `json:"-"`
	Name       string    `json:"category_name" gorm:"not null" binding:"required,min=1,max=256"`
}

type Brand struct {
	ID   uint   `json:"id" gorm:"primaryKey;not null"`
	Name string `json:"brand_name" gorm:"unique;not null"`
}

// to store a url of productItem Id along a unique url
// so we can ote multiple images url for a ProductItem
// one to many connection
type ProductImage struct {
	ID        uint    `json:"id" gorm:"primaryKey;not null"`
	ProductID uint    `json:"product" gorm:"not null"`
	Product   Product `json:"-"`
	Image     string  `json:"image" gorm:"not null"`
}

// offer
type Offer struct {
	ID           uint      `json:"id" gorm:"primaryKey;not null" swaggerignore:"true"`
	Name         string    `json:"offer_name" gorm:"not null;unique" binding:"required"`
	Description  string    `json:"description" gorm:"not null" binding:"required,min=6,max=100000"`
	DiscountRate uint      `json:"discount_rate" gorm:"not null" binding:"required,numeric,min=1,max=100"`
	StartDate    time.Time `json:"start_date" gorm:"not null" binding:"required"`
	EndDate      time.Time `json:"end_date" gorm:"not null" binding:"required,gtfield=StartDate"`
}

type OfferCategory struct {
	ID         uint     `json:"id" gorm:"primaryKey;not null"`
	OfferID    uint     `json:"offer_id" gorm:"not null"`
	Offer      Offer    `json:"-"`
	CategoryID uint     `json:"category_id" gorm:"not null"`
	Category   Category `json:"-"`
}

type OfferProduct struct {
	ID        uint `json:"id" gorm:"primaryKey;not null"`
	OfferID   uint `json:"offer_id" gorm:"not null"`
	Offer     Offer
	ProductID uint `json:"product_id" gorm:"not null"`
	Product   Product
}

type Variations struct {
	ID         uint   `json:"id" gorm:"primaryKey;not null"`
	CategoryID uint   `json:"category_id" gorm:"not null"`
	Name       string `json:"name" gorm:"not null"`
}

type VariationOptions struct {
	ID          uint   `json:"id" gorm:"primaryKey;not null"`
	VariationID uint   `json:"variation_id" gorm:"not null"`
	Value       string `json:"value" gorm:"not null"`
}

type Comment struct {
	ID        int64 `json:"id" gorm:"primaryKey;not null"`
	UserID    uint  `json:"user_id" gorm:"not null"`
	User      User
	ProductID uint      `json:"product_id" gorm:"not null"`
	Product   Product   `json:"-"`
	Content   string    `json:"content"`
	Rating    *float32  `json:"rating" binding:"omitempty,min=0.0,max=5.0"`
	CreatedAt time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt time.Time `json:"updated_at"`
}
