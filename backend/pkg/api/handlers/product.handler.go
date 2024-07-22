package handlers

import (
	"errors"
	"etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/usecases"
	usecaseInterface "etterath_shop_feature/pkg/usecases/interfaces"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductHandler struct {
	productUseCase usecaseInterface.ProductUseCase
}

func NewProductHandler(productUsecase usecaseInterface.ProductUseCase) interfaces.ProductHandler {
	return &ProductHandler{
		productUseCase: productUsecase,
	}
}

// SaveVariation godoc
//
//	@Summary		Add new variations (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add new variations for a category
//	@Tags			Admin Category
//	@ID				SaveVariation
//	@Accept			json
//	@Produce		json
//	@Param			category_id	path	int					true	"Category ID"
//	@Param			input		body	requests.Variation{}	true	"Variation details"
//	@Router			/admin/categories/{category_id}/variations [post]
//	@Success		201	{object}	responses.Response{}	"Successfully added variations"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to add variation"
func (p *ProductHandler) SaveVariation(ctx *gin.Context) {

	categoryID, err := requests.GetParamAsUint(ctx, "category_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	var body requests.Variation

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = p.productUseCase.SaveVariation(ctx, categoryID, body.Names)

	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to add variation", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully added variations")
}

// UpdateVariation godoc
//
//	@Summary		Update variations (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to update avariation
//	@Tags			Admin Category
//	@ID				UpdateVariation
//	@Accept			json
//	@Produce		json
//	@Param			category_id 	path	int					true	"Category ID"
//	@Param			variation_id	path	int					true	"Variation ID"
//	@Param			input		body	requests.UpdateVariation{}	true	"Variation details"
//	@Router			/admin/categories/{category_id}/variations/{variation_id} [put]
//	@Success		201	{object}	responses.Response{}	"Successfully updated variation"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to update variation"
func (p *ProductHandler) UpdateVariation(ctx *gin.Context) {

	categoryID, err := requests.GetParamAsUint(ctx, "category_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	variationID, err := requests.GetParamAsUint(ctx, "variation_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	var body requests.UpdateVariation

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = p.productUseCase.UpdateVariation(ctx, categoryID, variationID, body.Name)

	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to update variation", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully updated variation")
}

// DeleteVariation godoc
//
//	@Summary		Update variations (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to update avariation
//	@Tags			Admin Category
//	@ID				DeleteVariation
//	@Accept			json
//	@Produce		json
//	@Param			category_id 	path	int					true	"Category ID"
//	@Param			variation_id	path	int					true	"Variation ID"
//	@Router			/admin/categories/{category_id}/variations/{variation_id} [delete]
//	@Success		201	{object}	responses.Response{}	"Successfully deleted variation"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to delete variation"
func (p *ProductHandler) DeleteVariation(ctx *gin.Context) {
	variationID, err := requests.GetParamAsUint(ctx, "variation_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	err = p.productUseCase.DeleteVariation(ctx, variationID)

	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to delete variation", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully deleted variation")
}

// GetAllVariationOptions godoc
//
//	@Summary		Get all variation options (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to get all variation options of a variation
//	@Tags			Admin Category
//	@ID				GetAllVariationOptions
//	@Accept			json
//	@Produce		json
//	@Param			category_id	path	int	true	"Category ID"
//	@Param			variation_id	path	int	true	"Variation ID"
//	@Router			/admin/categories/{category_id}/variations/{variation_id}/options [get]
//	@Success		200	{object}	responses.Response{}	"Successfully retrieved all variation options"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to Get variation options"
func (c *ProductHandler) GetAllVariationOptions(ctx *gin.Context) {

	variationID, err := requests.GetParamAsUint(ctx, "variation_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	variationOptions, err := c.productUseCase.FindAllVariationOptionsByVariationID(ctx, variationID)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Get variation options", err, nil)
		return
	}

	if len(variationOptions) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No variation options found", nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully retrieved all variation options", variationOptions)
}

// SaveVariationOption godoc
//
//	@Summary		Add new variation options (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add variation options for a variation
//	@Tags			Admin Category
//	@ID				SaveVariationOption
//	@Accept			json
//	@Produce		json
//	@Param			category_id		path	int							true	"Category ID"
//	@Param			variation_id	path	int							true	"Variation ID"
//	@Param			input			body	requests.VariationOption{}	true	"Variation option details"
//	@Router			/admin/categories/{category_id}/variations/{variation_id}/options [post]
//	@Success		201	{object}	responses.Response{}	"Successfully added variation options"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to add variation options"
func (p *ProductHandler) SaveVariationOption(ctx *gin.Context) {

	variationID, err := requests.GetParamAsUint(ctx, "variation_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	var body requests.VariationOption

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = p.productUseCase.SaveVariationOption(ctx, variationID, body.Values)
	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationOptionAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to add variation options", err, nil)
		return
	}
	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully added variation options")
}

