    'use client';
    import { QueryClient, QueryClientProvider as QClientProvider } from '@tanstack/react-query';
    import { useState } from 'react';

    export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
        const [queryClient] = useState(() => new QueryClient());

        return (
            <QClientProvider client={queryClient}>
                {children}
            </QClientProvider>
        );
    }