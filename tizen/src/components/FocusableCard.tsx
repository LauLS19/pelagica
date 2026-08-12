import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useScrollIntoViewOnFocus } from '@/lib/use-scroll-into-view-on-focus';

const FocusableCard = ({
    to,
    autoFocus,
    className,
    children,
}: {
    to: string;
    autoFocus?: boolean;
    className?: string;
    children: (focused: boolean) => ReactNode;
}) => {
    const { ref, focused, focusSelf } = useFocusable<object, HTMLAnchorElement>({
        onEnterPress: () => ref.current?.click(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    useScrollIntoViewOnFocus(ref, focused);

    return (
        <Link ref={ref} to={to} className={cn('block shrink-0 scroll-m-3 outline-none', className)}>
            {children(focused)}
        </Link>
    );
};

export default FocusableCard;
