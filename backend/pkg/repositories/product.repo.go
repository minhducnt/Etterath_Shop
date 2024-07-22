package repositories

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"time"

	"gorm.io/gorm"
)

type productDatabase struct {
	DB *gorm.DB
}

func NewProductRepository(db *gorm.DB) interfaces.ProductRepository {
	return &productDatabase{
		DB: db,
	}
}

func (c *productDatabase) Transactions(ctx context.Context, trxFn func(repo interfaces.ProductRepository) error) error {

	trx := c.DB.Begin()

	repo := NewProductRepository(trx)

	if err := trxFn(repo); err != nil {
		trx.Rollback()
		return err
	}

	if err := trx.Commit().Error; err != nil {
		trx.Rollback()
		return err
	}
	return nil
}

// Find all variations which related to given category id
func (c *productDatabase) FindAllVariationsByCategoryID(ctx context.Context,
	categoryID uint) (variations []responses.Variation, err error) {

	query := `SELECT id, name FROM variations WHERE category_id = $1`
	err = c.DB.Raw(query, categoryID).Scan(&variations).Error

	return
}

// Find all variation options which related to given variation id
func (c productDatabase) FindAllVariationOptionsByVariationID(ctx context.Context,
	variationID uint) (variationOptions []responses.VariationOption, err error) {

	query := `SELECT id, value FROM variation_options WHERE variation_id = $1`
	err = c.DB.Raw(query, variationID).Scan(&variationOptions).Error

	return
}

// To check a variation exist for the given category
func (c *productDatabase) IsVariationNameExistForCategory(ctx context.Context,
	name string, categoryID uint) (exist bool, err error) {

	query := `SELECT EXISTS(SELECT 1 FROM variations WHERE name = $1 AND category_id = $2)`
	err = c.DB.Raw(query, name, categoryID).Scan(&exist).Error

	return
}

// To check a variation value exist for the given variation
func (c *productDatabase) IsVariationValueExistForVariation(ctx context.Context,
	value string, variationID uint) (exist bool, err error) {

	query := `SELECT EXISTS(SELECT 1 FROM variation_options WHERE value = $1 AND variation_id = $2)`
	err = c.DB.Raw(query, value, variationID).Scan(&exist).Error

	return
}

// Save Variation for category
func (c *productDatabase) SaveVariation(ctx context.Context, categoryID uint, variationName string) error {

	query := `INSERT INTO variations (category_id, name) VALUES($1, $2)`
	err := c.DB.Exec(query, categoryID, variationName).Error

	return err
}

// Update Variation for category
func (c *productDatabase) UpdateVariation(ctx context.Context,
	variationID uint, variationName string) error {

	query := `UPDATE variations SET name = $1
	WHERE id = $2`
	err := c.DB.Exec(query, variationName, variationID).Error

	return err
}

// Delete Variation
func (c *productDatabase) DeleteVariation(ctx context.Context, variationID uint) error {

	query := `DELETE FROM public.variations WHERE id=$1`
	err := c.DB.Exec(query, variationID).Error

	return err
}

// add variation option
func (c *productDatabase) SaveVariationOption(ctx context.Context, variationID uint, variationValue string) error {

	query := `INSERT INTO variation_options (variation_id, value) VALUES($1, $2)`
	err := c.DB.Exec(query, variationID, variationValue).Error

	return err
}

// Update Variation Option
func (c *productDatabase) UpdateVariationOption(ctx context.Context,
	variationOptionID uint, variationOptionValue string) error {

	query := `UPDATE variation_options SET value = $1
	WHERE id = $2`
	err := c.DB.Exec(query, variationOptionValue, variationOptionID).Error

	return err
}

// Delete Variation Option
func (c *productDatabase) DeleteVariationOption(ctx context.Context, variationOptionID uint) error {

	query := `DELETE FROM public.variation_options WHERE id=$1`
	err := c.DB.Exec(query, variationOptionID).Error

	return err
}

// find product by id
func (c *productDatabase) FindProductByID(ctx context.Context, productID uint) (product models.Product, err error) {

	query := `SELECT * FROM products WHERE id = $1`
	err = c.DB.Raw(query, productID).Scan(&product).Error

	return
}

