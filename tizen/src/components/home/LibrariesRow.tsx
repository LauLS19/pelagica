import { useUserViews } from '@pelagica/core';
import LibraryCard from '../LibraryCard';
import { SUPPORTED_LIBRARY_COLLECTION_TYPES } from '../../utils/supportedLibraryCollectionTypes';
import ScrollableHomeSection from './ScrollableHomeSection';

const LibrariesRow = ({ title }: { title: string }) => {
    const { data, isLoading } = useUserViews();

    const libraries = (data?.Items ?? []).filter(
        (library) =>
            library.CollectionType &&
            SUPPORTED_LIBRARY_COLLECTION_TYPES.includes(library.CollectionType)
    );

    if (!isLoading && libraries.length === 0) return null;

    return (
        <ScrollableHomeSection title={title}>
            {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                      <div
                          key={i}
                          className="aspect-video w-56 shrink-0 animate-pulse rounded-md bg-muted"
                      />
                  ))
                : libraries.map((library) => <LibraryCard key={library.Id} item={library} />)}
        </ScrollableHomeSection>
    );
};

export default LibrariesRow;
