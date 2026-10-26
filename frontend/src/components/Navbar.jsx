import React from 'react';
import { Car, BarChart3, Database, Layers } from 'lucide-react';

export default function Navbar({ onOpenMetrics, metrics }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Car className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-white tracking-tight">
                AutoValuate<span className="text-emerald-400">.ai</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                PROD v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Machine Learning Used Car Valuation Engine
            </p>
          </div>
        </div>

        {/* Right Actions & Model Status */}
        <div className="flex items-center space-x-3">
          {metrics && (
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Model Accuracy:</span>
              <span className="font-semibold text-slate-200">{(metrics.test_r2 * 100).toFixed(1)}% R²</span>
            </div>
          )}

          <button
            onClick={onOpenMetrics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-colors shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Model Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
}
