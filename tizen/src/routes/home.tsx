import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { getServerUrl, useCurrentUser } from '@pelagica/core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Home = () => {
    const serverUrl = getServerUrl();
    const { data: user, isLoading, refetch, isFetching } = useCurrentUser();
    const { ref, focused } = useFocusable<object, HTMLButtonElement>({
        onEnterPress: () => refetch(),
    });

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">Pelagica</h1>
            <p className="text-muted-foreground">Server: {serverUrl || 'not configured'}</p>
            <p className="text-muted-foreground">
                Signed in as: {isLoading ? 'Loading…' : (user?.Name ?? 'unknown')}
            </p>
            <Button
                ref={ref}
                onClick={() => refetch()}
                disabled={isFetching}
                className={cn(focused && 'border-ring ring-3 ring-ring/50')}
            >
                Refetch
            </Button>
        </div>
    );
};

export default Home;
