package http

import (
	handlerInterface "etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/middlewares"
	"etterath_shop_feature/pkg/api/routes"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type ServerHTTP struct {
	Engine *gin.Engine
}

func NewServerHTTP(authHandler handlerInterface.AuthHandler, middlewares middlewares.Middleware,
	adminHandler handlerInterface.AdminHandler, userHandler handlerInterface.UserHandler,
	cartHandler handlerInterface.CartHandler, paymentHandler handlerInterface.PaymentHandler,
	productHandler handlerInterface.ProductHandler, categoryHandler handlerInterface.CategoryHandler,
	orderHandler handlerInterface.OrderHandler,
	couponHandler handlerInterface.CouponHandler, offerHandler handlerInterface.OfferHandler,
	stockHandler handlerInterface.StockHandler, branHandler handlerInterface.BrandHandler,
) *ServerHTTP {
	engine := gin.New()
	engine.RedirectTrailingSlash = true

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowMethods = []string{"POST", "GET", "PUT", "PATCH", "OPTIONS", "DELETE"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization", "Accept", "User-Agent", "Cache-Control", "Pragma"}
	corsConfig.ExposeHeaders = []string{"Content-Length"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 12 * time.Hour

	// engine.LoadHTMLGlob("views/*.html")

	engine.Use(cors.New(corsConfig))
	engine.Use(gin.Logger())

	// Set up routers and handlers
	routes.UserRoutes(engine.Group("/api"), authHandler, middlewares, userHandler, cartHandler,
		productHandler, paymentHandler, orderHandler, couponHandler, branHandler, categoryHandler)
	routes.AdminRoutes(engine.Group("/api/admin"), authHandler, middlewares, adminHandler,
		productHandler, categoryHandler, paymentHandler, orderHandler, couponHandler, offerHandler, stockHandler, branHandler)

	// No hanldlers
	engine.NoRoute(func(context *gin.Context) {
		context.JSON(http.StatusNotFound, gin.H{
			"message": "Invalid URL provided",
		})
	})
	return &ServerHTTP{Engine: engine}
}

func (s *ServerHTTP) Start() error {
	return s.Engine.Run(":8000")
}
