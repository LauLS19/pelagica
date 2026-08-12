import { useState } from 'react';
import { getPrimaryImageUrl, useUserViews } from '@pelagica/core';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING_LARGE } from '@/lib/focus-styles';
import FocusableCard from './FocusableCard';
import { SUPPORTED_LIBRARY_COLLECTION_TYPES } from '../utils/supportedLibraryCollectionTypes';

const LibraryCard = ({ item }: { item: BaseItemDto }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <FocusableCard to="/about" className="w-56">
            {(focused) => (
                <>
                    <div
                        className={cn(
                            'aspect-video w-full overflow-hidden rounded-md border border-border bg-muted',
                            focused && FOCUS_RING_LARGE
                        )}
                    >
                        {imageError || !item.Id ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageOff className="h-8 w-8 text-muted-foreground" />
                            </div>
                        ) : (
                            <img
                                src={getPrimaryImageUrl(item.Id, { width: 448 })}
                                alt={item.Name || 'Library'}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        )}
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{item.Name}</p>
                </>
            )}
        </FocusableCard>
    );
};

const LibrariesRow = () => {
    const { data, isLoading } = useUserViews();

    const libraries = (data?.Items ?? []).filter(
        (library) =>
            library.CollectionType &&
            SUPPORTED_LIBRARY_COLLECTION_TYPES.includes(library.CollectionType)
    );

    if (!isLoading && libraries.length === 0) return null;

    return (
        <section className="min-w-0 w-full flex flex-col gap-3">
            <h2 className="text-lg font-semibold">Libraries</h2>
            <div className="scrollbar-hide min-w-0 flex gap-4 overflow-x-auto p-3">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                              key={i}
                              className="aspect-video w-56 shrink-0 animate-pulse rounded-md bg-muted"
                          />
                      ))
                    : libraries.map((library) => <LibraryCard key={library.Id} item={library} />)}
            </div>
        </section>
    );
};

export default LibrariesRow;
