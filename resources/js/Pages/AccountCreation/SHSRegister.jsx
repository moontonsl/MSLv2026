import { BadgeCheck } from 'lucide-react';
import styles from "./register.module.scss";

import MainLayout from "@/Layouts/MainLayout";
import { Head } from '@inertiajs/react';

import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';

// ✅ UPDATED IMPORT PATHS (SHS folder)
import Step1BasicDetails from './components/SHS/Step1BasicDetails.jsx';
import Step2EducationDetails from './components/SHS/Step2EducationDetails.jsx';
import Step3GameDetails from './components/SHS/Step3GameDetails.jsx';
import Step4AccountCredentials from './components/SHS/Step4AccountCredentials.jsx';


const initialFormData = {
    // Step 1
    firstName: '', lastName: '', suffix: 'N/A', birthday: '', age: 0, gender: '', contactNo: '', facebookLink: '',
    // Step 2
    yearLevel: '', university: '', island: '', region: '', studentId: '', course: '', proofOfEnrollment: null,
    // Step 3
    userId: '', serverId: '', ign: '', squadName: '', squadAbbreviation: '', rank: '', inGameRole: '', mainHero: '',
    // Step 4
    username: '', password: '', confirmPassword: '', email: '', captcha: '', termsAccepted: false
};

const fileTypeIsValid = (file, allowedTypes) =>
    file && allowedTypes.includes(file.type);

