'use client';

import { useState } from 'react';

interface ChartDataPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

interface NativeFinancialChartProps {
  data?: ChartDataPoint[];
}

export default function NativeFinancialChart({ data: dataProp }: NativeFinancialChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getLast7Months = () => {
    const months = [];
    const date = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      months.push(d.toLocaleString('id-ID', { month: 'short' }));
    }
    return months;
  };

  const labels = getLast7Months();

  const dummyData: ChartDataPoint[] = [
    { month: labels[0], pemasukan: 3500000, pengeluaran: 2100000 },
    { month: labels[1], pemasukan: 4200000, pengeluaran: 2800000 },
    { month: labels[2], pemasukan: 3800000, pengeluaran: 3100000 },
    { month: labels[3], pemasukan: 5000000, pengeluaran: 2500000 },
    { month: labels[4], pemasukan: 4700000, pengeluaran: 3900000 },
    { month: labels[5], pemasukan: 5500000, pengeluaran: 3000000 },
    { month: labels[6], pemasukan: 6100000, pengeluaran: 2700000 },
  ];

  const data = dataProp && dataProp.length > 0 ? dataProp : dummyData;

  const width = 500;
  const height = 220;
  const paddingX = 35;
  const paddingTop = 30;
  const paddingBottom = 40;

  const allValues = data.flatMap(d => [d.pemasukan, d.pengeluaran]);
  const maxValue = Math.max(...allValues, 1000000);

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  const getY = (value: number) => {
    const usableHeight = height - paddingTop - paddingBottom;
    return height - paddingBottom - (value / maxValue) * usableHeight;
  };

  const incomePath = `M ${data.map((d, i) => `${getX(i)},${getY(d.pemasukan)}`).join(' L ')}`;
  const expensePath = `M ${data.map((d, i) => `${getX(i)},${getY(d.pengeluaran)}`).join(' L ')}`;

  return (
    <div className=" p-6 rounded-2xl text-white w-full">
      {/* SVG */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          {[0, 0.5, 1].map((ratio, idx) => {
            const yPos = height - paddingBottom - ratio * (height - paddingTop - paddingBottom);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={yPos}
                x2={width - paddingX}
                y2={yPos}
                stroke="#ffffff"
                strokeOpacity="0.06"
                strokeDasharray="4 4"
              />
            );
          })}

          <path d={incomePath} fill="none" stroke="#2EC4B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={expensePath} fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {data.map((item, idx) => {
            const cx = getX(idx);
            const cyIncome = getY(item.pemasukan);
            const cyExpense = getY(item.pengeluaran);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={idx}>
                <rect
                  x={cx - 15}
                  y={0}
                  width="30"
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingTop}
                    x2={cx}
                    y2={height - paddingBottom}
                    stroke="#ffffff"
                    strokeOpacity="0.2"
                    strokeDasharray="2 2"
                  />
                )}

                <circle cx={cx} cy={cyIncome} r={isHovered ? "6" : "4"} fill="#2EC4B6" stroke="#2EC4B6" strokeWidth="2.5" className="transition-all duration-200 pointer-events-none" />
                <circle cx={cx} cy={cyExpense} r={isHovered ? "6" : "4"} fill="#EF4444" stroke="#EF4444" strokeWidth="2.5" className="transition-all duration-200 pointer-events-none" />
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && (
          <div
            className="absolute -top-12 bg-[#121824] border border-gray-700 text-xs p-2.5 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 transition-all duration-150 z-10 min-w-36"
            style={{ left: `${(hoveredIndex / (data.length - 1)) * 100}%` }}
          >
            <div className="font-semibold text-gray-300 border-b border-gray-700/60 pb-1 mb-1.5">
              Bulan {data[hoveredIndex].month}
            </div>
            <div className="flex items-center justify-between gap-3 text-[#2EC4B6]">
              <span>Masuk:</span>
              <span className="font-bold">Rp {data[hoveredIndex].pemasukan.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[#EF4444]">
              <span>Keluar:</span>
              <span className="font-bold">Rp {data[hoveredIndex].pengeluaran.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400 px-1 font-medium">
        {data.map((item, idx) => (
          <span key={idx} className={hoveredIndex === idx ? 'text-white font-bold' : ''}>
            {item.month}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6]"></span>
            <span className="text-gray-300">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
            <span className="text-gray-300">Pengeluaran</span>
          </div>
        </div>
      </div>
    </div>
  );
}