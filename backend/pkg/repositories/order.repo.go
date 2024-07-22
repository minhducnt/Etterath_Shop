package repositories

import (
	"context"
	"errors"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"fmt"
	"time"

	commonConstant "etterath_shop_feature/pkg/common/constants"

	"gorm.io/gorm"
)

type OrderDatabase struct {
	DB *gorm.DB
}

func NewOrderRepository(db *gorm.DB) interfaces.OrderRepository {
	return &OrderDatabase{DB: db}
}

func (c *OrderDatabase) Transaction(callBack func(trxRepo interfaces.OrderRepository) error) error {

	trx := c.DB.Begin()
	transactionRepo := NewOrderRepository(trx)

	err := callBack(transactionRepo)
	if err != nil {
		trx.Rollback()
		return fmt.Errorf("failed to complete transaction \nerror:%v", err.Error())
	}

	err = trx.Commit().Error
	return err
}

// find a specific shop order by shopOrderID
func (c *OrderDatabase) FindShopOrderByShopOrderID(ctx context.Context, shopOrderID uint) (shopOrder models.ShopOrder, err error) {

	query := `SELECT * FROM shop_orders WHERE id = $1`
	err = c.DB.Raw(query, shopOrderID).Scan(&shopOrder).Error

	return shopOrder, err
}

// get all shop order of user
func (c *OrderDatabase) FindAllShopOrdersByUserID(ctx context.Context, userID uint,
	pagination requests.Pagination) (shopOrders []responses.ShopOrder, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT so.user_id, so.id AS shop_order_id, so.order_date, so.order_total_price, so.discount, 
	so.order_status_id, os.status AS order_status,so.address_id, so.payment_method_id, pm.name AS payment_method_name  
	FROM shop_orders so 
	INNER JOIN order_statuses os ON so.order_status_id = os.id 
	INNER JOIN payment_methods pm ON pm.id = so.payment_method_id 
	WHERE user_id = $1 
	ORDER BY order_date DESC LIMIT $2 OFFSET  $3`
	err = c.DB.Raw(query, userID, limit, offset).Scan(&shopOrders).Error

	return shopOrders, err
}

// find all shop orders with user
func (c *OrderDatabase) FindAllShopOrders(ctx context.Context,
	pagination requests.Pagination) (shopOrders []responses.ShopOrder, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT so.user_id, so.id AS shop_order_id, so.order_date, so.order_total_price, so.discount, 
	so.order_status_id, os.status AS order_status, so.address_id, so.payment_method_id, pm.name AS payment_method_name   
	FROM shop_orders so 
	INNER JOIN order_statuses os ON so.order_status_id = os.id 
	INNER JOIN payment_methods pm ON so.payment_method_id = pm.id 
	ORDER BY so.order_date DESC LIMIT $1 OFFSET $2`

	err = c.DB.Raw(query, limit, offset).Scan(&shopOrders).Error

	return shopOrders, err
}

