import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

export default function FeatureInsights({ contributions }) {
  if (!contributions || contributions.length === 0) return null;

  const getImpactBadge = (impact) => {
    const imp = impact.toLowerCase();
    if (imp.includes('positive')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ArrowUpRight className="w-3 h-3" />
          <span>Value Enhancer</span>
        </span>
      );
    } else if (imp.includes('depreciation') || imp.includes('negative')) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <ArrowDownRight className="w-3 h-3" />
          <span>Depreciation Factor</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
          <Minus className="w-3 h-3" />
          <span>Market Neutral</span>
        </span>
      );
    }
  };

  return (
    <div className="card-surface p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Explainable AI • Valuation Factors</span>
        </div>
        <span className="text-[10px] text-slate-400">Model Insights</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
        {contributions.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-200">{item.feature}</span>
              {getImpactBadge(item.impact)}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
