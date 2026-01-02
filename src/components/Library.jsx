import React, { useState } from 'react';
import { Book, Search, ChevronDown, ChevronUp, Tag } from 'lucide-react';

// Comprehensive real estate glossary
const GLOSSARY = [
    // === Finansiering ===
    {
        term: 'Fellesgjeld',
        category: 'Finansiering',
        short: 'Lån som foreningen har og som du overtar en andel av ved kjøp',
        full: 'Fellesgjeld er lån som borettslaget eller sameiet har tatt opp sammen. Ved kjøp av en andel/leilighet overtar du din forholdsmessige andel av denne gjelden. Fellesgjelden påvirker totalkostnaden din, og du betaler den ned gjennom felleskostnadene.'
    },
    {
        term: 'Felleskostnader',
        category: 'Finansiering',
        short: 'Månedlige utgifter til felles drift av bygget',
        full: 'Felleskostnader dekker drift og vedlikehold av fellesarealer, kommunale avgifter, forsikring, og nedbetaling av fellesgjeld. For borettslag inkluderer dette ofte renter og avdrag på IN-lån.'
    },
    {
        term: 'Dokumentavgift',
        category: 'Finansiering',
        short: '2,5% avgift ved kjøp av selveier',
        full: 'Dokumentavgift er en statlig avgift på 2,5% av kjøpesummen som betales ved tinglysing av skjøte. Gjelder kun selveierboliger (ikke borettslagsandeler).'
    },
    {
        term: 'Totalpris',
        category: 'Finansiering',
        short: 'Prisantydning + fellesgjeld + omkostninger',
        full: 'Totalprisen er det du faktisk betaler for boligen. Den inkluderer prisantydning, din andel av fellesgjeld, dokumentavgift (for selveier), tinglysingsgebyr, og eventuelle andre omkostninger.'
    },
    // === Verdivurdering ===
    {
        term: 'Prisantydning',
        category: 'Verdivurdering',
        short: 'Selgers forventede salgspris',
        full: 'Prisantydning er megleren og selgers anslag på hva boligen bør selges for. Den skal være realistisk og basert på markedsverdien, men sluttprisen avgjøres av budgivning.'
    },
    {
        term: 'Takst',
        category: 'Verdivurdering',
        short: 'Profesjonell verdivurdering av boligen',
        full: 'En takst er en uavhengig vurdering av boligens tekniske tilstand og verdi, utført av en godkjent takstmann. Den inneholder ofte låne- og markedsverdi, samt tilstandsgrad på bygningsdeler.'
    },
    {
        term: 'Kvadratmeterpris',
        category: 'Verdivurdering',
        short: 'Pris per m² (kr/m²)',
        full: 'Kvadratmeterpris beregnes ved å dele salgsprisen på primærarealet (P-ROM). Brukes for å sammenligne boligpriser på tvers av størrelser og områder.'
    },
    {
        term: 'Sammenlignbare salg',
        category: 'Verdivurdering',
        short: 'Nylig solgte lignende boliger i området',
        full: 'Sammenlignbare salg (comps) er boliger med lignende egenskaper som nylig er solgt i samme område. Brukes til å estimere markedsverdi og vurdere om en bolig er riktig priset.'
    },
    // === Utleie ===
    {
        term: 'Yield',
        category: 'Utleie',
        short: 'Årlig leieinntekt / kjøpspris (avkastning)',
        full: 'Yield (direkteavkastning) måler lønnsomheten av en utleieinvestering. Beregnes som (årlig leieinntekt / kjøpspris) * 100. En yield på 5% betyr at du får 5% avkastning på investert kapital årlig fra leie.'
    },
    {
        term: 'Brutto leieinntekt',
        category: 'Utleie',
        short: 'Total leieinntekt før utgifter',
        full: 'Brutto leieinntekt er den totale leien du mottar før du trekker fra driftsutgifter som felleskostnader, forsikring, vedlikehold, og skatt.'
    },
    {
        term: 'Netto leieinntekt',
        category: 'Utleie',
        short: 'Leieinntekt etter alle utgifter',
        full: 'Netto leieinntekt er det du sitter igjen med etter alle driftskostnader er trukket fra. Dette inkluderer felleskostnader, forsikring, vedlikehold, eiendomsskatt, og eventuelt forvaltningshonorar.'
    },
    // === Boligtyper ===
    {
        term: 'Selveier',
        category: 'Boligtyper',
        short: 'Du eier boligen og tomten direkte',
        full: 'I en selveierbolig (seksjonert sameie) eier du din egen seksjon av bygningen og en ideell andel av fellesarealer og tomt. Du kan fritt selge, leie ut, og har full råderett.'
    },
    {
        term: 'Borettslagsandel',
        category: 'Boligtyper',
        short: 'Du eier en andel i borettslaget som gir borett',
        full: 'I et borettslag eier du en andel av laget, som gir deg eksklusiv borett til en bestemt leilighet. Borettslag har ofte strengere regler for utleie og vedtekter du må følge.'
    },
    {
        term: 'Aksjeleilighet',
        category: 'Boligtyper',
        short: 'Du eier aksjer som gir rett til å bo i leiligheten',
        full: 'Aksjeleiligheter ligner borettslagsandeler, men organisert som et aksjeselskap. Aksjene gir borett til en spesifikk leilighet. Mindre vanlig i dag.'
    },
    // === Areal ===
    {
        term: 'P-ROM',
        category: 'Areal',
        short: 'Primærrom - hoveddelen av boligen',
        full: 'P-ROM (primærrom) er de rommene som brukes til varig opphold: stue, kjøkken, soverom, bad, entre. Det er dette arealet kvadratmeterprisen vanligvis beregnes fra.'
    },
    {
        term: 'BRA',
        category: 'Areal',
        short: 'Bruksareal - totalt innvendig areal',
        full: 'BRA (bruksareal) er det totale arealet innenfor ytterveggene, inkludert P-ROM og S-ROM (sekundærrom som bod, teknisk rom). BRA er alltid større enn eller lik P-ROM.'
    },
    {
        term: 'S-ROM',
        category: 'Areal',
        short: 'Sekundærrom - boder, tekniske rom, etc.',
        full: 'S-ROM (sekundærrom) er rom som ikke regnes som primærrom: boder, kjellerrom, tekniske rom, garasje. Disse regnes ikke med i P-ROM, men inngår i BRA.'
    },
    // === Investering ===
    {
        term: 'Flipping',
        category: 'Investering',
        short: 'Kjøpe, pusse opp, selge med fortjeneste',
        full: 'Flipping er en investeringsstrategi der du kjøper en bolig under markedspris, renoverer den, og selger med fortjeneste. Krever god markedskunnskap og oppussingsbudsjett.'
    },
    {
        term: 'ROI',
        category: 'Investering',
        short: 'Return on Investment - avkastning på investert kapital',
        full: 'ROI (avkastning på investering) måler hvor mye fortjeneste du får i forhold til investert kapital. Beregnes som (fortjeneste / investert beløp) * 100.'
    },
    {
        term: 'Egenkapital',
        category: 'Investering',
        short: 'Din egen kapital (ikke lån) i investeringen',
        full: 'Egenkapital er den delen av boligkjøpet du finansierer selv, uten lån. Banker krever vanligvis 15% egenkapital for primærbolig og 40% for sekundærbolig/utleie.'
    }
];

