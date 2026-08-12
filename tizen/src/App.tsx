import { QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { queryClient } from '@/lib/query-client';
import { RootLayout } from '@/routes/RootLayout';
import { RequireAuth } from '@/routes/RequireAuth';
import Home from '@/routes/Home';
import About from '@/routes/About';
import Login from '@/routes/Login';
import Settings from './routes/Settings';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
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
                    </Route>
                </Routes>
            </HashRouter>
        </QueryClientProvider>
    );
}

export default App;
