import { Footer, Header } from '@/Components/index.js';
import { Toaster } from 'react-hot-toast';

/**
 * Default site shell: header, main content area, footer.
 * Used for both public and authenticated pages — not auth-gated by name.
 *
 * `header` is accepted for compatibility with Breeze-style pages (Dashboard, Profile);
 * it is not rendered until a dedicated page-header slot is added.
 */
export default function MainLayout({ children, header: _header }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md divider">
                <Header />
            </header>

            <main className="divider flex-1">
                <div className="container-page">{children}</div>
            </main>

            <footer>
                <Footer />
            </footer>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}
