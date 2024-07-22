package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type CouponRepository interface {
	CheckCouponDetailsAlreadyExist(ctx context.Context, coupon models.Coupon) (couponID uint, err error)
	FindCouponByID(ctx context.Context, couponID uint) (coupon models.Coupon, err error)

	FindCouponByCouponCode(ctx context.Context, couponCode string) (coupon models.Coupon, err error)
	FindCouponByName(ctx context.Context, couponName string) (coupon models.Coupon, err error)

	FindAllCoupons(ctx context.Context, pagination requests.Pagination) (coupons []models.Coupon, err error)
	SaveCoupon(ctx context.Context, coupon models.Coupon) error
	UpdateCoupon(ctx context.Context, coupon models.Coupon) (models.Coupon, error)

	// uses coupon
	FindCouponUsesByCouponAndUserID(ctx context.Context, userID, couopnID uint) (couponUses models.CouponUses, err error)
	SaveCouponUses(ctx context.Context, couponUses models.CouponUses) error

	// find all coupon for user
	FindAllCouponForUser(ctx context.Context, userID uint, pagination requests.Pagination) (coupons []responses.UserCoupon, err error)
}