// UpdateVariationOption godoc
//
//	@Summary		Update a variation option (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to update variation option for a variation
//	@Tags			Admin Category
//	@ID				UpdateVariationOption
//	@Accept			json
//	@Produce		json
//	@Param			category_id		    path	int							true	"Category ID"
//	@Param			variation_id	    path	int							true	"Variation ID"
//	@Param			variation_option_id	path	int							true	"Variation Option ID"
//	@Param			input			body	requests.UpdateVariationOption{}	true	"Variation option details"
//	@Router			/admin/categories/{category_id}/variations/{variation_id}/options/{variation_option_id} [put]
//	@Success		201	{object}	responses.Response{}	"Successfully updated variation option"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to update variation option"
func (p *ProductHandler) UpdateVariationOption(ctx *gin.Context) {

	variationID, err := requests.GetParamAsUint(ctx, "variation_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	variationOptionID, err := requests.GetParamAsUint(ctx, "variation_option_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	var body requests.UpdateVariationOption

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = p.productUseCase.UpdateVariationOption(ctx, variationID, variationOptionID, body.Value)
	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationOptionAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to update variation option", err, nil)
		return
	}
	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully updated variation option")
}

// DeleteVariationOption godoc
//
//	@Summary		Delete a variation option (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to delete variation option for a variation
//	@Tags			Admin Category
//	@ID				DeleteVariationOption
//	@Accept			json
//	@Produce		json
//	@Param			category_id		    path	int							true	"Category ID"
//	@Param			variation_id	    path	int							true	"Variation ID"
//	@Param			variation_option_id	path	int							true	"Variation Option ID"
//	@Router			/admin/categories/{category_id}/variations/{variation_id}/options/{variation_option_id} [delete]
//	@Success		201	{object}	responses.Response{}	"Successfully deleted variation option"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to delete variation option"
func (p *ProductHandler) DeleteVariationOption(ctx *gin.Context) {
	variationOptionID, err := requests.GetParamAsUint(ctx, "variation_option_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	err = p.productUseCase.DeleteVariationOption(ctx, variationOptionID)
	if err != nil {
		var statusCode = http.StatusInternalServerError
		if errors.Is(err, usecases.ErrVariationOptionAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to delete variation option", err, nil)
		return
	}
	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully deleted variation option")
}

// GetAllVariations godoc
//
//	@Summary		Get all variations (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to get all variation and its values of a category
//	@Tags			Admin Category
//	@ID				GetAllVariations
//	@Accept			json
//	@Produce		json
//	@Param			category_id	path	int	true	"Category ID"
//	@Router			/admin/categories/{category_id}/variations [get]
//	@Success		200	{object}	responses.Response{}	"Successfully retrieved all variations and its values"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		500	{object}	responses.Response{}	"Failed to Get variations and its values"
func (c *ProductHandler) GetAllVariations(ctx *gin.Context) {

	categoryID, err := requests.GetParamAsUint(ctx, "category_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	variations, err := c.productUseCase.FindAllVariationsAndItsValues(ctx, categoryID)
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Get variations and its values", err, nil)
		return
	}

	if len(variations) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No variations found")
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully retrieved all variations and its values", variations)
}

// SaveProduct godoc
//
//	@Summary		Add a new product (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add a new product
//	@ID				SaveProduct
//	@Tags			Admin Products
//	@Produce		json
//	@Param			name		formData	string				true	"Product Name"
//	@Param			description	formData	string				true	"Product Description"
//	@Param			category_id	formData	int					true	"Category Id"
//	@Param			brand_id	formData	int					true	"Brand Id"
//	@Param			price		formData	int					true	"Product Price"
//	@Param			image		formData	file				true	"Product Description"
//	@Success		200			{object}	responses.Response{}	"Successfully product added"
//	@Router			/admin/products [post]
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		409	{object}	responses.Response{}	"Product name already exist"
func (p *ProductHandler) SaveProduct(ctx *gin.Context) {

	name, err1 := requests.GetFormValuesAsString(ctx, "name")
	description, err2 := requests.GetFormValuesAsString(ctx, "description")
	categoryID, err3 := requests.GetFormValuesAsUint(ctx, "category_id")
	price, err4 := requests.GetFormValuesAsUint(ctx, "price")
	puschargePrice, err5 := requests.GetFormValuesAsUint(ctx, "puscharge_price")
	brandID, err6 := requests.GetFormValuesAsUint(ctx, "brand_id")
	properties, err7 := requests.GetFormValuesAsString(ctx, "properties")

	var err8 error
	imageFileHeaders, err8 := requests.GetArrayOfFromFiles(ctx, "images", true)

	err := errors.Join(err1, err2, err3, err4, err5, err6, err7)
	if err8 != nil && err8.Error() != "http: no such file" {
		err = errors.Join(err, err8)
	}

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	product := requests.Product{
		Name:           name,
		Description:    description,
		CategoryID:     categoryID,
		BrandID:        brandID,
		Price:          price,
		PuschargePrice: puschargePrice,
		Properties:     properties,
	}

	if imageFileHeaders != nil {
		product.ImageFileHeaders = imageFileHeaders
	}

	err = p.productUseCase.SaveProduct(ctx, product)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to add product", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully product added")
}

// GetAllProductsAdmin godoc
//
//	@Summary		Get all products (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to get all products
//	@ID				GetAllProductsAdmin
//	@Tags			Admin Products
//	@Param			page_number	query	int	false	"Page Number"
//	@Param			count		query	int	false	"Count"
//	@Router			/admin/products [get]
//	@Success		200	{object}	responses.Response{}	"Successfully found all products"
//	@Failure		500	{object}	responses.Response{}	"Failed to Get all products"
func (p *ProductHandler) GetAllProductsAdmin() func(ctx *gin.Context) {
	return p.getAllProducts()
}

// GetAllProductsUser godoc
//
//	@Summary		Get all products (User)
//	@Security		BearerAuth
//	@Description	API for user to get all products
//	@ID				GetAllProductsUser
//	@Tags			User Products
//	@Param			page_number	query	int	false	"Page Number"
//	@Param			count		query	int	false	"Count"
//	@Router			/products [get]
//	@Success		200	{object}	responses.Response{}	"Successfully found all products"
//	@Failure		500	{object}	responses.Response{}	"Failed to get all products"
func (p *ProductHandler) GetAllProductsUser() func(ctx *gin.Context) {
	return p.getAllProducts()
}

// Get products is common for user and admin so this function is to get the common Get all products func for them
func (p *ProductHandler) getAllProducts() func(ctx *gin.Context) {

	return func(ctx *gin.Context) {

		pagination := requests.GetPagination(ctx)

		products, err := p.productUseCase.FindAllProducts(ctx, pagination)

		if err != nil {
			responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Get all products", err, nil)
			return
		}

		if len(products) == 0 {
			responses.SuccessResponse(ctx, http.StatusOK, "No products found", nil)
			return
		}

		responses.SuccessResponse(ctx, http.StatusOK, "Successfully found all products", products)
	}

}

// GetAllProductOfferUser godoc
//
//	@Summary		Get all offers of all products (User)
//	@Security		BearerAuth
//	@Description	API for user to get all offers of all products
//	@ID				GetAllProductOffersUser
//	@Tags			User Products
//	@Router			/products/offers [get]
//	@Success		200	{object}	responses.Response{}	"Successfully found all offers for all products"
//	@Failure		500	{object}	responses.Response{}	"Failed to Get all offers"
func (p *ProductHandler) GetAllProductOffersUser() func(ctx *gin.Context) {

	return func(ctx *gin.Context) {

		pagination := requests.GetPagination(ctx)

		offers, err := p.productUseCase.FindAllProductOffers(ctx, pagination)

		if err != nil {
			responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to Get all offers", err, nil)
			return
		}

		if len(offers) == 0 {
			responses.SuccessResponse(ctx, http.StatusOK, "No offers found", nil)
			return
		}

		responses.SuccessResponse(ctx, http.StatusOK, "Successfully found all offers for all products", offers)
	}
}

// FindAllProductOffers godoc
//
//	@Summary		Get all offers of a product (User)
//	@Security		BearerAuth
//	@Description	API for user to get all offers of a product
//	@ID				FindAllProductOffers
//	@Tags			User Products
//	@Accept			json
//	@Produce		json
//	@Param			product_id	path	int	true	"Product ID"
//	@Router			/products/{product_id}/offers [get]
//	@Success		200	{object}	responses.Response{}	"Successfully found offer for given product"
func (p *ProductHandler) FindAllProductOffers(ctx *gin.Context) {

	productID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	productOffers, err := p.productUseCase.FindAllProductOffersByProductID(ctx, productID)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to find all product offers", err, nil)
		return
	}

	if len(productOffers) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No product offers found")
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully get all product offers", productOffers)
}

