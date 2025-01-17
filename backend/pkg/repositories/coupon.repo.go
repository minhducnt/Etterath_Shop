package repositories

import (
	"context"
	"errors"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type couponDatabase struct {
	DB *gorm.DB
}

func NewCouponRepository(db *gorm.DB) interfaces.CouponRepository {
	return &couponDatabase{DB: db}
}

func (c *couponDatabase) CheckCouponDetailsAlreadyExist(ctx context.Context, coupon models.Coupon) (couponID uint, err error) {

	// query := `SELECT coupon_id FROM coupons WHERE (coupon_code = $1 OR coupon_name = $2) AND coupon_id != $3`
	query := `SELECT coupon_id FROM coupons WHERE  coupon_name = $1 AND coupon_id != $2`

	err = c.DB.Raw(query, coupon.CouponName, coupon.CouponID).Scan(&couponID).Error

	return couponID, err
}

// find all coupon
func (c *couponDatabase) FindCouponByID(ctx context.Context, couponID uint) (coupon models.Coupon, err error) {
	query := `SELECT * FROM coupons WHERE coupon_id = $1`
	err = c.DB.Raw(query, couponID).Scan(&coupon).Error

	if err != nil {
		return coupon, err
	}

	return coupon, nil
}

// find coupon by code
func (c *couponDatabase) FindCouponByCouponCode(ctx context.Context, couponCode string) (coupon models.Coupon, err error) {

	query := `SELECT * FROM coupons WHERE coupon_code = $1`

	err = c.DB.Raw(query, couponCode).Scan(&coupon).Error
	if err != nil {
		return coupon, fmt.Errorf("failed to find coupon with coupon_code %v", couponCode)
	}

	return coupon, nil
}

// find coupo by name
func (c *couponDatabase) FindCouponByName(ctx context.Context, couponName string) (coupon models.Coupon, err error) {
	query := `SELECT * FROM coupons WHERE coupon_name = $1`
	err = c.DB.Raw(query, couponName).Scan(&coupon).Error

	if err != nil {
		return coupon, fmt.Errorf("failed to find coupon with coupon_name %v", couponName)
	}

	return coupon, nil
}

func (c *couponDatabase) FindAllCoupons(ctx context.Context, pagination requests.Pagination) (coupons []models.Coupon, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT * FROM coupons ORDER BY created_at DESC LIMIT $1 OFFSET $2`
	err = c.DB.Raw(query, limit, offset).Scan(&coupons).Error
	if err != nil {
		return coupons, errors.New("faild to find coupon")
	}
	return coupons, nil
}

// save a new coupon
func (c *couponDatabase) SaveCoupon(ctx context.Context, coupon models.Coupon) error {
	query := `INSERT INTO coupons (coupon_name, coupon_code, description, expire_date, 
		discount_rate, minimum_cart_price, image, block_status,created_at)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	cratedAt := time.Now()

	err := c.DB.Exec(query, coupon.CouponName, coupon.CouponCode, coupon.Description, coupon.ExpireDate,
		coupon.DiscountRate, coupon.MinimumCartPrice, coupon.Image, coupon.BlockStatus, cratedAt,
	).Error

	if err != nil {
		return fmt.Errorf("faild to save coupon for coupon_name %v", coupon.CouponName)
	}
	return nil
}

// update coupon
func (c *couponDatabase) UpdateCoupon(ctx context.Context, coupon models.Coupon) (models.Coupon, error) {

	updatedCoupon := models.Coupon{}
	query := `UPDATE coupons SET coupon_name = $1, description = $2, discount_rate = $3, 
	minimum_cart_price = $4, image = $5, block_status = $6, updated_at = $7 
	WHERE coupon_id = $8 RETURNING *`

	updatedAt := time.Now()

	err := c.DB.Raw(query, coupon.CouponName, coupon.Description,
		coupon.DiscountRate, coupon.MinimumCartPrice, coupon.Image, coupon.BlockStatus, updatedAt,
		coupon.CouponID,
	).Scan(&updatedCoupon).Error
	if err != nil {
		return updatedCoupon, fmt.Errorf("faild to update coupon for coupon_name %v", coupon.CouponName)
	}
	return updatedCoupon, nil
}

// find couponUses which is also uses for checking a user is a coupon is used or not
func (c *couponDatabase) FindCouponUsesByCouponAndUserID(ctx context.Context, userID, couopnID uint) (couponUses models.CouponUses, err error) {
	query := `SELECT * FROM  coupon_uses WHERE user_id = $1 AND coupon_id = $2`
	err = c.DB.Raw(query, userID, couopnID).Scan(&couponUses).Error
	if err != nil {
		return couponUses, err
	}
	return couponUses, nil
}

// save a couponUses
func (c *couponDatabase) SaveCouponUses(ctx context.Context, couponUses models.CouponUses) error {

	usedAt := time.Now()
	query := `INSERT INTO coupon_uses ( user_id, coupon_id, used_at) VALUES ($1, $2, $3)`
	err := c.DB.Exec(query, couponUses.UserID, couponUses.CouponID, usedAt).Error

	return err
}

// find all coupons for user

func (c *couponDatabase) FindAllCouponForUser(ctx context.Context, userID uint, pagination requests.Pagination) (coupons []responses.UserCoupon, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT c.coupon_id, c.coupon_code, c.coupon_name, c.expire_date, c.description, c.discount_rate, c.minimum_cart_price, 
	c.image, c.block_status, c.coupon_id = cu.coupon_id AS used, cu.used_at FROM coupons c 
	LEFT JOIN coupon_uses cu ON c.coupon_id = cu.coupon_id 
	AND cu.user_id = $1 
	ORDER BY used DESC LIMIT $2 OFFSET $3`

	err = c.DB.Raw(query, userID, limit, offset).Scan(&coupons).Error

	if err != nil {
		return coupons, fmt.Errorf("faild to find coupons for user \n %v", err.Error())
	}

	return coupons, nil
}
