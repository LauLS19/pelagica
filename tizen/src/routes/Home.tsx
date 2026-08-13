import { useTranslation } from 'react-i18next';
import LibrariesRow from '../components/home/LibrariesRow';
import ContinueWatchingRow from '@/components/home/ContinueWatchingRow';
import ResumeRow from '../components/home/ResumeRow';
import NextUpRow from '../components/home/NextUpRow';
import { useConfig } from '@pelagica/core';
import ItemsRow from '../components/home/ItemsRow';

const Home = () => {
    const { config } = useConfig();
    const { t } = useTranslation('home');

    return (
        <div className="flex flex-col items-start gap-6">
            {config.homeScreenSections?.map((section, index) => {
                switch (section.type) {
                    case 'continueWatching':
                        return (
                            <ContinueWatchingRow
                                key={index}
                                title={t('continue_watching')}
                                accurateSorting={section.accurateSorting}
                                titleLine={section.titleLine}
                                detailLine={section.detailLine}
                                limit={section.limit}
                            />
                        );
                    case 'resume':
                        return (
                            <ResumeRow
                                key={index}
                                title={t('resume')}
                                titleLine={section.titleLine}
                                detailLine={section.detailLine}
                                limit={section.limit}
                            />
                        );
                    case 'nextUp':
                        return (
                            <NextUpRow
                                key={index}
                                title={t('next_up')}
                                titleLine={section.titleLine}
                                detailLine={section.detailLine}
                                limit={section.limit}
                            />
                        );
                    case 'libraries':
                        return <LibrariesRow key={index} title={t('libraries')} />;
                    case 'items':
                        return (
                            <ItemsRow
                                key={index}
                                title={section.title || t('items')}
                                items={section.items}
                                useThumbImage={section.useThumbImage}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default Home;
