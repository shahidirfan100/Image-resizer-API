import Apify from 'apify';
import sharp from 'sharp';
import { gotScraping } from 'got-scraping';
import { HeaderGenerator } from 'header-generator';

/**
 * Resolves an image source to a Buffer.
 * Supports HTTP(S) URLs and key-value:// references.
 */
async function resolveImageBuffer(source, headerGenerator) {
    if (!source || typeof source !== 'string') {
        throw new Error('Invalid image source: must be a non-empty string');
    }

    // HTTP(S) URL
    if (source.startsWith('http://') || source.startsWith('https://')) {
        try {
            const headers = headerGenerator.getHeaders({
                browsers: ['chrome', 'firefox', 'edge'],
                operatingSystems: ['windows', 'macos', 'linux'],
                devices: ['desktop'],
                locales: ['en-US'],
            });

            const response = await gotScraping({
                url: source,
                headers,
                responseType: 'buffer',
                timeout: {
                    request: 30000,
                },
                retry: {
                    limit: 2,
                },
            });

            if (!Buffer.isBuffer(response.body)) {
                throw new Error('Response body is not a buffer');
            }

            return response.body;
        } catch (error) {
            throw new Error(`Failed to fetch image from URL: ${error.message}`);
        }
    }

    // Key-value store reference: key-value://{storeId}/{key}
    if (source.startsWith('key-value://')) {
        try {
            const path = source.replace('key-value://', '');
            const parts = path.split('/');

            if (parts.length < 2) {
                throw new Error('Invalid key-value:// format. Expected: key-value://{storeId}/{key}');
            }

            const storeId = parts[0];
            const key = parts.slice(1).join('/');

            if (!storeId || !key) {
                throw new Error('Both storeId and key must be non-empty');
            }

            const store = await Apify.openKeyValueStore(storeId);
            const value = await store.getValue(key);

            if (!value) {
                throw new Error(`Key "${key}" not found in store "${storeId}"`);
            }

            // Convert to Buffer if necessary
            if (Buffer.isBuffer(value)) {
                return value;
            } else if (typeof value === 'string') {
                return Buffer.from(value, 'binary');
            } else if (value instanceof ArrayBuffer) {
                return Buffer.from(value);
            } else {
                throw new Error('Value in key-value store is not a valid image buffer');
            }
        } catch (error) {
            throw new Error(`Failed to fetch image from key-value store: ${error.message}`);
        }
    }

    throw new Error(`Unsupported image source format: ${source}. Must start with http://, https://, or key-value://`);
}

/**
 * Processes an image buffer according to specified options.
 */
async function processWithSharp(buffer, options) {
    const {
        width,
        height,
        fit = 'cover',
        position = 'center',
        format = 'webp',
        quality = 80,
        background = '#ffffff',
        stripMetadata = true,
    } = options;

    try {
        let img = sharp(buffer);

        // Strip metadata by not calling withMetadata and using rotate() to normalize orientation
        if (stripMetadata) {
            img = img.rotate();
        }

        // Resize if width or height is specified
        if (width || height) {
            img = img.resize({
                width: width || undefined,
                height: height || undefined,
                fit,
                position,
                background,
                withoutEnlargement: true,
            });
        }

        // Apply format conversion
        switch (format) {
            case 'jpeg':
                img = img.jpeg({
                    quality,
                    mozjpeg: true,
                });
                break;

            case 'png':
                img = img.png({
                    compressionLevel: 9,
                });
                break;

            case 'webp':
                img = img.webp({
                    quality,
                });
                break;

            case 'avif':
                img = img.avif({
                    quality,
                });
                break;

            case 'gif':
                img = img.gif();
                break;

            case 'original':
                // Do not change format; sharp will maintain the original format
                break;

            default:
                throw new Error(`Unsupported format: ${format}`);
        }

        // Process and return buffer with metadata
        const { data, info } = await img.toBuffer({ resolveWithObject: true });

        return {
            buffer: data,
            info,
        };
    } catch (error) {
        throw new Error(`Failed to process image: ${error.message}`);
    }
}

