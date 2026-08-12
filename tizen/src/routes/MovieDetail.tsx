import { useParams } from 'react-router-dom';
import { getUserId, useItem, useSimilarItems } from '@pelagica/core';
import { Badge } from '@/components/ui/badge';
import { formatRuntime } from '@/lib/formatRuntime';
import ItemHero from '../components/ItemHero';
import ItemCard from '../components/ItemCard';
import FocusableButton from '../components/FocusableButton';
import { Play } from 'lucide-react';
import WatchlistButton from '../components/WatchlistButton';
import FavoriteButton from '../components/FavoriteButton';

const MovieDetail = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { data: item, isLoading } = useItem(itemId, true, getUserId() ?? undefined);
    const { data: similarItems } = useSimilarItems(itemId, 12);

    return (
        <div className="flex flex-col gap-6">
            <ItemHero
                item={item}
                isLoading={isLoading}
                extraBadge={
                    item?.RunTimeTicks && (
                        <Badge variant="outline">{formatRuntime(item.RunTimeTicks)}</Badge>
                    )
                }
                mainButtonRow={
                    <>
                        <FocusableButton autoFocus size="lg">
                            <Play /> Play
                        </FocusableButton>

                        {item && <WatchlistButton item={item} />}

                        {item && <FavoriteButton item={item} />}
                    </>
                }
            />

            {similarItems && similarItems.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">More Like This</h2>
                    <div className="scrollbar-hide flex gap-4 overflow-x-auto p-3">
                        {similarItems.map((similarItem) => (
                            <ItemCard key={similarItem.Id} item={similarItem} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
