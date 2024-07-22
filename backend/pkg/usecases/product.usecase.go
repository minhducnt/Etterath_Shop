package usecases

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"etterath_shop_feature/pkg/services/cloud"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"etterath_shop_feature/pkg/utils"
	"fmt"

	"github.com/jinzhu/copier"
)

type productUseCase struct {
	productRepo  interfaces.ProductRepository
	cloudService cloud.CloudService
	userRepo     interfaces.UserRepository
}

// to get a new instance of productUseCase
func NewProductUseCase(productRepo interfaces.ProductRepository, cloudService cloud.CloudService, userRepo interfaces.UserRepository) service.ProductUseCase {
	return &productUseCase{
		productRepo:  productRepo,
		cloudService: cloudService,
		userRepo:     userRepo,
	}
}

// to add new variation for a category
func (c *productUseCase) SaveVariation(ctx context.Context, categoryID uint, variationNames []string) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {

		for _, variationName := range variationNames {

			variationExist, err := repo.IsVariationNameExistForCategory(ctx, variationName, categoryID)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to check variation already exist")
			}

			if variationExist {
				return utils.PrependMessageToError(ErrVariationAlreadyExist, "variation name "+variationName)
			}

			err = c.productRepo.SaveVariation(ctx, categoryID, variationName)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to save variation")
			}
		}
		return nil
	})

	return err
}

// to update a variation
func (c *productUseCase) UpdateVariation(ctx context.Context, categoryID uint, variationID uint, variationName string) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {

		variationExist, err := repo.IsVariationNameExistForCategory(ctx, variationName, categoryID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to check variation already exist")
		}

		if variationExist {
			return utils.PrependMessageToError(ErrVariationAlreadyExist, "variation name "+variationName)
		}

		err = c.productRepo.UpdateVariation(ctx, variationID, variationName)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to update variation")
		}
		return nil
	})

	return err
}

// to delete a variation
func (c *productUseCase) DeleteVariation(ctx context.Context, variationID uint) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {

		variationOptions, err := repo.FindAllVariationOptionsByVariationID(ctx, variationID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to check variation options")
		}

		for _, variationOption := range variationOptions {
			err := repo.DeleteVariationOption(ctx, variationOption.ID)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to delete variation options")
			}
		}

		err = c.productRepo.DeleteVariation(ctx, variationID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to delete variation")
		}
		return nil
	})

	return err
}

// to add new variation value for variation
func (c *productUseCase) SaveVariationOption(ctx context.Context, variationID uint, variationOptionValues []string) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {
		for _, variationValue := range variationOptionValues {

			valueExist, err := repo.IsVariationValueExistForVariation(ctx, variationValue, variationID)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to check variation already exist")
			}
			if valueExist {
				return utils.PrependMessageToError(ErrVariationOptionAlreadyExist, "variation option value "+variationValue)
			}

			err = repo.SaveVariationOption(ctx, variationID, variationValue)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to save variation option")
			}
		}
		return nil
	})

	return err
}

// to update a variation value for variation
func (c *productUseCase) UpdateVariationOption(ctx context.Context, variationID uint,
	variationOptionID uint, variationOptionValue string) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {
		valueExist, err := repo.IsVariationValueExistForVariation(ctx, variationOptionValue, variationID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to check variation already exist")
		}
		if valueExist {
			return utils.PrependMessageToError(ErrVariationOptionAlreadyExist, "variation option value "+variationOptionValue)
		}

		err = repo.UpdateVariationOption(ctx, variationOptionID, variationOptionValue)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to update variation option")
		}
		return nil
	})

	return err
}

// to delete a variation
func (c *productUseCase) DeleteVariationOption(ctx context.Context, variationOptionID uint) error {

	err := c.productRepo.Transactions(ctx, func(repo interfaces.ProductRepository) error {
		err := c.productRepo.DeleteVariationOption(ctx, variationOptionID)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to delete variation option")
		}
		return nil
	})

	return err
}

func (c *productUseCase) FindAllVariationsAndItsValues(ctx context.Context, categoryID uint) ([]responses.Variation, error) {

	variations, err := c.productRepo.FindAllVariationsByCategoryID(ctx, categoryID)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed to find all variations of category")
	}

	// get all variation values of each variations
	for i, variation := range variations {

		variationOption, err := c.productRepo.FindAllVariationOptionsByVariationID(ctx, variation.ID)
		if err != nil {
			return nil, utils.PrependMessageToError(err, "failed to get variation option")
		}
		variations[i].VariationOptions = variationOption
	}
	return variations, nil
}

