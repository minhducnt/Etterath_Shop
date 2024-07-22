package interfaces

import (
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/models"
)

type BrandRepository interface {
	IsExist(brand models.Brand) (bool, error)
	Save(brand models.Brand) (models.Brand, error)
	Update(brand models.Brand) error
	FindAll(pagination requests.Pagination) ([]models.Brand, error)
	FindOne(brandID uint) (models.Brand, error)
	Delete(brandID uint) error
}
