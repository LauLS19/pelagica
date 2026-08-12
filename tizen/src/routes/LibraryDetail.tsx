import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    COLLECTION_ITEM_TYPES,
    getPrimaryImageUrl,
    useLibraryItems,
    useUserViews,
} from '@pelagica/core';
import type { BaseItemDto, CollectionType } from '@jellyfin/sdk/lib/generated-client/models';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING_LARGE } from '@/lib/focus-styles';
import FocusableCard from '../components/FocusableCard';
import ItemPagination from '../components/ItemPagination';

const MIN_CARD_WIDTH = 160;
const GRID_GAP = 16;
const ROWS_PER_PAGE = 5;

const ItemCard = ({ item, autoFocus }: { item: BaseItemDto; autoFocus?: boolean }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <FocusableCard to="/about" autoFocus={autoFocus} className="w-40">
            {(focused) => (
                <>
                    <div
                        className={cn(
                            'aspect-2/3 w-full overflow-hidden rounded-md border border-border bg-muted',
                            focused && FOCUS_RING_LARGE
                        )}
                    >
                        {imageError || !item.Id ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageOff className="h-8 w-8 text-muted-foreground" />
                            </div>
                        ) : (
                            <img
                                src={getPrimaryImageUrl(item.Id, { width: 320 })}
                                alt={item.Name || 'Item'}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{item.Name}</p>
                    <p className="text-xs text-muted-foreground">{item.ProductionYear}</p>
                </>
            )}
        </FocusableCard>
    );
};

const LibraryDetail = () => {
    const { libraryId } = useParams<{ libraryId: string }>();
    const { data: views } = useUserViews();
    const library = views?.Items?.find((view) => view.Id === libraryId);
    const gridRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (!gridRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            setColumns(Math.max(1, Math.floor((width + GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP))));
        });

        observer.observe(gridRef.current);
        return () => observer.disconnect();
    }, []);

    const pageSize = columns * ROWS_PER_PAGE;

    const { data, isLoading } = useLibraryItems(libraryId, {
        limit: pageSize,
        startIndex: page * pageSize,
        includeItemTypes: COLLECTION_ITEM_TYPES[library?.CollectionType as CollectionType],
        sortBy: ['DateCreated'],
        sortOrder: 'Descending',
    });

    const totalPages = data?.totalCount ? Math.ceil(data.totalCount / pageSize) : 0;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">{library?.Name ?? 'Library'}</h1>
            <div
                ref={gridRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4"
            >
                {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => (
                          <div
                              key={i}
                              className="aspect-2/3 w-full animate-pulse rounded-md bg-muted"
                          />
                      ))
                    : data?.items.map((item, i) => (
                          <ItemCard key={item.Id} item={item} autoFocus={i === 0} />
                      ))}
            </div>
            {!isLoading && data?.items.length === 0 && (
                <p className="text-muted-foreground">No items in this library yet.</p>
            )}
            <ItemPagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={(newPage) => setPage(newPage)}
            />
        </div>
    );
};

export default LibraryDetail;
