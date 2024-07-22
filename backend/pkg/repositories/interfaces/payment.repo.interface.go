package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	commonConstant "etterath_shop_feature/pkg/common/constants"
	"etterath_shop_feature/pkg/models"
)

type PaymentRepository interface {
	FindPaymentMethodByID(ctx context.Context, paymentMethodID uint) (paymentMethods models.PaymentMethod, err error)
	FindPaymentMethodByType(ctx context.Context, paymentType commonConstant.PaymentType) (paymentMethod models.PaymentMethod, err error)
	FindAllPaymentMethods(ctx context.Context) ([]models.PaymentMethod, error)
	UpdatePaymentMethod(ctx context.Context, paymentMethod requests.PaymentMethodUpdate) error
}
