import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getJellyfinInstance,
    getServerUrl,
    saveServerUrl,
    useLogin,
    useQuickConnectAuthenticate,
    useQuickConnectInitiate,
    useQuickConnectStatus,
    useServerAddress,
} from '@pelagica/core';
import FocusableButton from '@/components/FocusableButton';
import FocusableField from '@/components/FocusableField';

type Step = 'server' | 'method' | 'quickconnect' | 'password';

const Login = () => {
    const navigate = useNavigate();
    const predefinedServerAddress = useServerAddress();

    const [serverUrl, setServerUrl] = useState<string>(() => getServerUrl() || '');
    const [step, setStep] = useState<Step>(() => (getServerUrl() ? 'method' : 'server'));
    const [checkingServer, setCheckingServer] = useState(false);
    const [serverCheckError, setServerCheckError] = useState<string | null>(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const [loginError, setLoginError] = useState<string | null>(null);

    const quickConnectInitiate = useQuickConnectInitiate();
    const quickConnectAuthenticate = useQuickConnectAuthenticate();
    const [quickConnectSecret, setQuickConnectSecret] = useState<string | undefined>(undefined);
    const [quickConnectCode, setQuickConnectCode] = useState<string | null>(null);
    const [quickConnectError, setQuickConnectError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [quickConnectApproved, setQuickConnectApproved] = useState(false);
    const initiatingRef = useRef(false);

    const quickConnectStatus = useQuickConnectStatus(serverUrl, quickConnectSecret, isPolling);

    // A server pre-configured by the deployment (e.g. bundled with the Pelagica
    // backend) means the user never has to type a server address on the TV.
    useEffect(() => {
        if (!predefinedServerAddress?.trim() || getServerUrl()) return;
        saveServerUrl(predefinedServerAddress);
        setServerUrl(predefinedServerAddress);
        setStep('method');
    }, [predefinedServerAddress]);

    const onSubmitServer = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCheckingServer(true);
        setServerCheckError(null);

        const input = String(new FormData(e.currentTarget).get('server') ?? '').trim();
        if (!input) {
            setServerCheckError('Please enter a server address');
            setCheckingServer(false);
            return;
        }

        try {
            const servers =
                await getJellyfinInstance().discovery.getRecommendedServerCandidates(input);
            const best = getJellyfinInstance().discovery.findBestServer(servers);
            if (!best) {
                setServerCheckError('Could not find a server at that address');
                return;
            }
            saveServerUrl(best.address);
            setServerUrl(best.address);
            setStep('method');
        } finally {
            setCheckingServer(false);
        }
    }, []);

    const initiateQuickConnect = useCallback(async () => {
        setQuickConnectError(null);
        try {
            const result = await quickConnectInitiate.mutateAsync(serverUrl);
            if (result.Code && result.Secret) {
                setQuickConnectCode(result.Code);
                setQuickConnectSecret(result.Secret);
                setIsPolling(true);
            } else {
                setQuickConnectError('Quick Connect is not available on this server');
            }
        } catch {
            setQuickConnectError('Quick Connect is not available on this server');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverUrl]);

    useEffect(() => {
        if (step === 'quickconnect' && !quickConnectCode && !initiatingRef.current) {
            initiatingRef.current = true;
            initiateQuickConnect().finally(() => {
                initiatingRef.current = false;
            });
        }
    }, [step, quickConnectCode, initiateQuickConnect]);

    useEffect(() => {
        if (!quickConnectStatus.data?.Authenticated || !quickConnectSecret || quickConnectApproved)
            return;

        setQuickConnectApproved(true);
        setIsPolling(false);

        quickConnectAuthenticate
            .mutateAsync({ server: serverUrl, secret: quickConnectSecret })
            .then(() => navigate('/', { replace: true }))
            .catch(() => {
                setQuickConnectError('Quick Connect authentication failed');
                setQuickConnectApproved(false);
            });
    }, [
        quickConnectStatus.data,
        quickConnectSecret,
        quickConnectApproved,
        serverUrl,
        quickConnectAuthenticate,
        navigate,
    ]);

    const onSubmitPassword = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoginError(null);
            try {
                await login.mutateAsync({ server: serverUrl, username, password });
                navigate('/', { replace: true });
            } catch {
                setLoginError('Invalid username or password');
            }
        },
        [serverUrl, username, password, login, navigate]
    );

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
            <h1 className="text-2xl font-semibold">Pelagica</h1>

            {step === 'server' && (
                <form onSubmit={onSubmitServer} className="flex w-full max-w-sm flex-col gap-3">
                    <label className="text-sm text-muted-foreground" htmlFor="server">
                        Server address
                    </label>
                    <FocusableField
                        id="server"
                        name="server"
                        placeholder="jellyfin.example.com"
                        autoFocus
                    />
                    {serverCheckError && (
                        <p className="text-sm text-destructive">{serverCheckError}</p>
                    )}
                    <FocusableButton type="submit" disabled={checkingServer}>
                        {checkingServer ? 'Connecting…' : 'Connect'}
                    </FocusableButton>
                </form>
            )}

            {step === 'method' && (
                <div className="flex w-full max-w-sm flex-col gap-3">
                    <FocusableButton autoFocus onClick={() => setStep('quickconnect')}>
                        Sign in with Quick Connect
                    </FocusableButton>
                    <FocusableButton variant="outline" onClick={() => setStep('password')}>
                        Sign in with username &amp; password
                    </FocusableButton>
                    {!predefinedServerAddress && (
                        <FocusableButton
                            variant="ghost"
                            onClick={() => {
                                setStep('server');
                                setServerCheckError(null);
                            }}
                        >
                            Use a different server
                        </FocusableButton>
                    )}
                </div>
            )}

            {step === 'quickconnect' && (
                <div className="flex w-full max-w-sm flex-col items-center gap-3 text-center">
                    <p className="text-muted-foreground">
                        Go to <span className="font-medium text-foreground">{serverUrl}</span> on
                        your phone or computer, sign in, and enter this code:
                    </p>
                    <p className="text-4xl font-semibold tracking-[0.3em]">
                        {quickConnectCode ?? '……'}
                    </p>
                    {quickConnectError && (
                        <p className="text-sm text-destructive">{quickConnectError}</p>
                    )}
                    <FocusableButton
                        autoFocus
                        variant="ghost"
                        onClick={() => {
                            setIsPolling(false);
                            setQuickConnectCode(null);
                            setQuickConnectSecret(undefined);
                            setQuickConnectError(null);
                            setStep('method');
                        }}
                    >
                        Back
                    </FocusableButton>
                </div>
            )}

            {step === 'password' && (
                <form onSubmit={onSubmitPassword} className="flex w-full max-w-sm flex-col gap-3">
                    <label className="text-sm text-muted-foreground" htmlFor="username">
                        Username
                    </label>
                    <FocusableField
                        id="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="text-sm text-muted-foreground" htmlFor="password">
                        Password
                    </label>
                    <FocusableField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                    <FocusableButton type="submit" disabled={login.isPending}>
                        {login.isPending ? 'Signing in…' : 'Sign in'}
                    </FocusableButton>
                    <FocusableButton variant="ghost" onClick={() => setStep('method')}>
                        Back
                    </FocusableButton>
                </form>
            )}
        </div>
    );
};

export default Login;
