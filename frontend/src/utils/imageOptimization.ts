/**
 * Image optimization utilities for Arohan frontend
 * Supports responsive images, lazy loading, WebP/AVIF fallbacks
 */

/**
 * Generate srcset for responsive images
 * Usage: getResponsiveSrcSet('/images/product.jpg', [400, 800, 1200])
 */
export const getResponsiveSrcSet = (basePath: string, widths: number[] = [400, 800, 1200, 1600]): string => {
    // Extract file extension
    const ext = basePath.split('.').pop();
    const pathWithoutExt = basePath.substring(0, basePath.lastIndexOf('.'));

    return widths
        .map(width => `${pathWithoutExt}-${width}w.${ext} ${width}w`)
        .join(', ');
};

interface Breakpoints {
    mobile: string;
    tablet: string;
    desktop: string;
    [key: string]: string;
}

/**
 * Generate sizes attribute for responsive images
 */
export const getResponsiveSizes = (breakpoints: Breakpoints = {
    mobile: '400px',
    tablet: '800px',
    desktop: '1200px'
}): string => {
    return [
        `(max-width: 600px) ${breakpoints.mobile}`,
        `(max-width: 1200px) ${breakpoints.tablet}`,
        breakpoints.desktop
    ].join(', ');
};

interface CloudinaryOptions {
    width?: number;
    quality?: string | number;
    format?: string;
}

/**
 * Get Cloudinary optimized URL
 * Replace once Cloudinary is set up
 */
export const getCloudinaryURL = (imagePath: string, options: CloudinaryOptions = {}): string => {
    const {
        width = 800,
        quality = 'auto',
        format = 'auto'
    } = options;

    // TODO: Replace with actual Cloudinary cloud name
    const cloudName = 'YOUR_CLOUD_NAME';

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},q_${quality},f_${format}/${cleanPath}`;
};

/**
 * Lazy loading observer for images
 * Usage: lazyLoadImages('.lazy-image')
 */
export const lazyLoadImages = (selector: string = '.lazy'): void => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.classList.remove('lazy');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll(selector).forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll(selector).forEach(el => {
            const img = el as HTMLImageElement;
            if (img.dataset.src) img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        });
    }
};

/**
 * Convert image to WebP (client-side check)
 */
export const supportsWebP = (): boolean => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

/**
 * Get optimized image format
 */
export const getOptimizedFormat = (): string => {
    // Check for AVIF support (simulated as direct checks can be async or tricky)
    const avifSupport = new Image();
    avifSupport.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0Eg';

    // Note: This sync check is imperfect as image loading is async. 
    // For critical paths, assume webp/jpg or check async.
    if (avifSupport.complete && avifSupport.width === 2) {
        return 'avif';
    } else if (supportsWebP()) {
        return 'webp';
    }
    return 'jpg';
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
};

/**
 * Calculate optimal image dimensions for container
 */
export const getOptimalDimensions = (containerWidth: number, aspectRatio: number = 16 / 9): { width: number; height: number } => {
    const width = Math.ceil(containerWidth);
    const height = Math.ceil(width / aspectRatio);
    return { width, height };
};
