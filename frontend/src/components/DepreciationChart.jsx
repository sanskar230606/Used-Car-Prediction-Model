import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';
import { formatIndianRupees } from '../utils/currency';

export default function DepreciationChart({ data, currentYear }) {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      const isCurrent = pt.year === currentYear;
      return (
        <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-xs">
          <div className="flex items-center space-x-1.5 font-medium text-white mb-1">
            <Calendar className="w-3 h-3 text-emerald-400" />
            <span>Year {pt.year}</span>
            {isCurrent && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                Selected
              </span>
            )}
          </div>
          <div className="text-slate-400 text-[11px]">
            Vehicle Age: <strong className="text-slate-200">{pt.age} yrs</strong>
          </div>
          <div className="text-emerald-400 font-bold mt-1 text-xs">
            Est. Value: {formatIndianRupees(pt.estimated_price)}
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
          Estimated residual value over 7 manufacturing model years
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="deprecColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
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
            <Area
              type="monotone"
              dataKey="estimated_price"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#deprecColor)"
              dot={(props) => {
                const isSelected = props.payload.year === currentYear;
                return (
                  <circle
                    key={props.payload.year}
                    cx={props.cx}
                    cy={props.cy}
                    r={isSelected ? 5 : 3.5}
                    fill={isSelected ? '#34d399' : '#10b981'}
                    stroke={isSelected ? '#ffffff' : '#047857'}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
