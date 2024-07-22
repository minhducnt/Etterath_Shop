package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
)

type StockUseCase interface {
	GetAllStockDetails(ctx context.Context, pagination requests.Pagination) (stocks []responses.Stock, err error)
	UpdateStockBySKU(ctx context.Context, updateDetails requests.UpdateStock) error
}
