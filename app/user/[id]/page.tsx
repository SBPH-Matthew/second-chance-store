import UserProfile from '@/features/user/Profile';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <UserProfile id={id} />;
}
