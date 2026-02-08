import { apiClient } from './client';
import { UserProfile } from './auth';
import { ListingItem } from './products';

export interface PublicProfile {
    user: UserProfile;
    products: ListingItem[];
    vehicles: ListingItem[];
    reviews: any[];
}

export const userApi = {
    getPublicProfile: async (id: string): Promise<PublicProfile> => {
        return apiClient.get<PublicProfile>(`/user/${id}/public`);
    },
};
