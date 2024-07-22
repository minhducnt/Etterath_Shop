package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
)

type CategoryUseCase interface {
	FindAllCategories(ctx context.Context, pagination requests.Pagination) ([]responses.Category, error)
	UpdateCategory(ctx context.Context, categoryID uint, categoryName string) error
	DeleteCategory(ctx context.Context, categoryID uint) error
	SaveCategory(ctx context.Context, categoryName string) error
	SaveSubCategory(ctx context.Context, subCategory requests.SubCategory) error
}
