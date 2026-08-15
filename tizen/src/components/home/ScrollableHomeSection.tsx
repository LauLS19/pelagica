import type { PropsWithChildren } from 'react';
import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const ScrollableHomeSection = ({ title, children }: PropsWithChildren<{ title: string }>) => {
    const { ref, focusKey } = useFocusable<object, HTMLDivElement>({
        saveLastFocusedChild: true,
    });

    return (
        <section className="min-w-0 w-full flex flex-col">
            <h2 className="text-lg font-semibold">{title}</h2>
            <FocusContext.Provider value={focusKey}>
                <div ref={ref} className="scrollbar-hide min-w-0 flex gap-4 overflow-x-auto p-3">
                    {children}
                </div>
            </FocusContext.Provider>
        </section>
    );
};

export default ScrollableHomeSection;
