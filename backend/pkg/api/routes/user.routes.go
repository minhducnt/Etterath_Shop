package routes

import (
	handlerInterface "etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoutes(api *gin.RouterGroup, authHandler handlerInterface.AuthHandler, middleware middlewares.Middleware,
	userHandler handlerInterface.UserHandler, cartHandler handlerInterface.CartHandler,
	productHandler handlerInterface.ProductHandler, paymentHandler handlerInterface.PaymentHandler,
	orderHandler handlerInterface.OrderHandler, couponHandler handlerInterface.CouponHandler,
	branHandler handlerInterface.BrandHandler, categoryHandler handlerInterface.CategoryHandler) {

	auth := api.Group("/auth")
	{
		signup := auth.Group("/sign-up")
		{
			signup.POST("/", authHandler.UserSignUp)
			signup.POST("/verify", authHandler.UserSignUpVerify)
		}

		login := auth.Group("/sign-in")
		{
			login.POST("/", authHandler.UserLogin)
			login.POST("/otp/send", authHandler.UserLoginOtpSend)
			login.POST("/otp/verify", authHandler.UserLoginOtpVerify)
		}

		goath := auth.Group("/google-auth")
		{
			goath.GET("/", authHandler.UserGoogleAuthLoginPage)
			goath.GET("/initialize", authHandler.UserGoogleAuthInitialize)
			goath.GET("/callback", authHandler.UserGoogleAuthCallBack)
		}

		auth.POST("/renew-access-token", authHandler.UserRenewAccessToken())

		// api.POST("/logout")

	}

	// API for products - No authentication
	product := api.Group("/products")
	{
		product.GET("/", productHandler.GetAllProductsUser())
		product.GET("/:product_id", productHandler.GetProductByIDUser())
		product.GET("/offers", productHandler.GetAllProductOffersUser())

		productItem := product.Group("/:product_id/items")
		{
			productItem.GET("/", productHandler.GetAllProductItemsUser())
		}

		productOffer := product.Group("/:product_id/offers")
		{
			productOffer.GET("/", productHandler.FindAllProductOffers)
		}
	}

	product.GET("/:product_id/comments", productHandler.FindAllProductComments) // get all comments for productD

	// API for brand - No authentication
	brand := api.Group("/brands")
	{
		brand.GET("", branHandler.FindAll)
		brand.GET("/:brand_id", branHandler.FindOne)
	}

	// API for category - No authentication
	category := api.Group("/categories")
	{
		category.GET("/", categoryHandler.GetAllCategories)

		variation := category.Group("/:category_id/variations")
		{
			variation.GET("/", productHandler.GetAllVariations)
		}

	}

	// APIs need to authentication with user role
	api.Use(middleware.AuthenticateUser())
	{

		// api.POST("/logout", userHandler.UserLogout)

		// 	// cart
		cart := api.Group("/carts")
		{
			cart.GET("/", cartHandler.GetCart)
			cart.POST("/:product_item_id", cartHandler.AddToCart)
			cart.PUT("/", cartHandler.UpdateCart)
			cart.DELETE("/:product_item_id", cartHandler.RemoveFromCart)

			cart.PATCH("/apply-coupon", couponHandler.ApplyCouponToCart)

			cart.GET("/checkout/payment-select-page", paymentHandler.CartOrderPaymentSelectPage)
			// 		cart.GET("/payment-methods", orderHandler.GetAllPaymentMethods)
			cart.POST("/place-order", orderHandler.SaveOrder)

			// 		//cart.GET("/checkout", userHandler.CheckOutCart, orderHandler.GetAllPaymentMethods)
			cart.POST("/place-order/cod", paymentHandler.PaymentCOD)

			// razorpay payment
			cart.POST("/place-order/razorpay-checkout", paymentHandler.RazorpayCheckout)
			cart.POST("/place-order/razorpay-verify", paymentHandler.RazorpayVerify)

			// 	stripe payment
			cart.POST("/place-order/stripe-checkout", paymentHandler.StripPaymentCheckout)
			cart.POST("/place-order/stripe-verify", paymentHandler.StripePaymentVeify)
		}

		// profile
		account := api.Group("/account")
		{
			account.GET("/", userHandler.GetProfile)
			account.PUT("/", userHandler.UpdateProfile)

			account.GET("/address", userHandler.GetAllAddresses) // to show all address and // show countries
			account.POST("/address", userHandler.SaveAddress)    // to add a new address
			account.PUT("/address", userHandler.UpdateAddress)   // to edit address
			// account.DELETE("/address", userHandler.DeleteAddress)

			//wishlist
			wishList := account.Group("/wishlist")
			{
				wishList.GET("/", userHandler.GetWishList)
				wishList.POST("/:product_item_id", userHandler.SaveToWishList)
				wishList.DELETE("/:product_item_id", userHandler.RemoveFromWishList)
			}

			wallet := account.Group("/wallet")
			{
				wallet.GET("/", orderHandler.GetUserWallet)
				wallet.GET("/transactions", orderHandler.GetUserWalletTransactions)
			}

			coupons := account.Group("/coupons")
			{
				coupons.GET("/", couponHandler.GetAllCouponsForUser)
			}
		}

		paymentMethod := api.Group("/payment-methods")
		{
			paymentMethod.GET("/", paymentHandler.GetAllPaymentMethodsUser())
		}

		// 	// order
		orders := api.Group("/orders")
		{
			orders.GET("/", orderHandler.GetUserOrder)                               // get all order list for user
			orders.GET("/:shop_order_id/items", orderHandler.GetAllOrderItemsUser()) //get order items for specific order
			orders.PUT("/", orderHandler.UpdateOrderStatus)

			orders.POST("/return", orderHandler.SubmitReturnRequest)
			orders.POST("/:shop_order_id/cancel", orderHandler.CancelOrder) // cancel an order
		}

		// comment
		product := api.Group("/products")
		{
			product.POST("/:product_id/comments", productHandler.SaveComment)                     // save comment for product
			product.PUT("/:product_id/comments/:comment_id", productHandler.UpdateProductComment) // update comment for product
			product.DELETE("/:product_id/comments/:comment_id", productHandler.DeleteCommentByID) // delete a comment of a product
		}
	}
}
