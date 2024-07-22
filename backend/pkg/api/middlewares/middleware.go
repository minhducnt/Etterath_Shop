package middlewares

import (
	token "etterath_shop_feature/pkg/services/tokens"

	"github.com/gin-gonic/gin"
)

type Middleware interface {
	AuthenticateUser() gin.HandlerFunc
	AuthenticateAdmin() gin.HandlerFunc
	TrimSpaces() gin.HandlerFunc
}

type middleware struct {
	tokenService token.TokenService
}

func NewMiddleware(tokenService token.TokenService) Middleware {
	return &middleware{
		tokenService: tokenService,
	}
}
