# Image Resizer API

<p>
  <strong>Professional bulk image processing and optimization at scale.</strong> Transform, resize, crop, and convert hundreds of images with a single API call. Perfect for e-commerce, content management, and automated workflows.
</p>

---

## 🎯 What is Image Resizer API?

**Image Resizer API** is a powerful batch image processing tool that transforms and optimizes images from any source. Process images from URLs or Apify storage, apply intelligent resizing and cropping, convert between formats, and deliver optimized images via public URLs.

<p>
  <strong>Key capabilities:</strong>
</p>

- ✅ **Bulk Processing** — Process hundreds of images in parallel with configurable concurrency
- ✅ **Smart Cropping** — Intelligent positioning (center, top, bottom, edges) with multiple fit modes
- ✅ **Format Conversion** — Convert between JPEG, PNG, WebP, AVIF, and GIF formats
- ✅ **Optimization** — Automatic compression and metadata stripping for smaller file sizes
- ✅ **Multiple Sources** — Accept images from HTTP(S) URLs or Apify key-value stores
- ✅ **Public URLs** — Get instant public URLs for all processed images
- ✅ **Error Handling** — Robust per-image error handling without stopping the batch

---

## 🚀 Use Cases

### E-commerce & Product Images
Automatically resize and optimize product photos for your online store. Convert images to modern WebP format for faster page loads and better SEO.

### Content Management Systems
Process user-uploaded images to multiple sizes and formats. Generate thumbnails, hero images, and optimized versions automatically.

### Social Media Automation
Batch convert images to social media specifications. Create perfectly sized images for Instagram, Facebook, Twitter, and LinkedIn.

### Marketing & Advertising
Optimize banner images and ad creatives. Convert legacy formats to modern, web-optimized formats.

### Website Optimization
Automatically compress and resize images for better web performance. Improve Core Web Vitals and page speed scores.

---

## 📋 Features

<table>
  <tr>
    <td><strong>Batch Processing</strong></td>
    <td>Process up to hundreds of images in a single run with parallel execution</td>
  </tr>
  <tr>
    <td><strong>Smart Resizing</strong></td>
    <td>Specify target dimensions with intelligent fit modes (cover, contain, inside, outside, fill)</td>
  </tr>
  <tr>
    <td><strong>Format Conversion</strong></td>
    <td>Convert between JPEG, PNG, WebP, AVIF, GIF, or maintain original format</td>
  </tr>
  <tr>
    <td><strong>Quality Control</strong></td>
    <td>Adjustable quality settings (1-100) for lossy formats with optimized compression</td>
  </tr>
  <tr>
    <td><strong>Metadata Management</strong></td>
    <td>Strip EXIF and metadata to reduce file sizes and protect privacy</td>
  </tr>
  <tr>
    <td><strong>Flexible Input</strong></td>
    <td>Accept images from HTTP(S) URLs or Apify key-value store references</td>
  </tr>
  <tr>
    <td><strong>Aspect Ratio</strong></td>
    <td>Preserve or modify aspect ratios with smart cropping and positioning</td>
  </tr>
  <tr>
    <td><strong>Public URLs</strong></td>
    <td>Automatically generate public URLs for all processed images</td>
  </tr>
  <tr>
    <td><strong>Dataset Export</strong></td>
    <td>Optional structured dataset with metadata and processing statistics</td>
  </tr>
  <tr>
    <td><strong>Error Recovery</strong></td>
    <td>Individual image failures don't stop batch processing</td>
  </tr>
</table>

---

## 💡 How to Use

### Quick Start

<ol>
  <li><strong>Add image sources</strong> — Provide an array of image URLs or key-value store references</li>
  <li><strong>Configure settings</strong> — Set target dimensions, format, quality, and other options</li>
  <li><strong>Run the actor</strong> — Start processing and get public URLs for all optimized images</li>
  <li><strong>Access results</strong> — Download from key-value store or export dataset with metadata</li>
</ol>

### Input Configuration

The actor accepts the following input parameters:

#### Required

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>images</code></td>
    <td>Array of strings</td>
    <td>List of image sources (URLs or key-value store references)</td>
  </tr>
</table>

