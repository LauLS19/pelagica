import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { getBackdropUrl, getPrimaryImageUrl, getThumbUrl } from '@pelagica/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FocusableCard from '../FocusableCard';
import { cn } from '@/lib/utils';
import { FOCUS_RING_LARGE } from '@/lib/focus-styles';
import { ImageOff } from 'lucide-react';
import ScrollableHomeSection from './ScrollableHomeSection';

interface BaseContinueRowProps {
    items: BaseItemDto[];
    isLoading: boolean;
    error: unknown;
    title: string;
}
type ImageState = 'thumb' | 'backdrop' | 'primary' | 'failed';

const ContinueEpisodeCard = ({
    item,
    imageState,
    onImageError,
    autoFocus,
    className,
}: {
    item: BaseItemDto;
    imageState: ImageState;
    onImageError: (item: BaseItemDto) => void;
    autoFocus?: boolean;
    className?: string;
}) => {
    const { t } = useTranslation('home');
    const watched = item.UserData?.PlaybackPositionTicks ?? 0;
    const runtime = item.RunTimeTicks ?? 0;
    const progress = runtime > 0 ? (watched / runtime) * 100 : 0;

    const imageSrc =
        imageState === 'thumb'
            ? getThumbUrl(item.Id!, { width: 416 }, item.ImageTags?.Thumb)
            : imageState === 'backdrop'
              ? getBackdropUrl(item.Id!, { width: 416 }, item.BackdropImageTags?.[0])
              : imageState === 'primary'
                ? getPrimaryImageUrl(item.Id!, { width: 416 }, item.ImageTags?.Primary)
                : '';

    return (
        <FocusableCard
            to={`/player/${item.Id}`}
            autoFocus={autoFocus}
            className={cn('w-46', className)}
        >
            {(focused) => (
                <>
                    <div
                        className={cn(
                            'relative aspect-video w-full overflow-hidden rounded-md border border-border bg-muted',
                            focused && FOCUS_RING_LARGE
                        )}
                    >
                        {imageState === 'failed' || !item.Id ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <ImageOff className="h-8 w-8 text-muted-foreground" />
                            </div>
                        ) : (
                            <img
                                src={imageSrc}
                                alt={item.Name || t('continue_item_alt')}
                                className="h-full w-full object-cover"
                                onError={() => onImageError(item)}
                            />
                        )}
                        {progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-gray-700">
                                <div
                                    style={{ width: `${progress}%` }}
                                    className="h-full bg-brand transition-width"
                                />
                            </div>
                        )}
                    </div>
                    <p className="mt-2 truncate text-sm font-medium">{item.Name}</p>
                </>
            )}
        </FocusableCard>
    );
};

const BaseContinueRow = ({ items, isLoading, error, title }: BaseContinueRowProps) => {
    const { t } = useTranslation('home');
    const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});

    const handleImageError = (item: BaseItemDto) => {
        const id = item.Id;
        if (!id) return;

        const state = imageStates[id] ?? 'thumb';

        switch (state) {
            case 'thumb':
                if (item.BackdropImageTags?.length) {
                    setImageStates((prev) => ({
                        ...prev,
                        [id]: 'backdrop',
                    }));
                    return;
                }

                if (item.ImageTags?.Primary) {
                    setImageStates((prev) => ({
                        ...prev,
                        [id]: 'primary',
                    }));
                    return;
                }
                break;

            case 'backdrop':
                if (item.ImageTags?.Primary) {
                    setImageStates((prev) => ({
                        ...prev,
                        [id]: 'primary',
                    }));
                    return;
                }
                break;
        }

        setImageStates((prev) => ({
            ...prev,
            [id]: 'failed',
        }));
    };

    return (
        <>
            {error && (
                <div className="text-destructive">
                    {t('error_loading_continue', { error: String(error) })}
                </div>
            )}
            {((items && items.length > 0) || isLoading) && (
                <ScrollableHomeSection title={title}>
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="aspect-video w-46 shrink-0 animate-pulse rounded-md bg-muted"
                              />
                          ))
                        : items.map((item) => (
                              <ContinueEpisodeCard
                                  key={item.Id}
                                  item={item}
                                  imageState={imageStates[item.Id!] ?? 'thumb'}
                                  onImageError={handleImageError}
                              />
                          ))}
                </ScrollableHomeSection>
            )}
        </>
    );
};

export default BaseContinueRow;
