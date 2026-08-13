import { getUserId, useNextUp } from '@pelagica/core';
import BaseContinueRow from './BaseContinueRow';

const NextUpRow = ({ limit, title }: { limit?: number; title: string }) => {
    const { data: nextUpData, isLoading, error } = useNextUp(getUserId(), limit);

    return (
        <BaseContinueRow
            items={nextUpData || []}
            isLoading={isLoading}
            error={error}
            title={title}
        />
    );
};

export default NextUpRow;
