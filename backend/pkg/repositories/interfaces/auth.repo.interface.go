package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/models"
)

type AuthRepository interface {
	SaveRefreshSession(ctx context.Context, refreshSession models.RefreshSession) error
	FindRefreshSessionByTokenID(ctx context.Context, tokenID string) (models.RefreshSession, error)

	SaveOtpSession(ctx context.Context, otpSession models.OtpSession) error
	FindOtpSession(ctx context.Context, otpID string) (models.OtpSession, error)
}
