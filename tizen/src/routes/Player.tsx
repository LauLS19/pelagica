import { useNavigate, useParams } from 'react-router-dom';
import { useItem } from '@pelagica/core';
import FocusableButton from '../components/FocusableButton';

const Player = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    const { data: item } = useItem(itemId);

    return (
        <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-semibold">{item?.Name ?? 'Player'}</h1>
            <p className="text-muted-foreground">
                Playback isn&apos;t implemented yet for item {itemId}.
            </p>
            <FocusableButton autoFocus onClick={() => navigate(-1)}>
                Back
            </FocusableButton>
        </div>
    );
};

export default Player;
