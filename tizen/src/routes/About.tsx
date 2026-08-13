import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FocusableButton from '../components/FocusableButton';

const About = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">{t('about')}</h1>
            <p className="text-muted-foreground">{t('about_description')}</p>
            <FocusableButton autoFocus onClick={() => navigate(-1)}>
                {t('back')}
            </FocusableButton>
        </div>
    );
};

export default About;
