import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import { useConfig, useFavorite } from '@pelagica/core';
import FocusableButton from './FocusableButton';
import { Heart } from 'lucide-react';
import { cn } from '../lib/utils';

const FavoriteButton = ({ item }: { item: BaseItemDto }) => {
    const { config } = useConfig();
    const { isFavorite, toggleFavorite, isLoading: isFavoriteLoading } = useFavorite(item.Id);

    if (item.Type && config.itemPage?.favoriteButton?.includes(item.Type) === false) return null;

    return (
        <FocusableButton
            variant="outline"
            size="lg"
            onClick={() => toggleFavorite(!isFavorite)}
            disabled={isFavoriteLoading}
        >
            <Heart className={cn(isFavorite && 'fill-current')} />
            {isFavorite ? 'Favorited' : 'Favorite'}
        </FocusableButton>
    );
};

export default FavoriteButton;
