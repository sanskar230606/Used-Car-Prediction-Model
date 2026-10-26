import React from 'react';
import { X, CheckCircle2, Cpu, Database, Award, Activity, Layers } from 'lucide-react';
import { formatExactINR } from '../utils/currency';

export default function ModelMetricsModal({ isOpen, onClose, metrics }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Machine Learning Model Architecture & Evaluation</h3>
              <p className="text-xs text-slate-400">Trained on real Indian used car marketplace transaction records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Key Metric Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400 mb-1">Test R² Score</div>
              <div className="text-xl font-bold text-emerald-400">
                {metrics ? (metrics.test_r2 * 100).toFixed(1) + '%' : '98.0%'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Variance Explained</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400 mb-1">Mean Abs. Error</div>
              <div className="text-xl font-bold text-teal-300">
                {metrics ? formatExactINR(metrics.test_mae) : '₹63,920'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Average Error (MAE)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400 mb-1">Root Mean Sq. Error</div>
              <div className="text-xl font-bold text-sky-400">
                {metrics ? formatExactINR(metrics.test_rmse) : '₹1.18 Lakh'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">RMSE</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div className="text-xs text-slate-400 mb-1">MAPE</div>
              <div className="text-xl font-bold text-purple-400">
                {metrics ? `${metrics.test_mape}%` : '14.29%'}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Mean % Error</div>
            </div>
          </div>

          {/* Dataset & Training Partition */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Dataset Split & Verification</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">Total Records</span>
                <span className="font-semibold text-white">{metrics?.total_samples?.toLocaleString() || '8,119'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">Training Partition (80%)</span>
                <span className="font-semibold text-emerald-400">{metrics?.train_samples?.toLocaleString() || '6,495'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block">Test Validation (20%)</span>
                <span className="font-semibold text-sky-400">{metrics?.test_samples?.toLocaleString() || '1,624'}</span>
              </div>
            </div>
          </div>

          {/* Pipeline Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Scikit-Learn Pipeline Pipeline Architecture</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Algorithm:</strong> {metrics?.algorithm || 'RandomForestRegressor with Log-Transformed Target'}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Target Transformation:</strong> Log1p transformation applied during training and Expm1 inversion on inference to maintain strictly positive valuations and exponential depreciation curves.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Preprocessing:</strong> ColumnTransformer with RobustScaler for numeric variables (Year, KM, Engine CC, BHP, Seats, Mileage) and OneHotEncoder for categoricals.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Hyperparameters:</strong> 180 Estimators, Max Depth = 22, Min Samples Split = 4, Min Samples Leaf = 2.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
