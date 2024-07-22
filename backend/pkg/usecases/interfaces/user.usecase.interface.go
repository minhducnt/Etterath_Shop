package interfaces

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
)

type UserUseCase interface {
	FindProfile(ctx context.Context, userId uint) (models.User, error)
	UpdateProfile(ctx context.Context, user models.User) error

	// profile side

	//address side
	SaveAddress(ctx context.Context, userID uint, address models.Address, isDefault bool) error // save address
	UpdateAddress(ctx context.Context, addressBody requests.EditAddress, userID uint) error
	FindAddresses(ctx context.Context, userID uint) ([]responses.Address, error) // to get all address of a user

	// wishlist
	SaveToWishList(ctx context.Context, wishList models.WishList) error
	RemoveFromWishList(ctx context.Context, userID, productItemID uint) error
	FindAllWishListItems(ctx context.Context, userID uint) ([]responses.WishListItem, error)
}
