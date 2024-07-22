package usecases

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"etterath_shop_feature/pkg/services/cloud"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"etterath_shop_feature/pkg/utils"
	"fmt"
	"log"
	"time"

	"github.com/jinzhu/copier"
)

type couponUseCase struct {
	couponRepo   interfaces.CouponRepository
	cartRepo     interfaces.CartRepository
	cloudService cloud.CloudService
}

func NewCouponUseCase(couponRepo interfaces.CouponRepository, cloudService cloud.CloudService, cartRepo interfaces.CartRepository) service.CouponUseCase {
	return &couponUseCase{
		couponRepo:   couponRepo,
		cartRepo:     cartRepo,
		cloudService: cloudService,
	}
}

func (c *couponUseCase) AddCoupon(ctx context.Context, couponRequest requests.Coupon) error {
	// first check coupon already exist with this coupon name
	checkCoupon, err := c.couponRepo.FindCouponByName(ctx, couponRequest.CouponName)
	if err != nil {
		return err
	}
	if checkCoupon.CouponID != 0 {
		return fmt.Errorf("there already a coupon exist with coupon_name %v", couponRequest.CouponName)
	}
	// validate the coupn expire date
	if time.Since(couponRequest.ExpireDate) > 0 {
		return fmt.Errorf("given coupon expire date already exceeded %v", couponRequest.ExpireDate)
	}

	// check the given expire time is valid or not

	if time.Since(couponRequest.ExpireDate) > 0 {
		return fmt.Errorf("given expire date is already over \ngiven time %v", couponRequest.ExpireDate)
	}

	var newCoupon models.Coupon
	err = copier.Copy(&newCoupon, &couponRequest)
	if err != nil {
		return err
	}

	if couponRequest.Image != nil {
		// upload image on cloud
		uploadID, err := c.cloudService.UploadFileFirebase(ctx, couponRequest.Image)
		if err != nil {
			return err
		}
		newCoupon.Image = uploadID
	}

	// create a random coupon code
	newCoupon.CouponCode = utils.GenerateCouponCode(10)

	// create a coupon
	err = c.couponRepo.SaveCoupon(ctx, newCoupon)
	if err != nil {
		return err
	}

	return nil
}
func (c *couponUseCase) GetAllCoupons(ctx context.Context, pagination requests.Pagination) (coupons []models.Coupon, err error) {

	coupons, err = c.couponRepo.FindAllCoupons(ctx, pagination)
	if err != nil {
		return coupons, err
	}

	for index, coupon := range coupons {
		if coupon.Image != "" {
			uploadedImageURL, err := c.cloudService.GetFileURLFromFisebaseService(ctx, coupon.Image)
			if err != nil {
				return coupons, err
			}
			coupons[index].Image = uploadedImageURL
		}
	}

	log.Printf("Successfully got all coupons \n\n")
	return coupons, nil
}

// get all coupon for user
func (c *couponUseCase) GetCouponsForUser(ctx context.Context, userID uint, pagination requests.Pagination) (coupons []responses.UserCoupon, err error) {

	coupons, err = c.couponRepo.FindAllCouponForUser(ctx, userID, pagination)

	if err != nil {
		return coupons, err
	}

	for index, coupon := range coupons {
		if coupon.Image != "" {
			uploadedImageURL, err := c.cloudService.GetFileURLFromFisebaseService(ctx, coupon.Image)
			if err != nil {
				return coupons, err
			}
			coupons[index].Image = uploadedImageURL
		}
	}

	log.Printf("Successfully go coupons for user of user_id %v", userID)

	return coupons, nil
}

func (c *couponUseCase) GetCouponByCouponCode(ctx context.Context, couponCode string) (coupon models.Coupon, err error) {
	coupon, err = c.couponRepo.FindCouponByCouponCode(ctx, couponCode)

	if err != nil {
		return coupon, err
	} else if coupon.CouponID == 0 {
		return coupon, fmt.Errorf("invalid coupon code %s", couponCode)
	}
	return coupon, nil
}

