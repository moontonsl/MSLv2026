import UnavailablePage from '@/Components/UnavailablePage';
import { COMING_SOON_FEATURES } from '@/data/siteNavigation';

export default function ComingSoon({ feature = 'msl' }) {
    const content = COMING_SOON_FEATURES[feature] || COMING_SOON_FEATURES.msl;
    return <UnavailablePage pageTitle={`${content.title} — Coming Soon`} description={content.description} />;
}
