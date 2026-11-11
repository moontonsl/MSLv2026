import AdminFieldLabel from '@/Components/Admin/AdminFieldLabel';
import SuccessModal from '@/Components/Admin/SuccessModal';
import SectionCard from '@/Components/Admin/SectionCard';
import { ADMIN_GOLD_BUTTON_CLASS, ADMIN_INPUT_CLASS } from '@/Components/Admin/adminFormStyles';
import { router } from '@inertiajs/react';
import { Building2, Database, Save, Trophy, UserCheck, Users } from 'lucide-react';
import { useState } from 'react';

const STAT_CONFIG = [
    {
        key: 'student_gamers',
        title: 'Student Gamers',
        icon: UserCheck,
        defaultCount: '22K+',
        defaultLabel: 'STUDENT GAMERS',
        hint: 'Total student gamers in the community network.',
        liveKey: 'student_gamers',
        liveLabel: 'Registered Students in DB',
    },
    {
        key: 'campus_communities',
        title: 'Campus Communities',
        icon: Building2,
        defaultCount: '150+',
        defaultLabel: 'CAMPUS COMMUNITIES',
        hint: 'Number of affiliated campus chapters & communities.',
        liveKey: 'campus_communities',
        liveLabel: 'Institutions in DB',
    },
    {
        key: 'events_sponsored',
        title: 'Events Sponsored',
        icon: Trophy,
        defaultCount: '110+',
        defaultLabel: 'EVENTS SPONSORED',
        hint: 'Campus tournaments and community events supported.',
        liveKey: 'events_sponsored',
        liveLabel: 'Events in DB',
    },
    {
        key: 'student_leaders',
        title: 'Student Leaders',
        icon: Users,
        defaultCount: '240+',
        defaultLabel: 'STUDENT LEADERS',
        hint: 'Active student leaders, organizers, and ambassadors.',
        liveKey: 'student_leaders',
        liveLabel: 'Student Leaders in DB',
    },
];

export default function StatisticsSection({ initialStatistics = {}, liveCounts = {} }) {
    const [values, setValues] = useState({
        student_gamers: initialStatistics.student_gamers ?? '22K+',
        student_gamers_label: initialStatistics.student_gamers_label ?? 'STUDENT GAMERS',
        campus_communities: initialStatistics.campus_communities ?? '150+',
        campus_communities_label: initialStatistics.campus_communities_label ?? 'CAMPUS COMMUNITIES',
        events_sponsored: initialStatistics.events_sponsored ?? '110+',
        events_sponsored_label: initialStatistics.events_sponsored_label ?? 'EVENTS SPONSORED',
        student_leaders: initialStatistics.student_leaders ?? '240+',
        student_leaders_label: initialStatistics.student_leaders_label ?? 'STUDENT LEADERS',
    });

    const [saving, setSaving] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (field, val) => {
        setValues((prev) => ({ ...prev, [field]: val }));
    };

    const handleUseLive = (stat) => {
        const live = liveCounts[stat.liveKey];
        if (live !== undefined && live !== null) {
            handleChange(stat.key, `${live}+`);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        router.post(route('admin.home-page.statistics'), values, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setSuccessOpen(true);
            },
            onError: (errs) => {
                setSaving(false);
                setErrors(errs || {});
            },
        });
    };

    return (
        <>
            <SectionCard
                title="About Section Statistics Counters"
                description="Configure the 4 key dynamic counters shown in the 'About MSL Philippines' section of the homepage. Supports dynamic counting animation (e.g. 22K+, 150+, 1,000+)."
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {STAT_CONFIG.map((stat) => {
                            const Icon = stat.icon;
                            const valueKey = stat.key;
                            const labelKey = `${stat.key}_label`;
                            const liveCount = liveCounts[stat.liveKey] ?? 0;

                            return (
                                <div
                                    key={stat.key}
                                    className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-[#161616] p-5 transition-colors hover:border-neutral-700"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FBBF24]/10 text-[#FBBF24]">
                                                    <Icon className="h-5 w-5" />
                                                </span>
                                                <div>
                                                    <h3 className="text-base font-semibold text-white">
                                                        {stat.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-400">
                                                        {stat.hint}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Live DB Reference pill */}
                                            <div className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/80 px-2.5 py-1 text-[11px] text-gray-300">
                                                <Database className="h-3 w-3 text-emerald-400" />
                                                <span>DB: <strong className="text-white">{Number(liveCount).toLocaleString()}</strong></span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUseLive(stat)}
                                                    className="ml-1 text-[10px] font-semibold text-[#FBBF24] hover:underline"
                                                    title={`Copy live count (${liveCount}+) into input`}
                                                >
                                                    Use
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <AdminFieldLabel htmlFor={`stat-${valueKey}`}>
                                                    Counter Value
                                                </AdminFieldLabel>
                                                <input
                                                    id={`stat-${valueKey}`}
                                                    type="text"
                                                    value={values[valueKey]}
                                                    onChange={(e) => handleChange(valueKey, e.target.value)}
                                                    placeholder={stat.defaultCount}
                                                    className={ADMIN_INPUT_CLASS}
                                                    required
                                                />
                                                {errors[valueKey] && (
                                                    <p className="mt-1 text-xs text-red-400">{errors[valueKey]}</p>
                                                )}
                                                <span className="mt-1 block text-[11px] text-gray-500">
                                                    e.g. 22K+, 150+, 100%
                                                </span>
                                            </div>

                                            <div>
                                                <AdminFieldLabel htmlFor={`stat-${labelKey}`}>
                                                    Display Label
                                                </AdminFieldLabel>
                                                <input
                                                    id={`stat-${labelKey}`}
                                                    type="text"
                                                    value={values[labelKey]}
                                                    onChange={(e) => handleChange(labelKey, e.target.value)}
                                                    placeholder={stat.defaultLabel}
                                                    className={ADMIN_INPUT_CLASS}
                                                    required
                                                />
                                                {errors[labelKey] && (
                                                    <p className="mt-1 text-xs text-red-400">{errors[labelKey]}</p>
                                                )}
                                                <span className="mt-1 block text-[11px] text-gray-500">
                                                    Upper case label
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className={ADMIN_GOLD_BUTTON_CLASS}
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Statistics'}
                        </button>
                    </div>
                </form>
            </SectionCard>

            <SuccessModal
                isOpen={successOpen}
                onClose={() => setSuccessOpen(false)}
                title="Homepage Statistics Saved"
                message="The homepage statistics counters have been successfully updated. Visitors will now see the updated dynamic values and animations on the landing page."
            />
        </>
    );
}
