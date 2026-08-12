import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import {
    getPrimaryImageUrl,
    getUserId,
    useEpisodes,
    useItem,
    useSeasons,
    useSimilarItems,
} from '@pelagica/core';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { ImageOff, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FOCUS_RING_LARGE } from '@/lib/focus-styles';
import { useScrollIntoViewOnFocus } from '@/lib/use-scroll-into-view-on-focus';
import { Badge } from '@/components/ui/badge';
import { formatRuntime } from '@/lib/formatRuntime';
import ItemHero from '../components/ItemHero';
import ItemCard from '../components/ItemCard';
import FocusableButton from '../components/FocusableButton';

const EpisodeCard = ({ episode, autoFocus }: { episode: BaseItemDto; autoFocus?: boolean }) => {
    const [imageError, setImageError] = useState(false);
    const { ref, focused, focusSelf } = useFocusable<object, HTMLButtonElement>({
        onEnterPress: () => ref.current?.click(),
    });

    useEffect(() => {
        if (autoFocus) focusSelf();
    }, [autoFocus, focusSelf]);

    useScrollIntoViewOnFocus(ref, focused);

    const watched = episode.UserData?.PlaybackPositionTicks ?? 0;
    const runtime = episode.RunTimeTicks ?? 0;
    const progress =
        episode.UserData?.Played && watched <= 0
            ? 100
            : runtime > 0
              ? (watched / runtime) * 100
              : 0;

    return (
        <button ref={ref} type="button" className="w-64 shrink-0 scroll-m-6 text-left outline-none">
            <div
                className={cn(
                    'relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted',
                    focused && FOCUS_RING_LARGE
                )}
            >
                {imageError || !episode.Id ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                ) : (
                    <img
                        src={getPrimaryImageUrl(
                            episode.Id,
                            { width: 400 },
                            episode.ImageTags?.Primary
                        )}
                        alt={episode.Name || 'Episode'}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                )}
                {episode.RunTimeTicks && (
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                        {formatRuntime(episode.RunTimeTicks)}
                    </Badge>
                )}
                {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                            style={{ width: `${progress}%` }}
                            className="h-full bg-brand transition-width"
                        />
                    </div>
                )}
            </div>
            <p className="mt-2 truncate text-sm font-medium">
                {episode.IndexNumber != null ? `${episode.IndexNumber}. ` : ''}
                {episode.Name}
            </p>
            {episode.Overview && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {episode.Overview}
                </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
                {episode.IndexNumber !== undefined && (
                    <Badge variant={'outline'}>
                        S{episode.ParentIndexNumber} E{episode.IndexNumber}
                    </Badge>
                )}
                {episode.CommunityRating !== undefined && (
                    <Badge variant={'outline'}>
                        <Star size={14} />
                        {episode.CommunityRating?.toFixed(1)}
                    </Badge>
                )}
                {episode.PremiereDate && (
                    <Badge variant={'outline'}>
                        {new Date(episode.PremiereDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Badge>
                )}
            </div>
        </button>
    );
};

const SeriesDetail = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { data: item, isLoading } = useItem(itemId, true, getUserId() ?? undefined);
    const { data: similarItems } = useSimilarItems(itemId, 12);

    const { data: seasons } = useSeasons(itemId);
    const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(undefined);
    const { data: episodes, isLoading: isEpisodesLoading } = useEpisodes(
        itemId ?? null,
        selectedSeasonId
    );

    useEffect(() => {
        setSelectedSeasonId(undefined);
    }, [itemId]);

    useEffect(() => {
        if (!selectedSeasonId && seasons && seasons.length > 0) {
            setSelectedSeasonId(seasons[0].Id ?? undefined);
        }
    }, [seasons, selectedSeasonId]);

    return (
        <div className="flex flex-col gap-6">
            <ItemHero
                item={item}
                isLoading={isLoading}
                extraBadge={
                    item?.ChildCount && (
                        <Badge variant="outline">
                            {item.ChildCount} {item.ChildCount === 1 ? 'Season' : 'Seasons'}
                        </Badge>
                    )
                }
            />

            {seasons && seasons.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">Episodes</h2>
                    {seasons.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {seasons.map((season) => (
                                <FocusableButton
                                    key={season.Id}
                                    variant={season.Id === selectedSeasonId ? 'default' : 'outline'}
                                    onClick={() => setSelectedSeasonId(season.Id ?? undefined)}
                                >
                                    {season.Name || `Season ${season.IndexNumber}`}
                                </FocusableButton>
                            ))}
                        </div>
                    )}
                    <div className="scrollbar-hide flex gap-4 overflow-x-auto p-3">
                        {isEpisodesLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div key={i} className="w-64 shrink-0 space-y-2">
                                      <div className="aspect-video w-full animate-pulse rounded-md bg-muted" />
                                      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                                  </div>
                              ))
                            : episodes?.map((episode) => (
                                  <EpisodeCard key={episode.Id} episode={episode} />
                              ))}
                    </div>
                </div>
            )}

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

export default SeriesDetail;
