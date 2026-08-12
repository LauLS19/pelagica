import { useUserViews } from '@pelagica/core';
import LibraryCard from './LibraryCard';
import { SUPPORTED_LIBRARY_COLLECTION_TYPES } from '../utils/supportedLibraryCollectionTypes';

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
