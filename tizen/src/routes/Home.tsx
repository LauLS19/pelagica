import { useTranslation } from 'react-i18next';
import LibrariesRow from '../components/home/LibrariesRow';
import ContinueWatchingRow from '@/components/home/ContinueWatchingRow';
import ResumeRow from '../components/home/ResumeRow';
import NextUpRow from '../components/home/NextUpRow';
import { useConfig } from '@pelagica/core';

const Home = () => {
    const { config } = useConfig();
    const { t } = useTranslation('home');

    return (
        <div className="flex flex-col items-start gap-6">
            {config.homeScreenSections?.map((section, index) => {
                switch (section.type) {
                    case 'continueWatching':
                        return <ContinueWatchingRow key={index} title={t('continue_watching')} />;
                    case 'resume':
                        return <ResumeRow key={index} title={t('resume')} />;
                    case 'nextUp':
                        return <NextUpRow key={index} title={t('next_up')} />;
                    case 'libraries':
                        return <LibrariesRow key={index} title={t('libraries')} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Home;
