import { useNavigate } from 'react-router-dom';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { getUserId, useSeriesNextUp } from '@pelagica/core';
import { Play } from 'lucide-react';
import FocusableButton from './FocusableButton';

const PlayButton = ({ item }: { item: BaseItemDto }) => {
    const navigate = useNavigate();
    const isSeries = item.Type === 'Series';

    const { data: nextUpEpisode } = useSeriesNextUp(
        isSeries ? item.Id : undefined,
        getUserId() ?? undefined
    );

    const playItemId = isSeries ? nextUpEpisode?.Id : item.Id;
    const resume = isSeries
        ? (item.UserData?.PlayedPercentage ?? 0) > 0 ||
          (nextUpEpisode?.UserData?.PlaybackPositionTicks ?? 0) > 0
        : (item.UserData?.PlaybackPositionTicks ?? 0) > 0;

    const label = isSeries
        ? nextUpEpisode
            ? resume
                ? `Resume S${nextUpEpisode.ParentIndexNumber} E${nextUpEpisode.IndexNumber}`
                : `Play S${nextUpEpisode.ParentIndexNumber} E${nextUpEpisode.IndexNumber}`
            : resume
              ? `Resume`
              : `Play`
        : resume
          ? 'Resume'
          : 'Play';

    return (
        <FocusableButton
            autoFocus
            size="lg"
            disabled={!playItemId}
            onClick={() => playItemId && navigate(`/player/${playItemId}`)}
        >
            <Play /> {label}
        </FocusableButton>
    );
};

export default PlayButton;
