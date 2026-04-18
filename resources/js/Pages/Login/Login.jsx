import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { useState } from "react";

import LoginLanding from "./components/LoginLanding";
import LoginForm from "./components/LoginForm";

export default function Login(props) {

    const [showLogin, setShowLogin] = useState(false);

    return (
        <MainLayout>
            <Head title="Login" />

            {!showLogin ? (
                <LoginLanding onSignIn={() => setShowLogin(true)} />
            ) : (
                <LoginForm {...props} />
            )}

        </MainLayout>
    );
}