// find product by user id
func (c *productDatabase) FindProductIDByUser(ctx context.Context, productID uint) (product responses.Product, err error) {

	query := `SELECT DISTINCT p.id, p.name, p.description, p.properties, p.price, p.discount_price, p.category_id, sc.name AS category_name, 
		mc.name AS main_category_name, p.brand_id, b.name AS brand_name, mc.id AS main_category_id,
		p.created_at, p.updated_at
		FROM products p
		INNER JOIN categories sc ON p.category_id = sc.id
		INNER JOIN categories mc ON sc.category_id = mc.id
		INNER JOIN brands b ON b.id = p.brand_id
		WHERE p.id = $1`

	err = c.DB.Raw(query, productID).Scan(&product).Error

	return
}

func (c *productDatabase) IsProductNameExistForOtherProduct(ctx context.Context,
	name string, productID uint) (exist bool, err error) {

	query := `SELECT EXISTS(SELECT id FROM products WHERE name = $1 AND id != $2)`
	err = c.DB.Raw(query, name, productID).Scan(&exist).Error

	return
}

func (c *productDatabase) IsProductNameExist(ctx context.Context, productName string) (exist bool, err error) {

	query := `SELECT EXISTS(SELECT 1 FROM products WHERE name = $1)`
	err = c.DB.Raw(query, productName).Scan(&exist).Error

	return
}

// to add a new product in database
func (c *productDatabase) SaveProduct(ctx context.Context, product models.Product) (productID uint, err error) {

	query := `INSERT INTO products (name, description, properties, category_id, brand_id, price, puscharge_price, created_at, discount_price)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id AS product_id`

	createdAt := time.Now()
	err = c.DB.Raw(query, product.Name, product.Description, product.Properties, product.CategoryID, product.BrandID,
		product.Price, product.PuschargePrice, createdAt, product.DiscountPrice).Scan(&productID).Error

	return
}

// update product
func (c *productDatabase) UpdateProduct(ctx context.Context, product models.Product) error {

	query := `UPDATE products SET name = $1, description = $2, properties = $3, category_id = $4, 
	price = $5, puscharge_price = $6, brand_id = $7, updated_at = $8
	WHERE id = $9`

	updatedAt := time.Now()

	err := c.DB.Exec(query, product.Name, product.Description, product.Properties, product.CategoryID,
		product.Price, product.PuschargePrice, product.BrandID, updatedAt, product.ID).Error

	return err
}

// update product-item
func (c *productDatabase) UpdateProductItem(ctx context.Context, productItem models.ProductItem) error {

	// Update product-item
	query := `UPDATE product_items SET product_id = $1, qty_in_stock = $2, qty_out_stock = $3,
	sku = $4, updated_at = $5
	WHERE id = $6`

	updatedAt := time.Now()

	err := c.DB.Exec(query, productItem.Product, productItem.QtyInStock, productItem.QtyOutStock,
		productItem.SKU, updatedAt, productItem.ID).Error

	return err
}

// update product-item
func (c *productDatabase) UpdateProductItemQty(ctx context.Context, productItemID, qty uint) error {

	// Update product-item
	query := `UPDATE product_items SET qty_in_stock = $1, updated_at = $2
	WHERE id = $3`

	updatedAt := time.Now()

	err := c.DB.Exec(query, qty, updatedAt, productItemID).Error

	return err
}

// get all products from database
func (c *productDatabase) FindAllProducts(ctx context.Context, pagination requests.Pagination) (products []responses.Product, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT DISTINCT p.id, p.name, p.description, p.properties, p.price, p.puscharge_price, p.discount_price, p.category_id, sc.name AS category_name, 
	mc.name AS main_category_name, p.brand_id, b.name AS brand_name, mc.id AS main_category_id,
	p.created_at, p.updated_at
	FROM products p
	INNER JOIN categories sc ON p.category_id = sc.id
	INNER JOIN categories mc ON sc.category_id = mc.id
	INNER JOIN brands b ON b.id = p.brand_id
	ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	err = c.DB.Raw(query, limit, offset).Scan(&products).Error

	return
}

