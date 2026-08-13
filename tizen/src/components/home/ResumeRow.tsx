import { getUserId, useResumeItems } from '@pelagica/core';
import BaseContinueRow from './BaseContinueRow';

const ResumeRow = ({ limit, title }: { limit?: number; title: string }) => {
    const { data: resumeData, isLoading, error } = useResumeItems(getUserId(), limit);

    return (
        <BaseContinueRow
            items={resumeData || []}
            isLoading={isLoading}
            error={error}
            title={title}
        />
    );
};

export default ResumeRow;
