import React from 'react';
import { Star, Info } from 'lucide-react';

// Mock data - replace with real data later
const defaultScores = [
    { label: 'Beliggenhet', score: 8.9, maxScore: 10 },
    { label: 'Standard', score: 7.7, maxScore: 10 },
    { label: 'Planløsning', score: 8.3, maxScore: 10 },
    { label: 'Utsikt', score: 8.3, maxScore: 10 }
];

function getScoreColor(score, maxScore = 10) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
    if (percentage >= 60) return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    if (percentage >= 40) return { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' };
    return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
}

function ScoreBadge({ label, score, maxScore = 10, showLabel = true }) {
    const colors = getScoreColor(score, maxScore);

    return (
        <div className={`flex flex-col items-center p-3 rounded-lg ${colors.bg} border ${colors.border} transition-transform hover:scale-105`}>
            <div className={`text-2xl font-bold ${colors.text}`}>
                {score.toFixed(1)}
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

export default function ScoreCards({ scores = defaultScores, title = "Vurderinger", compact = false }) {
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
        <div className="velvet-card p-5 mb-6">
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
                    Vurderingene er basert på sammenligning med lignende eiendommer i området.
                </p>
            </div>
        </div>
    );
}

// Export individual badge for use elsewhere
export { ScoreBadge };
