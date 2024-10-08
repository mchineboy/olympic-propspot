package main

import (
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"log"
	"path/filepath"

	"cloud.google.com/go/storage"
	"github.com/nfnt/resize"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

const (
	projectID      = "your-project-id"
	bucketName     = "your-bucket-name"
	credentialsFile = "path/to/your/credentials.json"
	targetWidth    = 1080
)

func main() {
	ctx := context.Background()

	// Create a client
	client, err := storage.NewClient(ctx, option.WithCredentialsFile(credentialsFile))
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	defer client.Close()

	bucket := client.Bucket(bucketName)

	// List all objects in the bucket
	it := bucket.Objects(ctx, nil)
	for {
		attrs, err := it.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Fatalf("Error iterating: %v", err)
		}

		// Process only JPEG images
		if filepath.Ext(attrs.Name) != ".jpg" && filepath.Ext(attrs.Name) != ".jpeg" {
			continue
		}

		// Download the image
		rc, err := bucket.Object(attrs.Name).NewReader(ctx)
		if err != nil {
			log.Printf("Error reading %s: %v", attrs.Name, err)
			continue
		}
		defer rc.Close()

		// Decode the image
		img, _, err := image.Decode(rc)
		if err != nil {
			log.Printf("Error decoding %s: %v", attrs.Name, err)
			continue
		}

		// Resize the image
		resized := resize.Resize(targetWidth, 0, img, resize.Lanczos3)

		// Create a new object to store the resized image
		wc := bucket.Object(attrs.Name).NewWriter(ctx)
		wc.ContentType = "image/jpeg"

		// Encode and upload the resized image
		if err := jpeg.Encode(wc, resized, nil); err != nil {
			log.Printf("Error encoding %s: %v", attrs.Name, err)
			continue
		}
		if err := wc.Close(); err != nil {
			log.Printf("Error closing writer for %s: %v", attrs.Name, err)
			continue
		}

		fmt.Printf("Successfully resized and uploaded: %s\n", attrs.Name)
	}
}