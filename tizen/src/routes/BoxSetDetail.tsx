import { getUserId, useBoxSetItems, useItem } from '@pelagica/core';
import { useParams } from 'react-router-dom';
import ItemHero from '../components/ItemHero';
import FavoriteButton from '../components/FavoriteButton';
import ItemRow from '../components/ItemRow';
import PlayButton from '../components/PlayButton';

const BoxSetDetail = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const { data: item, isLoading } = useItem(itemId, true, getUserId() ?? undefined);
    const { data: boxSetItems, isLoading: isBoxSetItemsLoading } = useBoxSetItems(item?.Id);

    return (
        <div className="flex flex-col gap-6">
            <ItemHero
                item={item}
                isLoading={isLoading}
                mainButtonRow={
                    item && (
                        <>
                            <PlayButton item={item} />
                            <FavoriteButton item={item} />
                        </>
                    )
                }
            />
            <ItemRow
                title="Box Set Items"
                items={boxSetItems ?? []}
                isLoading={isLoading || isBoxSetItemsLoading}
            />
        </div>
    );
};

export default BoxSetDetail;
