package repositories

import (
	"context"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type adminDatabase struct {
	DB *gorm.DB
}

func NewAdminRepository(DB *gorm.DB) interfaces.AdminRepository {
	return &adminDatabase{DB: DB}
}

func (c *adminDatabase) FindAdminByEmail(ctx context.Context, email string) (models.Admin, error) {

	var admin models.Admin
	err := c.DB.Raw("SELECT * FROM admins WHERE email = $1", email).Scan(&admin).Error

	return admin, err
}

func (c *adminDatabase) FindAdminByUserName(ctx context.Context, userName string) (models.Admin, error) {

	var admin models.Admin
	err := c.DB.Raw("SELECT * FROM admins WHERE user_name = $1", userName).Scan(&admin).Error

	return admin, err
}

func (c *adminDatabase) SaveAdmin(ctx context.Context, admin models.Admin) error {
	fmt.Println(admin)
	query := `INSERT INTO admins (user_name, email, password, created_at) VALUES ($1, $2, $3, $4)`
	createdAt := time.Now()
	err := c.DB.Exec(query, admin.UserName, admin.Email, admin.Password, createdAt).Error

	return err
}

func (c *adminDatabase) FindAllUser(ctx context.Context, pagination requests.Pagination) (users []responses.User, err error) {

	limit := pagination.Count
	offset := (pagination.PageNumber - 1) * limit

	query := `SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`
	err = c.DB.Raw(query, limit, offset).Scan(&users).Error

	return users, err
}

// sales report from order // !add  product wise report
func (c *adminDatabase) CreateFullSalesReport(ctc context.Context, salesReq requests.SalesReport) (salesReport []responses.SalesReport, err error) {

	limit := salesReq.Pagination.Count
	offset := (salesReq.Pagination.PageNumber - 1) * limit

	query := `SELECT u.first_name, u.email,  so.id AS shop_order_id, so.user_id, so.order_date, 
	so.order_total_price, so.discount, os.status AS order_status, pm.name AS payment_type FROM shop_orders so
	INNER JOIN order_statuses os ON so.order_status_id = os.id 
	INNER JOIN  payment_methods pm ON so.payment_method_id = pm.id 
	INNER JOIN users u ON so.user_id = u.id 
	WHERE order_date >= $1 AND order_date <= $2
	ORDER BY so.order_date LIMIT $3 OFFSET $4`

	err = c.DB.Raw(query, salesReq.StartDate, salesReq.EndDate, limit, offset).Scan(&salesReport).Error

	return
}

// stock side
func (c *adminDatabase) FindStockBySKU(ctx context.Context, sku string) (stock responses.Stock, err error) {
	query := `SELECT pi.sku, pi.qty_in_stock,, pi.qty_out_stock, pi.price, p.name AS product_name, vo.value AS variation_value  
	FROM product_items pi 
	INNER JOIN products p ON p.id = pi.product_id 
	INNER JOIN product_configurations pc ON pc.product_item_id = pi.id 
	INNER JOIN variation_options vo ON vo.id = pc.variation_option_id
	WHERE pi.sku = $1`

	err = c.DB.Raw(query, sku).Scan(&stock).Error

	return stock, err
}

// GetAdmminProfile implements interfaces.AdminRepository.
func (c *adminDatabase) GetAdmminProfile(ctx context.Context, adminID uint) (adminProfile responses.Admin, err error) {
	err = c.DB.Raw("SELECT * FROM admins WHERE id = $1", adminID).Scan(&adminProfile).Error
	return adminProfile, err
}

// UpdateAdminProfile implements interfaces.AdminRepository.
func (c *adminDatabase) UpdateAdminProfile(ctx context.Context, adminID uint, adminProfile requests.Admin) (err error) {
	updatedAt := time.Now()
	// check password need to update or not
	if adminProfile.Password != "" {
		query := `UPDATE admins SET user_name=$1, day_of_birth=$2, email=$3, full_name=$4, password=$5,
		updated_at=$6 WHERE id=$7;`
		err = c.DB.Exec(query, adminProfile.UserName, adminProfile.DayOfBirth,
			adminProfile.Email, adminProfile.FullName, adminProfile.Password,
			updatedAt, adminID).Error
	} else {
		query := `UPDATE admins SET user_name=$1, day_of_birth=$2, email=$3, full_name=$4,
		updated_at=$5 WHERE id=$6;`
		err = c.DB.Exec(query, adminProfile.UserName, adminProfile.DayOfBirth,
			adminProfile.Email, adminProfile.FullName,
			updatedAt, adminID).Error
	}

	if err != nil {
		return fmt.Errorf("failed to update user detail of admin with adminID %d", adminID)
	}
	return nil
}
