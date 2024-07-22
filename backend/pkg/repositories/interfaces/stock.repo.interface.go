package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
)

type StockRepository interface {
	FindAll(ctx context.Context, pagination requests.Pagination) (stocks []responses.Stock, err error)
	Update(ctx context.Context, updateValues requests.UpdateStock) error
}