// to get productItem id
func (c *productDatabase) FindProductItemByID(ctx context.Context, productItemID uint) (productItem models.ProductItem, err error) {

	query := `SELECT * FROM product_items WHERE id = $1`
	err = c.DB.Raw(query, productItemID).Scan(&productItem).Error

	return productItem, err
}

// to get all offers for a product
func (c *productDatabase) FindAllProductOffers(ctx context.Context, pagination requests.Pagination) (offers []responses.ProductOffer, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT DISTINCT p.id, p.name, p.description, p.price, p.discount_price, p.category_id, sc.name AS category_name, 
	mc.name AS main_category_name, p.brand_id, b.name AS brand_name, mc.id AS main_category_id, o.id AS offer_id, o.discount_rate, o.name AS offer_name, o.start_date AS offer_date, o.end_date,
	p.created_at, p.updated_at
	FROM products p
	INNER JOIN categories sc ON p.category_id = sc.id
	INNER JOIN categories mc ON sc.category_id = mc.id
	INNER JOIN brands b ON b.id = p.brand_id
	INNER JOIN offer_products op ON op.product_id = p.id
	INNER JOIN offers o ON o.id = op.offer_id
	ORDER BY created_at DESC LIMIT $1 OFFSET $2`

	err = c.DB.Raw(query, limit, offset).Scan(&offers).Error

	return
}

// to get all offers for a product

func (c *productDatabase) FindAllProductOffersByProductID(ctx context.Context, productID uint) (offers []responses.ProductOffer, err error) {

	query := `SELECT p.id AS product_id, o.id AS offer_id, o.discount_rate, o.name AS offer_name, o.start_date AS offer_date, o.end_date
	FROM offers o
	INNER JOIN offer_products op ON op.offer_id = o.id
	INNER JOIN products p ON op.product_id = p.id
	WHERE product_id = $1`

	err = c.DB.Raw(query, productID).Scan(&offers).Error

	return
}

// to get how many variations are available for a product
func (c *productDatabase) FindVariationCountForProduct(ctx context.Context, productID uint) (variationCount uint, err error) {

	query := `SELECT COUNT(v.id) FROM variations v
	INNER JOIN categories c ON c.id = v.category_id 
	INNER JOIN products p ON p.category_id = v.category_id 
	WHERE p.id = $1`

	err = c.DB.Raw(query, productID).Scan(&variationCount).Error

	return
}

// To find all product item ids which related to the given product id and variation option id
func (c *productDatabase) FindAllProductItemIDsByProductIDAndVariationOptionID(ctx context.Context, productID,
	variationOptionID uint) (productItemIDs []uint, err error) {

	query := `SELECT id FROM product_items pi 
		INNER JOIN product_configurations pc ON pi.id = pc.product_item_id 
		WHERE pi.product_id = $1 AND variation_option_id = $2`
	err = c.DB.Raw(query, productID, variationOptionID).Scan(&productItemIDs).Error

	return
}

func (c *productDatabase) SaveProductConfiguration(ctx context.Context, productItemID, variationOptionID uint) error {

	query := `INSERT INTO product_configurations (product_item_id, variation_option_id) VALUES ($1, $2)`
	err := c.DB.Exec(query, productItemID, variationOptionID).Error

	return err
}

func (c *productDatabase) SaveProductItem(ctx context.Context, productItem models.ProductItem) (productItemID uint, err error) {

	query := `INSERT INTO product_items (product_id, qty_in_stock, qty_out_stock, sku, created_at) VALUES($1, $2, $3, $4, $5) 
	 RETURNING id AS product_item_id`
	createdAt := time.Now()
	err = c.DB.Raw(query, productItem.ProductID, productItem.QtyInStock, productItem.QtyOutStock, productItem.SKU, createdAt).
		Scan(&productItemID).Error

	return
}

// for get all products items for a product
func (c *productDatabase) FindAllProductItems(ctx context.Context,
	productID uint) (productItems []responses.ProductItems, err error) {

	// first find all product_items

	query := `SELECT p.name, pi.id, pi.product_id, 
	pi.qty_in_stock, pi.qty_out_stock, pi.sku, p.category_id, sc.name AS category_name, 
	mc.name AS main_category_name, p.brand_id, b.name AS brand_name 
	FROM product_items pi 
	INNER JOIN products p ON p.id = pi.product_id 
	INNER JOIN categories sc ON p.category_id = sc.id 
	INNER JOIN categories mc ON sc.category_id = mc.id 
	INNER JOIN brands b ON b.id = p.brand_id 
	AND pi.product_id = $1`

	err = c.DB.Raw(query, productID).Scan(&productItems).Error

	return
}

// Find all variation and value of a product item
func (c *productDatabase) FindAllVariationValuesOfProductItem(ctx context.Context,
	productItemID uint) (productVariationsValues []responses.ProductVariationValue, err error) {

	query := `SELECT v.id AS variation_id, v.name, vo.id AS variation_option_id, vo.value 
	FROM  product_configurations pc 
	INNER JOIN variation_options vo ON vo.id = pc.variation_option_id 
	INNER JOIN variations v ON v.id = vo.variation_id 
	WHERE pc.product_item_id = $1`
	err = c.DB.Raw(query, productItemID).Scan(&productVariationsValues).Error

	return
}

// To save image for product item
func (c *productDatabase) SaveProductImage(ctx context.Context, productID uint, image string) error {

	query := `INSERT INTO product_images (product_id, image) VALUES ($1, $2)`
	err := c.DB.Exec(query, productID, image).Error

	return err
}

// To find all images of a product item
func (c *productDatabase) FindAllProductImages(ctx context.Context, productID uint) (images []string, err error) {

	query := `SELECT image FROM product_images WHERE product_id = $1`

	err = c.DB.Raw(query, productID).Scan(&images).Error

	return
}

// To find all images of a product item
func (c *productDatabase) DeleteAllProductImages(ctx context.Context, productID uint) (err error) {

	query := `DELETE FROM public.product_images WHERE product_id=$1`

	err = c.DB.Exec(query, productID).Error

	return
}

// To save comment on a product without rating
func (c *productDatabase) SaveCommentWithoutRating(ctx context.Context,
	productID uint, comment models.Comment) error {
	query := `INSERT INTO comments (product_id, user_id, content, created_at) VALUES ($1, $2, $3, $4)`
	createdAt := time.Now()
	err := c.DB.Exec(query, productID, comment.UserID, comment.Content, createdAt).Error
	return err
}

// To save comment on a product with a rating
func (c *productDatabase) SaveCommentWithRating(ctx context.Context,
	productID uint, comment models.Comment) error {
	query := `INSERT INTO comments (product_id, user_id, content, rating, created_at) VALUES ($1, $2, $3, $4, $5)`
	createdAt := time.Now()
	err := c.DB.Exec(query, productID, comment.UserID, comment.Content, comment.Rating, createdAt).Error
	return err
}

// To find all comments for a product
func (c *productDatabase) FindAllCommentForProduct(ctx context.Context, productID uint) (comments []responses.Comment, err error) {
	query := `SELECT * FROM comments WHERE product_id =$1`
	err = c.DB.Raw(query, productID).Scan(&comments).Error
	return
}

// To get a comment by ID
func (c *productDatabase) FindCommentByID(ctx context.Context, commentID uint) (comment responses.Comment, err error) {
	// Get the comment by ID
	query := `SELECT * FROM comments WHERE id =$1`
	err = c.DB.Raw(query, commentID).Scan(&comment).Error
	return
}

// To update a comment
func (c *productDatabase) UpdateComment(ctx context.Context, productID uint,
	commentID uint, updatedComment models.Comment) (comment responses.Comment, err error) {
	// Update comment
	query := `UPDATE comments SET content = $1, rating = $2, updated_at = $3
	WHERE id = $4 RETURNING *`

	updatedAt := time.Now()

	err = c.DB.Raw(query, updatedComment.Content,
		updatedComment.Rating, updatedAt, commentID).Scan(&comment).Error

	return
}

// To delete a comment
func (c *productDatabase) DeleteComment(ctx context.Context, commentID uint) (err error) {
	query := `DELETE FROM comments WHERE id = $1`
	err = c.DB.Exec(query, commentID).Error
	return
}
