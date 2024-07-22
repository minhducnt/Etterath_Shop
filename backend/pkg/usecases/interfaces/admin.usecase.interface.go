package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type AdminUseCase interface {
	SignUp(ctx context.Context, admin models.Admin) error

	FindAllUser(ctx context.Context, pagination requests.Pagination) (users []responses.User, err error)
	BlockOrUnBlockUser(ctx context.Context, blockDetails requests.BlockUser) error

	GetFullSalesReport(ctx context.Context, requestData requests.SalesReport) (salesReport []responses.SalesReport, err error)
	GetAdmminProfile(ctx context.Context, adminID uint) (admin responses.Admin, err error)
	UpdateAdminProfile(ctx context.Context, adminID uint, adminProfile requests.Admin) error
}
