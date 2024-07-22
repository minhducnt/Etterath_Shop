//go:build wireinject
// +build wireinject

package di

import (
	http "etterath_shop_feature/pkg/api"
	"etterath_shop_feature/pkg/api/handlers"
	"etterath_shop_feature/pkg/api/middlewares"
	"etterath_shop_feature/pkg/config"
	"etterath_shop_feature/pkg/database"
	"etterath_shop_feature/pkg/repositories"
	"etterath_shop_feature/pkg/services/cloud"
	"etterath_shop_feature/pkg/services/otp"
	"etterath_shop_feature/pkg/services/tokens"
	"etterath_shop_feature/pkg/usecases"

	"github.com/google/wire"
)

func InitializeApi(cfg config.Config) (*http.ServerHTTP, error) {

	wire.Build(database.ConnectToDB,
		//external
		tokens.NewTokenService,
		otp.NewOtpAuth,
		cloud.NewAWSCloudService,

		// repositories

		middlewares.NewMiddleware,
		repositories.NewAuthRepository,
		repositories.NewPaymentRepository,
		repositories.NewAdminRepository,
		repositories.NewUserRepository,
		repositories.NewCartRepository,
		repositories.NewProductRepository,
		repositories.NewCategoryRepository,
		repositories.NewOrderRepository,
		repositories.NewCouponRepository,
		repositories.NewOfferRepository,
		repositories.NewStockRepository,
		repositories.NewBrandDatabaseRepository,

		//usecases
		usecases.NewAuthUseCase,
		usecases.NewAdminUseCase,
		usecases.NewUserUseCase,
		usecases.NewCartUseCase,
		usecases.NewPaymentUseCase,
		usecases.NewProductUseCase,
		usecases.NewCategoryUseCase,
		usecases.NewOrderUseCase,
		usecases.NewCouponUseCase,
		usecases.NewOfferUseCase,
		usecases.NewStockUseCase,
		usecases.NewBrandUseCase,
		// handlers
		handlers.NewAuthHandler,
		handlers.NewAdminHandler,
		handlers.NewUserHandler,
		handlers.NewCartHandler,
		handlers.NewPaymentHandler,
		handlers.NewProductHandler,
		handlers.NewCategoryHandler,
		handlers.NewOrderHandler,
		handlers.NewCouponHandler,
		handlers.NewOfferHandler,
		handlers.NewStockHandler,
		handlers.NewBrandHandler,

		http.NewServerHTTP,
	)

	return &http.ServerHTTP{}, nil
}