func (c *productUseCase) FindAllVariationOptionsByVariationID(ctx context.Context, variationID uint) ([]responses.VariationOption, error) {
	variationOption, err := c.productRepo.FindAllVariationOptionsByVariationID(ctx, variationID)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed to get variation option")
	}
	return variationOption, nil
}

// to get all product
func (c *productUseCase) FindAllProducts(ctx context.Context, pagination requests.Pagination) ([]responses.Product, error) {
	products, err := c.productRepo.FindAllProducts(ctx, pagination)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed to get product details from database")
	}

	// Convert product properties to json format
	// for i, product := range products {
	// 	var productProperties json.RawMessage
	// 	json.Unmarshal([]byte(product.Properties), &productProperties)
	// 	propertiesString := string(productProperties)
	// 	products[i].Properties = propertiesString
	// }

	errChan := make(chan error, 2)
	newCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {
		// get all images of each product
		for i := range products {

			select { // checking each time context is cancelled or not
			case <-newCtx.Done():
				return
			default:
				images, err := c.productRepo.FindAllProductImages(ctx, products[i].ID)

				imageUrls := make([]string, len(images))

				for j := range images {

					url, err := c.cloudService.GetFileURLFromFisebaseService(ctx, images[j])
					if err != nil {
						errChan <- utils.PrependMessageToError(err, "failed to get image url from could service")
					}
					imageUrls[j] = url
				}

				if err != nil {
					errChan <- utils.PrependMessageToError(err, "failed to find images of product")
					return
				}
				products[i].Images = imageUrls
			}
		}
		errChan <- nil
	}()

	select {
	case <-ctx.Done():
		return nil, nil
	case err := <-errChan:
		if err != nil {
			return nil, err
		}
		// no error then continue for the next check
	}

	return products, nil
}

// to get product by id
func (c *productUseCase) FindProductIDByUser(ctx context.Context, productID uint) (responses.Product, error) {

	product, err := c.productRepo.FindProductIDByUser(ctx, productID)
	if err != nil {
		return responses.Product{}, utils.PrependMessageToError(err, "failed to get product details from database")
	}

	// Convert product properties to json format
	// var productProperties json.RawMessage
	// json.Unmarshal([]byte(product.Properties), &productProperties)
	// product.Properties = string(productProperties)

	// Find product images
	images, err := c.productRepo.FindAllProductImages(ctx, productID)
	if err != nil {
		return product, err
	}

	imageUrls := make([]string, len(images))

	for i := range images {

		url, err := c.cloudService.GetFileURLFromFisebaseService(ctx, images[i])
		if err != nil {
			return product, utils.PrependMessageToError(err, "failed to get image url from could service")
		}
		imageUrls[i] = url
	}

	product.Images = imageUrls

	return product, nil
}

