import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { useEffect, useMemo, useState } from "react";

import LoginLanding from "./components/LoginLanding";
import LoginForm from "./components/LoginForm";
import AccountRenewalModal from "./components/AccountRenewalModal";
import { getAccountRenewalRequirements } from "./components/AccountRenewalLists";

export default function Login(props) {

    const [showLogin, setShowLogin] = useState(false);
    const renewalStatuses = props.accountRenewal ?? props.accountRenewalStatuses ?? props.auth?.user?.accountRenewal ?? {};
    const renewalProfile = props.accountRenewalProfile ?? props.auth?.user ?? {};
    const renewalRequirements = useMemo(
        () => getAccountRenewalRequirements(renewalStatuses),
        [renewalStatuses],
    );
    const [showRenewalModal, setShowRenewalModal] = useState(renewalRequirements.length > 0);

    useEffect(() => {
        setShowRenewalModal(renewalRequirements.length > 0);
    }, [renewalRequirements.length]);

    return (
        <MainLayout>
            <Head title="Login" />

            {!showLogin ? (
                <LoginLanding onSignIn={() => setShowLogin(true)} />
            ) : (
                <LoginForm {...props} />
            )}

            <AccountRenewalModal
                isOpen={showRenewalModal}
                renewalStatuses={renewalStatuses}
                profile={{
                    fullName: renewalProfile.fullName ?? renewalProfile.name,
                    username: renewalProfile.username,
                    email: renewalProfile.email,
                    school: renewalProfile.school ?? renewalProfile.schoolName,
                    ign: renewalProfile.ign ?? renewalProfile.playerInformation?.ign,
                    status: 'Renewal Required',
                }}
                onSubmit={(payload) => {
                    console.log('Account renewal payload', payload);
                    setShowRenewalModal(false);
                }}
            />

        </MainLayout>
    );
}
