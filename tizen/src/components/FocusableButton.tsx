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
            className={cn(focused && 'border-ring ring-3 ring-ring/50', className)}
            {...props}
        />
    );
};

export default FocusableButton;
