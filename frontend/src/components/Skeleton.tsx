interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export default function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
    count = 1,
}: SkeletonProps) {
    const getVariantClass = () => {
        switch (variant) {
            case 'text':
                return 'h-4 rounded';
            case 'circular':
                return 'rounded-full';
            case 'rectangular':
                return 'rounded-lg';
            default:
                return 'rounded';
        }
    };

    const style = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    const skeletonElement = (
        <div
            className={`bg-gray-200 animate-pulse ${getVariantClass()} ${className}`}
            style={style}
        />
    );

    if (count === 1) {
        return skeletonElement;
    }

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="mb-2">
                    {skeletonElement}
                </div>
            ))}
        </>
    );
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <Skeleton variant="rectangular" height={250} />
            <div className="p-4 space-y-3">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
                <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="30%" />
                </div>
            </div>
        </div>
    );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                    <Skeleton variant="circular" width={60} height={60} />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                </div>
            ))}
        </div>
    );
}
