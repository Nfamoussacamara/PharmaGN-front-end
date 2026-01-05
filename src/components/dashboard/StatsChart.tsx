import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/utils/format';

interface DataPoint {
    label: string;
    value: number;
}

interface StatsChartProps {
    data: DataPoint[];
    title: string;
    color?: string;
    height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white tracking-tight">
                    {formatPrice(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export const StatsChart: React.FC<StatsChartProps> = ({
    data,
    title,
    color = "#10b981",
    height = 240
}) => {
    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-500 group">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                        Revenus <span className="text-slate-400">7j</span>
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50">
                        <span className="animate-pulse inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        +12.5%
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">vs semaine dern.</span>
                </div>
            </div>

            <div style={{ width: '100%', height: height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            strokeWidth={1}
                        />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
