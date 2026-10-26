import React from 'react';
import {
  Calendar,
  Gauge,
  Fuel,
  GitBranch,
  UserCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

const PRESETS = [
  {
    name: 'Maruti Swift (2018)',
    desc: 'Commuter Hatchback',
    values: {
      brand: 'Maruti',
      model: 'Swift',
      year: 2018,
      km_driven: 45000,
      fuel: 'Petrol',
      seller_type: 'Individual',
      transmission: 'Manual',
      owner: 'First Owner',
      mileage: 21.2,
      engine: 1197,
      max_power: 81.8,
      seats: 5,
    },
  },
  {
    name: 'Hyundai i20 (2019)',
    desc: 'Premium Hatchback',
    values: {
      brand: 'Hyundai',
      model: 'i20',
      year: 2019,
      km_driven: 38000,
      fuel: 'Petrol',
      seller_type: 'Individual',
      transmission: 'Manual',
      owner: 'First Owner',
      mileage: 18.6,
      engine: 1197,
      max_power: 82.0,
      seats: 5,
    },
  },
  {
    name: 'Honda City (2017)',
    desc: 'Midsize Sedan',
    values: {
      brand: 'Honda',
      model: 'City',
      year: 2017,
      km_driven: 62000,
      fuel: 'Petrol',
      seller_type: 'Individual',
      transmission: 'Manual',
      owner: 'First Owner',
      mileage: 17.8,
      engine: 1497,
      max_power: 117.3,
      seats: 5,
    },
  },
  {
    name: 'Mahindra Scorpio (2016)',
    desc: 'Rugged SUV',
    values: {
      brand: 'Mahindra',
      model: 'Scorpio',
      year: 2016,
      km_driven: 88000,
      fuel: 'Diesel',
      seller_type: 'Individual',
      transmission: 'Manual',
      owner: 'First Owner',
      mileage: 15.4,
      engine: 2179,
      max_power: 120.0,
      seats: 7,
    },
  },
  {
    name: 'BMW 3 Series (2016)',
    desc: 'Luxury Sedan',
    values: {
      brand: 'BMW',
      model: '3',
      year: 2016,
      km_driven: 54000,
      fuel: 'Diesel',
      seller_type: 'Dealer',
      transmission: 'Automatic',
      owner: 'First Owner',
      mileage: 22.69,
      engine: 1995,
      max_power: 190.0,
      seats: 5,
    },
  },
];

export default function CarInputForm({
  formData,
  setFormData,
  metadata,
  onSubmit,
  loading,
}) {
  const brands = metadata?.brands || [];
  const brandModels = metadata?.brand_models || {};
  const currentBrandModels = brandModels[formData.brand] || [];

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    const availableModels = brandModels[newBrand] || [];
    const newModel = availableModels.includes(formData.model)
      ? formData.model
      : availableModels[0] || 'Other';

    setFormData((prev) => ({
      ...prev,
      brand: newBrand,
      model: newModel,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPreset = (preset) => {
    setFormData(preset.values);
  };

  return (
    <div className="card-surface p-5 sm:p-6 space-y-6">
      {/* Header & Presets */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white tracking-tight">Vehicle Parameters</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Input Controls</span>
        </div>

        {/* Quick Test Presets */}
        <div className="mt-3.5">
          <div className="text-[11px] font-medium text-slate-400 mb-2">Preset Vehicle Profiles:</div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESETS.map((p, i) => {
              const isSelected = formData.brand === p.values.brand && formData.model === p.values.model;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-lg border text-left transition text-xs ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-medium text-xs">{p.name}</div>
                  <div className="text-[10px] text-slate-400">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        {/* Brand & Model (Cascading) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Make / Manufacturer
            </label>
            <select
              value={formData.brand}
              onChange={handleBrandChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Model Series
            </label>
            <select
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {currentBrandModels.length > 0 ? (
                currentBrandModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))
              ) : (
                <option value="Other">Other</option>
              )}
            </select>
          </div>
        </div>

        {/* Manufacturing Year Slider */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Manufacturing Year</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              {formData.year} ({2024 - formData.year} yr old)
            </span>
          </div>
          <input
            type="range"
            min="2005"
            max="2024"
            step="1"
            value={formData.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>2005</span>
            <span>2015</span>
            <span>2024</span>
          </div>
        </div>

        {/* Kilometers Driven Slider */}
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-300 flex items-center space-x-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span>Kilometers Driven</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
              {formData.km_driven.toLocaleString()} km
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="200000"
            step="1000"
            value={formData.km_driven}
            onChange={(e) => handleInputChange('km_driven', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1,000 km</span>
            <span>100,000 km</span>
            <span>200,000 km</span>
          </div>
        </div>

        {/* Fuel Type & Transmission */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Fuel */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>Fuel Type</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['Petrol', 'Diesel', 'CNG', 'LPG'].map((fuel) => (
                <button
                  key={fuel}
                  type="button"
                  onClick={() => handleInputChange('fuel', fuel)}
                  className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    formData.fuel.toLowerCase() === fuel.toLowerCase()
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" />
              <span>Transmission</span>
            </label>
            <div className="grid grid-cols-2 gap-1">
              {['Manual', 'Automatic'].map((trans) => (
                <button
                  key={trans}
                  type="button"
                  onClick={() => handleInputChange('transmission', trans)}
                  className={`py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    formData.transmission.toLowerCase() === trans.toLowerCase()
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {trans}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ownership & Seller Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Ownership</span>
            </label>
            <select
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="First Owner">First Owner</option>
              <option value="Second Owner">Second Owner</option>
              <option value="Third Owner">Third Owner</option>
              <option value="Fourth & Above Owner">Fourth & Above Owner</option>
              <option value="Test Drive Car">Test Drive Car</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Seller Category
            </label>
            <select
              value={formData.seller_type}
              onChange={(e) => handleInputChange('seller_type', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Individual">Individual</option>
              <option value="Dealer">Dealer</option>
              <option value="Trustmark Dealer">Trustmark Dealer</option>
            </select>
          </div>
        </div>

        {/* Engine, Max Power, Mileage, Seats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Engine CC */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Displacement</span>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-white">{formData.engine}</span>
              <span className="text-[10px] text-slate-400">CC</span>
            </div>
            <input
              type="range"
              min="800"
              max="3500"
              step="50"
              value={formData.engine}
              onChange={(e) => handleInputChange('engine', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Max Power */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Engine Output</span>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-white">{formData.max_power}</span>
              <span className="text-[10px] text-slate-400">bhp</span>
            </div>
            <input
              type="range"
              min="35"
              max="300"
              step="1"
              value={formData.max_power}
              onChange={(e) => handleInputChange('max_power', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Mileage */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Efficiency</span>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-white">{formData.mileage}</span>
              <span className="text-[10px] text-slate-400">kmpl</span>
            </div>
            <input
              type="range"
              min="8"
              max="32"
              step="0.1"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Seats */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">Seating</span>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-semibold text-white">{formData.seats}</span>
              <span className="text-[10px] text-slate-400">Seats</span>
            </div>
            <div className="flex gap-1">
              {[4, 5, 7, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleInputChange('seats', s)}
                  className={`flex-1 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                    formData.seats === s
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calculate Resale Valuation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
