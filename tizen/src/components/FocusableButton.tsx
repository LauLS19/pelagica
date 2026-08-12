import { useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FocusableButton = ({
    autoFocus,
    className,
    ...props
}: React.ComponentProps<typeof Button> & { autoFocus?: boolean }) => {
    const { ref, focused, focusSelf } = useFocusable<object, HTMLButtonElement>({
        onEnterPress: () => ref.current?.click(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    return (
        <Button
            ref={ref}
            className={cn(
                focused && 'scale-105 ring-4 ring-ring ring-offset-4 ring-offset-background',
                className
            )}
            {...props}
        />
    );
};

export default FocusableButton;
