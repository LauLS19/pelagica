import { useTranslation } from 'react-i18next';
import LibrariesRow from '../components/home/LibrariesRow';
import ContinueWatchingRow from '@/components/home/ContinueWatchingRow';

const Home = () => {
    const { t } = useTranslation('home');

    return (
        <div className="flex flex-col items-start gap-6">
            <ContinueWatchingRow title={t('continue_watching')} />
            <LibrariesRow title={t('libraries')} />
        </div>
    );
};

export default Home;