// to add new product
func (c *productUseCase) SaveProduct(ctx context.Context, product requests.Product) error {

	productNameExist, err := c.productRepo.IsProductNameExist(ctx, product.Name)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to check product name already exist")
	}
	if productNameExist {
		return utils.PrependMessageToError(ErrProductAlreadyExist, "product name "+product.Name)
	}

	err = c.productRepo.Transactions(ctx, func(trxRepo interfaces.ProductRepository) error {

		// new product
		newProduct := models.Product{
			Name:           product.Name,
			Description:    product.Description,
			CategoryID:     product.CategoryID,
			BrandID:        product.BrandID,
			Price:          product.Price,
			PuschargePrice: product.PuschargePrice,
			Properties:     product.Properties,
		}

		// Save product to DB
		productID, err := c.productRepo.SaveProduct(ctx, newProduct)
		if err != nil {
			return utils.PrependMessageToError(err, "failed to save product")
		}

		errChan := make(chan error, 2)
		newCtx, cancel := context.WithCancel(ctx) // for any of one of goroutine get error then cancel the working of other also
		defer cancel()

		go func() {
			// save all images for the given product
			for _, imageFile := range product.ImageFileHeaders {

				select {
				case <-newCtx.Done():
					return
				default:
					// upload image on cloud
					uploadID, err := c.cloudService.UploadFileFirebase(ctx, imageFile)
					if err != nil {
						errChan <- utils.PrependMessageToError(err, "failed to upload image to cloud")
						return
					}
					// save upload id on database
					err = trxRepo.SaveProductImage(ctx, productID, uploadID)
					if err != nil {
						errChan <- utils.PrependMessageToError(err, "failed to save image for product on database")
						return
					}
				}
			}
			errChan <- nil
		}()

		// wait for the go routine to complete
		select {
		case <-ctx.Done():
			return nil
		case err := <-errChan:
			if err != nil { // if any of the goroutine send error then return the error
				return err
			}
			// no error then continue for the next check of select
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

// for add new productItem for a specific product
func (c *productUseCase) SaveProductItem(ctx context.Context, productID uint, productItem requests.ProductItem) error {

	// variationCount, err := c.productRepo.FindVariationCountForProduct(ctx, productID)
	// if err != nil {
	// 	return utils.PrependMessageToError(err, "failed to get variation count of product from database")
	// }

	// if len(productItem.VariationOptionIDs) != int(variationCount) {
	// 	return ErrNotEnoughVariations
	// }

	// check the given all combination already exist (Color:Red with Size:M)
	productItemExist, err := c.isProductVariationCombinationExist(productID, productItem.VariationOptionIDs)
	if err != nil {
		return err
	}
	if productItemExist {
		return ErrProductItemAlreadyExist
	}

	err = c.productRepo.Transactions(ctx, func(trxRepo interfaces.ProductRepository) error {

		sku := utils.GenerateSKU()
		newProductItem := models.ProductItem{
			ProductID:  productID,
			QtyInStock: productItem.QtyInStock,
			SKU:        sku,
		}

		productItemID, err := trxRepo.SaveProductItem(ctx, newProductItem)

		if err != nil {
			return utils.PrependMessageToError(err, "failed to save product item")
		}

		errChan := make(chan error, 2)
		newCtx, cancel := context.WithCancel(ctx) // for any of one of goroutine get error then cancel the working of other also
		defer cancel()

		go func() {
			// save all product configurations based on given variation option id
			for _, variationOptionID := range productItem.VariationOptionIDs {

				select {
				case <-newCtx.Done():
					return
				default:
					err = trxRepo.SaveProductConfiguration(ctx, productItemID, variationOptionID)
					if err != nil {
						errChan <- utils.PrependMessageToError(err, "failed to save product_item configuration")
						return
					}
				}
			}
			errChan <- nil
		}()

		// wait for the both go routine to complete
		for i := 1; i <= 1; i++ {

			select {
			case <-ctx.Done():
				return nil
			case err := <-errChan:
				if err != nil { // if any of the goroutine send error then return the error
					return err
				}
				// no error then continue for the next check of select
			}

		}

		return nil
	})

	if err != nil {
		return err
	}
	return nil
}

// step 1 : get product_id and and all variation id as function parameter
// step 2 : initialize an map for storing product item id and its count(map[uint]int)
// step 3 : loop through the variation option ids
// step 4 : then find all product items ids with given product id and the loop variation option id
// step 5 : if the product item array length is zero means the configuration not exist return false
// step 6 : then loop through the product items ids array(got from database)
// step 7 : add each id on the map and increment its count
// step 8 : check if any of the product items id's count is greater than the variation options ids length then return true
// step 9 : if the loop exist means product configuration is not exist
func (c *productUseCase) isProductVariationCombinationExist(productID uint, variationOptionIDs []uint) (exist bool, err error) {

	setOfIds := map[uint]int{}

	for _, variationOptionID := range variationOptionIDs {

		productItemIds, err := c.productRepo.FindAllProductItemIDsByProductIDAndVariationOptionID(context.TODO(),
			productID, variationOptionID)
		if err != nil {
			return false, utils.PrependMessageToError(err, "failed to find product item ids from database using product id and variation option id")
		}

		if len(productItemIds) == 0 {
			return false, nil
		}

		for _, productItemID := range productItemIds {

			setOfIds[productItemID]++
			// if any of the ids count is equal to array length it means product item id of this is the existing product item of this configuration
			if setOfIds[productItemID] >= len(variationOptionIDs) {
				return true, nil
			}
		}
	}
	return false, nil
}

// for get all productItem for a specific product
func (c *productUseCase) FindAllProductItems(ctx context.Context, productID uint) ([]responses.ProductItems, error) {

	productItems, err := c.productRepo.FindAllProductItems(ctx, productID)
	if err != nil {
		return productItems, err
	}

	errChan := make(chan error, 2)
	_, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {

		// get all variation values of each product items
		for i := range productItems {

			select { // checking each time context is cancelled or not
			case <-ctx.Done():
				return
			default:
				variationValues, err := c.productRepo.FindAllVariationValuesOfProductItem(ctx, productItems[i].ID)
				if err != nil {
					errChan <- utils.PrependMessageToError(err, "failed to find variation values product item")
					return
				}
				productItems[i].VariationValues = variationValues
			}
		}
		errChan <- nil
	}()

	select {
	case <-ctx.Done():
		return nil, nil
	case err := <-errChan:
		if err != nil {
			return nil, err
		}
		// no error then continue for the next check
	}

	return productItems, nil
}

// to get all product offers
func (c *productUseCase) FindAllProductOffers(ctx context.Context, pagination requests.Pagination) ([]responses.ProductOffer, error) {

	productOffers, err := c.productRepo.FindAllProductOffers(ctx, pagination)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed to get product offers from database")
	}

	errChan := make(chan error, 2)
	newCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {
		// get all images of each product
		for i := range productOffers {

			select { // checking each time context is cancelled or not
			case <-newCtx.Done():
				return
			default:
				images, err := c.productRepo.FindAllProductImages(ctx, productOffers[i].ID)

				imageUrls := make([]string, len(images))

				for j := range images {

					url, err := c.cloudService.GetFileURLFromFisebaseService(ctx, images[j])
					if err != nil {
						errChan <- utils.PrependMessageToError(err, "failed to get image url from could service")
					}
					imageUrls[j] = url
				}

				if err != nil {
					errChan <- utils.PrependMessageToError(err, "failed to find images of product")
					return
				}
				productOffers[i].Images = imageUrls
			}
		}
		errChan <- nil
	}()

	select {
	case <-ctx.Done():
		return nil, nil
	case err := <-errChan:
		if err != nil {
			return nil, err
		}
		// no error then continue for the next check
	}

	return productOffers, nil

}

// to get all product offers for a specific product
func (c *productUseCase) FindAllProductOffersByProductID(ctx context.Context, productID uint) ([]responses.ProductOffer, error) {

	productOffers, err := c.productRepo.FindAllProductOffersByProductID(ctx, productID)
	if err != nil {
		return nil, utils.PrependMessageToError(err, "failed to get product offers from database")
	}

	return productOffers, nil
}

func (c *productUseCase) UpdateProduct(ctx context.Context, updateDetails requests.UpdateProduct) error {

	nameExistForOther, err := c.productRepo.IsProductNameExistForOtherProduct(ctx, updateDetails.Name, updateDetails.ID)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to check product name already exist for other product")
	}

	if nameExistForOther {
		return utils.PrependMessageToError(ErrProductAlreadyExist, "product name "+updateDetails.Name)
	}

	_, err = c.productRepo.FindProductByID(ctx, updateDetails.ID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find product with ID=%d", updateDetails.ID)
		return utils.PrependMessageToError(err, errMessage)
	}

	var product models.Product
	copier.Copy(&product, &updateDetails)

	if len(updateDetails.ImageFileHeaders) > 0 {
		// Get all the images of the product from the product ID in DB
		productItemImages, err := c.productRepo.FindAllProductImages(ctx, updateDetails.ID)
		if err != nil {
			errMessage := fmt.Sprintf("failed to find product image with product_id=%d", updateDetails.ID)
			return utils.PrependMessageToError(err, errMessage)
		}
		// Delete all old images in Firebase Service
		for _, productItemImage := range productItemImages {
			err := c.cloudService.DeleteObjectFromFisebaseService(ctx, productItemImage)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to delete current product image")
			}
		}
		// Delete all old images URL in product_image table
		err = c.productRepo.DeleteAllProductImages(ctx, updateDetails.ID)
		if err != nil {
			errMessage := fmt.Sprintf("failed to delete product with product_id=%d", updateDetails.ID)
			return utils.PrependMessageToError(err, errMessage)
		}
		// Upload new files to Firebase Service and store them URL in product_image table
		for _, newProductItemImage := range updateDetails.ImageFileHeaders {
			newProductImage, err := c.cloudService.UploadFileFirebase(ctx, newProductItemImage)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to upload product image")
			}
			// save upload id on database
			err = c.productRepo.SaveProductImage(ctx, updateDetails.ID, newProductImage)
			if err != nil {
				return utils.PrependMessageToError(err, "failed to update product image")
			}
		}
	}

	err = c.productRepo.UpdateProduct(ctx, product)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to update product")
	}
	return nil
}