const SHSRegister = () => {

    const { data, setData, processing, errors, reset } = useForm(initialFormData);
    const formData = data;

    const [currentStep, setCurrentStep] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [step1ValidationTrigger, setStep1ValidationTrigger] = useState(0);
    const [step2ValidationTrigger, setStep2ValidationTrigger] = useState(0);
    const [step3ValidationTrigger, setStep3ValidationTrigger] = useState(0);
    const [step4ShowErrors, setStep4ShowErrors] = useState(false);
    const [step4VisitId, setStep4VisitId] = useState(0);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);
    const step4Ref = useRef(null);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        setData(name, type === 'file' ? files[0] : value);
    };

    const handleNext = () => {
        setErrorMessage("");
        setSuccessMessage("");
        const stepValidators = {
            1: () => step1Ref.current?.validateStep1?.() ?? false,
            2: () => step2Ref.current?.validateStep2?.() ?? false,
            3: () => step3Ref.current?.validateStep3?.() ?? false,
        };

        if (currentStep <= 3) {
            const isStepValid = stepValidators[currentStep]?.() ?? isFormValid(currentStep);

            if (!isStepValid) {
                return;
            }
        } else if (!isFormValid(currentStep)) {
            return;
        }

        if (currentStep === 1) {
            setStep1ValidationTrigger((prev) => prev + 1);
        }
        if (currentStep === 2) {
            setStep2ValidationTrigger((prev) => prev + 1);
        }
        if (currentStep === 3) {
            setStep3ValidationTrigger((prev) => prev + 1);
        }
        if (currentStep === 3) {
            setStep4ShowErrors(false);
            setStep4VisitId((prev) => prev + 1);
        }
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrev = () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (currentStep === 4) {
            setStep4ShowErrors(false);
        }
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentStep === 4) {
            const isStep4Valid = handleFinalStep4Submit();
            if (!isStep4Valid) {
                return;
            }
            return;
        }

        if (!isFormValid(currentStep)) return;

        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleFinalStep4Submit = () => {
        setStep4ShowErrors(true);
        const isStep4Valid = step4Ref.current?.validateStep4?.();

        if (!isStep4Valid) {
            return false;
        }

        setErrorMessage("");
        setSuccessMessage("");
        setSuccessModalOpen(true);
        return true;
    };

    function isFormValid(step) {

        const requireFields = (fields) =>
        fields.every(f => (formData[f] && formData[f].toString().trim() !== ""));

        setErrorMessage("");
        setSuccessMessage("");

        switch (step) {

        case 1:
            if (!requireFields(['firstName', 'lastName', 'gender', 'birthday', 'age', 'contactNo', 'facebookLink'])) {
            return false;
            }
            break;

        case 2: {
            const required = ['yearLevel', 'university', 'island', 'region', 'studentId', 'course', 'proofOfEnrollment'];

            if (!requireFields(required)) {
            setErrorMessage("⚠️ Please fill in all the required fields.");
            return false;
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

            if (!fileTypeIsValid(formData.proofOfEnrollment, allowedTypes)) {
            setErrorMessage("⚠️ File must be an image (jpg, jpeg, png) or PDF.");
            return false;
            }

            break;
        }

        case 3: {

            if (!formData.userId || !formData.serverId || !formData.ign) {
                setErrorMessage("⚠️ Please verify your MLBB account first.");
                return false;
            }
            
            const required = ['userId', 'serverId', 'rank', 'inGameRole', 'mainHero'];

            if (!requireFields(required)) {
            setErrorMessage("⚠️ Please fill in all the required fields.");
            return false;
            }

            break;
        }

        case 4: {

            const { username, password, confirmPassword, email, captcha } = formData;

            if (!requireFields(['username', 'password', 'confirmPassword', 'email', 'captcha'])) {
            return false;
            }

            if (!formData.termsAccepted) {
            return false;
            }

            const usernameRegex = /^[A-Za-z0-9]{5,12}$/;

            if (!usernameRegex.test(username)) {
            return false;
            }

            if (password.length < 6 || password.length > 16) {
            return false;
            }

            if (/\s/.test(password)) {
            return false;
            }

            if (password !== confirmPassword) {
            return false;
            }

            if (captcha != verificationCode) {
            return false;
            }

            break;
        }

        default:
            return false;
        }

        return true;
    }

    const stepProps = {
        data,
        handleInputChange,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        verificationCode,
        setVerificationCode,
        step4ShowErrors,
        validationTrigger: step1ValidationTrigger,
        step2ValidationTrigger,
        step3ValidationTrigger,
        onCancelVerification: () => setCurrentStep(2)
    };

    const stepComponents = {
        1: <Step1BasicDetails ref={step1Ref} {...stepProps} />,
        2: <Step2EducationDetails ref={step2Ref} {...stepProps} />,
        3: <Step3GameDetails ref={step3Ref} {...stepProps} />,
        4: <Step4AccountCredentials key={step4VisitId} ref={step4Ref} {...stepProps} />
    };

    return (
        <>
        <Head title="Register SHS Account" />

        <MainLayout>

            <div className="min-h-screen flex items-start md:items-center justify-center px-md pt-10 md:pt-0">

            <div className={`w-full max-w-md md:max-w-[758px] mx-auto py-8 md:py-12 px-5 md:px-12 my-6 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[#242424] backdrop-blur-[10px] flex flex-col transition-all duration-300`}>

                <form onSubmit={handleSubmit} className="w-full" noValidate>

                {stepComponents[currentStep]}

                {/* SUCCESS */}
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 mt-4 rounded-md text-sm flex items-center gap-2">
                    <BadgeCheck size={18} />
                    {successMessage}
                    </div>
                )}

                {/* NAV BUTTONS */}
                <div className="flex flex-row gap-3 mt-6">

                    {/* PREV */}
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="flex-1 py-3 rounded-xl bg-gray-700 text-white hover:bg-yellow-500 transition"
                        >
                            PREVIOUS
                        </button>
                    )}

                    {/* NEXT / SUBMIT */}
                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 py-3 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition"
                        >
                            NEXT
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleFinalStep4Submit}
                            className="flex-1 py-3 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition"
                        >
                            SUBMIT
                        </button>
                    )}

                </div>

                {/* FOOTER */}
                <div className="mt-6 text-center text-sm text-white/70">
                    Already have an account?{' '}
                    <a href="/login" className="text-yellow-400 hover:underline">
                    Sign In
                    </a>
                </div>

                </form>

                {successModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                        <div className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 relative shadow-2xl">
                            <div className="flex justify-center mb-4">
                                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xl">
                                    <BadgeCheck size={26} />
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    Account Successfully Created
                                </h2>
                                <p className="text-sm text-white/60 mt-2">
                                    Wait for the verification of your Student Leader assigned to your school.
                                    Thank you!
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setSuccessModalOpen(false);
                                    window.location.href = '/';
                                }}
                                className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                )}

            </div>

            </div>

        </MainLayout>
        </>
    );
};

export default SHSRegister;
