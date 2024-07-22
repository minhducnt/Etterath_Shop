package routes

import (
	handlerInterface "etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/middlewares"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(api *gin.RouterGroup, authHandler handlerInterface.AuthHandler, middleware middlewares.Middleware,
	adminHandler handlerInterface.AdminHandler, productHandler handlerInterface.ProductHandler,
	categoryHandler handlerInterface.CategoryHandler,
	paymentHandler handlerInterface.PaymentHandler, orderHandler handlerInterface.OrderHandler,
	couponHandler handlerInterface.CouponHandler, offerHandler handlerInterface.OfferHandler,
	stockHandler handlerInterface.StockHandler, branHandler handlerInterface.BrandHandler,
) {
	auth := api.Group("/auth")
	{
		login := auth.Group("/sign-in")
		{
			login.POST("/", authHandler.AdminLogin)
		}

		signup := api.Group("/sign-up")
		{
			signup.POST("/", adminHandler.AdminSignUp)
		}

		auth.POST("/renew-access-token", authHandler.AdminRenewAccessToken())
	}

	api.Use(middleware.AuthenticateAdmin())
	{

		// user side
		user := api.Group("/users")
		{
			user.GET("/", adminHandler.GetAllUsers)
			user.PATCH("/block", adminHandler.BlockUser)
		}
		// category
		category := api.Group("/categories")
		{
			category.GET("/", categoryHandler.GetAllCategories)
			category.POST("/", categoryHandler.SaveCategory)
			category.POST("/sub-categories", categoryHandler.SaveSubCategory)
			category.PUT("/:category_id", categoryHandler.UpdateCategory)
			category.DELETE("/:category_id", categoryHandler.DeleteCategory)

			variation := category.Group("/:category_id/variations")
			{
				variation.POST("/", productHandler.SaveVariation)
				variation.GET("/", productHandler.GetAllVariations)
				variation.PUT("/:variation_id", productHandler.UpdateVariation)
				variation.DELETE("/:variation_id", productHandler.DeleteVariation)

				variationOption := variation.Group("/:variation_id/options")
				{
					variationOption.GET("/", productHandler.GetAllVariationOptions)
					variationOption.POST("/", productHandler.SaveVariationOption)
					variationOption.PUT("/:variation_option_id", productHandler.UpdateVariationOption)
					variationOption.DELETE("/:variation_option_id", productHandler.DeleteVariationOption)
				}
			}

		}
		// brand
		brand := api.Group("/brands")
		{
			brand.POST("", branHandler.Save)
			brand.GET("", branHandler.FindAll)
			brand.GET("/:brand_id", branHandler.FindOne)
			brand.PUT("/:brand_id", branHandler.Update)
			brand.DELETE("/:brand_id", branHandler.Delete)
		}

		// product
		product := api.Group("/products")
		{
			product.GET("/", productHandler.GetAllProductsAdmin())
			product.GET("/:product_id", productHandler.GetProductByIDUser())
			product.POST("/", productHandler.SaveProduct)
			product.PUT("/:product_id", productHandler.UpdateProduct)

			productItem := product.Group("/:product_id/items")
			{
				productItem.GET("/", productHandler.GetAllProductItemsAdmin())
				productItem.POST("/", productHandler.SaveProductItem)
				productItem.PUT("/:product_item_id", productHandler.UpdateProductItem)
			}
		}

		// order
		order := api.Group("/orders")
		{
			order.GET("/all", orderHandler.GetAllShopOrders)
			order.GET("/:shop_order_id/items", orderHandler.GetAllOrderItemsAdmin())
			order.PUT("/", orderHandler.UpdateOrderStatus)
			order.GET("/all/:user_id", orderHandler.GetUserOrdersAdmin)

			status := order.Group("/statuses")
			{
				status.GET("/", orderHandler.GetAllOrderStatuses)
			}

			//return requests
			order.GET("/returns", orderHandler.GetAllOrderReturns)
			order.GET("/returns/pending", orderHandler.GetAllPendingReturns)
			order.PUT("/returns/pending", orderHandler.UpdateReturnRequest)
		}

		// payment_method
		paymentMethod := api.Group("/payment-methods")
		{
			paymentMethod.GET("/", paymentHandler.GetAllPaymentMethodsAdmin())
			// paymentMethod.POST("/", paymentHandler.AddPaymentMethod)
			paymentMethod.PUT("/", paymentHandler.UpdatePaymentMethod)
		}

		// offer
		offer := api.Group("/offers")
		{
			offer.POST("/", offerHandler.SaveOffer)   // add a new offer
			offer.GET("/", offerHandler.GetAllOffers) // get all offers
			offer.DELETE("/:offer_id", offerHandler.RemoveOffer)

			offer.GET("/category", offerHandler.GetAllCategoryOffers) // to get all offers of categories
			offer.POST("/category", offerHandler.SaveCategoryOffer)   // add offer for categories
			offer.PATCH("/category", offerHandler.ChangeCategoryOffer)
			offer.DELETE("/category/:offer_category_id", offerHandler.RemoveCategoryOffer)

			offer.GET("/products", offerHandler.GetAllProductsOffers) // to get all offers of products
			offer.GET(":offer_id/products/", offerHandler.GetAllProductsOffersByID)
			offer.POST("/products", offerHandler.SaveProductOffer) // add offer for products
			offer.PATCH("/products", offerHandler.ChangeProductOffer)
			offer.DELETE("/products/:offer_product_id", offerHandler.RemoveProductOffer)
		}

		// coupons
		coupons := api.Group("/coupons")
		{
			coupons.POST("/", couponHandler.SaveCoupon)
			coupons.GET("/", couponHandler.GetAllCouponsAdmin)
			coupons.PUT("/:coupon_id", couponHandler.UpdateCoupon)
		}

		// sales report
		sales := api.Group("/sales")
		{
			sales.GET("/", adminHandler.GetFullSalesReport)
		}

		stock := api.Group("/stocks")
		{
			stock.GET("/", stockHandler.GetAllStocks)

			stock.PATCH("/", stockHandler.UpdateStock)
		}

		// Admin profile
		profile := api.Group("/profile/:admin_id")
		{
			profile.GET("/", adminHandler.GetAdminProfile)
			profile.PUT("/", adminHandler.UpdateAdminProfile)
		}

	}
}
