import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { clearCredentials } from '@pelagica/core';
import { cn } from '@/lib/utils';
import { useTvBackKey } from '@/lib/use-tv-back-key';
import FocusableButton from '@/components/FocusableButton';

const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
];

function NavLink({ to, label, autoFocus }: { to: string; label: string; autoFocus?: boolean }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { ref, focused, focusSelf } = useFocusable<object, HTMLAnchorElement>({
        onEnterPress: () => navigate(to),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    return (
        <Link
            ref={ref}
            to={to}
            className={cn(
                'rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground',
                location.pathname === to && 'text-foreground',
                focused && 'text-foreground outline-2 outline-ring outline-offset-4'
            )}
        >
            {label}
        </Link>
    );
}

function LogoutButton() {
    const navigate = useNavigate();

    return (
        <FocusableButton
            variant="ghost"
            size="sm"
            onClick={() => {
                clearCredentials();
                navigate('/login', { replace: true });
            }}
        >
            Log out
        </FocusableButton>
    );
}

export function RootLayout() {
    useTvBackKey();

    return (
        <div className="flex min-h-svh flex-col">
            <header className="flex items-center justify-between gap-4 border-b px-6 py-4">
                <nav className="flex gap-4">
                    {links.map((link, i) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            label={link.label}
                            autoFocus={i === 0}
                        />
                    ))}
                </nav>
                <LogoutButton />
            </header>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
