import { useRowItems, type DetailField, type SectionItemsConfig } from '@pelagica/core';
import { useEffect } from 'react';
import ScrollableHomeSection from './ScrollableHomeSection';
import ItemCard from '../ItemCard';
import { Skeleton } from '../ui/skeleton';
import { useTranslation } from 'react-i18next';

interface ItemsRowProps {
    title?: string;
    allLink?: string;
    items?: SectionItemsConfig;
    detailFields?: DetailField[];
    useThumbImage?: boolean;
    autoPlayTrailers?: boolean;
}

const ItemsRow = ({ title, items, useThumbImage }: ItemsRowProps) => {
    const { t } = useTranslation('home');
    const { data: recentItems, isLoading } = useRowItems(items);

    useEffect(() => {
        if (recentItems && recentItems.length === 0) {
            console.warn(`ItemsRow: No items found for section "${title}"`);
        }
    }, [recentItems, title]);

    return (
        ((recentItems && recentItems.length > 0) || isLoading) && (
            <ScrollableHomeSection title={title || t('items')}>
                {recentItems
                    ? recentItems.map((item) => (
                          <ItemCard
                              key={item.Id}
                              item={item}
                              autoFocus={false}
                              useThumb={useThumbImage}
                          />
                      ))
                    : Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="w-40">
                              <Skeleton className="w-40 h-54 rounded-md mb-2" />
                              <Skeleton className="w-36 h-4 mb-1" />
                              <Skeleton className="w-24 h-3" />
                          </div>
                      ))}
            </ScrollableHomeSection>
        )
    );
};

export default ItemsRow;
