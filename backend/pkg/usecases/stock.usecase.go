package usecases

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/repositories/interfaces"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"log"
)

type stockUseCase struct {
	stockRepo interfaces.StockRepository
}

func NewStockUseCase(stockRepo interfaces.StockRepository) service.StockUseCase {

	return &stockUseCase{
		stockRepo: stockRepo,
	}
}

func (c *stockUseCase) GetAllStockDetails(ctx context.Context, pagination requests.Pagination) (stocks []responses.Stock, err error) {
	stocks, err = c.stockRepo.FindAll(ctx, pagination)

	if err != nil {
		return stocks, err
	}
	log.Printf("Successfully got stock details")
	return stocks, nil
}

func (c *stockUseCase) UpdateStockBySKU(ctx context.Context, updateDetails requests.UpdateStock) error {

	err := c.stockRepo.Update(ctx, updateDetails)

	if err != nil {
		return err
	}

	log.Printf("Successfully updated of stock details of stock with sku %v", updateDetails.SKU)
	return nil
}
