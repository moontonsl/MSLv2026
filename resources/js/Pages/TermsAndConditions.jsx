import LegalPage from '@/Components/Legal/LegalPage';
import { termsSections } from '@/data/legalData';

export default function TermsAndConditions() {
    return <LegalPage pageTitle="Terms and Conditions" title={<>Terms <span className="text-brand-400">and</span> Conditions</>} sections={termsSections} />;
}
