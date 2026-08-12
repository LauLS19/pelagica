import { getServerUrl, useCurrentUser } from '@pelagica/core';
import FocusableButton from '../components/FocusableButton';
import LibrariesRow from '../components/LibrariesRow';

const Home = () => {
    const serverUrl = getServerUrl();
    const { data: user, isLoading, refetch, isFetching } = useCurrentUser();

    return (
        <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-4">
                <h1 className="text-2xl font-semibold">Pelagica</h1>
                <p className="text-muted-foreground">Server: {serverUrl || 'not configured'}</p>
                <p className="text-muted-foreground">
                    Signed in as: {isLoading ? 'Loading…' : (user?.Name ?? 'unknown')}
                </p>
                <FocusableButton onClick={() => refetch()} disabled={isFetching}>
                    Refetch
                </FocusableButton>
            </div>
            <LibrariesRow />
        </div>
    );
};

export default Home;
