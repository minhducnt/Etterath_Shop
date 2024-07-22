package handlers

import (
	"errors"
	"etterath_shop_feature/pkg/api/handlers/interfaces"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/usecases"
	usecaseInterface "etterath_shop_feature/pkg/usecases/interfaces"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	categoryUseCase usecaseInterface.CategoryUseCase
}

func NewCategoryHandler(categoryUsecase usecaseInterface.CategoryUseCase) interfaces.CategoryHandler {
	return &CategoryHandler{
		categoryUseCase: categoryUsecase,
	}
}

// GetAllCategories godoc
//
//	@Summary		Get all categories (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to get all categories and their subcategories
//	@Tags			Admin Category
//	@ID				GetAllCategories
//	@Accept			json
//	@Produce		json
//	@Param			page_number	query	int	false	"Page number"
//	@Param			count		query	int	false	"Count"
//	@Router			/admin/categories [get]
//	@Success		200	{object}	responses.Response{}	"Successfully retrieved all categories"
//	@Failure		500	{object}	responses.Response{}	"Failed to retrieve categories"
func (p *CategoryHandler) GetAllCategories(ctx *gin.Context) {

	pagination := requests.GetPagination(ctx)

	categories, err := p.categoryUseCase.FindAllCategories(ctx, pagination)

	if err != nil {
		responses.ErrorResponse(ctx, http.StatusInternalServerError, "Failed to retrieve categories", err, nil)
		return
	}

	if len(categories) == 0 {
		responses.SuccessResponse(ctx, http.StatusOK, "No categories found", nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusOK, "Successfully retrieved all categories", categories)
}

// SaveCategory godoc
//
//	@Summary		Add a new category (Admin)
//	@Security		BearerAuth
//	@Description	API for Admin to save new category
//	@Tags			Admin Category
//	@ID				SaveCategory
//	@Accept			json
//	@Produce		json
//	@Param			input	body	requests.Category{}	true	"Category details"
//	@Router			/admin/categories [post]
//	@Success		201	{object}	responses.Response{}	"Successfully added category"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		409	{object}	responses.Response{}	"Category already exist"
//	@Failure		409	{object}	responses.Response{}	"Failed to save category"
func (c *CategoryHandler) SaveCategory(ctx *gin.Context) {

	var body requests.Category

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err := c.categoryUseCase.SaveCategory(ctx, body.Name)

	if err != nil {

		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrCategoryAlreadyExist) {
			statusCode = http.StatusConflict
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to add category", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully added category")
}

// SaveSubCategory godoc
//
//	@Summary		Add a new subcategory (Admin)
//	@Security		BearerAuth
//	@Description	API for admin to add a new sub category for a existing category
//	@Tags			Admin Category
//	@ID				SaveSubCategory
//	@Accept			json
//	@Produce		json
//	@Param			input	body	requests.SubCategory{}	true	"Subcategory details"
//	@Router			/admin/categories/sub-categories [post]
//	@Success		201	{object}	responses.Response{}	"Successfully added subcategory"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		409	{object}	responses.Response{}	"Sub category already exist"
//	@Failure		500	{object}	responses.Response{}	"Failed to add subcategory"
func (c *CategoryHandler) SaveSubCategory(ctx *gin.Context) {

	var body requests.SubCategory
	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err := c.categoryUseCase.SaveSubCategory(ctx, body)

	if err != nil {

		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrCategoryAlreadyExist) {
			statusCode = http.StatusConflict
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to add sub category", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully sub category added")
}

// UpdateCategory godoc
//
//	@Summary		Update category (Admin)
//	@Security		BearerAuth
//	@Description	API for Admin to update category
//	@Tags			Admin Category
//	@ID				UpdateCategory
//	@Accept			json
//	@Produce		json
//	@Param			input	body	requests.Category{}	true	"Category details"
//	@Router			/admin/categories/:category_id [put]
//	@Success		201	{object}	responses.Response{}	"Successfully updated category"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		409	{object}	responses.Response{}	"Category already exist"
//	@Failure		409	{object}	responses.Response{}	"Failed to update category"
func (c *CategoryHandler) UpdateCategory(ctx *gin.Context) {

	categoryID, err := requests.GetParamAsUint(ctx, "category_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	var body requests.Category

	if err := ctx.ShouldBindJSON(&body); err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindJsonFailMessage, err, nil)
		return
	}

	err = c.categoryUseCase.UpdateCategory(ctx, categoryID, body.Name)

	if err != nil {

		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrCategoryAlreadyExist) {
			statusCode = http.StatusConflict
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to update category", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully updated category")
}

// DeleteCategory godoc
//
//	@Summary		Delete category (Admin)
//	@Security		BearerAuth
//	@Description	API for Admin to delete category
//	@Tags			Admin Category
//	@ID				DeleteCategory
//	@Accept			json
//	@Produce		json
//	@Router			/admin/categories/:category_id [delete]
//	@Success		201	{object}	responses.Response{}	"Successfully deleted category"
//	@Failure		400	{object}	responses.Response{}	"Invalid input"
//	@Failure		409	{object}	responses.Response{}	"Failed to delete category"
func (c *CategoryHandler) DeleteCategory(ctx *gin.Context) {

	categoryID, err := requests.GetParamAsUint(ctx, "category_id")
	if err != nil {
		responses.ErrorResponse(ctx, http.StatusBadRequest, BindParamFailMessage, err, nil)
		return
	}

	err = c.categoryUseCase.DeleteCategory(ctx, categoryID)

	if err != nil {

		statusCode := http.StatusInternalServerError
		if errors.Is(err, usecases.ErrCategoryAlreadyExist) {
			statusCode = http.StatusConflict
		}

		responses.ErrorResponse(ctx, statusCode, "Failed to delete category", err, nil)
		return
	}

	responses.SuccessResponse(ctx, http.StatusCreated, "Successfully deleted category")
}