// get order items of a specific order
func (c *OrderDatabase) FindAllOrdersItemsByShopOrderID(ctx context.Context,
	shopOrderID uint, pagination requests.Pagination) (orderItems []responses.OrderItem, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT ol.product_item_id, p.id AS product_id, p.name AS product_name, pg.image, ol.price, so.order_date, os.status,ol.qty, 
	(ol.price * ol.qty) AS sub_total FROM  order_lines ol 
	INNER JOIN shop_orders so ON ol.shop_order_id = so.id 
	INNER JOIN product_items pi ON ol.product_item_id = pi.id
	INNER JOIN products p ON pi.product_id = p.id 
	INNER JOIN order_statuses os ON so.order_status_id = os.id 
	INNER JOIN product_images pg ON pg.id = (
		SELECT id 
		FROM product_images as pi2
		WHERE pi2.product_id = p.id
		LIMIT 1
	)
	AND ol.shop_order_id = $1 
	ORDER BY ol.qty DESC LIMIT $2 OFFSET $3`

	err = c.DB.Raw(query, shopOrderID, limit, offset).Scan(&orderItems).Error

	return orderItems, err
}

// ! order place

func (c *OrderDatabase) SaveShopOrder(ctx context.Context, shopOrder models.ShopOrder) (shopOrderID uint, err error) {

	// save the shop_order
	query := `INSERT INTO shop_orders (user_id, address_id, order_total_price, discount, 
	order_status_id, order_date) 
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`

	orderDate := time.Now()
	err = c.DB.Raw(query, shopOrder.UserID, shopOrder.AddressID, shopOrder.OrderTotalPrice, shopOrder.Discount,
		shopOrder.OrderStatusID, orderDate).Scan(&shopOrderID).Error

	return shopOrderID, err
}

func (c *OrderDatabase) SaveOrderLine(ctx context.Context, orderLine models.OrderLine) error {

	query := `INSERT INTO order_lines (product_item_id, shop_order_id, qty, price) 
	VALUES ($1, $2, $3, $4)`
	err := c.DB.Exec(query, orderLine.ProductItemID, orderLine.ShopOrderID, orderLine.Qty, orderLine.Price).Error

	return err
}

//!end

func (c *OrderDatabase) FindOrderStatusByShopOrderID(ctx context.Context,
	shopOrderID uint) (orderStatus models.OrderStatus, err error) {

	query := `SELECT * FROM order_statuses
	WHERE id = (SELECT order_status_id FROM shop_orders WHERE id = $1)`
	err = c.DB.Raw(query, shopOrderID).Scan(&orderStatus).Error

	return orderStatus, err
}

// find order status
func (c *OrderDatabase) FindOrderStatusByID(ctx context.Context, orderStatusID uint) (models.OrderStatus, error) {

	var orderStatus models.OrderStatus
	err := c.DB.Raw("SELECT * FROM order_statuses WHERE id = $1", orderStatusID).Scan(&orderStatus).Error

	return orderStatus, err
}

func (c *OrderDatabase) FindOrderStatusByStatus(ctx context.Context,
	status commonConstant.OrderStatusType) (models.OrderStatus, error) {

	var orderStatus models.OrderStatus
	err := c.DB.Raw("SELECT * FROM order_statuses WHERE status = $1", status).Scan(&orderStatus).Error

	return orderStatus, err
}

func (c *OrderDatabase) FindAllOrderStatuses(ctx context.Context) (orderStatuses []models.OrderStatus, err error) {

	err = c.DB.Raw("SELECT * FROM order_statuses").Scan(&orderStatuses).Error

	return orderStatuses, err
}

func (c *OrderDatabase) UpdateShopOrderOrderStatus(ctx context.Context, shopOrderID, changeStatusID uint) error {

	query := `UPDATE shop_orders SET order_status_id = $1 WHERE id = $2`
	err := c.DB.Exec(query, changeStatusID, shopOrderID).Error

	return err
}

func (c *OrderDatabase) UpdateShopOrderStatusAndSavePaymentMethod(ctx context.Context,
	shopOrderID, orderStatusID, paymentID uint) error {

	query := `UPDATE shop_orders SET order_status_id = $1, payment_method_id = $2 WHERE id = $3`
	err := c.DB.Exec(query, orderStatusID, paymentID, shopOrderID).Error

	return err
}

func (c *OrderDatabase) FindOrderReturnByReturnID(ctx context.Context,
	orderReturnID uint) (orderReturn models.OrderReturn, err error) {

	query := `SELECT *  FROM order_returns WHERE id = $1`
	err = c.DB.Raw(query, orderReturnID).Scan(&orderReturn).Error

	return orderReturn, err
}
func (c *OrderDatabase) FindOrderReturnByShopOrderID(ctx context.Context,
	shopOrderID uint) (orderReturn models.OrderReturn, err error) {

	query := `SELECT *  FROM order_returns WHERE shop_order_id = $1`
	err = c.DB.Raw(query, shopOrderID).Scan(&orderReturn).Error

	return orderReturn, err
}

func (c *OrderDatabase) FindAllOrderReturns(ctx context.Context,
	pagination requests.Pagination) (orderReturns []responses.OrderReturn, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT ors.id AS order_return_id, ors.shop_order_id, ors.request_date, ors.return_reason, 
		os.id AS order_status_id, os.status AS order_status,ors.refund_amount, 
		ors.admin_comment, ors.is_approved, ors.approval_date, ors.return_date 
		FROM order_returns ors 
		INNER JOIN shop_orders so ON ors.shop_order_id =  so.id 
		INNER JOIN order_statuses os ON so.order_status_id = os.id 
		ORDER BY ors.request_date LIMIT $1 OFFSET $2`
	err = c.DB.Raw(query, limit, offset).Scan(&orderReturns).Error

	return orderReturns, err
}

func (c *OrderDatabase) FindAllPendingOrderReturns(ctx context.Context,
	pagination requests.Pagination) (pendingReturns []responses.OrderReturn, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	returnRequested, err1 := c.FindOrderStatusByStatus(ctx, "return requested")
	returnApproved, err2 := c.FindOrderStatusByStatus(ctx, "return approved")
	err = errors.Join(err1, err2)
	if err != nil {
		return nil, err
	}

	query := `SELECT ors.id AS order_return_id, ors.shop_order_id, ors.request_date, ors.return_reason, 
	os.id AS order_status_id, os.status AS order_status,ors.refund_amount  
	FROM order_returns ors 
	INNER JOIN shop_orders so ON ors.shop_order_id =  so.id 
	INNER JOIN order_statuses os ON so.order_status_id = os.id 
	WHERE so.order_status_id = $1 OR so.order_status_id = $2 
	ORDER BY ors.request_date DESC LIMIT $3 OFFSET $4`
	err = c.DB.Raw(query, returnRequested.ID, returnApproved.ID, limit, offset).Scan(&pendingReturns).Error

	return pendingReturns, err
}

// to save a return requests
func (c *OrderDatabase) SaveOrderReturn(ctx context.Context, orderReturn models.OrderReturn) error {

	query := `INSERT INTO order_returns (shop_order_id,return_reason,request_date,refund_amount,is_approved) 
	VALUES($1,$2,$3,$4,$5)`
	err := c.DB.Exec(query, orderReturn.ShopOrderID, orderReturn.ReturnReason,
		orderReturn.RequestDate, orderReturn.RefundAmount, false).Error

	return err
}

// update the order return
func (c *OrderDatabase) UpdateOrderReturn(ctx context.Context, orderReturn models.OrderReturn) error {

	query := `UPDATE order_returns SET admin_comment = $1, return_date = $2, 
	approval_date = $3, is_approved = $4 WHERE id = $5`
	err := c.DB.Exec(query, orderReturn.AdminComment, orderReturn.RequestDate,
		orderReturn.ApprovalDate, orderReturn.IsApproved, orderReturn.ID).Error

	return err
}
