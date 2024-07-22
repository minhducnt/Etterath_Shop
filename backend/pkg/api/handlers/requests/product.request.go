package requests

import "mime/multipart"

// for a new product
type Product struct {
	Name             string                  `json:"product_name" binding:"required,min=0,max=256"`
	Description      string                  `json:"description" binding:"required,min=10,max=10000"`
	CategoryID       uint                    `json:"category_id" binding:"required"`
	BrandID          uint                    `json:"brand_id" binding:"required"`
	Price            uint                    `json:"price" binding:"required,numeric"`
	PuschargePrice   uint                    `json:"puscharge_price" binding:"required,numeric"`
	ImageFileHeaders []*multipart.FileHeader `json:"images" binding:"required,gte=1"`
	Properties       string                  `json:"properties" binding:"omitempty"`
}

type UpdateProduct struct {
	ID               uint                    `json:"product_id" binding:"required"`
	Name             string                  `json:"product_name" binding:"required,min=0,max=256"`
	Description      string                  `json:"description" binding:"required,min=10,max=10000"`
	CategoryID       uint                    `json:"category_id" binding:"required"`
	BrandID          uint                    `json:"brand_id" binding:"required"`
	Price            uint                    `json:"price" binding:"required,numeric"`
	PuschargePrice   uint                    `json:"puscharge_price" binding:"required,numeric"`
	ImageFileHeaders []*multipart.FileHeader `json:"images" binding:"omitempty,gte=1"`
	Properties       string                  `json:"properties" binding:"omitempty"`
}

// for a new productItem
type ProductItem struct {
	VariationOptionIDs []uint `json:"variation_option_ids" binding:"required,gte=1"`
	QtyInStock         uint   `json:"qty_in_stock" binding:"omitempty"`
	QtyOutStock        uint   `json:"qty_out_stock" binding:"omitempty"`
	SKU                string `json:"-"`
}

type UpdateProductItem struct {
	ID                 uint   `json:"product_item_id" binding:"required"`
	ProductID          uint   `json:"product_id" binding:"required"`
	VariationOptionIDs []uint `json:"variation_option_ids" binding:"required,gte=1"`
	QtyInStock         uint   `json:"qty_in_stock" binding:"omitempty"`
	QtyOutStock        uint   `json:"qty_out_stock" binding:"omitempty"`
	SKU                string `json:"-"`
}

type Variation struct {
	Names []string `json:"variation_names" binding:"required,dive,min=1"`
}

type UpdateVariation struct {
	Name string `json:"variation_name" binding:"required"`
}

type VariationOption struct {
	Values []string `json:"variation_value" binding:"required,dive,min=1"`
}

type UpdateVariationOption struct {
	Value string `json:"variation_value" binding:"required"`
}

type Category struct {
	Name string `json:"category_name" binding:"required"`
}

type SubCategory struct {
	CategoryID uint   `json:"category_id" binding:"required"`
	Name       string `json:"category_name" binding:"required"`
}

type Brand struct {
	Name string `json:"brand_name" binding:"required,min=0,max=256"`
}

type Comment struct {
	UserID  uint     `json:"user_id" binding:"required"`
	Content string   `json:"content" binding:"omitempty"`
	Rating  *float32 `json:"rating" binding:"omitempty,min=0.0,max=5.0"`
}

type UpdateComment struct {
	ProductID uint     `json:"product_id" binding:"required"`
	UserID    uint     `json:"user_id" binding:"required"`
	Content   string   `json:"content" binding:"omitempty"`
	Rating    *float32 `json:"rating" binding:"omitempty,min=0.0,max=5.0"`
}
