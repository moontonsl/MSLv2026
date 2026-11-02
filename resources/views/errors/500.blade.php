<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>500 | Internal Server Error</title>

        <style>
            :root {
                color-scheme: dark;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                background: #030303;
                color: #ffffff;
            }

            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                min-width: 320px;
                min-height: 100vh;
                background: #030303;
            }

            .error-page {
                display: grid;
                min-height: 100vh;
                place-items: center;
                padding: 2rem 1.5rem;
                text-align: center;
            }

            .error-card {
                display: flex;
                width: min(100%, 42rem);
                flex-direction: column;
                align-items: center;
            }

            .error-visual {
                display: grid;
                width: min(100%, 25rem);
                min-height: clamp(9rem, 26vw, 13rem);
                place-items: center;
            }

            .error-code {
                color: #e4b600;
                font-size: clamp(8.5rem, 28vw, 14.5rem);
                font-weight: 900;
                letter-spacing: -0.09em;
                line-height: 0.8;
                transform: translateX(-0.04em);
                user-select: none;
            }

            h1 {
                margin: 0.25rem 0 0;
                font-size: clamp(1.75rem, 4vw, 2.2rem);
                line-height: 1.15;
            }

            p {
                max-width: 35rem;
                margin: 1.25rem 0 0;
                color: #f4f4f5;
                font-size: clamp(1rem, 2.4vw, 1.15rem);
                font-weight: 600;
                line-height: 1.55;
            }

            .home-link {
                display: inline-flex;
                align-items: center;
                gap: 0.55rem;
                margin-top: 1.75rem;
                color: #f4c400;
                font-size: 1rem;
                font-weight: 700;
                text-decoration: none;
                transition: color 160ms ease, transform 160ms ease;
            }

            .home-link:hover {
                color: #ffe16b;
                transform: translateX(0.2rem);
            }

            .home-link:focus-visible {
                border-radius: 0.25rem;
                outline: 0.2rem solid #f4c400;
                outline-offset: 0.35rem;
            }

            .home-link svg {
                width: 0.75rem;
                height: 0.75rem;
                fill: none;
                stroke: currentColor;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 2.5;
            }

            @media (max-width: 480px) {
                .error-page {
                    padding-inline: 1rem;
                }

                p {
                    margin-top: 1rem;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .home-link {
                    transition: none;
                }
            }
        </style>
    </head>
    <body>
        <main class="error-page">
            <section class="error-card" aria-labelledby="server-error-title">
                <div class="error-visual" aria-hidden="true">
                    <div class="error-code">500</div>
                </div>

                <h1 id="server-error-title">Internal Server Error</h1>
                <p>
                    Whoops, our servers just got hit by Johnson’s full-speed ultimate!<br>
                    Our minions are working hard to clear the wreckage and fix the lag.
                </p>

                <a class="home-link" href="{{ url('/') }}">
                    <span>Go back to Homepage</span>
                    <svg viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M3 1.5 7.5 6 3 10.5" />
                    </svg>
                </a>
            </section>
        </main>
    </body>
</html>
