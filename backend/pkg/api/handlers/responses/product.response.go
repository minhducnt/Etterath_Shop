package responses

import (
	"encoding/json"
	"time"
)

// response for product
type Product struct {
	ID               uint      `json:"product_id"`
	CategoryID       uint      `json:"category_id"`
	Price            uint      `json:"price"`
	PuschargePrice   uint      `json:"puscharge_price"`
	DiscountPrice    uint      `json:"discount_price"`
	Name             string    `json:"product_name"`
	Description      string    `json:"description" `
	Properties       string    `json:"properties"`
	CategoryName     string    `json:"category_name"`
	MainCategoryId   uint      `json:"main_category_id"`
	MainCategoryName string    `json:"main_category_name"`
	BrandID          uint      `json:"brand_id"`
	BrandName        string    `json:"brand_name"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	Images           []string  `json:"images" gorm:"-"`
}

type ProductResponse struct {
	ID               uint            `json:"product_id"`
	CategoryID       uint            `json:"category_id"`
	Price            uint            `json:"price"`
	PuschargePrice   uint            `json:"puscharge_price"`
	DiscountPrice    uint            `json:"discount_price"`
	Name             string          `json:"product_name"`
	Description      string          `json:"description" `
	Properties       json.RawMessage `json:"properties"`
	CategoryName     string          `json:"category_name"`
	MainCategoryId   uint            `json:"main_category_id"`
	MainCategoryName string          `json:"main_category_name"`
	BrandID          uint            `json:"brand_id"`
	BrandName        string          `json:"brand_name"`
	CreatedAt        time.Time       `json:"created_at"`
	UpdatedAt        time.Time       `json:"updated_at"`
	Images           []string        `json:"images" gorm:"-"`
}

// for a specific category representation
type Category struct {
	ID          uint          `json:"category_id"`
	Name        string        `json:"category_name"`
	SubCategory []SubCategory `json:"sub_category" gorm:"-"`
}

type SubCategory struct {
	ID   uint   `json:"sub_category_id"`
	Name string `json:"sub_category_name"`
}

// for a specific variation representation
type Variation struct {
	ID               uint              `json:"variation_id"`
	Name             string            `json:"variation_name"`
	VariationOptions []VariationOption `json:"options" gorm:"-"`
}

// for a specific variation Value representation
type VariationOption struct {
	ID    uint   `json:"variation_option_id"`
	Value string `json:"variation_value"`
}

// for response a specific products all product items
type ProductItems struct {
	ID               uint                    `json:"product_item_id"`
	Name             string                  `json:"product_name"`
	ProductID        uint                    `json:"product_id"`
	SKU              string                  `json:"sku"`
	QtyInStock       uint                    `json:"qty_in_stock"`
	QtyOutStock      uint                    `json:"qty_out_stock"`
	CategoryName     string                  `json:"category_name"`
	MainCategoryName string                  `json:"main_category_name"`
	BrandID          uint                    `json:"brand_id"`
	BrandName        string                  `json:"brand_name"`
	VariationValues  []ProductVariationValue `json:"variation_values" gorm:"-"`
}

type ProductVariationValue struct {
	VariationID       uint   `json:"variation_id"`
	Name              string `json:"variation_name"`
	VariationOptionID uint   `json:"variation_option_id"`
	Value             string `json:"variation_value"`
}

// offer response
type OfferCategory struct {
	OfferCategoryID uint   `json:"offer_category_id"`
	CategoryID      uint   `json:"category_id"`
	CategoryName    string `json:"category_name"`
	DiscountRate    uint   `json:"discount_rate"`
	OfferID         uint   `json:"offer_id"`
	OfferName       string `json:"offer_name"`
}

type OfferProduct struct {
	OfferProductID uint   `json:"offer_product_id"`
	ProductID      uint   `json:"product_id"`
	ProductName    string `json:"product_name"`
	DiscountRate   uint   `json:"discount_rate"`
	DiscountPrice  uint   `json:"discount_price"`
	OfferID        uint   `json:"offer_id"`
	OfferName      string `json:"offer_name"`
}

type Comment struct {
	ID        uint   `json:"id"`
	ProductID uint   `json:"product_id" binding:"required"`
	UserID    uint   `json:"user_id" binding:"required"`
	User      User   `json:"user"`
	Content   string `json:"content" binding:"omitempty"`
	Rating    string `json:"rating" binding:"omitempty"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type ProductOffer struct {
	// product
	ID               uint      `json:"product_id"`
	CategoryID       uint      `json:"category_id"`
	Price            uint      `json:"price"`
	DiscountPrice    uint      `json:"discount_price"`
	Name             string    `json:"product_name"`
	Description      string    `json:"description" `
	CategoryName     string    `json:"category_name"`
	MainCategoryId   uint      `json:"main_category_id"`
	MainCategoryName string    `json:"main_category_name"`
	BrandID          uint      `json:"brand_id"`
	BrandName        string    `json:"brand_name"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	Images           []string  `json:"images" gorm:"-"`

	// offer
	OfferID      uint   `json:"offer_id"`
	DiscountRate uint   `json:"discount_rate"`
	OfferName    string `json:"offer_name"`
	OfferDate    string `json:"offer_date"`
	EndDate      string `json:"end_date"`
}
