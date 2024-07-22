package usecases

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/config"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"etterath_shop_feature/pkg/utils"

	commonConstant "etterath_shop_feature/pkg/common/constants"

	"github.com/razorpay/razorpay-go"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/paymentintent"
)

type paymentUseCase struct {
	paymentRepo interfaces.PaymentRepository
	orderRepo   interfaces.OrderRepository
	userRepo    interfaces.UserRepository
	cartRepo    interfaces.CartRepository
	couponRepo  interfaces.CouponRepository
	config      config.Config
}

func NewPaymentUseCase(paymentRepo interfaces.PaymentRepository,
	orderRepo interfaces.OrderRepository, userRepo interfaces.UserRepository,
	cartRepo interfaces.CartRepository, couponRepo interfaces.CouponRepository,
	config config.Config) service.PaymentUseCase {
	return &paymentUseCase{
		paymentRepo: paymentRepo,
		orderRepo:   orderRepo,
		userRepo:    userRepo,
		cartRepo:    cartRepo,
		couponRepo:  couponRepo,
		config:      config,
	}
}

func (c *paymentUseCase) FindAllPaymentMethods(ctx context.Context) ([]models.PaymentMethod, error) {
	return c.paymentRepo.FindAllPaymentMethods(ctx)
}

func (c *paymentUseCase) FindPaymentMethodByID(ctx context.Context, paymentMethodID uint) (models.PaymentMethod, error) {
	return c.paymentRepo.FindPaymentMethodByID(ctx, paymentMethodID)
}

func (c *paymentUseCase) UpdatePaymentMethod(ctx context.Context, paymentMethod requests.PaymentMethodUpdate) error {

	err := c.paymentRepo.UpdatePaymentMethod(ctx, paymentMethod)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to update payment on database")
	}

	return nil
}

// To create a razor pay order
func (c *paymentUseCase) MakeRazorpayOrder(ctx context.Context, userID, shopOrderID uint) (responses.RazorpayOrder, error) {

	shopOrder, err := c.orderRepo.FindShopOrderByShopOrderID(ctx, shopOrderID)
	if err != nil {
		return responses.RazorpayOrder{}, utils.PrependMessageToError(err, "failed to find shop order from database")
	}

	// find the given payment
	payment, err := c.paymentRepo.FindPaymentMethodByType(ctx, commonConstant.RazorpayPayment)
	if err != nil {
		return responses.RazorpayOrder{}, utils.PrependMessageToError(err, "failed to find payment method details")
	}
	// payment is blocked
	if payment.BlockStatus {
		return responses.RazorpayOrder{}, ErrBlockedPayment
	}

	// check order total reached the payment method max amount
	if shopOrder.OrderTotalPrice > payment.MaximumAmount {
		return responses.RazorpayOrder{}, ErrPaymentAmountReachedMax
	}

	// get user details
	userDetails, err := c.userRepo.FindUserByUserID(ctx, userID)
	if err != nil {
		return responses.RazorpayOrder{}, err
	}

	//razorpay amount is calculate on pisa for india so make the actual price into paisa
	razorPayAmount := shopOrder.OrderTotalPrice * 100

	razorpayKey := c.config.RazorPayKey
	razorpaySecret := c.config.RazorPaySecret

	client := razorpay.NewClient(razorpayKey, razorpaySecret)
	// razor pay data for order
	data := map[string]interface{}{
		"amount":   razorPayAmount,
		"currency": "INR",
		"receipt":  "ecommerce purchase completed",
	}

	razorpayRes, err := client.Order.Create(data, nil)
	if err != nil {
		return responses.RazorpayOrder{}, utils.PrependMessageToError(err, "failed to create razorpay order")
	}

	razorpayOrderID := razorpayRes["id"]

	razorPayOrder := responses.RazorpayOrder{
		ShopOrderID:     shopOrderID,
		AmountToPay:     shopOrder.OrderTotalPrice,
		RazorpayAmount:  razorPayAmount,
		RazorpayKey:     razorpayKey,
		RazorpayOrderID: razorpayOrderID,
		UserID:          userID,
		Email:           userDetails.Email,
		Phone:           userDetails.Phone,
	}

	return razorPayOrder, nil
}

// To verify razor pay payment
func (c *paymentUseCase) VerifyRazorPay(ctx context.Context, verifyReq requests.RazorpayVerify) error {

	razorpayKey := c.config.RazorPayKey
	razorPaySecret := c.config.RazorPaySecret

	data := verifyReq.OrderID + "|" + verifyReq.PaymentID
	h := hmac.New(sha256.New, []byte(razorPaySecret))
	_, err := h.Write([]byte(data))
	if err != nil {
		return utils.PrependMessageToError(err, "failed to verify signature")
	}

	sha := hex.EncodeToString(h.Sum(nil))
	if subtle.ConstantTimeCompare([]byte(sha), []byte(verifyReq.Signature)) != 1 {
		return errors.New("razorpay signature not match")
	}

	client := razorpay.NewClient(razorpayKey, razorPaySecret)

	// fetch payment and verify
	payment, err := client.Payment.Fetch(verifyReq.PaymentID, nil, nil)

	if err != nil {
		return err
	}

	// check payment status
	if payment["status"] != "captured" {
		return ErrPaymentNotApproved
	}

	return nil
}

