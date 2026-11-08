import { useId, useState } from 'react';
import { Diamond, Layers, HeartHandshake, Banknote } from 'lucide-react';
import styles from '@/Pages/Buffs and Support/BuffsSupport.module.css';
import {
    SUPPORT_RANKS, SUPPORT_TIERS, DIAMOND_TYPES, SHS_TYPES, SHS_TEAM_BANDS,
    SHS_CATEGORIES, CAUSE_TYPES, CAUSE_TEAM_BANDS, diamondAllocation,
    shsAllocation, causeAllocation, monetaryAllocation,
} from '@/data/supportAllocations';

const diamonds = (amount) => amount == null ? 'Not specified in allocation table' : `${amount.toLocaleString('en-PH')} Diamonds`;
const pesos = (amount) => amount == null ? 'Not specified in allocation table' : `₱${amount.toLocaleString('en-PH')}`;

function ChoiceButtons({ label, options, value, onChange, segmented = false, disabled = false }) {
    return (
        <fieldset className="min-w-0" disabled={disabled}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</legend>
            <div className={`${segmented ? styles.segmentedChoices : styles.scopeChoices} ${!segmented && options.length === 4 ? styles.scopeTwoColumns : ''} ${disabled ? 'opacity-40' : ''}`}>
                {options.map((option) => (
                    <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)} className={styles.choiceButton}>
                        {option}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}

function TeamVolumeSlider({ options, value, onChange, disabled = false }) {
    const sliderId = useId();
    const index = options.indexOf(value);
    const labels = ['Small', 'Medium', 'Large'];
    return (
        <div className={disabled ? 'opacity-40' : ''}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <label htmlFor={sliderId} className="text-xs font-semibold uppercase tracking-wide text-gray-400">Team Volume</label>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-200">{value}</span>
            </div>
            <input
                id={sliderId} type="range" min="0" max="2" step="1" value={index}
                disabled={disabled} aria-valuetext={value}
                onChange={(event) => onChange(options[Number(event.target.value)])}
                className={styles.teamSlider}
                style={{ '--slider-progress': `${index * 50}%` }}
            />
            <div className="mt-1 flex justify-between gap-2">
                {options.map((option, position) => (
                    <button key={option} type="button" disabled={disabled} aria-label={`${labels[position]}: ${option}`} aria-pressed={position === index} onClick={() => onChange(option)} className={`min-h-8 text-[10px] font-semibold uppercase tracking-wide ${position === index ? 'text-white' : 'text-gray-500'}`}>
                        {labels[position]}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function SupportConfigurator({ ConfigCard, FieldSelect }) {
    const [rank, setRank] = useState('Rank 1');
    const [tier, setTier] = useState('Tier C');
    const [type, setType] = useState('Tournament');
    const [category, setCategory] = useState('Intra-strand Event');
    const [shsTeams, setShsTeams] = useState(SHS_TEAM_BANDS[0]);
    const [shsEventType, setShsEventType] = useState('Tournament');
    const [shsSetup, setShsSetup] = useState('On-Ground');
    const [shsMode, setShsMode] = useState('MLBB-Related');
    const [causeTeams, setCauseTeams] = useState(CAUSE_TEAM_BANDS[0]);
    const [causeType, setCauseType] = useState(CAUSE_TYPES[0]);
    const [moneyRank, setMoneyRank] = useState('Rank 2');
    const [moneyTier, setMoneyTier] = useState('Tier A');
    const [moneyType, setMoneyType] = useState('On-Ground Tournament');
    const intramurals = category === 'High-school Intramurals';
    const shsType = shsEventType === 'Tournament'
        ? SHS_TYPES[shsSetup === 'On-Ground' ? 0 : 1]
        : SHS_TYPES[shsMode === 'MLBB-Related' ? 2 : 3];

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ConfigCard icon={Diamond} title="Diamonds Support" amount={diamonds(diamondAllocation(rank, tier, type))} selectionKey={[rank, tier, type].join('|')}>
                <ChoiceButtons label="Scope of Event" value={rank} options={SUPPORT_RANKS} onChange={setRank} />
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldSelect label="Event Type" value={type} options={DIAMOND_TYPES} onChange={setType} />
                    <FieldSelect label="Tier Level" value={tier} options={SUPPORT_TIERS} onChange={setTier} />
                </div>
                {type === 'Cross-campus Tournament' && <p className="text-sm text-gray-400">Maximum of 10,000 diamonds across all ranks, tiers, and Superschools.</p>}
            </ConfigCard>

            <ConfigCard icon={Layers} title="Senior High School" amount={diamonds(shsAllocation(category, shsTeams, shsType))} selectionKey={[category, shsTeams, shsEventType, shsSetup, shsMode].join('|')}>
                <FieldSelect label="Category" value={category} options={SHS_CATEGORIES} onChange={setCategory} />
                <ChoiceButtons label="Event Type" value={shsEventType} options={['Tournament', 'Non-Tournament']} onChange={setShsEventType} segmented disabled={intramurals} />
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldSelect label="Setup" value={shsSetup} options={['On-Ground', 'Online']} onChange={setShsSetup} disabled={intramurals || shsEventType !== 'Tournament'} />
                    <FieldSelect label="Mode" value={shsMode} options={['MLBB-Related', 'Not MLBB-Related']} onChange={setShsMode} disabled={intramurals || shsEventType !== 'Non-Tournament'} />
                </div>
                <TeamVolumeSlider value={shsTeams} options={SHS_TEAM_BANDS} onChange={setShsTeams} disabled={intramurals} />
                {intramurals && <p className="text-xs text-gray-400">High-school Intramurals has a fixed maximum of 25,000 diamonds.</p>}
            </ConfigCard>

            <ConfigCard icon={HeartHandshake} title="Events for a Cause" amount={diamonds(causeAllocation(causeTeams, causeType))} selectionKey={[causeTeams, causeType].join('|')}>
                <FieldSelect label="Setup Type" value={causeType} options={CAUSE_TYPES} onChange={setCauseType} />
                <TeamVolumeSlider value={causeTeams} options={CAUSE_TEAM_BANDS} onChange={setCauseTeams} />
            </ConfigCard>

            <ConfigCard icon={Banknote} title="Monetary Grants" amount={moneyRank === 'Rank 5' ? 'Varies depending upon proposal' : pesos(monetaryAllocation(moneyRank, moneyTier, moneyType))} selectionKey={[moneyRank, moneyTier, moneyType].join('|')}>
                <ChoiceButtons label="Target Scope" value={moneyRank} options={SUPPORT_RANKS.slice(1)} onChange={setMoneyRank} />
                {moneyRank !== 'Rank 5' && <>
                    {(moneyRank === 'Rank 2' || moneyRank === 'Rank 3') && <FieldSelect label="Tier Level" value={moneyTier} options={['Tier A', 'Superschools']} onChange={setMoneyTier} />}
                    <FieldSelect label="Activity Base" value={moneyType} options={['On-Ground Tournament', 'Online Tournament']} onChange={setMoneyType} />
                </>}
                {moneyRank === 'Rank 5' && <p className="text-sm text-gray-400">A comprehensive pitch deck is required.</p>}
                <p className="text-xs text-gray-400">Amounts are in Philippine pesos. {moneyRank === 'Rank 2' || moneyRank === 'Rank 3' ? 'Only Tier A and Superschools are listed for this rank.' : ''}</p>
            </ConfigCard>
        </div>
    );
}
