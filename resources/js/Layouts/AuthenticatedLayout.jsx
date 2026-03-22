// resources/js/Layouts/MainLayout.jsx
import {Footer, Header} from '@/Components/index.js';
import {Toaster} from 'react-hot-toast';


export default function AuthenticatedLayout({ children }) {
    return (
        <div className="min-h-screen bg-bg text-white flex flex-col">

            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md divider">
                <Header />
            </header>

            {/* MAIN */}
            <main className="divider flex-1">
                <div className="container-page">
                    {children}
                </div>
            </main>

            {/* FOOTER */}
            <footer>
                <Footer />
            </footer>

        </div>
    );
}