/**
 * Image Resizer API - Main Entry Point
 * Batch processes images from URLs or Apify storages with customizable resizing,
 * cropping, format conversion, and compression.
 */
Apify.main(async () => {
    // Get input
    const input = await Apify.getInput() || {};

    // Destructure input with defaults
    const {
        images = [],
        width = null,
        height = null,
        fit = 'cover',
        position = 'center',
        format = 'webp',
        quality = 80,
        background = '#ffffff',
        stripMetadata = true,
        concurrency = 5,
        outputStoreId = null,
        createDataset = true,
    } = input;

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
        throw new Error('Input field "images" must be a non-empty array of image sources');
    }

    Apify.utils.log.info(`Starting image processing for ${images.length} images`);
    Apify.utils.log.info(`Settings: width=${width}, height=${height}, fit=${fit}, format=${format}, quality=${quality}`);

    // Initialize storages
    const store = await Apify.openKeyValueStore(outputStoreId);
    const dataset = createDataset ? await Apify.openDataset() : null;

    // Initialize header generator for HTTP requests
    const headerGenerator = new HeaderGenerator();

    // Results array and counters
    const results = [];
    let succeeded = 0;
    let failed = 0;

    // Helper function to determine content type from format
    const getContentType = (formatName) => {
        const contentTypes = {
            jpeg: 'image/jpeg',
            jpg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            avif: 'image/avif',
            gif: 'image/gif',
        };
        return contentTypes[formatName] || 'application/octet-stream';
    };

    // Process images with concurrency control
    await Apify.utils.createPromisePool({
        maxConcurrency: Math.min(Math.max(1, concurrency), 20),
        taskFn: async (source, index) => {
            try {
                Apify.utils.log.info(`Processing image ${index + 1}/${images.length}: ${source}`);

                // Step 1: Resolve image buffer from source
                const inputBuffer = await resolveImageBuffer(source, headerGenerator);

                // Step 2: Process image
                const { buffer, info } = await processWithSharp(inputBuffer, {
                    width,
                    height,
                    fit,
                    position,
                    format,
                    quality,
                    background,
                    stripMetadata,
                });

                // Step 3: Generate unique key for storage
                const key = `image_${index}_${Date.now()}`;

                // Step 4: Determine content type
                const contentType = getContentType(info.format);

                // Step 5: Save to key-value store
                await store.setValue(key, buffer, { contentType });

                // Step 6: Get public URL
                const url = store.getPublicUrl(key);

                // Step 7: Build result object
                const result = {
                    index,
                    source,
                    key,
                    url,
                    width: info.width,
                    height: info.height,
                    format: info.format,
                    sizeBytes: buffer.length,
                };

                // Step 8: Save result
                results.push(result);

                // Step 9: Push to dataset if enabled
                if (dataset) {
                    await dataset.pushData(result);
                }

                succeeded++;
                Apify.utils.log.info(`Successfully processed image ${index + 1}: ${url}`);
            } catch (error) {
                // Handle error for individual image
                Apify.utils.log.exception(error, `Failed to process image ${index + 1}: ${source}`);

                const errorResult = {
                    index,
                    source,
                    error: error.message,
                };

                results.push(errorResult);

                // Push error result to dataset if enabled
                if (dataset) {
                    await dataset.pushData(errorResult);
                }

                failed++;
            }
        },
        tasksArray: images,
    });

    // Compute summary
    const summary = {
        total: images.length,
        succeeded,
        failed,
    };

    Apify.utils.log.info(`Processing complete: ${succeeded} succeeded, ${failed} failed out of ${images.length} total`);

    // Save final output to OUTPUT key
    const output = {
        results,
        summary,
    };

    await Apify.setValue('OUTPUT', output);

    Apify.utils.log.info('Results saved to OUTPUT key in key-value store');
});