func (c *productUseCase) UpdateProductItem(ctx context.Context, updateProductItem requests.UpdateProductItem) error {
	_, err := c.productRepo.FindProductItemByID(ctx, updateProductItem.ID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find product item with ID=%d", updateProductItem.ID)
		return utils.PrependMessageToError(err, errMessage)
	}

	var productItem models.ProductItem
	copier.Copy(&productItem, &updateProductItem)

	err = c.productRepo.UpdateProductItem(ctx, productItem)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to update product")
	}
	return nil
}

func (c *productUseCase) SaveComments(ctx context.Context, productID uint, newComment requests.Comment) error {
	// check if the product is already existing
	_, err := c.productRepo.FindProductByID(ctx, productID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find product with ID=%d", productID)
		return utils.PrependMessageToError(err, errMessage)
	}

	// check if the user is already existing
	_, err = c.userRepo.FindUserByUserID(ctx, newComment.UserID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find user with ID=%d", newComment.UserID)
		return utils.PrependMessageToError(err, errMessage)
	}

	var comment models.Comment
	copier.Copy(&comment, &newComment)
	// If rating is specified, add new comment with rating
	if comment.Rating != nil {
		err = c.productRepo.SaveCommentWithRating(ctx, productID, comment)
		if err != nil {
			errMessage := fmt.Sprintf("failed to add new comment with rating to product with ID=%d", productID)
			return utils.PrependMessageToError(err, errMessage)
		}
		return nil
	}
	// If rating is specified, only add comment with content comment
	err = c.productRepo.SaveCommentWithoutRating(ctx, productID, comment)
	if err != nil {
		errMessage := fmt.Sprintf("failed to add new comment to product with ID=%d", productID)
		return utils.PrependMessageToError(err, errMessage)
	}
	return nil
}

