import { useState } from 'react';
import type { ReactNode } from 'react';
import { getBackdropUrl, getLogoUrl, getPrimaryImageUrl } from '@pelagica/core';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { useTranslation } from 'react-i18next';
import { ImageOff, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ItemHero = ({
    item,
    isLoading,
    extraBadge,
    mainButtonRow,
}: {
    item?: BaseItemDto;
    isLoading: boolean;
    extraBadge?: ReactNode;
    mainButtonRow?: ReactNode;
}) => {
    const { t } = useTranslation('item');
    const [backdropError, setBackdropError] = useState(false);
    const [postersFailed, setPostersFailed] = useState(false);
    const [isPosterLoaded, setIsPosterLoaded] = useState(false);
    const [failedLogo, setFailedLogo] = useState(false);

    if (isLoading) {
        return (
            <div className="-mx-6 -mt-20 flex flex-col gap-6 rounded-b-xl bg-muted p-6 pt-20 sm:flex-row">
                <div className="aspect-2/3 w-48 shrink-0 animate-pulse rounded-md bg-background/40" />
                <div className="flex-1 space-y-3">
                    <div className="h-8 w-2/3 animate-pulse rounded bg-background/40" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-background/40" />
                    <div className="h-20 w-full animate-pulse rounded bg-background/40" />
                </div>
            </div>
        );
    }

    if (!item) {
        return <p className="text-muted-foreground">{t('item_not_found')}</p>;
    }

    return (
        <div className="relative -mx-6 -mt-20 overflow-hidden rounded-b-xl">
            <div className="absolute inset-0 bg-muted">
                {item.Id && !backdropError && (
                    <img
                        src={getBackdropUrl(item.Id, { width: 1280 }, item.BackdropImageTags?.[0])}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => setBackdropError(true)}
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/70 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative flex flex-col gap-6 p-6 pt-29 sm:flex-row">
                <div className="w-62 shrink-0 mx-auto lg:mx-0">
                    <div className="relative aspect-2/3 w-full rounded-xl overflow-hidden shadow-2xl shadow-black/85 border border-white/10 bg-muted flex items-center justify-center">
                        {!postersFailed ? (
                            <>
                                <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
                                <img
                                    src={getPrimaryImageUrl(
                                        item.Id || '',
                                        { width: 640, height: 960 },
                                        item.ImageTags?.Primary
                                    )}
                                    alt={item.Name + ' Primary'}
                                    className={[
                                        'object-cover rounded-xl w-full h-full relative z-10',
                                        'transition-[filter,opacity] duration-700 ease-out',
                                        isPosterLoaded ? 'blur-0 opacity-100' : 'blur-md opacity-0',
                                    ].join(' ')}
                                    onLoad={() => setIsPosterLoaded(true)}
                                    onError={() => setPostersFailed(true)}
                                />
                            </>
                        ) : (
                            <ImageOff className="text-muted-foreground w-12 h-12" />
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                    {!failedLogo && item.Id ? (
                        <img
                            src={getLogoUrl(item.Id, { maxHeight: 350 }, item.ImageTags?.Logo)}
                            alt={item.Name || ''}
                            className="h-16 max-w-[85%] object-contain object-left mb-2"
                            onError={() => setFailedLogo(true)}
                        />
                    ) : (
                        <h1 className="text-3xl font-semibold tracking-tight mb-2 text-wrap balance">
                            {item.Name}
                        </h1>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {item.ProductionYear && (
                            <Badge variant="outline">{item.ProductionYear}</Badge>
                        )}
                        {item.CommunityRating && (
                            <Badge variant="outline">
                                <Star /> {item.CommunityRating.toFixed(1)}
                            </Badge>
                        )}
                        {extraBadge}
                        {item.OfficialRating && (
                            <Badge variant="outline">{item.OfficialRating}</Badge>
                        )}
                    </div>

                    {item.Genres && item.Genres.length > 0 && (
                        <p className="text-sm text-muted-foreground">{item.Genres.join(', ')}</p>
                    )}

                    {item.Overview && (
                        <p className="max-w-3xl whitespace-pre-line text-base text-foreground/90 line-clamp-3">
                            {item.Overview}
                        </p>
                    )}

                    {mainButtonRow && <div className="mt-2 flex gap-3">{mainButtonRow}</div>}
                </div>
            </div>
        </div>
    );
};

export default ItemHero;
