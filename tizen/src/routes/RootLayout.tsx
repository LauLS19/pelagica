import { Outlet } from 'react-router-dom';
import { useTvBackKey } from '@/lib/use-tv-back-key';
import TopBar from '../components/TopBar';

export function RootLayout() {
    useTvBackKey();

    return (
        <div className="flex min-h-svh flex-col">
            <TopBar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
