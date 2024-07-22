package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type PaymentUseCase interface {
	FindAllPaymentMethods(ctx context.Context) ([]models.PaymentMethod, error)
	FindPaymentMethodByID(ctx context.Context, paymentMethodID uint) (models.PaymentMethod, error)
	UpdatePaymentMethod(ctx context.Context, paymentMethod requests.PaymentMethodUpdate) error

	// razorpay
	MakeRazorpayOrder(ctx context.Context, userID, shopOrderID uint) (razorpayOrder responses.RazorpayOrder, err error)
	VerifyRazorPay(ctx context.Context, verifyReq requests.RazorpayVerify) error
	// stipe
	MakeStripeOrder(ctx context.Context, userID, shopOrderID uint) (stipeOrder responses.StripeOrder, err error)
	VerifyStripOrder(ctx context.Context, stripePaymentID string) error

	ApproveShopOrderAndClearCart(ctx context.Context, userID uint, approveDetails requests.ApproveOrder) error
}
