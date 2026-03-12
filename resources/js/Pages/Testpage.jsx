import React from "react";
import { Head } from "@inertiajs/react";
import { Helmet } from "react-helmet";

export default function TestPage() {

    return (

        <div className="bg-bg min-h-screen text-white">

            <Head title="Design System Test | MPL Philippines v26" />

            <Helmet>
                <title>Design System Test | MPL Philippines v26</title>
                <meta name="description" content="Testing global design tokens and components." />
            </Helmet>

            <div className="container section space-y-3xl">

                {/* TYPOGRAPHY TEST */}

                <section className="space-y-md">

                    <h1 className="text-gradient">
                        Hero Large Typography
                    </h1>

                    <h2>
                        Section Heading
                    </h2>

                    <h3>
                        Subsection Heading
                    </h3>

                    <p className="text-body-md text-gray-400 max-w-xl">
                        This paragraph uses the body-md token. If the typography
                        tokens are working, the font size and line height should
                        match the Figma design system.
                    </p>

                </section>



                {/* BRAND COLORS */}

                <section className="space-y-md">

                    <h2>Brand Colors</h2>

                    <div className="flex gap-md">

                        <div className="w-16 h-16 bg-brand-300 rounded-md"></div>
                        <div className="w-16 h-16 bg-brand-400 rounded-md"></div>
                        <div className="w-16 h-16 bg-brand-500 rounded-md"></div>
                        <div className="w-16 h-16 bg-brand-600 rounded-md"></div>

                    </div>

                </section>



                {/* BACKGROUND TOKENS */}

                <section className="space-y-md">

                    <h2>Background Tokens</h2>

                    <div className="flex gap-md">

                        <div className="p-lg bg-bg-surface rounded-md">
                            Surface
                        </div>

                        <div className="p-lg bg-bg-card rounded-md shadow-soft">
                            Card
                        </div>

                        <div className="p-lg bg-bg-cardHover rounded-md">
                            Card Hover
                        </div>

                    </div>

                </section>



                {/* BUTTONS */}

                <section className="space-y-md">

                    <h2>Buttons</h2>

                    <div className="flex gap-md">

                        <button className="btn-primary">
                            Primary
                        </button>

                        <button className="btn-outline">
                            Outline
                        </button>

                        <button className="btn-danger">
                            Danger
                        </button>

                    </div>

                </section>



                {/* CARD */}

                <section className="space-y-md">

                    <h2>Card Component</h2>

                    <div className="card max-w-md space-y-md">

                        <h3 className="text-card-title text-brand-400">
                            Card Title
                        </h3>

                        <p className="text-body-sm text-gray-400">
                            This card tests spacing tokens, shadows, and card styles.
                        </p>

                        <button className="btn-primary">
                            Card Action
                        </button>

                    </div>

                </section>



                {/* INPUT */}

                <section className="space-y-md">

                    <h2>Input Component</h2>

                    <input
                        className="input w-72"
                        placeholder="Type something..."
                    />

                </section>



                {/* DEPARTMENT COLORS */}

                <section className="space-y-md">

                    <h2>Department Colors</h2>

                    <div className="flex gap-md">

                        <div className="w-16 h-16 bg-dept-blue-500 rounded-md"></div>
                        <div className="w-16 h-16 bg-dept-purple-500 rounded-md"></div>
                        <div className="w-16 h-16 bg-dept-green-500 rounded-md"></div>
                        <div className="w-16 h-16 bg-dept-red-500 rounded-md"></div>

                    </div>

                </section>



                {/* SEMANTIC COLORS */}

                <section className="space-y-md">

                    <h2>Semantic Colors</h2>

                    <div className="flex gap-md">

                        <div className="px-lg py-sm bg-success-500 rounded-md">
                            Success
                        </div>

                        <div className="px-lg py-sm bg-warning-400 text-black rounded-md">
                            Warning
                        </div>

                        <div className="px-lg py-sm bg-error-500 rounded-md">
                            Error
                        </div>

                    </div>

                </section>



                {/* SPACING TOKENS */}

                <section className="space-y-md">

                    <h2>Spacing Tokens</h2>

                    <div className="flex gap-xs bg-bg-surface p-md rounded-md">

                        <div className="bg-brand-500 p-xs">xs</div>
                        <div className="bg-brand-500 p-sm">sm</div>
                        <div className="bg-brand-500 p-md">md</div>
                        <div className="bg-brand-500 p-lg">lg</div>
                        <div className="bg-brand-500 p-xl">xl</div>

                    </div>

                </section>



                {/* SHADOW TEST */}

                <section className="space-y-md">

                    <h2>Shadow Token</h2>

                    <div className="p-xl bg-bg-card rounded-xl shadow-soft">
                        Soft Shadow Example
                    </div>

                </section>

            </div>

        </div>

    );
}