// To mak a stripe order
func (c *paymentUseCase) MakeStripeOrder(ctx context.Context, userID, shopOrderID uint) (responses.StripeOrder, error) {

	shopOrder, err := c.orderRepo.FindShopOrderByShopOrderID(ctx, shopOrderID)
	if err != nil {
		return responses.StripeOrder{}, utils.PrependMessageToError(err, "failed to find shop order from database")
	}

	// find the given payment
	payment, err := c.paymentRepo.FindPaymentMethodByType(ctx, commonConstant.StripePayment)
	if err != nil {
		return responses.StripeOrder{}, utils.PrependMessageToError(err, "failed to find payment method details")
	}

	// payment is blocked
	if payment.BlockStatus {
		return responses.StripeOrder{}, ErrBlockedPayment
	}

	// check order total reached the payment method max amount
	if shopOrder.OrderTotalPrice > payment.MaximumAmount {
		return responses.StripeOrder{}, ErrPaymentAmountReachedMax
	}

	userDetails, err := c.userRepo.FindUserByUserID(ctx, userID)
	if err != nil {
		return responses.StripeOrder{}, err
	}
	// set up the stripe secret key
	stripe.Key = c.config.StripSecretKey

	// create a payment param
	params := &stripe.PaymentIntentParams{

		Amount:       stripe.Int64(int64(shopOrder.OrderTotalPrice)),
		ReceiptEmail: stripe.String(userDetails.Email),

		Currency: stripe.String(string(stripe.CurrencyVND)),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	// create new payment intent with this param
	paymentIntent, err := paymentintent.New(params)

	if err != nil {
		return responses.StripeOrder{}, utils.PrependMessageToError(err, "failed to create new stripe payment intent")
	}

	stripePaymentId := paymentIntent.ID
	clientSecret := paymentIntent.ClientSecret
	stripePublishKey := c.config.StripPublishKey

	stripeOrder := responses.StripeOrder{
		StripePaymentId: stripePaymentId,
		ShopOrderID:     shopOrderID,
		AmountToPay:     shopOrder.OrderTotalPrice,
		ClientSecret:    clientSecret,
		PublishableKey:  stripePublishKey,
	}

	return stripeOrder, nil
}

func (c *paymentUseCase) VerifyStripOrder(ctx context.Context, stripePaymentID string) error {

	stripe.Key = c.config.StripSecretKey

	// get payment by payment_id
	paymentIntent, err := paymentintent.Get(stripePaymentID, nil)

	if err != nil {
		return utils.PrependMessageToError(err, "failed to get payment intent from stripe")
	}

	// verify the payment intent
	if paymentIntent.Status != stripe.PaymentIntentStatusSucceeded && paymentIntent.Status != stripe.PaymentIntentStatusRequiresCapture {
		return ErrPaymentNotApproved
	}

	return nil
}

// Approve the order and clear the cart (if coupon applied then change it used for this user)
func (c *paymentUseCase) ApproveShopOrderAndClearCart(ctx context.Context, userID uint,
	approveDetails requests.ApproveOrder) error {

	// find the order status of order placed
	orderPlacedStatus, err := c.orderRepo.FindOrderStatusByStatus(ctx, commonConstant.StatusOrderPlaced)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to find order place status for shop order")
	}
	// find the payment method of given payment type
	paymentMethod, err := c.paymentRepo.FindPaymentMethodByType(ctx, approveDetails.PaymentType)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to find payment method from database")
	}

	err = c.orderRepo.Transaction(func(trxRepo interfaces.OrderRepository) error {

		// change order status and save the payment method for the order
		err = trxRepo.UpdateShopOrderStatusAndSavePaymentMethod(ctx, approveDetails.ShopOrderID,
			orderPlacedStatus.ID, paymentMethod.ID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to update shop order status and payment method")
		}
		// find the cart
		cart, err := c.cartRepo.FindCartByUserID(ctx, userID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to find user cart from database")
		}

		// if user applied a coupon on cart then save coupon uses for user
		if cart.AppliedCouponID != 0 {
			err = c.couponRepo.SaveCouponUses(ctx, models.CouponUses{
				UserID:   userID,
				CouponID: cart.AppliedCouponID,
			})

			if err != nil {
				return utils.PrependMessageToError(err, "failed to save coupon used for user")
			}
		}
		// delete the all cart item
		err = c.cartRepo.DeleteAllCartItemsByCartID(ctx, cart.ID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to clear user cart")
		}
		return nil
	})
	return err
}
