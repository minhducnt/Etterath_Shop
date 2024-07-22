package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
)

type ProductUseCase interface {
	// variations
	SaveVariation(ctx context.Context, categoryID uint, variationNames []string) error
	UpdateVariation(ctx context.Context, categoryID uint, variationID uint, variationName string) error
	DeleteVariation(ctx context.Context, variationID uint) error
	SaveVariationOption(ctx context.Context, variationID uint, variationOptionValues []string) error
	UpdateVariationOption(ctx context.Context, variationID uint, variationOptionID uint, variationOptionValue string) error
	DeleteVariationOption(ctx context.Context, variationOptionID uint) error
	FindAllVariationsAndItsValues(ctx context.Context, categoryID uint) ([]responses.Variation, error)
	FindAllVariationOptionsByVariationID(ctx context.Context, variationID uint) ([]responses.VariationOption, error)

	// products
	FindAllProducts(ctx context.Context, pagination requests.Pagination) (products []responses.Product, err error)
	FindProductIDByUser(ctx context.Context, productID uint) (responses.Product, error)
	SaveProduct(ctx context.Context, product requests.Product) error
	UpdateProduct(ctx context.Context, product requests.UpdateProduct) error

	// offers
	FindAllProductOffers(ctx context.Context, pagination requests.Pagination) ([]responses.ProductOffer, error)
	FindAllProductOffersByProductID(ctx context.Context, productID uint) ([]responses.ProductOffer, error)

	// product-items
	SaveProductItem(ctx context.Context, productID uint, productItem requests.ProductItem) error
	FindAllProductItems(ctx context.Context, productID uint) ([]responses.ProductItems, error)
	UpdateProductItem(ctx context.Context, updateProductItem requests.UpdateProductItem) error

	// comments and ratings
	SaveComments(ctx context.Context, productID uint, comment requests.Comment) error
	FindAllProductComments(ctx context.Context, productID uint) ([]responses.Comment, error)
	UpdateComment(ctx context.Context, productID uint, commentID uint, updatedComment requests.Comment) (responses.Comment, error)
	DeleteCommentByID(ctx context.Context, commentID uint) error
}
