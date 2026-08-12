import { useQueryClient } from '@tanstack/react-query';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useServerAddress } from '@pelagica/core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Home = () => {
    const serverAddress = useServerAddress();
    const queryClient = useQueryClient();
    const { ref, focused } = useFocusable<object, HTMLButtonElement>({
        onEnterPress: () => queryClient.invalidateQueries({ queryKey: ['server-address'] }),
    });

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">Pelagica</h1>
            <p className="text-muted-foreground">Server: {serverAddress || 'not configured'}</p>
            <Button
                ref={ref}
                onClick={() => queryClient.invalidateQueries({ queryKey: ['server-address'] })}
                className={cn(focused && 'border-ring ring-3 ring-ring/50')}
            >
                Refetch
            </Button>
        </div>
    );
};

export default Home;
