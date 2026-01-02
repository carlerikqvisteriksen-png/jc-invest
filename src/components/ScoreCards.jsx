import React, { useMemo } from 'react';
import { Star, Info } from 'lucide-react';

function getScoreColor(score, maxScore = 10) {
    if (!score || isNaN(score)) return { bg: 'bg-stone-500/20', border: 'border-stone-500/30', text: 'text-stone-400' };
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
    if (percentage >= 60) return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    if (percentage >= 40) return { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' };
    return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
}

function ScoreBadge({ label, score, maxScore = 10, showLabel = true }) {
    const colors = getScoreColor(score, maxScore);
    const displayScore = score && !isNaN(score) ? score.toFixed(1) : '—';

    return (
        <div className={`flex flex-col items-center p-3 rounded-lg ${colors.bg} border ${colors.border} transition-transform hover:scale-105`}>
            <div className={`text-2xl font-bold ${colors.text}`}>
                {displayScore}
            </div>
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                av {maxScore}
            </div>
            {showLabel && (
                <div className="text-xs text-stone-300 mt-1 text-center">
                    {label}
                </div>
            )}
        </div>
    );
}

export default function ScoreCards({ properties = [], title = "Vurderinger", compact = false }) {

    // Calculate average scores from properties
    const scores = useMemo(() => {
        if (properties.length === 0) return [];

        // Try to extract scores from property data
        // Properties may have: score, location_score, condition_score, etc.
        const scoreFields = [
            { key: 'location_score', label: 'Beliggenhet' },
            { key: 'condition_score', label: 'Standard' },
            { key: 'layout_score', label: 'Planløsning' },
            { key: 'view_score', label: 'Utsikt' }
        ];

        const calculatedScores = [];

        scoreFields.forEach(field => {
            const values = properties
                .map(p => p[field.key])
                .filter(v => v !== null && v !== undefined && !isNaN(v));

            if (values.length > 0) {
                const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
                calculatedScores.push({ label: field.label, score: avg, maxScore: 10 });
            }
        });

        // If no specific scores, try to use the general 'score' field
        if (calculatedScores.length === 0) {
            const generalScores = properties
                .map(p => p.score)
                .filter(v => v !== null && v !== undefined && !isNaN(v));

            if (generalScores.length > 0) {
                const avg = generalScores.reduce((sum, v) => sum + v, 0) / generalScores.length;
                calculatedScores.push({ label: 'AI-Score', score: avg, maxScore: 10 });
            }
        }

        return calculatedScores;
    }, [properties]);

    // If no scores available
    if (scores.length === 0) {
        return (
            <div className="velvet-card p-5 mb-6 opacity-50">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {title}
                </h3>
                <p className="text-sm text-stone-400 mt-2">Ingen vurderinger tilgjengelig for valgte boliger.</p>
            </div>
        );
    }

    // Calculate average score
    const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const avgColors = getScoreColor(avgScore);

    if (compact) {
        // Compact horizontal layout
        return (
            <div className="flex items-center gap-3 flex-wrap mb-4">
                {scores.map((item, idx) => (
                    <div
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getScoreColor(item.score).bg} border ${getScoreColor(item.score).border}`}
                        title={item.label}
                    >
                        <span className={`text-sm font-medium ${getScoreColor(item.score).text}`}>
                            {item.score.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-stone-500">av {item.maxScore}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="velvet-card p-5 mb-6 fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-brass flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {title}
                </h3>

                {/* Average score */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${avgColors.bg} border ${avgColors.border}`}>
                    <span className="text-xs text-stone-400">Snitt:</span>
                    <span className={`font-bold ${avgColors.text}`}>{avgScore.toFixed(1)}</span>
                </div>
            </div>

            {/* Score grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {scores.map((item, idx) => (
                    <ScoreBadge
                        key={idx}
                        label={item.label}
                        score={item.score}
                        maxScore={item.maxScore}
                    />
                ))}
            </div>

            {/* Info text */}
            <div className="flex items-start gap-2 mt-4 p-3 bg-white/5 rounded-lg">
                <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <p className="text-xs text-stone-500">
                    Vurderingene er beregnet fra {properties.length} boliger i utvalget.
                </p>
            </div>
        </div>
    );
}

// Export individual badge for use elsewhere
export { ScoreBadge };
