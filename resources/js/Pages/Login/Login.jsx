import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

import LoginLanding from "./components/LoginLanding";
import LoginForm from "./components/LoginForm";

export default function Login(props) {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Login" />

            {!showLogin ? (
                <LoginLanding onSignIn={() => setShowLogin(true)} />
            ) : (
                <LoginForm {...props} />
            )}

        </AuthenticatedLayout>
    );
}