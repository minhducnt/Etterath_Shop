package usecases

import (
	"context"
	"errors"
	"etterath_shop_feature/pkg/api/handlers/requests"
	"etterath_shop_feature/pkg/api/handlers/responses"
	"etterath_shop_feature/pkg/models"
	"etterath_shop_feature/pkg/repositories/interfaces"
	service "etterath_shop_feature/pkg/usecases/interfaces"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

type adminUseCase struct {
	adminRepo interfaces.AdminRepository
	userRepo  interfaces.UserRepository
}

func NewAdminUseCase(repo interfaces.AdminRepository, userRepo interfaces.UserRepository) service.AdminUseCase {

	return &adminUseCase{
		adminRepo: repo,
		userRepo:  userRepo,
	}
}

func (c *adminUseCase) SignUp(ctx context.Context, loginDetails models.Admin) error {

	existAdmin, err := c.adminRepo.FindAdminByEmail(ctx, loginDetails.Email)
	if err != nil {
		return err
	} else if existAdmin.ID != 0 {
		return errors.New("can't save admin \nan admin already exist with this email")
	}

	existAdmin, err = c.adminRepo.FindAdminByUserName(ctx, loginDetails.UserName)
	if err != nil {
		return err
	} else if existAdmin.ID != 0 {
		return errors.New("can't save admin \nan admin already exist with this user_name")
	}

	// generate a hashed password for admin
	hashPass, err := bcrypt.GenerateFromPassword([]byte(loginDetails.Password), 10)

	if err != nil {
		return errors.New("failed to generate hashed password for admin")
	}
	// set the hashed password on the admin
	loginDetails.Password = string(hashPass)

	return c.adminRepo.SaveAdmin(ctx, loginDetails)
}

func (c *adminUseCase) FindAllUser(ctx context.Context, pagination requests.Pagination) (users []responses.User, err error) {

	users, err = c.adminRepo.FindAllUser(ctx, pagination)

	return users, err
}

// Block User
func (c *adminUseCase) BlockOrUnBlockUser(ctx context.Context, blockDetails requests.BlockUser) error {

	userToBlock, err := c.userRepo.FindUserByUserID(ctx, blockDetails.UserID)
	if err != nil {
		return fmt.Errorf("failed to find user \nerror:%w", err)
	}

	if userToBlock.BlockStatus == blockDetails.Block {
		return ErrSameBlockStatus
	}

	err = c.userRepo.UpdateBlockStatus(ctx, blockDetails.UserID, blockDetails.Block)
	if err != nil {
		return fmt.Errorf("failed to update user block status \nerror:%v", err.Error())
	}
	return nil
}

func (c *adminUseCase) GetFullSalesReport(ctx context.Context, requestData requests.SalesReport) (salesReport []responses.SalesReport, err error) {
	salesReport, err = c.adminRepo.CreateFullSalesReport(ctx, requestData)

	if err != nil {
		return salesReport, err
	}

	log.Printf("Successfully got sales report from %v to %v of limit %v",
		requestData.StartDate, requestData.EndDate, requestData.Pagination.Count)

	return salesReport, nil
}

// GetAdmminProfile implements interfaces.AdminUseCase.
func (c *adminUseCase) GetAdmminProfile(ctx context.Context, adminID uint) (admin responses.Admin, err error) {
	adminProfile, err := c.adminRepo.GetAdmminProfile(ctx, adminID)
	if err != nil {
		return adminProfile, err
	}
	log.Printf("Successfully get admin profile with adminID=%d", adminID)
	return adminProfile, nil
}

// UpdateAdminProfile implements interfaces.AdminUseCase.
func (c *adminUseCase) UpdateAdminProfile(ctx context.Context, adminID uint, adminProfile requests.Admin) error {
	// Check if admin is existing
	_, err := c.adminRepo.GetAdmminProfile(ctx, adminID)
	if err != nil {
		return fmt.Errorf("failed to find user \nerror:%w", err)
	}

	// if user password given then hash the password
	if adminProfile.Password != "" {
		hash, err := bcrypt.GenerateFromPassword([]byte(adminProfile.Password), 10)
		if err != nil {
			return fmt.Errorf("failed to generate hash password for admin")
		}
		adminProfile.Password = string(hash)
	}

	err = c.adminRepo.UpdateAdminProfile(ctx, adminID, adminProfile)
	if err != nil {
		return fmt.Errorf("failed to update admin profile with adminID= %d \nerror:%v", adminID, err.Error())
	}
	return nil
}
