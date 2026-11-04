import LegalPage from '@/Components/Legal/LegalPage';
import { privacyIntroduction, privacySections } from '@/data/legalData';

export default function PrivacyPolicy() {
    return <LegalPage pageTitle="Privacy Policy" title={<>Privacy <span className="text-brand-400">Policy</span></>} introduction={privacyIntroduction} sections={privacySections} />;
}
