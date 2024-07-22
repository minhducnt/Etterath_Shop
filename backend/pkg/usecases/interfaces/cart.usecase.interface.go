package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type CartUseCase interface {
	SaveProductItemToCart(ctx context.Context, userID, productItemId, qty uint) error    // save product_item to cart
	RemoveProductItemFromCartItem(ctx context.Context, userID, productItemId uint) error // remove product_item from cart
	UpdateCartItem(ctx context.Context, updateDetails requests.UpdateCartItem) error     // edit cartItems( quantity change )
	GetUserCart(ctx context.Context, userID uint) (cart models.Cart, err error)
	GetUserCartItems(ctx context.Context, cartId uint) (cartItems []responses.CartItem, err error)
}
