package cloud

import (
	"context"
	"etterath_shop_feature/pkg/utils"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"
	"time"

	"cloud.google.com/go/storage"
	firebase "firebase.google.com/go"
	"github.com/google/uuid"
	"google.golang.org/api/option"
)

const (
	projectName = "etterath-shop"
)

type Sizer interface {
	Size() int64
}

func (c *awsService) UploadFileFirebase(ctx context.Context, fileHeader *multipart.FileHeader) (string, error) {
	// Connect to Firebase Service
	firebaseBudget, err := c.initFirebaseService(projectName)
	if err != nil {
		return "", utils.PrependMessageToError(err, "failed to upload file")
	}

	// Generate ID and filename for the file upload to Firebase Service
	newID := uuid.New().String()
	docName := fmt.Sprintf("%s_%s%s", projectName, newID, filepath.Ext(fileHeader.Filename))

	// upload it to Google Cloud Storage
	go func() error {
		file, err := fileHeader.Open()
		if err != nil {
			return err
		}
		object := firebaseBudget.Object(docName)
		wc := firebaseBudget.Object(docName).NewWriter(context.Background())
		if _, err = io.Copy(wc, file); err != nil {
			err := fmt.Errorf(err.Error())
			return err
		}
		err = wc.Close()
		if err != nil {
			errReturn := fmt.Errorf(err.Error())
			return errReturn
		}
		if err := object.ACL().Set(context.Background(), storage.AllUsers, storage.RoleReader); err != nil {
			return err
		}
		return nil
	}()
	return docName, nil
}

func (c *awsService) GetFileURLFromFisebaseService(ctx context.Context, docName string) (string, error) {
	// Connect to Firebase Service
	firebaseBudget, err := c.initFirebaseService(projectName)
	if err != nil {
		return "", utils.PrependMessageToError(err, "failed to upload file")
	}
	// Get signed URL of the file from Firebase Service by filename
	fileSignedURL, err := firebaseBudget.SignedURL(docName, &storage.SignedURLOptions{
		Expires: time.Now().AddDate(100, 0, 0),
		Method:  "GET",
	})

	if err != nil {
		return "", err
	}
	return fileSignedURL, nil
}

func (c *awsService) DeleteObjectFromFisebaseService(ctx context.Context, docName string) error {
	// Connect to Firebase Service
	firebaseBudget, err := c.initFirebaseService(projectName)
	if err != nil {
		return utils.PrependMessageToError(err, "failed to upload file")
	}
	// Delete the file from Firebase Service by filename
	err = firebaseBudget.Object(docName).Delete(context.Background())
	if err != nil {
		return err
	}
	return nil
}

func (c *awsService) initFirebaseService(projectName string) (*storage.BucketHandle, error) {
	storageBucket := fmt.Sprintf(storageBucketURL, projectName)
	configStorage := &firebase.Config{
		StorageBucket: storageBucket,
	}

	var filePath string = "./serviceAccountKey.json"
	opt := option.WithCredentialsJSON([]byte(filePath))
	app, err := firebase.NewApp(context.Background(), configStorage, opt)
	if err != nil {
		return nil, err
	}

	client, err := app.Storage(context.Background())
	if err != nil {
		return nil, err
	}

	bucket, err := client.DefaultBucket()
	if err != nil {
		return nil, err
	}
	return bucket, nil
}
