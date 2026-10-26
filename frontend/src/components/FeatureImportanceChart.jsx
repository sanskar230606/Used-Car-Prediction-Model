import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const FEATURE_LABELS = {
  max_power: 'Max Power (bhp)',
  year: 'Manufacturing Year',
  engine: 'Engine CC',
  km_driven: 'Kilometers Driven',
  brand: 'Brand / Make',
  transmission: 'Transmission',
  mileage: 'Mileage (kmpl)',
  fuel: 'Fuel Type',
  seats: 'Seating Capacity',
  model: 'Model Variant',
  owner: 'Ownership Tier',
  seller_type: 'Seller Category',
};

const COLORS = [
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
];

export default function FeatureImportanceChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 7).map((item) => ({
    rawName: item.feature,
    displayName: FEATURE_LABELS[item.feature] || item.feature,
    importance: item.importance,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div className="p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg text-xs">
          <div className="font-medium text-white">{pt.displayName}</div>
          <div className="text-emerald-400 font-semibold mt-0.5">
            Importance Weight: {pt.importance}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-slate-400">
          Random Forest Gini importance weights for top price determinants
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="importance" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