// GetProductByIDUser godoc
//
//	@Summary		Get a product by ID (User)
//	@Security		BearerAuth
//	@Description	API for user to get a product by ID
//	@ID				GetProductByIDUser
//	@Tags			User Products
//	@Param			product_id	path	int	true	"Product ID"
//	@Router			/products/{product_id} [get]
//	@Success		200	{object}	responses.Response{}	"Successfully found product"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		404	{object}	responses.Response{}	"Product not found"
func (p *ProductHandler) GetProductByIDUser() func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		productID, err := requests.GetParamAsUint(ctx, "product_id")
		if err != nil {
			responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
			return
		}

		product, err := p.productUseCase.FindProductIDByUser(ctx, productID)
		if err != nil {
			responses.ErrorResponse(ctx, http.StatusNotFound, "Product not found", err, nil)
			return
		}

		responses.SuccessResponse(ctx, http.StatusOK, "Successfully found product", product)
	}
}

// UpdateProduct godoc
//
//	@Summary		Update a product (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to update a product
//	@ID				UpdateProduct
//	@Tags			Admin Products
//	@Accept			json
//	@Produce		json
//	@Param			input	body	requests.UpdateProduct{}	true	"Product update input"
//	@Router			/admin/products [put]
//	@Success		200	{object}	responses.Response{}	"Successfully product updated"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		409	{object}	responses.Response{}	"Failed to update product"
//	@Failure		500	{object}	responses.Response{}	"Product name already exist for another product"
func (c *ProductHandler) UpdateProduct(ctx *gin.Context) {
	productID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	name, err1 := requests.GetFormValuesAsString(ctx, "name")
	description, err2 := requests.GetFormValuesAsString(ctx, "description")
	categoryID, err3 := requests.GetFormValuesAsUint(ctx, "category_id")
	price, err4 := requests.GetFormValuesAsUint(ctx, "price")
	puschargePrice, err5 := requests.GetFormValuesAsUint(ctx, "puscharge_price")
	brandID, err6 := requests.GetFormValuesAsUint(ctx, "brand_id")
	properties, err7 := requests.GetFormValuesAsString(ctx, "properties")

	var err8 error
	imageFileHeaders, err8 := requests.GetArrayOfFromFiles(ctx, "images", false)

	err = errors.Join(err1, err2, err3, err4, err5, err6, err7)
	if err8 != nil && err8.Error() != "http: no such file" {
		err = errors.Join(err, err8)
	}

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	updatedProduct := requests.UpdateProduct{
		ID:             productID,
		Name:           name,
		Description:    description,
		CategoryID:     categoryID,
		BrandID:        brandID,
		Price:          price,
		PuschargePrice: puschargePrice,
		Properties:     properties,
	}

	if len(imageFileHeaders) > 0 {
		updatedProduct.ImageFileHeaders = imageFileHeaders
	}

	err = c.productUseCase.UpdateProduct(ctx, updatedProduct)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to update product", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully product updated", nil)
}

