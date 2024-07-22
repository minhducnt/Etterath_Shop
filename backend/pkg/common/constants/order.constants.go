package common

// for defining ENUM stasues
type OrderStatusType string

// payment types
type PaymentType string

const (
	// order status
	StatusPaymentPending  OrderStatusType = "payment pending"
	StatusOrderPlaced     OrderStatusType = "order placed"
	StatusOrderCancelled  OrderStatusType = "order cancelled"
	StatusOrderDelivered  OrderStatusType = "order delivered"
	StatusReturnRequested OrderStatusType = "return requested"
	StatusReturnApproved  OrderStatusType = "return approved"
	StatusReturnCancelled OrderStatusType = "return cancelled"
	StatusOrderReturned   OrderStatusType = "order returned"

	// payment type
	RazorpayPayment       PaymentType = "razor pay"
	RazorPayMaximumAmount             = 200000000 // this is only for initial admin can later change this
	CodPayment            PaymentType = "cod"
	CodMaximumAmount                  = 200000000
	StripePayment         PaymentType = "stripe"
	StripeMaximumAmount               = 200000000
)
