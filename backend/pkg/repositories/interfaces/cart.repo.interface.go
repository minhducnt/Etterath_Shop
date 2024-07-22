package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type CartRepository interface {
	FindCartByUserID(ctx context.Context, userID uint) (cart models.Cart, err error)
	SaveCart(ctx context.Context, userID uint) (cartID uint, err error)
	UpdateCart(ctx context.Context, cartId, discountAmount, couponID uint) error

	FindCartItemByCartAndProductItemID(ctx context.Context, cartID, productItemID uint) (cartItem models.CartItem, err error)
	FindAllCartItemsByCartID(ctx context.Context, cartID uint) (cartItems []responses.CartItem, err error)
	SaveCartItem(ctx context.Context, cartId, productItemId, qty uint) error
	DeleteCartItem(ctx context.Context, cartItemID uint) error
	DeleteAllCartItemsByCartID(ctx context.Context, cartID uint) error
	UpdateCartItemQty(ctx context.Context, cartItemId, qty uint) error

	IsCartValidForOrder(ctx context.Context, userID uint) (valid bool, err error)
}
