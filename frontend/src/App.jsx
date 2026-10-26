import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModelMetricsModal from './components/ModelMetricsModal';
import CarInputForm from './components/CarInputForm';
import ValuationCard from './components/ValuationCard';
import FeatureInsights from './components/FeatureInsights';
import AnalyticsTabs from './components/AnalyticsTabs';
import { fetchMetadata, fetchModelInfo, predictPrice } from './api/client';
import { AlertCircle, RefreshCw } from 'lucide-react';

const INITIAL_FORM_STATE = {
  brand: 'Hyundai',
  model: 'i20',
  year: 2018,
  km_driven: 45000,
  fuel: 'Petrol',
  seller_type: 'Individual',
  transmission: 'Manual',
  owner: 'First Owner',
  mileage: 18.6,
  engine: 1197,
  max_power: 81.86,
  seats: 5,
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [metadata, setMetadata] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setInitialLoading(true);
        setError(null);
        const [metaDataRes, metricsRes] = await Promise.all([
          fetchMetadata(),
          fetchModelInfo(),
        ]);
        setMetadata(metaDataRes);
        setMetrics(metricsRes);

        const initialPrediction = await predictPrice(INITIAL_FORM_STATE);
        setResult(initialPrediction);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(
          'Failed to connect to the backend server. Make sure the FastAPI service is running on http://127.0.0.1:8000.'
        );
      } finally {
        setInitialLoading(false);
      }
    }
    init();
  }, []);

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await predictPrice(formData);
      setResult(res);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error occurred while calculating car valuation.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <h2 className="text-sm font-semibold text-slate-200">Initializing Valuation Engine</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to FastAPI service and model artifacts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenMetrics={() => setIsMetricsModalOpen(true)}
        metrics={metrics}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Connection Error</strong>
              <span>{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-xs font-medium flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <CarInputForm
              formData={formData}
              setFormData={setFormData}
              metadata={metadata}
              onSubmit={handlePredict}
              loading={loading}
            />
          </div>

          {/* Right Column: Valuation & Visualizations (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Valuation Hero Card */}
            <ValuationCard
              result={result}
              loading={loading}
              formState={formData}
            />

            {/* Explainable AI Driver Factors */}
            {result?.feature_contributions && (
              <FeatureInsights contributions={result.feature_contributions} />
            )}

            {/* Unified Analytics Workbench Tabs */}
            <AnalyticsTabs
              depreciationData={result?.depreciation_curve}
              currentYear={formData.year}
              mileageData={result?.mileage_curve}
              currentKm={formData.km_driven}
              featureImportances={metadata?.feature_importances}
            />
          </div>
        </div>
      </main>

      {/* Minimal Enterprise Footer */}
      <footer className="border-t border-slate-800 bg-[#070b13] py-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-medium text-slate-300">AutoValuate.ai</span>
            <span className="mx-2">•</span>
            <span>Indian Used Car Valuation & Price Prediction</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Ensemble Random Forest Regressor • 8,119 verified records • R² = 0.98
          </div>
        </div>
      </footer>

      {/* Model Metrics Modal */}
      <ModelMetricsModal
        isOpen={isMetricsModalOpen}
        onClose={() => setIsMetricsModalOpen(false)}
        metrics={metrics}
      />
    </div>
  );
}
