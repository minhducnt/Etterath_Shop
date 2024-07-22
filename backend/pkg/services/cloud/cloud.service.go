package cloud

import (
	"context"
	"mime/multipart"
)

type CloudService interface {
	SaveFile(ctx context.Context, fileHeader *multipart.FileHeader) (uploadId string, err error)
	GetFileUrl(ctx context.Context, uploadID string) (url string, err error)
	UploadFileFirebase(ctx context.Context, fileHeader *multipart.FileHeader) (uploadFileURL string, err error)
	GetFileURLFromFisebaseService(ctx context.Context, docName string) (string, error)
	DeleteObjectFromFisebaseService(ctx context.Context, docName string) error
}