#### Image Dimensions

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>width</code></td>
    <td>Integer</td>
    <td>Auto</td>
    <td>Target width in pixels (1-10000)</td>
  </tr>
  <tr>
    <td><code>height</code></td>
    <td>Integer</td>
    <td>Auto</td>
    <td>Target height in pixels (1-10000)</td>
  </tr>
  <tr>
    <td><code>fit</code></td>
    <td>String</td>
    <td>"cover"</td>
    <td>Resize mode: cover, contain, inside, outside, fill</td>
  </tr>
  <tr>
    <td><code>position</code></td>
    <td>String</td>
    <td>"center"</td>
    <td>Crop position: center, top, bottom, left, right, top-left, top-right, bottom-left, bottom-right</td>
  </tr>
</table>

#### Format & Quality

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>format</code></td>
    <td>String</td>
    <td>"webp"</td>
    <td>Output format: jpeg, png, webp, avif, gif, original</td>
  </tr>
  <tr>
    <td><code>quality</code></td>
    <td>Integer</td>
    <td>80</td>
    <td>Quality for lossy formats (1-100, higher = better quality)</td>
  </tr>
  <tr>
    <td><code>background</code></td>
    <td>String</td>
    <td>"#ffffff"</td>
    <td>Background color for padding (hex or CSS color name)</td>
  </tr>
  <tr>
    <td><code>stripMetadata</code></td>
    <td>Boolean</td>
    <td>true</td>
    <td>Remove EXIF and other metadata</td>
  </tr>
</table>

#### Processing Options

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>concurrency</code></td>
    <td>Integer</td>
    <td>5</td>
    <td>Maximum parallel image processing (1-20)</td>
  </tr>
  <tr>
    <td><code>outputStoreId</code></td>
    <td>String</td>
    <td>Default store</td>
    <td>Custom key-value store ID for output images</td>
  </tr>
  <tr>
    <td><code>createDataset</code></td>
    <td>Boolean</td>
    <td>true</td>
    <td>Create dataset records with metadata</td>
  </tr>
</table>

---

## 📤 Input Examples

### Example 1: Basic Image Resizing

```json
{
  "images": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.png"
  ],
  "width": 800,
  "height": 600,
  "format": "webp",
  "quality": 85
}
```

### Example 2: E-commerce Product Images

```json
{
  "images": [
    "https://store.example.com/product-001.jpg",
    "https://store.example.com/product-002.jpg",
    "https://store.example.com/product-003.jpg"
  ],
  "width": 1200,
  "height": 1200,
  "fit": "contain",
  "position": "center",
  "format": "webp",
  "quality": 90,
  "background": "#ffffff",
  "stripMetadata": true,
  "concurrency": 10,
  "createDataset": true
}
```

### Example 3: Using Key-Value Store

```json
{
  "images": [
    "https://cdn.example.com/image1.png",
    "key-value://my-store-id/original-image.jpg"
  ],
  "width": 1920,
  "height": 1080,
  "fit": "cover",
  "format": "avif",
  "quality": 80
}
```

---

## 📥 Output

### Dataset Structure

Each processed image creates a dataset record with the following structure:

```json
{
  "index": 0,
  "source": "https://example.com/image.jpg",
  "key": "image_0_1702345678901",
  "url": "https://api.apify.com/v2/key-value-stores/.../image_0_1702345678901",
  "width": 1200,
  "height": 800,
  "format": "webp",
  "sizeBytes": 45678
}
```

### OUTPUT Key Structure

The final results are saved to the `OUTPUT` key in the key-value store:

```json
{
  "results": [
    {
      "index": 0,
      "source": "https://example.com/image1.jpg",
      "key": "image_0_1702345678901",
      "url": "https://api.apify.com/v2/...",
      "width": 1200,
      "height": 800,
      "format": "webp",
      "sizeBytes": 45678
    }
  ],
  "summary": {
    "total": 10,
    "succeeded": 9,
    "failed": 1
  }
}
```

### Error Handling

If an image fails to process, the result includes an error message:

```json
{
  "index": 5,
  "source": "https://example.com/invalid-image.jpg",
  "error": "Failed to fetch image from URL: 404 Not Found"
}
```

---

## 🎨 Fit Modes Explained

