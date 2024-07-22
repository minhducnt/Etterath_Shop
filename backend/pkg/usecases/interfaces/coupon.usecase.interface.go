package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type CouponUseCase interface {
	// coupon
	AddCoupon(ctx context.Context, coupon requests.Coupon) error
	GetAllCoupons(ctx context.Context, pagination requests.Pagination) (coupons []models.Coupon, err error)
	UpdateCoupon(ctx context.Context, coupon requests.EditCoupon) (models.Coupon, error)

	//user side coupons
	GetCouponsForUser(ctx context.Context, userID uint, pagination requests.Pagination) (coupons []responses.UserCoupon, err error)

	GetCouponByCouponCode(ctx context.Context, couponCode string) (coupon models.Coupon, err error)
	ApplyCouponToCart(ctx context.Context, userID uint, couponCode string) (discountPrice uint, err error)
}