func (c *couponUseCase) UpdateCoupon(ctx context.Context, coupon requests.EditCoupon) (models.Coupon, error) {

	couponAfterUpdate := models.Coupon{}
	// first check the coupon_id is valid or not
	checkCoupon, err := c.couponRepo.FindCouponByID(ctx, coupon.CouponID)
	if err != nil {
		return couponAfterUpdate, err
	} else if checkCoupon.CouponID == 0 {
		return couponAfterUpdate, fmt.Errorf("invalid coupon_id %v", coupon.CouponID)
	}

	var updatedCoupon models.Coupon
	err = copier.Copy(&updatedCoupon, &coupon)
	if err != nil {
		return couponAfterUpdate, err
	}

	if coupon.Image != nil {
		if checkCoupon.Image != "" {
			err := c.cloudService.DeleteObjectFromFisebaseService(ctx, checkCoupon.Image)
			if err != nil {
				return couponAfterUpdate, utils.PrependMessageToError(err, "failed to delete current product image")
			}
		}
		newCouponImage, err := c.cloudService.UploadFileFirebase(ctx, coupon.Image)
		if err != nil {
			return couponAfterUpdate, utils.PrependMessageToError(err, "failed to upload product image")
		}
		// uploadedImageURL, err := c.cloudService.GetFileURLFromFisebaseService(ctx, newCouponImage)
		// if err != nil {
		// 	return couponAfterUpdate, err
		// }
		updatedCoupon.Image = newCouponImage
	} else {
		updatedCoupon.Image = checkCoupon.Image
	}

	// check any coupon already exist wtih this details
	couponID, err := c.couponRepo.CheckCouponDetailsAlreadyExist(ctx, updatedCoupon)

	if err != nil {
		return couponAfterUpdate, err
	} else if couponID != 0 {
		return couponAfterUpdate, fmt.Errorf("another coupon already exist with this details with coupon_id %v", couponID)
	}

	if time.Since(coupon.ExpireDate) > 0 {
		return couponAfterUpdate, fmt.Errorf("given expire date is already over \ngiven time %v", coupon.ExpireDate)
	}

	// then update the coupon
	couponAfterUpdate, err = c.couponRepo.UpdateCoupon(ctx, updatedCoupon)
	if err != nil {
		return couponAfterUpdate, err
	}

	if couponAfterUpdate.Image != "" {
		uploadedImageURL, err := c.cloudService.GetFileURLFromFisebaseService(ctx, couponAfterUpdate.Image)
		if err != nil {
			return couponAfterUpdate, err
		}
		couponAfterUpdate.Image = uploadedImageURL
	}

	return couponAfterUpdate, nil
}

// apply coupon
func (c *couponUseCase) ApplyCouponToCart(ctx context.Context, userID uint, couponCode string) (discountAmount uint, err error) {

	// get the coupon with given coupon code
	coupon, err := c.couponRepo.FindCouponByCouponCode(ctx, couponCode)
	if err != nil {
		return discountAmount, err
	} else if coupon.CouponID == 0 {
		return discountAmount, fmt.Errorf("invalid coupon_code %s", couponCode)
	}

	// check the coupon is user already used or not
	couponUses, err := c.couponRepo.FindCouponUsesByCouponAndUserID(ctx, userID, coupon.CouponID)
	if err != nil {
		return discountAmount, err
	} else if couponUses.CouponUsesID != 0 {
		return discountAmount, fmt.Errorf("user already applied this coupon at %v", couponUses.UsedAt)
	}

	// get the cart of user
	cart, err := c.cartRepo.FindCartByUserID(ctx, userID)
	if err != nil {
		return discountAmount, err
	} else if cart.ID == 0 {
		return discountAmount, fmt.Errorf("there is no cart_items available for user with user_id %d", userID)
	}

	// then check the cart have already a coupon applied
	if cart.AppliedCouponID != 0 {
		return discountAmount, fmt.Errorf("cart have already a coupon applied with coupon_id %d", cart.AppliedCouponID)
	}

	// validate the coupon expire date and cart price
	if time.Since(coupon.ExpireDate) > 0 {
		return discountAmount, fmt.Errorf("can't apply coupon \ncoupon expired")
	}
	if cart.TotalPrice < coupon.MinimumCartPrice {
		return discountAmount, fmt.Errorf("can't apply coupon \ncoupon minimum cart_amount %d not met with user cart total price %d",
			coupon.MinimumCartPrice, cart.TotalPrice)
	}

	// calculate a discount for cart
	discountAmount = (cart.TotalPrice * coupon.DiscountRate) / 100
	// update the cart
	err = c.cartRepo.UpdateCart(ctx, cart.ID, discountAmount, coupon.CouponID)
	if err != nil {
		return discountAmount, err
	}

	log.Printf("Successfully updated the cart price with discount price %d", discountAmount)
	return discountAmount, nil
}