// SaveProductItem godoc
//
//	@Summary		Add a product item (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add a product item for a specific product(should select at least one variation option from each variations)
//	@ID				SaveProductItem
//	@Tags			Admin Products
//	@Accept			json
//	@Produce		json
//	@Param			product_id				path		int		true	"Product ID"
//	@Param			price					formData	int		true	"Price"
//	@Param			qty_in_stock			formData	int		true	"Quantity In Stock"
//	@Param			variation_option_ids	formData	[]int	true	"Variation Option IDs"
//	@Param			images					formData	file	true	"Images"
//	@Router			/admin/products/{product_id}/items [post]
//	@Success		200	{object}	responses.Response{}	"Successfully product item added"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		409	{object}	responses.Response{}	"Product have already this configured product items exist"
func (p *ProductHandler) SaveProductItem(ctx *gin.Context) {

	productID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
	}

	qtyInStock, err2 := requests.GetFormValuesAsUint(ctx, "qty_in_stock")
	variationOptionIDS, err3 := requests.GetArrayFormValueAsUint(ctx, "variation_option_ids")

	err = errors.Join(err2, err3)

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	productItem := requests.ProductItem{
		VariationOptionIDs: variationOptionIDS,
		QtyInStock:         qtyInStock,
	}

	fmt.Println(productItem, productID)

	err = p.productUseCase.SaveProductItem(ctx, productID, productItem)

	if err != nil {

		var statusCode int

		switch {
		case errors.Is(err, usecases.ErrProductItemAlreadyExist):
			statusCode = http.StatusConflict
		case errors.Is(err, usecases.ErrNotEnoughVariations):
			statusCode = http.StatusBadRequest
		default:
			statusCode = http.StatusInternalServerError
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to add product item", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully product item added", nil)
}

