import '../css/global.css';
import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initScrollReveal } from './scrollReveal';

const appName = import.meta.env.VITE_APP_NAME;

router.on('navigate', (event) => {
    const token = event?.detail?.page?.props?.csrf_token;
    if (token) {
        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta) {
            meta.setAttribute('content', token);
        }
    }
});

createInertiaApp({
    title: (title) => `${title} | MSL Philippines`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
        initScrollReveal();
    },
    progress: {
        color: '#4B5563',
    },
});
