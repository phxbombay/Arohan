import { useState, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface UseAsyncReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    execute: (...args: any[]) => Promise<T | void>;
    reset: () => void;
}

export function useAsync<T = any>(
    asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncReturn<T> {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]) => {
            setState({ data: null, loading: true, error: null });

            try {
                const result = await asyncFunction(...args);
                setState({ data: result, loading: false, error: null });
                return result;
            } catch (error) {
                setState({ data: null, loading: false, error: error as Error });
                throw error; // Re-throw to allow caller to handle
            }
        },
        [asyncFunction]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}