// SaveProductItem godoc
//
//	@Summary		Add a product item (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add a product item for a specific product(should select at least one variation option from each variations)
//	@ID				SaveProductItem
//	@Tags			Admin Products
//	@Accept			json
//	@Produce		json
//	@Param			product_id				path		int		true	"Product ID"
//	@Param			price					formData	int		true	"Price"
//	@Param			qty_in_stock			formData	int		true	"Quantity In Stock"
//	@Param			variation_option_ids	formData	[]int	true	"Variation Option IDs"
//	@Param			images					formData	file	true	"Images"
//	@Router			/admin/products/{product_id}/items [post]
//	@Success		200	{object}	responses.Response{}	"Successfully product item added"
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		409	{object}	responses.Response{}	"Product have already this configured product items exist"
func (p *ProductHandler) UpdateProductItem(ctx *gin.Context) {

	product_item_ID, err := requests.GetParamAsUint(ctx, "product_item_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
	}

	productID, err0 := requests.GetFormValuesAsUint(ctx, "product_id")
	qtyInStock, err2 := requests.GetFormValuesAsUint(ctx, "qty_in_stock")
	qtyOutStock, err3 := requests.GetFormValuesAsUint(ctx, "qty_out_stock")
	variationOptionIDS, err4 := requests.GetArrayFormValueAsUint(ctx, "variation_option_ids")

	err = errors.Join(err0, err2, err3, err4)

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	productItem := requests.UpdateProductItem{
		ID:                 product_item_ID,
		ProductID:          productID,
		VariationOptionIDs: variationOptionIDS,
		QtyInStock:         qtyInStock,
		QtyOutStock:        qtyOutStock,
	}

	err = p.productUseCase.UpdateProductItem(ctx, productItem)

	if err != nil {

		var statusCode int

		switch {
		case errors.Is(err, usecases.ErrProductItemAlreadyExist):
			statusCode = http.StatusConflict
		case errors.Is(err, usecases.ErrNotEnoughVariations):
			statusCode = http.StatusBadRequest
		default:
			statusCode = http.StatusInternalServerError
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to update product item", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully product item updated", nil)
}

// GetAllProductItemsAdmin godoc
//
//	@Summary		Get all product items (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to get all product items for a specific product
//	@ID				GetAllProductItemsAdmin
//	@Tags			Admin Products
//	@Accept			json
//	@Produce		json
//	@Param			product_id	path	int	true	"Product ID"
//	@Router			/admin/products/{product_id}/items [get]
//	@Success		200	{object}	responses.Response{}	"Successfully get all product items"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		400	{object}	responses.Response{}	"Failed to get all product items"
func (p *ProductHandler) GetAllProductItemsAdmin() func(ctx *gin.Context) {
	return p.getAllProductItems()
}

// GetAllProductItemsUser godoc
//
//	@Summary		Get all product items (User)
//	@Security		BearerAuth
//	@Description	API for user to get all product items for a specific product
//	@ID				GetAllProductItemsUser
//	@Tags			User Products
//	@Accept			json
//	@Produce		json
//	@Param			product_id	path	int	true	"Product ID"
//	@Router			/products/{product_id}/items [get]
//	@Success		200	{object}	responses.Response{}	"Successfully get all product items"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		400	{object}	responses.Response{}	"Failed to get all product items"
func (p *ProductHandler) GetAllProductItemsUser() func(ctx *gin.Context) {
	return p.getAllProductItems()
}

// same functionality of get all product items for admin and user
func (p *ProductHandler) getAllProductItems() func(ctx *gin.Context) {

	return func(ctx *gin.Context) {

		productID, err := requests.GetParamAsUint(ctx, "product_id")
		if err != nil {
			responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		}

		productItems, err := p.productUseCase.FindAllProductItems(ctx, productID)

		if err != nil {
			responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to get all product items", err, nil)
			return
		}

		// check the product have productItem exist or not
		if len(productItems) == 0 {
			responses.SuccessResponse(ctx, http.StatusOK, "No product items found")
			return
		}

		responses.SuccessResponse(ctx, http.StatusOK, "Successfully get all product items ", productItems)
	}
}

// SaveComment godoc
//
//	@Summary		Add a new product comment (User)
//	@Security		BearerAuth
//	@Description	API for user to add a new product comment
//	@ID				SaveComment
//	@Tags			User SaveComment
//	@Body			userID		json	uint				true	"User ID added comment"
//	@Body			content		json	string				true	"Comment Content"
//	@Body			rating		json	float32				true	"Comment Rating"
//	@Success		200			{object}	responses.Response{}	"successfully comment added"
//	@Router			/products/:product_id/comments [post]
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		404	{object}	responses.Response{}	"failed to find product with ID=productID"
//	@Failure		409	{object}	responses.Response{}	"failed to add new comment with rating to product with ID=productID"
//	@Failure		409	{object}	responses.Response{}	"failed to add new comment to product with ID=productID"
func (p *ProductHandler) SaveComment(ctx *gin.Context) {

	product_ID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	var body requests.Comment
	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = p.productUseCase.SaveComments(ctx, product_ID, body)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to add comment", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully comment added")
}