const CATEGORIES = [...new Set(GLOSSARY.map(g => g.category))];

export default function Library() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedTerm, setExpandedTerm] = useState(null);

    const filteredTerms = GLOSSARY.filter(item => {
        const matchesSearch = !searchQuery ||
            item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.short.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-brass mb-2 flex items-center justify-center gap-3">
                    <Book className="w-8 h-8" />
                    Bibliotek
                </h2>
                <p className="text-stone-light text-sm max-w-md mx-auto">
                    Ordliste og forklaringer på viktige begreper innen eiendomsinvestering.
                </p>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                    <input
                        type="text"
                        placeholder="Søk etter begreper..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-ink-primary placeholder:text-stone-500 focus:outline-none focus:border-brass/50"
                    />
                </div>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${!selectedCategory
                                ? 'bg-brass text-obsidian border-brass font-bold'
                                : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500'
                            }`}
                    >
                        Alle
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs border transition-all flex items-center gap-1 ${selectedCategory === cat
                                    ? 'bg-brass text-obsidian border-brass font-bold'
                                    : 'bg-transparent text-stone-400 border-stone-700 hover:border-stone-500'
                                }`}
                        >
                            <Tag className="w-3 h-3" />
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Terms List */}
            <div className="space-y-3">
                {filteredTerms.length === 0 ? (
                    <div className="velvet-card p-6 text-center">
                        <p className="text-stone-400">Ingen begreper funnet for "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredTerms.map((item, idx) => (
                        <div
                            key={idx}
                            className="velvet-card overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setExpandedTerm(expandedTerm === idx ? null : idx)}
                                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-serif text-brass">{item.term}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-white/5 px-2 py-0.5 rounded">
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-stone-400">{item.short}</p>
                                </div>
                                {expandedTerm === idx ? (
                                    <ChevronUp className="w-5 h-5 text-stone-500 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-stone-500 shrink-0" />
                                )}
                            </button>

                            {expandedTerm === idx && (
                                <div className="px-4 pb-4 pt-2 border-t border-white/10">
                                    <p className="text-stone-300 text-sm leading-relaxed">
                                        {item.full}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-stone-500">
                {filteredTerms.length} begreper vist
            </div>
        </div>
    );
}
