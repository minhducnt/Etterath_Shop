package database

import (
	"etterath_shop_feature/pkg/config"
	"etterath_shop_feature/pkg/models"
	"fmt"

	log "github.com/sirupsen/logrus"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB(config config.Config) (*gorm.DB, error) {
	url := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=require",
		config.DBUser,
		config.DBPassword,
		config.DBHost,
		config.DBPort,
		config.DBName,
	)
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Error("Failed to open database connection. Due to error: ", err)
		return nil, err
	}
	// Migrate database models to database
	err = db.AutoMigrate(
		//auth
		models.RefreshSession{},
		models.OtpSession{},

		//user
		models.User{},
		models.Country{},
		models.Address{},
		models.UserAddress{},

		//admin
		models.Admin{},

		//product
		models.Category{},
		models.Variation{},
		models.VariationOption{},
		models.ProductConfiguration{},
		models.Product{},
		models.ProductItem{},
		models.ProductImage{},
		models.Variations{},
		models.VariationOptions{},
		models.Comment{},

		// wish list
		models.WishList{},

		// cart
		models.Cart{},
		models.CartItem{},

		// order
		models.OrderStatus{},
		models.ShopOrder{},
		models.OrderLine{},
		models.OrderReturn{},

		//offer
		models.Offer{},
		models.OfferCategory{},
		models.OfferProduct{},

		// coupon
		models.Coupon{},
		models.CouponUses{},

		//wallet
		models.Wallet{},
		models.Transaction{},
	)

	if err != nil {
		log.Error("Failed to migrate database tables. Due to error: ", err)
	}
	// setup the triggers
	if err := SetUpDBTriggers(db); err != nil {
		log.Error("Failed to setup database triggers. Due to error: ", err)
		return nil, err
	}

	if err := saveAdmin(db, "admin@localhost.com", "admin", "admin"); err != nil {
		return nil, err
	}

	if err := saveOrderStatuses(db); err != nil {
		return nil, err
	}

	if err := savePaymentMethods(db); err != nil {
		return nil, err
	}

	if err := saveCountry(db, "Vietnam"); err != nil {
		return nil, err
	}

	return db, nil
}
