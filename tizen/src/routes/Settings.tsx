import { clearCredentials, getServerUrl, useCurrentUser } from '@pelagica/core';
import FocusableButton from '../components/FocusableButton';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCcw } from 'lucide-react';

const Settings = () => {
    const serverUrl = getServerUrl();
    const { data: user, isLoading, refetch, isFetching } = useCurrentUser();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">Pelagica</h1>
            <p className="text-muted-foreground">Server: {serverUrl || 'not configured'}</p>
            <p className="text-muted-foreground">
                Signed in as: {isLoading ? 'Loading…' : (user?.Name ?? 'unknown')}
            </p>
            <FocusableButton onClick={() => refetch()} disabled={isFetching}>
                <RefreshCcw />
                Refetch
            </FocusableButton>
            <FocusableButton
                onClick={() => {
                    clearCredentials();
                    navigate('/login', { replace: true });
                }}
            >
                <LogOut />
                Log out
            </FocusableButton>
        </div>
    );
};

export default Settings;