func (c *productUseCase) FindAllProductComments(ctx context.Context, productID uint) ([]responses.Comment, error) {
	// check if the product is already existing
	_, err := c.productRepo.FindProductByID(ctx, productID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find product with ID=%d", productID)
		return nil, utils.PrependMessageToError(err, errMessage)
	}

	productComments, err := c.productRepo.FindAllCommentForProduct(ctx, productID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to add new comment to product with ID=%d", productID)
		return nil, utils.PrependMessageToError(err, errMessage)
	}

	// get all user details of each comments
	for i := range productComments {
		user, err := c.userRepo.FindUserByUserID(ctx, productComments[i].UserID)
		if err != nil {
			errMessage := fmt.Sprintf("failed to find user with ID=%d", productComments[i].UserID)
			return nil, utils.PrependMessageToError(err, errMessage)
		}

		result := responses.User{
			ID:          user.ID,
			FirstName:   user.FirstName,
			LastName:    user.LastName,
			GoogleImage: user.GoogleImage,
			Email:       user.Email,
			Phone:       user.Phone,
		}

		productComments[i].User = result
	}

	return productComments, nil
}

func (c *productUseCase) UpdateComment(ctx context.Context, productID uint,
	commentID uint, updatedComment requests.Comment) (responses.Comment, error) {
	commentAfterUpdated := responses.Comment{}
	var comment models.Comment
	copier.Copy(&comment, &updatedComment)
	// check if the product is already existing
	_, err := c.productRepo.FindProductByID(ctx, productID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find product with ID=%d", productID)
		return commentAfterUpdated, utils.PrependMessageToError(err, errMessage)
	}

	// check if the comment is already existing
	_, err = c.productRepo.FindCommentByID(ctx, commentID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to find comment with ID=%d", commentID)
		return commentAfterUpdated, utils.PrependMessageToError(err, errMessage)
	}

	commentAfterUpdated, err = c.productRepo.UpdateComment(ctx, commentID, commentID, comment)
	if err != nil {
		errMessage := fmt.Sprintf("failed to update comment with ID=%d", commentID)
		return commentAfterUpdated, utils.PrependMessageToError(err, errMessage)
	}
	return commentAfterUpdated, nil
}

func (c *productUseCase) DeleteCommentByID(ctx context.Context, commentID uint) error {
	err := c.productRepo.DeleteComment(ctx, commentID)
	if err != nil {
		errMessage := fmt.Sprintf("failed to delete comment with ID=%d", commentID)
		return utils.PrependMessageToError(err, errMessage)
	}
	return nil
}
