import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Gauge } from 'lucide-react';
import { formatIndianRupees } from '../utils/currency';

export default function MileageImpactChart({ data, currentKm }) {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      const isCurrent = Math.abs(pt.km_driven - currentKm) < 500;
      return (
        <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs">
          <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
            <Gauge className="w-3 h-3 text-sky-400" />
            <span>{pt.km_driven.toLocaleString()} km</span>
            {isCurrent && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-500/20 text-sky-400 font-semibold">
                Current
              </span>
            )}
          </div>
          <div className="text-sky-400 font-bold mt-1 text-xs">
            Projected Value: {formatIndianRupees(pt.estimated_price)}
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
          Impact of accumulated odometer distance on market valuation
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="km_driven"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k km`}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => formatIndianRupees(val)}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="estimated_price"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={(props) => {
                const isSelected = Math.abs(props.payload.km_driven - currentKm) < 500;
                return (
                  <circle
                    key={props.payload.km_driven}
                    cx={props.cx}
                    cy={props.cy}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#38bdf8' : '#0284c7'}
                    stroke={isSelected ? '#ffffff' : '#0369a1'}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
