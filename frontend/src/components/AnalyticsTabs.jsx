import React, { useState } from 'react';
import { TrendingDown, Gauge, Cpu } from 'lucide-react';
import DepreciationChart from './DepreciationChart';
import MileageImpactChart from './MileageImpactChart';
import FeatureImportanceChart from './FeatureImportanceChart';

export default function AnalyticsTabs({
  depreciationData,
  currentYear,
  mileageData,
  currentKm,
  featureImportances,
}) {
  const [activeTab, setActiveTab] = useState('depreciation');

  return (
    <div className="card-surface p-5 space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Predictive Analytics & Model Behavior
          </h3>
          <p className="text-[11px] text-slate-400">
            Interactive multi-dimensional evaluation curves
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'depreciation'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Depreciation</span>
          </button>

          <button
            onClick={() => setActiveTab('mileage')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'mileage'
                ? 'bg-slate-800 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Usage Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('importance')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'importance'
                ? 'bg-slate-800 text-purple-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Feature Weights</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'depreciation' && (
          <DepreciationChart
            data={depreciationData}
            currentYear={currentYear}
          />
        )}

        {activeTab === 'mileage' && (
          <MileageImpactChart
            data={mileageData}
            currentKm={currentKm}
          />
        )}

        {activeTab === 'importance' && (
          <FeatureImportanceChart
            data={featureImportances}
          />
        )}
      </div>
    </div>
  );
}
