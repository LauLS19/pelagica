import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { useLocalTrailers } from '@pelagica/core';
import FocusableButton from './FocusableButton';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';

interface TrailerButtonProps {
    item: BaseItemDto;
}

const TrailerButton = ({ item }: TrailerButtonProps) => {
    const hasLocalTrailers = (item.LocalTrailerCount ?? 0) > 0;
    const navigate = useNavigate();
    const { data: localTrailers } = useLocalTrailers(item.Id ?? undefined, hasLocalTrailers);

    if (!hasLocalTrailers || !localTrailers || localTrailers.length === 0) {
        return null;
    }

    const firstTrailer = localTrailers[0];

    return (
        <FocusableButton
            variant="outline"
            size="lg"
            onClick={() => navigate(`/player/${firstTrailer.Id}`)}
        >
            <Film />
            Trailer
        </FocusableButton>
    );
};

export default TrailerButton;
