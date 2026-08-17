import { useQuery } from '@tanstack/react-query';
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api/user-library-api';
import { getApi } from '../api/getApi';
import { getRetryConfig } from '../utils/authErrorHandler';

export function useUserLibraryItem(
    itemId: string | null | undefined,
    userId?: string | undefined
) {
    return useQuery({
        queryKey: ['userLibraryItem', itemId, userId],
        queryFn: async () => {
            if (!itemId) {
                throw new Error('Item ID is required');
            }

            const api = getApi();
            const userLibraryApi = getUserLibraryApi(api);

            const response = await userLibraryApi.getItem({
                itemId,
                userId,
            });

            return response.data;
        },
        enabled: !!itemId,
        ...getRetryConfig(),
        staleTime: 30_000,
    });
}
