import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FOCUS_RING_COMPACT } from '@/lib/focus-styles';
import { Button } from '@/components/ui/button';

const FocusableNavLink = ({
    to,
    autoFocus,
    className,
    children,
}: {
    to: string;
    autoFocus?: boolean;
    className?: string;
    children: ReactNode;
}) => {
    const { ref, focused, focusSelf } = useFocusable<object, HTMLAnchorElement>({
        onEnterPress: () => ref.current?.click(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    return (
        <Button
            render={<Link ref={ref} to={to} />}
            variant="ghost"
            size="sm"
            className={cn(focused && FOCUS_RING_COMPACT, className)}
        >
            {children}
        </Button>
    );
};

export default FocusableNavLink;
