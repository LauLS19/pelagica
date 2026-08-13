import { useTranslation } from 'react-i18next';
import LibrariesRow from '../components/home/LibrariesRow';
import ContinueWatchingRow from '@/components/home/ContinueWatchingRow';
import ResumeRow from '../components/home/ResumeRow';

const Home = () => {
    const { t } = useTranslation('home');

    return (
        <div className="flex flex-col items-start gap-6">
            <ContinueWatchingRow title={t('continue_watching')} />
            <ResumeRow title={t('resume')} />
            <LibrariesRow title={t('libraries')} />
        </div>
    );
};

export default Home;
