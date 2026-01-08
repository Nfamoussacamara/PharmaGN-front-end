import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Loader } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface DataPoint {
    name: string;
    sales: number;
    revenue: number;
}

interface BestSellersChartProps {
    data?: DataPoint[];
    loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-sm font-black text-white tracking-tight">
                    {payload[0].value} ventes
                </p>
                <p className="text-[10px] font-bold text-emerald-400 tracking-tight mt-0.5">
                    {formatPrice(payload[0].payload.revenue)}
                </p>
            </div>
        );
    }
    return null;
};

export const BestSellersChart: React.FC<BestSellersChartProps> = ({
    data,
    loading = false
}) => {
    // Mock data si aucune donnée fournie
    const defaultData = [
        { name: 'Doliprane 1g', sales: 145, revenue: 45000 },
        { name: 'Efferalgan', sales: 120, revenue: 38000 },
        { name: 'Spasfon', sales: 98, revenue: 29000 },
        { name: 'Fervex', sales: 85, revenue: 22000 },
        { name: 'Advil 400', sales: 72, revenue: 18500 },
    ];

    const chartData = data || defaultData;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center bg-white rounded-[32px] border border-slate-100">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-500 group h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Trophy className="text-amber-500" size={16} />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Produits</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                        Meilleures Ventes
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            strokeWidth={1}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                            dy={15}
                            tickFormatter={(value) => value.split(' ')[0]} // Affiche seulement le premier mot si trop long
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                        />
                        <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                        <Bar
                            dataKey="sales"
                            radius={[8, 8, 8, 8]}
                            barSize={32}
                            animationDuration={1500}
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