<dl>
  <dt><strong>cover</strong> (default)</dt>
  <dd>Crop image to fill dimensions while preserving aspect ratio. Image covers entire area.</dd>
  
  <dt><strong>contain</strong></dt>
  <dd>Letterbox image to fit within dimensions. Entire image visible with possible padding.</dd>
  
  <dt><strong>inside</strong></dt>
  <dd>Resize image to fit within dimensions. Smaller than or equal to specified size.</dd>
  
  <dt><strong>outside</strong></dt>
  <dd>Resize image to cover dimensions. Larger than or equal to specified size.</dd>
  
  <dt><strong>fill</strong></dt>
  <dd>Stretch image to exact dimensions. May distort aspect ratio.</dd>
</dl>

---

## 🔧 Configuration Tips

### For Best Performance
- Use `concurrency` between 5-10 for optimal speed
- Choose WebP or AVIF format for best compression
- Set `quality` to 80-85 for balanced quality/size

### For Best Quality
- Use `quality` 90-95 for minimal quality loss
- Set `stripMetadata: false` if you need to preserve EXIF data
- Use PNG format for images with transparency

### For Smallest File Size
- Use WebP or AVIF format
- Set `quality` to 70-80
- Enable `stripMetadata: true`
- Choose appropriate dimensions (don't make images larger than needed)

---

## 📊 Performance

<table>
  <tr>
    <td><strong>Processing Speed</strong></td>
    <td>Up to 20 images simultaneously with configurable concurrency</td>
  </tr>
  <tr>
    <td><strong>Memory Usage</strong></td>
    <td>4GB default (suitable for most use cases)</td>
  </tr>
  <tr>
    <td><strong>Timeout</strong></td>
    <td>3600 seconds (1 hour) default run time</td>
  </tr>
  <tr>
    <td><strong>Format Support</strong></td>
    <td>JPEG, PNG, WebP, AVIF, GIF (input and output)</td>
  </tr>
</table>

---

## ❓ FAQ

<details>
  <summary><strong>Can I process images from private URLs?</strong></summary>
  <p>Currently, the actor supports public HTTP(S) URLs and Apify key-value store references. For private URLs, first upload images to an Apify key-value store.</p>
</details>

<details>
  <summary><strong>What happens if one image fails?</strong></summary>
  <p>The actor continues processing other images. Failed images are recorded in the results with error messages.</p>
</details>

<details>
  <summary><strong>How long are processed images stored?</strong></summary>
  <p>Images are stored in the key-value store according to your Apify data retention settings. Default is 7 days for unnamed stores.</p>
</details>

<details>
  <summary><strong>Can I process animated GIFs?</strong></summary>
  <p>Yes, the actor supports GIF format. However, converting animated GIFs to other formats may result in only the first frame being saved.</p>
</details>

<details>
  <summary><strong>What's the maximum image size I can process?</strong></summary>
  <p>The actor can handle large images, but extremely large files (50MB+) may require increased memory allocation.</p>
</details>

<details>
  <summary><strong>How do I preserve aspect ratio?</strong></summary>
  <p>Specify only width OR height (not both), or use fit modes like "contain" or "inside" which preserve aspect ratio automatically.</p>
</details>

---

## 🛠️ Advanced Usage

### Processing Images from Apify Storage

Reference images stored in Apify key-value stores:

```json
{
  "images": [
    "key-value://store-id-123/photo1.jpg",
    "key-value://store-id-123/photo2.png"
  ]
}
```

### Custom Output Store

Save processed images to a specific key-value store:

```json
{
  "images": ["https://example.com/image.jpg"],
  "outputStoreId": "my-custom-store-id"
}
```

### Disable Dataset Creation

For faster processing when you don't need metadata:

```json
{
  "images": ["https://example.com/image.jpg"],
  "createDataset": false
}
```

---

## 📞 Support & Feedback

<p>
  If you encounter any issues or have suggestions for improvement, please reach out through the Apify Console or leave a review. Your feedback helps improve this actor for everyone!
</p>

---

## 🏷️ Keywords

image optimization, image resizing, bulk image processing, image converter, format conversion, WebP converter, AVIF converter, image compression, thumbnail generator, image cropping, batch image processing, automated image optimization, e-commerce images, product photos, image API, bulk resize, image automation, web optimization, responsive images, image transformation
