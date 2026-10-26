import React from 'react';
import { ShieldCheck, Info, Gauge, Sparkles, Fuel, GitBranch, Calendar } from 'lucide-react';

export default function ValuationCard({ result, loading, formState }) {
  if (loading) {
    return (
      <div className="card-surface p-6 sm:p-7 min-h-[260px] flex flex-col justify-center items-center text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <div className="text-sm font-semibold text-slate-200">Evaluating Resale Valuation</div>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Computing tree ensemble predictions and generating market curves...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-surface p-6 sm:p-7 min-h-[260px] flex flex-col justify-center items-center text-center">
        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
          <Gauge className="w-5 h-5" />
        </div>
        <div className="text-sm font-semibold text-slate-200">No Valuation Generated</div>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Select your car details and click Calculate to view predicted market price.
        </p>
      </div>
    );
  }

  const { predicted_price, formatted_price, formatted_exact, price_range, input_summary } = result;

  return (
    <div className="card-surface p-6 sm:p-7 relative overflow-hidden transition-all duration-200">
      {/* Top Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Fair Market Valuation
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Confidence Interval: ±8.5%</span>
        </div>
      </div>

      {/* Main Valuation Display */}
      <div className="mt-5 mb-5">
        <div className="text-xs font-medium text-slate-400">Estimated Market Value</div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-3 mt-1">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            <span className="text-emerald-400 mr-1">₹</span>
            {formatted_price.replace('₹', '')}
          </div>
          <div className="text-xs text-slate-400 mt-1 sm:mt-0 font-medium">
            Exact: <span className="text-slate-300">{formatted_exact}</span>
          </div>
        </div>
      </div>

      {/* Market Spread & Valuation Meter */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-5">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-slate-400 font-medium">Market Range</span>
          <span className="font-semibold text-slate-200">
            {price_range.formatted_low} – {price_range.formatted_high}
          </span>
        </div>

        {/* Valuation Band Meter */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          {/* Fair market central zone */}
          <div className="absolute top-0 left-1/4 right-1/4 h-full bg-emerald-500/80" />
          {/* Indicator marker */}
          <div className="absolute top-0 left-1/2 -ml-1 w-2 h-full bg-white rounded-full shadow" />
        </div>

        <div className="grid grid-cols-3 text-[11px] text-slate-400 mt-2 font-medium">
          <div className="text-left">
            <span className="text-slate-400 block">Buyer Advantage</span>
            <span className="text-slate-300 font-semibold">{price_range.formatted_low}</span>
          </div>
          <div className="text-center">
            <span className="text-emerald-400 block font-semibold">Fair Market</span>
            <span className="text-white font-bold">{formatted_price}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Dealer Premium</span>
            <span className="text-slate-300 font-semibold">{price_range.formatted_high}</span>
          </div>
        </div>
      </div>

      {/* Vehicle Summary Metadata Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium">Car:</span>
          <span className="font-semibold text-white">{input_summary?.brand} {input_summary?.model}</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium">Year:</span>
          <span className="font-semibold text-white">{input_summary?.year}</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium">Driven:</span>
          <span className="font-semibold text-white">{input_summary?.km_driven?.toLocaleString()} km</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium">Transmission:</span>
          <span className="font-semibold text-white">{input_summary?.transmission}</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
          <span className="text-slate-400 font-medium">Fuel:</span>
          <span className="font-semibold text-white">{input_summary?.fuel}</span>
        </div>
      </div>
    </div>
  );
}
