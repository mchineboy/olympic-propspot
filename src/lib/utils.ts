export 	function fixImageUrl(image: string): string {
    // The image should have _1080x1920.jpg if it does not, fix it
    if (image.includes('_1080x1920.jpg')) {
        return image;
    } else {
        return image.replace('.jpg', '_1080x1920.jpg');
    }
}