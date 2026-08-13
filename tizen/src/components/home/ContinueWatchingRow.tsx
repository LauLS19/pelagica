import { getUserId, useContinueWatchingAndNextUp } from '@pelagica/core';
import BaseContinueRow from './BaseContinueRow';

const ContinueWatchingRow = ({
    limit,
    accurateSorting = true,
    title,
}: {
    limit?: number;
    accurateSorting?: boolean;
    title: string;
}) => {
    const {
        data: continueWatchingData,
        isLoading,
        error,
    } = useContinueWatchingAndNextUp(getUserId(), limit, accurateSorting);

    return (
        <BaseContinueRow
            items={continueWatchingData?.items || []}
            isLoading={isLoading}
            error={error}
            title={title}
        />
    );
};

export default ContinueWatchingRow;
