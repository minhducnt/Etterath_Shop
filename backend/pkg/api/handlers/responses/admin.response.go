package responses

import "time"

var ResoposeMap map[string]string

// admin
type AdminLogin struct {
	ID       uint   `json:"id" `
	UserName string `json:"user_name"`
	Email    string `json:"email"`
}

type Admin struct {
	ID         uint      `json:"id"`
	UserName   string    `json:"user_name"`
	DayOfBirth time.Time `json:"day_of_birth" binding:"omitempty"`
	Email      string    `json:"email"`
	FullName   string    `json:"full_name"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at" binding:"omitempty"`
}

// reponse for get all variations with its respective category

type SalesReport struct {
	UserID          uint      `json:"user_id"`
	FirstName       string    `json:"first_name"`
	Email           string    `json:"email"`
	ShopOrderID     uint      `json:"order_id"`
	OrderDate       time.Time `json:"order_date"`
	OrderTotalPrice uint      `json:"order_total_price"`
	Discount        uint      `json:"discount_price"`
	OrderStatus     string    `json:"order_status"`
	PaymentType     string    `json:"payment_type"`
}

type Stock struct {
	ProductItemID    uint              `json:"product_item_id"`
	ProductName      string            `json:"product_name"`
	Price            uint              `json:"price"`
	PuschargePrice   uint              `json:"puscharge_price"`
	DiscountPrice    uint              `json:"discount_price"`
	SKU              string            `json:"sku"`
	QtyInStock       uint              `json:"qty_in_stock"`
	QtyOutStock      uint              `json:"qty_out_stock" binding:"omitempty"`
	VariationOptions []VariationOption `gorm:"-"`
}