// FindAllProductComments godoc
//
//	@Summary		Get all comments of a product
//	@Security		BearerAuth
//	@Description	API for user to get all comments of a product
//	@ID				FindAllProductComments
//	@Tags			User FindAllProductComments
//	@Success		200			{object}	responses.Response{}	"Successfully get all product comments"
//	@Router			/products/:product_id/comments [get]
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		404	{object}	responses.Response{}	"failed to find product with ID=productID"
//	@Failure		409	{object}	responses.Response{}	"Failed to find all product comments"
func (p *ProductHandler) FindAllProductComments(ctx *gin.Context) {

	product_ID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	productComments, err := p.productUseCase.FindAllProductComments(ctx, product_ID)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to find all product comments", err, nil)
		return
	}

	// check the product have comment exist or not
	if len(productComments) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No product comments found")
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully get all product comments ", productComments)
}

// UpdateProductComment godoc
//
//	@Summary		Update a comment of a product
//	@Security		BearerAuth
//	@Description	API for user to update a comment of a product
//	@ID				UpdateProductComment
//	@Tags			User UpdateProductComment
//	@Body			userID		json	uint				true	"User ID added comment"
//	@Body			content		json	string				true	"Comment Content"
//	@Body			rating		json	float32				true	"Comment Rating"
//	@Success		200			{object}	responses.Response{}	"Successfully get all product comments"
//	@Router			/products/:product_id/comments/:comment_id [put]
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		404	{object}	responses.Response{}	"failed to find product with ID=productID"
//	@Failure		404	{object}	responses.Response{}	"failed to find comment with ID=commentID"
//	@Failure		409	{object}	responses.Response{}	"failed to update comment with ID=commentID"
func (p *ProductHandler) UpdateProductComment(ctx *gin.Context) {

	productID, err := requests.GetParamAsUint(ctx, "product_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	commentID, err := requests.GetParamAsUint(ctx, "comment_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	var body requests.Comment
	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	productComments, err := p.productUseCase.UpdateComment(ctx, productID, commentID, body)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to update comment", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully update the comment", productComments)
}

// DeleteCommentByID godoc
//
//	@Summary		Delete a comment of a product
//	@Security		BearerAuth
//	@Description	API for user to delete a comment of a product
//	@ID				DeleteCommentByID
//	@Tags			User DeleteCommentByID
//	@Success		200			{object}	responses.Response{}	"Successfully delete the comment"
//	@Router			/products/:product_id/comments/:comment_id [delete]
//	@Failure		400	{object}	responses.Response{}	"invalid input"
//	@Failure		409	{object}	responses.Response{}	"Failed to delete the comment"
func (p *ProductHandler) DeleteCommentByID(ctx *gin.Context) {

	commentID, err := requests.GetParamAsUint(ctx, "comment_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindFormValueMessage, err, nil)
		return
	}

	err = p.productUseCase.DeleteCommentByID(ctx, commentID)

	if err != nil {
		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrProductAlreadyExist) {
			statusCode = http.StatusConflict
		}
		responses.ErrorResponse(ctx, statusCode, "Failed to delete the comment", err, nil)
		return
	}
	responses.SuccessResponse(ctx, http.StatusOK, "Successfully delete the comment")
}
