package usecases

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/repositories/interfaces"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"etterath_shop_feature/pkg/utils"
	"fmt"
)

type categoryUseCase struct {
	categoryRepo interfaces.CategoryRepository
}

// to get a new instance of categoryUseCase
func NewCategoryUseCase(categoryRepo interfaces.CategoryRepository) service.CategoryUseCase {
	return &categoryUseCase{
		categoryRepo: categoryRepo,
	}
}

func (c *categoryUseCase) FindAllCategories(ctx context.Context, pagination requests.Pagination) ([]responses.Category, error) {

	categories, err := c.categoryRepo.FindAllMainCategories(ctx, pagination)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed find all main categories")
	}

	for i, category := range categories {

		subCategory, err := c.categoryRepo.FindAllSubCategories(ctx, category.ID)
		if err != nil {
			return nil, utils.PrependMessageToError(err, "failed to find sub categories")
		}
		categories[i].SubCategory = subCategory
	}

	return categories, nil
}

// Save category
func (c *categoryUseCase) SaveCategory(ctx context.Context, categoryName string) error {

	categoryExist, err := c.categoryRepo.IsCategoryNameExist(ctx, categoryName)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to check category already exist")
	}
	if categoryExist {
		return ErrCategoryAlreadyExist
	}

	err = c.categoryRepo.SaveCategory(ctx, categoryName)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to save category")
	}

	return nil
}

// Save Sub category
func (c *categoryUseCase) SaveSubCategory(ctx context.Context, subCategory requests.SubCategory) error {

	subCatExist, err := c.categoryRepo.IsSubCategoryNameExist(ctx, subCategory.Name, subCategory.CategoryID)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to check sub category already exist")
	}
	if subCatExist {
		return ErrCategoryAlreadyExist
	}

	err = c.categoryRepo.SaveSubCategory(ctx, subCategory.CategoryID, subCategory.Name)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to save sub category")
	}

	return nil
}

// Update a category
func (c *categoryUseCase) UpdateCategory(ctx context.Context, categoryID uint, categoryName string) error {

	// Check category is existing
	_, err := c.categoryRepo.GetCategoryByID(ctx, categoryID)
	if err != nil {
		errMsg := fmt.Sprintf("failed to get category with ID %d", categoryID)
		return utils.PrependMessageToError(err, errMsg)
	}

	err = c.categoryRepo.UpdateCategory(ctx, categoryID, categoryName)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to update category")
	}

	return nil
}

// Delete a category
func (c *categoryUseCase) DeleteCategory(ctx context.Context, categoryID uint) error {
	// Check category is existing
	_, err := c.categoryRepo.GetCategoryByID(ctx, categoryID)
	if err != nil {
		errMsg := fmt.Sprintf("failed to get category with ID %d", categoryID)
		return utils.PrependMessageToError(err, errMsg)
	}

	subCategories, err := c.categoryRepo.FindAllSubCategories(ctx, categoryID)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to get sub category")
	}
	for _, subCategory := range subCategories {
		err = c.categoryRepo.DeleteCategory(ctx, subCategory.ID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to delete sub category")
		}
	}

	err = c.categoryRepo.DeleteCategory(ctx, categoryID)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to delete category")
	}

	return nil
}
