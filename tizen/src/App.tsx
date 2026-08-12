import { QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { queryClient } from '@/lib/query-client';
import { RootLayout } from '@/routes/RootLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import { ScrollToTop } from '@/components/ScrollToTop';
import Home from '@/routes/Home';
import About from '@/routes/About';
import Login from '@/routes/Login';
import Settings from './routes/Settings';
import Library from './routes/Library';
import LibraryDetail from './routes/LibraryDetail';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route
                        element={
                            <RequireAuth>
                                <RootLayout />
                            </RequireAuth>
                        }
                    >
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="library" element={<Library />} />
                        <Route path="library/:libraryId" element={<LibraryDetail />} />
                    </Route>
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    );
}

export default App;
