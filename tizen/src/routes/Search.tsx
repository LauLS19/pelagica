import FocusableField from '@/components/FocusableField';
import ItemCard from '@/components/ItemCard';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { getUserId, useSearchItems } from '@pelagica/core';
import { CircleQuestionMark, TriangleAlert } from 'lucide-react';
import { startTransition, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Search = () => {
    const { t } = useTranslation('search');
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const {
        data: results,
        isLoading,
        error,
    } = useSearchItems(debouncedQuery, {
        itemTypes: ['Movie', 'Series'],
        limit: 50,
        userId: getUserId() || undefined,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            startTransition(() => {
                setDebouncedQuery(query);
            });
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    return (
        <div className="flex flex-col gap-6">
            <FocusableField
                type="text"
                placeholder={t('input_placeholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                          <div
                              key={i}
                              className="aspect-video w-full animate-pulse rounded-md bg-muted"
                          />
                      ))
                    : results?.map((item) => <ItemCard key={item.Id} item={item} />)}
            </div>
            {error && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <TriangleAlert />
                        </EmptyMedia>
                        <EmptyTitle>{t('unexpected_error')}</EmptyTitle>
                        <EmptyDescription>{t('error_occurred_while_searching')}</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
            {!isLoading && !error && results && results.length === 0 && (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <CircleQuestionMark />
                        </EmptyMedia>
                        <EmptyTitle>{t('no_results')}</EmptyTitle>
                        <EmptyDescription>{t('no_results_description')}</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </div>
    );
};

export default Search;
