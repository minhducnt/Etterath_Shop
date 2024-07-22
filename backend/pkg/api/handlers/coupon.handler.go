package handlers

import (
	"errors"
	"etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	usecase "etterath_shop_feature/pkg/usecases/interfaces"
	"etterath_shop_feature/pkg/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CouponHandler struct {
	couponUseCase usecase.CouponUseCase
}

func NewCouponHandler(couponUseCase usecase.CouponUseCase) interfaces.CouponHandler {
	return &CouponHandler{couponUseCase: couponUseCase}
}

// SaveCoupon godoc
//
//	@Summary		Add coupons (Admin)
//	@Description	API for admin to add a new coupon
//	@Security		BearerAuth
//	@Tags			Admin Coupon
//	@Id				SaveCoupon
//	@Param			inputs	body	requests.Coupon{}	true	"Input Fields"
//	@Router			/admin/coupons [post]
//	@Success		200	{object}	responses.Response{}	"Successfully coupon added"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
func (c *CouponHandler) SaveCoupon(ctx *gin.Context) {

	couponName, err1 := requests.GetFormValuesAsString(ctx, "coupon_name")
	description, err2 := requests.GetFormValuesAsString(ctx, "description")
	expireDate, err3 := requests.GetFormValuesAsTime(ctx, "expire_date")
	discountRate, err4 := requests.GetFormValuesAsUint(ctx, "discount_rate")
	minimumCartPrice, err5 := requests.GetFormValuesAsUint(ctx, "minimum_cart_price")
	blockStatus, err6 := requests.GetFormValuesAsBool(ctx, "block_status")

	var err7 error
	image, err7 := requests.GetArrayOfFromFiles(ctx, "image", true)

	err := errors.Join(err1, err2, err3, err4, err5, err6)
	if err7 != nil && err7.Error() != "http: no such file" {
		err = errors.Join(err, err7)
	}
	if len(image) > 1 {
		err8 := errors.New("please input only one image")
		err = errors.Join(err, err8)
	}

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	counponRequest := requests.Coupon{
		CouponName:       couponName,
		Description:      description,
		ExpireDate:       expireDate,
		DiscountRate:     discountRate,
		MinimumCartPrice: minimumCartPrice,
		BlockStatus:      blockStatus,
	}

	if image != nil {
		counponRequest.Image = image[0]
	}

	err = c.couponUseCase.AddCoupon(ctx, counponRequest)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, "Failed to add coupon", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully coupon added")
}

// GetAllCouponsAdmin godoc
//
//	@Summary		Get all coupons (Admin)
//	@Description	API for admin to get all coupons
//	@Security		BearerAuth
//	@Tags			Admin Coupon
//	@Id				GetAllCouponsAdmin
//	@Param			page_number	query	int	false	"Page Number"
//	@Param			count		query	int	false	"Count"
//	@Router			/admin/coupons [get]
//	@Success		200	{object}	responses.Response{}	"Successfully go all the coupons
//	@Failure		500	{object}	responses.Response{}	"failed to get all coupons"
func (c *CouponHandler) GetAllCouponsAdmin(ctx *gin.Context) {

	pagination := requests.GetPagination(ctx)

	coupons, err := c.couponUseCase.GetAllCoupons(ctx, pagination)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to get all coupons", err, nil)
		return
	}

	if len(coupons) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No Coupons found", nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully found coupons", coupons)
}

// GetAllCouponsForUser godoc
//
//	@Summary		Get all user coupons (User)
//	@Description	API for user to get all coupons
//	@Security		BearerAuth
//	@tags			User Profile
//	@id				GetAllCouponsForUser
//	@Param			page_number	query	int	false	"Page Number"
//	@Param			count		query	int	false	"Count Of Order"
//	@Router			/account/coupons [get]
//	@Success		200	{object}	responses.Response{}	""Successfully	found	all	coupons	for	user"
//	@Failure		500	{object}	responses.Response{}	"Failed to find all user"
func (c *CouponHandler) GetAllCouponsForUser(ctx *gin.Context) {

	userID := utils.GetUserIdFromContext(ctx)
	pagination := requests.GetPagination(ctx)

	coupons, err := c.couponUseCase.GetCouponsForUser(ctx, userID, pagination)

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, "Failed to find all user", err, nil)
		return
	}

	if len(coupons) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No coupons found", nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully found all coupons for user", coupons)
}

// UpdateCoupon godoc
//
//	@Summary		Update Coupon (Admin)
//	@Description	API for admin update coupon details
//	@Security		BearerAuth
//	@Tags			Admin Coupon
//	@Id				UpdateCoupon
//	@Param			inputs	body	requests.EditCoupon{}	true	"Input Field"
//	@Router			/admin/coupons/:coupon_id [put]
//	@Success		200	{object}	responses.Response{}	"Successfully updated the coupon"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
func (c *CouponHandler) UpdateCoupon(ctx *gin.Context) {

	couponID, err := requests.GetParamAsUint(ctx, "coupon_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	couponName, err1 := requests.GetFormValuesAsString(ctx, "coupon_name")
	description, err2 := requests.GetFormValuesAsString(ctx, "description")
	expireDate, err3 := requests.GetFormValuesAsTime(ctx, "expire_date")
	discountRate, err4 := requests.GetFormValuesAsUint(ctx, "discount_rate")
	minimumCartPrice, err5 := requests.GetFormValuesAsUint(ctx, "minimum_cart_price")
	blockStatus, err6 := requests.GetFormValuesAsBool(ctx, "block_status")

	var err7 error
	image, err7 := requests.GetArrayOfFromFiles(ctx, "image", false)

	err = errors.Join(err1, err2, err3, err4, err5, err6)
	if err7 != nil && err7.Error() != "http: no such file" {
		err = errors.Join(err, err7)
	}
	if len(image) > 1 {
		err8 := errors.New("please input only one image")
		err = errors.Join(err, err8)
	}

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	updatedCoupon := requests.EditCoupon{
		CouponID:         couponID,
		CouponName:       couponName,
		Description:      description,
		ExpireDate:       expireDate,
		DiscountRate:     discountRate,
		MinimumCartPrice: minimumCartPrice,
		BlockStatus:      blockStatus,
	}

	if image != nil {
		updatedCoupon.Image = image[0]
	}

	couponAfterUpdated, err := c.couponUseCase.UpdateCoupon(ctx, updatedCoupon)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, "Failed to update coupon", err, updatedCoupon)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully updated the coupon", couponAfterUpdated)
}

// ApplyCouponToCart godoc
//
//	@Summary		Apply coupon
//	@Description	API for user to apply a coupon on cart
//	@Security		BearerAuth
//	@Tags			User Cart
//	@Id				ApplyCouponToCart
//	@Param			inputs	body	requests.ApplyCoupon{}	true	"Input Field"
//	@Router			/carts/apply-coupon [patch]
//	@Success		200	{object}	responses.Response{}	"Successfully coupon applied to user cart"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
func (c *CouponHandler) ApplyCouponToCart(ctx *gin.Context) {

	var body requests.ApplyCoupon

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	userID := utils.GetUserIdFromContext(ctx)

	discountPrice, err := c.couponUseCase.ApplyCouponToCart(ctx, userID, body.CouponCode)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, "Failed to apply the coupon code", err, nil)
		return
	}

	data := gin.H{"discount_amount": discountPrice}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully coupon applied to user cart", data)
}
