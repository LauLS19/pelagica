import type { PropsWithChildren } from 'react';

const ScrollableHomeSection = ({ title, children }: PropsWithChildren<{ title: string }>) => {
    return (
        <section className="min-w-0 w-full flex flex-col">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="scrollbar-hide min-w-0 flex gap-4 overflow-x-auto p-3">{children}</div>
        </section>
    );
};

export default ScrollableHomeSection;
