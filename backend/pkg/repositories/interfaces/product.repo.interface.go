package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type ProductRepository interface {
	Transactions(ctx context.Context, trxFn func(repo ProductRepository) error) error

	// variation
	IsVariationNameExistForCategory(ctx context.Context, name string, categoryID uint) (bool, error)
	SaveVariation(ctx context.Context, categoryID uint, variationName string) error
	FindAllVariationsByCategoryID(ctx context.Context, categoryID uint) ([]responses.Variation, error)
	UpdateVariation(ctx context.Context, variationID uint, variationName string) error
	DeleteVariation(ctx context.Context, variationID uint) error

	// variation values
	IsVariationValueExistForVariation(ctx context.Context, value string, variationID uint) (exist bool, err error)
	SaveVariationOption(ctx context.Context, variationID uint, variationValue string) error
	UpdateVariationOption(ctx context.Context, variationOptionID uint, variationOptionValue string) error
	DeleteVariationOption(ctx context.Context, variationOptionID uint) error
	FindAllVariationOptionsByVariationID(ctx context.Context, variationID uint) ([]responses.VariationOption, error)
	FindAllVariationValuesOfProductItem(ctx context.Context, productItemID uint) ([]responses.ProductVariationValue, error)

	//product
	FindProductByID(ctx context.Context, productID uint) (product models.Product, err error)
	FindProductIDByUser(ctx context.Context, productID uint) (product responses.Product, err error)
	IsProductNameExistForOtherProduct(ctx context.Context, name string, productID uint) (bool, error)
	IsProductNameExist(ctx context.Context, productName string) (exist bool, err error)

	FindAllProducts(ctx context.Context, pagination requests.Pagination) ([]responses.Product, error)
	SaveProduct(ctx context.Context, product models.Product) (productID uint, err error)
	UpdateProduct(ctx context.Context, product models.Product) error

	// product items
	FindProductItemByID(ctx context.Context, productItemID uint) (models.ProductItem, error)
	FindAllProductItems(ctx context.Context, productID uint) ([]responses.ProductItems, error)
	FindVariationCountForProduct(ctx context.Context, productID uint) (variationCount uint, err error) // to check the product config already exist
	FindAllProductItemIDsByProductIDAndVariationOptionID(ctx context.Context, productID, variationOptionID uint) ([]uint, error)
	SaveProductConfiguration(ctx context.Context, productItemID, variationOptionID uint) error
	SaveProductItem(ctx context.Context, productItem models.ProductItem) (productItemID uint, err error)
	UpdateProductItem(ctx context.Context, productItem models.ProductItem) error
	UpdateProductItemQty(ctx context.Context, productItemID, qty uint) error

	// product offers
	FindAllProductOffers(ctx context.Context, pagination requests.Pagination) (offers []responses.ProductOffer, err error)
	FindAllProductOffersByProductID(ctx context.Context, productID uint) (offers []responses.ProductOffer, err error)

	// product item image
	FindAllProductImages(ctx context.Context, productID uint) (images []string, err error)
	SaveProductImage(ctx context.Context, productID uint, image string) error
	DeleteAllProductImages(ctx context.Context, productID uint) (err error)

	// Comment and rating
	SaveCommentWithoutRating(ctx context.Context, productID uint, comment models.Comment) error
	SaveCommentWithRating(ctx context.Context, productID uint, comment models.Comment) error
	FindAllCommentForProduct(ctx context.Context, productID uint) (comments []responses.Comment, err error)
	FindCommentByID(ctx context.Context, commentID uint) (comment responses.Comment, err error)
	UpdateComment(ctx context.Context, productID uint, commentID uint, updatedComment models.Comment) (comments responses.Comment, err error)
	DeleteComment(ctx context.Context, commentID uint) (err error)
}
