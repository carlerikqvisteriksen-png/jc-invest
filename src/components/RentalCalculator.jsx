import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, Wallet, PiggyBank, Percent, Home, Save, RotateCcw, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { calculateRentalAnalysis, formatNumber, formatNOK } from '../utils/rentalCalculations';

// Slider component
function Slider({ label, value, onChange, min, max, step = 1, unit = '', helpText = '', formatValue }) {
    const displayValue = formatValue ? formatValue(value) : value;
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-stone-400">{label}</label>
                <span className="text-sm font-medium text-ink-primary">
                    {displayValue}{unit}
                </span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brass"
                    style={{
                        background: `linear-gradient(to right, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0.5) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`
                    }}
                />
            </div>
            {helpText && <p className="text-[10px] text-stone-600 mt-1">{helpText}</p>}
        </div>
    );
}

// Result card component
function ResultCard({ label, value, subValue, icon: Icon, positive, large = false }) {
    const isPositive = positive === undefined ? value >= 0 : positive;

    return (
        <div className={`bg-white/5 rounded-lg p-4 ${large ? 'col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-4 h-4 text-stone-500" />}
                <span className="text-xs uppercase tracking-wider text-stone-500">{label}</span>
            </div>
            <div className={`${large ? 'text-2xl' : 'text-lg'} font-serif ${isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                {typeof value === 'number' ? formatNOK(value) : value}
            </div>
            {subValue && (
                <div className="text-xs text-stone-500 mt-1">{subValue}</div>
            )}
        </div>
    );
}

// Collapsible section
function Section({ title, children, defaultOpen = true }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 text-left"
            >
                <span className="text-sm font-medium text-stone-300">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>
            {isOpen && <div className="pb-4">{children}</div>}
        </div>
    );
}

export default function RentalCalculator() {
    // Input state
    const [inputs, setInputs] = useState({
        purchasePrice: 3500000,
        downPaymentPercent: 15,
        interestRate: 5.5,
        loanTermYears: 25,
        monthlyRent: 15000,
        monthlyCommonCosts: 3000,
        monthlyMaintenance: 500,
        annualInsurance: 3000,
        vacancyRatePercent: 5,
        internetTV: 500,
        taxRate: 22
    });

    // Calculate results
    const analysis = useMemo(() => {
        return calculateRentalAnalysis(inputs);
    }, [inputs]);

    // Update handler
    const updateInput = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    // Reset to defaults
    const resetInputs = () => {
        setInputs({
            purchasePrice: 3500000,
            downPaymentPercent: 15,
            interestRate: 5.5,
            loanTermYears: 25,
            monthlyRent: 15000,
            monthlyCommonCosts: 3000,
            monthlyMaintenance: 500,
            annualInsurance: 3000,
            vacancyRatePercent: 5,
            internetTV: 500,
            taxRate: 22
        });
    };

    return (
        <div className="velvet-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Utleiekalkulator
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={resetInputs}
                        className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
                        title="Tilbakestill"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1.5 bg-brass/10 text-brass text-xs uppercase tracking-wider rounded hover:bg-brass/20 transition-colors flex items-center gap-1">
                        <Save className="w-3 h-3" />
                        Lagre
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT: Inputs */}
                <div className="p-4 border-r border-white/10">
                    <Section title="Kjøp & Finansiering" defaultOpen={true}>
                        <Slider
                            label="Kjøpesum"
                            value={inputs.purchasePrice}
                            onChange={(v) => updateInput('purchasePrice', v)}
                            min={500000}
                            max={20000000}
                            step={50000}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr"
                        />
                        <Slider
                            label="Egenkapital"
                            value={inputs.downPaymentPercent}
                            onChange={(v) => updateInput('downPaymentPercent', v)}
                            min={0}
                            max={100}
                            step={1}
                            unit="%"
                            helpText={`= ${formatNOK(inputs.purchasePrice * inputs.downPaymentPercent / 100)}`}
                        />
                        <Slider
                            label="Lånerente"
                            value={inputs.interestRate}
                            onChange={(v) => updateInput('interestRate', v)}
                            min={1}
                            max={15}
                            step={0.1}
                            formatValue={(v) => v.toFixed(1)}
                            unit="%"
                        />
                        <Slider
                            label="Nedbetalingstid"
                            value={inputs.loanTermYears}
                            onChange={(v) => updateInput('loanTermYears', v)}
                            min={5}
                            max={35}
                            step={1}
                            unit=" år"
                        />
                    </Section>

                    <Section title="Leieinntekter" defaultOpen={true}>
                        <Slider
                            label="Månedlig leie"
                            value={inputs.monthlyRent}
                            onChange={(v) => updateInput('monthlyRent', v)}
                            min={0}
                            max={50000}
                            step={500}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr"
                        />
                        <Slider
                            label="Leditillstand (vacancy)"
                            value={inputs.vacancyRatePercent}
                            onChange={(v) => updateInput('vacancyRatePercent', v)}
                            min={0}
                            max={20}
                            step={1}
                            unit="%"
                            helpText="Forventet tomgang per år"
                        />
                    </Section>

                    <Section title="Driftskostnader" defaultOpen={false}>
                        <Slider
                            label="Felleskostnader"
                            value={inputs.monthlyCommonCosts}
                            onChange={(v) => updateInput('monthlyCommonCosts', v)}
                            min={0}
                            max={10000}
                            step={100}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr/mnd"
                        />
                        <Slider
                            label="Vedlikehold"
                            value={inputs.monthlyMaintenance}
                            onChange={(v) => updateInput('monthlyMaintenance', v)}
                            min={0}
                            max={5000}
                            step={100}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr/mnd"
                        />
                        <Slider
                            label="Internet/TV"
                            value={inputs.internetTV}
                            onChange={(v) => updateInput('internetTV', v)}
                            min={0}
                            max={2000}
                            step={50}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr/mnd"
                        />
                        <Slider
                            label="Forsikring"
                            value={inputs.annualInsurance}
                            onChange={(v) => updateInput('annualInsurance', v)}
                            min={0}
                            max={20000}
                            step={500}
                            formatValue={(v) => formatNumber(v)}
                            unit=" kr/år"
                        />
                    </Section>
                </div>

                {/* RIGHT: Results */}
                <div className="p-4 bg-white/[0.02]">
                    {/* Main result */}
                    <div className={`p-5 rounded-lg mb-4 ${analysis.summary.monthlyCashFlow >= 0
                            ? 'bg-gradient-to-br from-green-900/30 to-green-800/10 border border-green-500/20'
                            : 'bg-gradient-to-br from-red-900/30 to-red-800/10 border border-red-500/20'
                        }`}>
                        <div className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                            Månedlig resultat etter skatt
                        </div>
                        <div className={`text-3xl font-serif ${analysis.summary.monthlyCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {formatNOK(analysis.summary.monthlyCashFlow)}
                        </div>
                        <div className="text-sm text-stone-500 mt-1">
                            = {formatNOK(analysis.summary.annualCashFlow)} / år
                        </div>
                    </div>

                    {/* Yield metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Brutto yield</div>
                            <div className="text-lg font-medium text-brass">{analysis.summary.grossYield.toFixed(1)}%</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Netto yield</div>
                            <div className="text-lg font-medium text-brass">{analysis.summary.netYield.toFixed(1)}%</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Cash-on-cash</div>
                            <div className={`text-lg font-medium ${analysis.summary.cashOnCash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {analysis.summary.cashOnCash.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {/* Detailed breakdown */}
                    <div className="space-y-3 text-sm">
                        <h4 className="text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                            Detaljert oversikt for 1 år
                        </h4>

                        {/* Income */}
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-stone-400">Leieinntekter</span>
                            <span className="text-green-400">+ {formatNOK(analysis.income.effectiveAnnualRent)}</span>
                        </div>

                        {/* Operating costs */}
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-stone-400">Driftskostnader</span>
                            <span className="text-red-400">- {formatNOK(analysis.costs.totalOperatingCosts)}</span>
                        </div>

                        {/* Mortgage */}
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-stone-400">Avdrag og renter</span>
                            <span className="text-red-400">- {formatNOK(analysis.costs.annualMortgage)}</span>
                        </div>

                        {/* Tax */}
                        <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-stone-400">Skatt ({inputs.taxRate}%)</span>
                            <span className="text-red-400">- {formatNOK(analysis.tax.annualTax)}</span>
                        </div>

                        {/* Result */}
                        <div className="flex justify-between py-2 font-medium">
                            <span className="text-ink-primary">Resultat etter skatt</span>
                            <span className={analysis.results.annualCashFlowAfterTax >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {formatNOK(analysis.results.annualCashFlowAfterTax)}
                            </span>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-start gap-2">
                        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-stone-500">
                            Beregningene er estimater og tar ikke høyde for alle faktorer.
                            Konsulter en finansrådgiver for nøyaktige tall.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
