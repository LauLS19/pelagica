import { useEffect } from 'react';
import type { InputHTMLAttributes } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { cn } from '@/lib/utils';
import { useScrollIntoViewOnFocus } from '@/lib/use-scroll-into-view-on-focus';

const FocusableField = ({
    autoFocus,
    ...props
}: InputHTMLAttributes<HTMLInputElement> & { autoFocus?: boolean }) => {
    const { ref, focused, focusSelf } = useFocusable<object, HTMLInputElement>({
        onEnterPress: () => ref.current?.focus(),
        onBlur: () => ref.current?.blur(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    useScrollIntoViewOnFocus(ref, focused);

    return (
        <input
            ref={ref}
            className={cn(
                'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none scroll-m-3',
                focused && 'ring-4 ring-ring ring-offset-4 ring-offset-background'
            )}
            {...props}
        />
    );
};

export default FocusableField;
