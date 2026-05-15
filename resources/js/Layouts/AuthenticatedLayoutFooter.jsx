import { Footer, Header } from '@/Components/index.js';
import { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayoutFooter({ children, ...props }) {
    return (
        <div className="min-h-screen bg-bg text-white flex flex-col" {...props}>
            <Header />
            <main className="relative flex-1">
                <div className="webBG absolute inset-0 z-0" />
                <div className="relative z-10">{children}</div>
            </main>
            <Footer />
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

