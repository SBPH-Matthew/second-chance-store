import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/api/user';

export const usePublicProfile = (id: string) => {
    return useQuery({
        queryKey: ['user-profile', id],
        queryFn: () => userApi.getPublicProfile(id),
        enabled: !!id,
    });
};
