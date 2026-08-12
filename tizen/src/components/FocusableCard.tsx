import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

    useEffect(() => {
        if (focused) {
            ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
        }
    }, [focused, ref]);

    return (
        <Link ref={ref} to={to} className={cn('block shrink-0 scroll-m-3 outline-none', className)}>
            {children(focused)}
        </Link>
    );
};

export default FocusableCard;
