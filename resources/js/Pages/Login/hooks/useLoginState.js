import { useState } from "react";

export default function useLoginState() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showMLBBModal, setShowMLBBModal] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    return {
        showLoginForm,
        setShowLoginForm,
        showMLBBModal,
        setShowMLBBModal,
        passwordVisible,
        setPasswordVisible,
        error,
        setError,
    };
}