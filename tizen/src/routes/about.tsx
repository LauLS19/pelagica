import { useNavigate } from 'react-router-dom';
import FocusableButton from '../components/FocusableButton';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">About</h1>
            <p className="text-muted-foreground">
                React + TypeScript + Tailwind + shadcn/ui, packaged as a Tizen web app.
            </p>
            <FocusableButton autoFocus onClick={() => navigate(-1)}>
                Back
            </FocusableButton>
        </div>
    );
};

export default About;
