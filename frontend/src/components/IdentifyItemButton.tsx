import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from './ui/button';
import { ScanSearch } from 'lucide-react';

const IdentifyItemButton = ({ item, trigger }: { item: BaseItemDto; trigger: React.ReactNode }) => {
    const { t } = useTranslation('item');
    const [isIdentifyDialogOpen, setIsIdentifyDialogOpen] = useState(false);

    return (
        <Dialog open={isIdentifyDialogOpen} onOpenChange={setIsIdentifyDialogOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant={'outline'} size={'icon'}>
                        <ScanSearch />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t('identify_item_title')}</DialogTitle>
                    <DialogDescription>{t('identify_item_description')}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground font-medium">Path</span>
                    <span className="text-sm text-foreground font-medium break-all">
                        {item.Path}
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IdentifyItemButton;
