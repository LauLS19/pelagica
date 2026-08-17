import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onBackKey, tizenNavigationAdapter } from '@pelagica/tv-platform';

/**
 * Wires the TV remote's Return/Back key to browser-style back navigation,
 * exiting the app only when already at the root route (there's no browser
 * chrome on a TV to fall back on).
 */
export function useTvBackKey(onIntercept?: () => boolean) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        return onBackKey(() => {
            if (onIntercept?.()) return;

            if (location.pathname === '/') {
                tizenNavigationAdapter.exitApp();
            } else {
                navigate(-1);
            }
        });
    }, [location.pathname, navigate, onIntercept]);
}
