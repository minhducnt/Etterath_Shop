package interfaces

import "github.com/gin-gonic/gin"

type ProductHandler interface {
	SaveVariation(ctx *gin.Context)
	UpdateVariation(ctx *gin.Context)
	DeleteVariation(ctx *gin.Context)

	GetAllVariationOptions(ctx *gin.Context)
	SaveVariationOption(ctx *gin.Context)
	UpdateVariationOption(ctx *gin.Context)
	DeleteVariationOption(ctx *gin.Context)
	GetAllVariations(ctx *gin.Context)

	GetAllProductsAdmin() func(ctx *gin.Context)
	GetAllProductsUser() func(ctx *gin.Context)
	GetProductByIDUser() func(ctx *gin.Context)

	SaveProduct(ctx *gin.Context)
	UpdateProduct(ctx *gin.Context)

	SaveProductItem(ctx *gin.Context)
	GetAllProductItemsAdmin() func(ctx *gin.Context)
	GetAllProductItemsUser() func(ctx *gin.Context)
	UpdateProductItem(ctx *gin.Context)

	GetAllProductOffersUser() func(ctx *gin.Context)
	FindAllProductOffers(ctx *gin.Context)

	SaveComment(ctx *gin.Context)
	FindAllProductComments(ctx *gin.Context)
	UpdateProductComment(ctx *gin.Context)
	DeleteCommentByID(ctx *gin.Context)
}
