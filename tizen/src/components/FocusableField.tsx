import { useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { cn } from '@/lib/utils';

const FocusableField = ({
    autoFocus,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & { autoFocus?: boolean }) => {
    const { ref, focused, focusSelf } = useFocusable<object, HTMLInputElement>({
        onEnterPress: () => ref.current?.focus(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    return (
        <input
            ref={ref}
            className={cn(
                'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none',
                focused && 'ring-4 ring-ring ring-offset-4 ring-offset-background'
            )}
            {...props}
        />
    );
};

export default FocusableField;
