import { clearCredentials, getServerUrl, useCurrentUser } from '@pelagica/core';
import i18n, { SUPPORTED_LANGUAGES } from '@pelagica/core/i18n';
import { useTranslation } from 'react-i18next';
import FocusableButton from '../components/FocusableButton';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const Settings = () => {
    const { t } = useTranslation(['settings', 'sidebar', 'common']);
    const serverUrl = getServerUrl();
    const { data: user, isLoading, refetch, isFetching } = useCurrentUser();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">Pelagica</h1>
            <p className="text-muted-foreground">
                {t('settings:server_label')}: {serverUrl || t('settings:not_configured')}
            </p>
            <p className="text-muted-foreground">
                {t('settings:signed_in_as')}:{' '}
                {isLoading ? t('common:loading') : (user?.Name ?? t('sidebar:unknown_user'))}
            </p>
            <FocusableButton onClick={() => refetch()} disabled={isFetching}>
                <RefreshCcw />
                {t('common:refresh')}
            </FocusableButton>
            <FocusableButton
                onClick={() => {
                    clearCredentials();
                    navigate('/login', { replace: true });
                }}
            >
                <LogOut />
                {t('sidebar:logout')}
            </FocusableButton>

            <div className="flex flex-col items-start gap-2">
                <h2 className="text-sm text-muted-foreground">{t('sidebar:select_language')}</h2>
                <div className="flex flex-wrap gap-2">
                    {SUPPORTED_LANGUAGES.map(({ code, Flag, label }) => (
                        <FocusableButton
                            key={code}
                            variant={i18n.language === code ? 'default' : 'outline'}
                            onClick={() => i18n.changeLanguage(code)}
                            className={cn('gap-2')}
                        >
                            <span className="inline-block w-6 h-4 shrink-0 overflow-hidden rounded-xs">
                                <Flag style={{ width: '100%', height: '100%' }} />
                            </span>
                            {label}
                        </FocusableButton>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
