import { BadgeCheck } from 'lucide-react';
import styles from "./register.module.scss";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { Head } from '@inertiajs/react';

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

// ✅ UPDATED IMPORT PATHS (SHS folder)
import Step1BasicDetails from './components/SHS/Step1BasicDetails.jsx';
import Step2EducationDetails from './components/SHS/Step2EducationDetails.jsx';
import Step3GameDetails from './components/SHS/Step3GameDetails.jsx';
import Step4AccountCredentials from './components/SHS/Step4AccountCredentials.jsx';


const initialFormData = {
    // Step 1
    firstName: '', lastName: '', suffix: '', birthday: '', age: 0, gender: '', contactNo: '', facebookLink: '',
    // Step 2
    yearLevel: '', university: '', island: '', region: '', studentId: '', course: '', proofOfEnrollment: null,
    // Step 3
    userId: '', serverId: '', ign: '', squadName: '', squadAbbreviation: '', rank: '', inGameRole: '', mainHero: '',
    // Step 4
    username: '', password: '', confirmPassword: '', email: '', captcha: ''
};

const fileTypeIsValid = (file, allowedTypes) =>
    file && allowedTypes.includes(file.type);

const SHSRegister = () => {

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [step1ValidationTrigger, setStep1ValidationTrigger] = useState(0);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        const updatedData = {
        ...formData,
        [name]: type === 'file' ? files[0] : value
        };

        setFormData(updatedData);
        setData(updatedData);
    };

    const handleNext = () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (currentStep === 1) {
            setStep1ValidationTrigger((prev) => prev + 1);
        }
        if (!isFormValid(currentStep)) return;
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const handlePrev = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid(currentStep)) return;

        setErrorMessage("");
        setSuccessMessage("");

        post(route('register.shs'), {
        onStart: () => {
            setErrorMessage("");
            setSuccessMessage("");
        },
        onSuccess: () => {
            setSuccessMessage("✅ Your SHS account has been successfully created!");
            reset();
            setCurrentStep(1);
        },
        onError: (errors) => {
            setSuccessMessage("");

            if (errors) {
            const errorMessages = Object.values(errors).flat();

            if (errors.email) {
                setErrorMessage("⚠️ Email has already been taken.");
            } else if (errors.username) {
                setErrorMessage("⚠️ Username has already been taken.");
            } else {
                setErrorMessage(`⚠️ ${errorMessages.join(', ')}`);
            }
            } else {
            setErrorMessage("⚠️ Please check your information and try again.");
            }
        },
        });
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
            setErrorMessage("⚠️ Please fill in all the required fields.");
            return false;
            }

            const usernameRegex = /^[a-zA-Z1-9][a-zA-Z0-9]{4,14}$/;

            if (!usernameRegex.test(username)) {
            setErrorMessage("⚠️ Username must be 5–15 characters, alphanumeric only.");
            return false;
            }

            if (password.length < 8) {
            setErrorMessage("⚠️ Password must be at least 8 characters.");
            return false;
            }

            if (password !== confirmPassword) {
            setErrorMessage("⚠️ Passwords do not match.");
            return false;
            }

            if (captcha != verificationCode) {
            setErrorMessage("⚠️ Incorrect code.");
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
        formData,
        handleInputChange,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
        verificationCode,
        setVerificationCode,
        validationTrigger: step1ValidationTrigger
    };

    const stepComponents = {
        1: <Step1BasicDetails {...stepProps} />,
        2: <Step2EducationDetails {...stepProps} />,
        3: <Step3GameDetails {...stepProps} />,
        4: <Step4AccountCredentials {...stepProps} />
    };

    return (
        <>
        <Head title="Register SHS Account" />

        <AuthenticatedLayout>

            <div className="min-h-screen flex items-start md:items-center justify-center px-md pt-10 md:pt-0">

            <div className={`w-full max-w-md md:max-w-[758px] mx-auto py-8 md:py-12 px-5 md:px-12 my-6 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[#242424] backdrop-blur-[10px] flex flex-col transition-all duration-300`}>

                <form onSubmit={handleSubmit} className="w-full">

                {stepComponents[currentStep]}

                {/* ERROR */}
                {currentStep !== 1 && errorMessage && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 mt-4 rounded-md text-sm">
                    {errorMessage}
                    </div>
                )}

                {/* SUCCESS */}
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 mt-4 rounded-md text-sm flex items-center gap-2">
                    <BadgeCheck size={18} />
                    {successMessage}
                    </div>
                )}

                {/* NAV BUTTONS */}
                <div className="flex flex-col md:flex-row gap-3 mt-6">

                    {/* PREV */}
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="w-full md:w-1/2 py-3 rounded-xl bg-gray-700 text-white hover:bg-yellow-500 transition"
                        >
                            PREVIOUS
                        </button>
                    )}

                    {/* NEXT / SUBMIT */}
                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className={`w-full ${
                                currentStep > 1 ? 'md:w-1/2' : ''
                            } py-3 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition`}
                        >
                            NEXT
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className={`w-full ${
                                currentStep > 1 ? 'md:w-1/2' : ''
                            } py-3 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-600 transition`}
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

            </div>

            </div>

        </AuthenticatedLayout>
        </>
    );
};

export default SHSRegister;
