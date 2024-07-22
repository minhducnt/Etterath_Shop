package responses

import commonConstant "etterath_shop_feature/pkg/common/constants"

type OrderPayment struct {
	PaymentType  commonConstant.PaymentType `json:"payment_type"`
	PaymentOrder any                        `json:"payment_order"`
}
