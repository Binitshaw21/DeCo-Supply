import { useMemo } from "react";
import { LogEntry, VendorData } from "../types";
import { TrendingDown, ShieldAlert, Check } from "lucide-react";

interface BiddingProgressChartProps {
  logs: LogEntry[];
  vendorA: VendorData;
  vendorB: VendorData;
  targetUnitPrice: number;
  isNegotiating: boolean;
}

export default function BiddingProgressChart({
  logs,
  vendorA,
  vendorB,
  targetUnitPrice,
  isNegotiating,
}: BiddingProgressChartProps) {
  // Extract and compute the points from logs
  const chartData = useMemo(() => {
    // Start with catalogs
    const dataPoints: {
      round: number;
      label: string;
      vA: number;
      vB: number;
    }[] = [
      { round: 0, label: "Catalog", vA: vendorA.publicPrice, vB: vendorB.publicPrice },
    ];

    // Find first proposals (Round 1)
    const r1_vA = logs.find(l => l.actor === "vendor_a" && l.id === "3")?.meta?.unitPrice;
    const r1_vB = logs.find(l => l.actor === "vendor_b" && l.id === "5")?.meta?.unitPrice;

    if (r1_vA !== undefined || r1_vB !== undefined) {
      dataPoints.push({
        round: 1,
        label: "Round 1",
        vA: r1_vA !== undefined ? r1_vA : vendorA.publicPrice,
        vB: r1_vB !== undefined ? r1_vB : vendorB.publicPrice,
      });
    }

    // Find final proposals (Round 2)
    const r2_vA = logs.find(l => l.actor === "vendor_a" && l.id === "9" && !l.id.includes("err"))?.meta?.unitPrice;
    const r2_vB = logs.find(l => l.actor === "vendor_b" && l.id === "11" && !l.id.includes("err"))?.meta?.unitPrice;

    // Also check if they walked away (err logs)
    const r2_vA_err = logs.find(l => l.actor === "vendor_a" && l.id === "9_err");
    const r2_vB_err = logs.find(l => l.actor === "vendor_b" && l.id === "11_err");

    if (r2_vA !== undefined || r2_vB !== undefined || r2_vA_err || r2_vB_err) {
      dataPoints.push({
        round: 2,
        label: "Final",
        vA: r2_vA !== undefined ? r2_vA : (r2_vA_err ? r1_vA || vendorA.publicPrice : r1_vA || vendorA.publicPrice),
        vB: r2_vB !== undefined ? r2_vB : (r2_vB_err ? r1_vB || vendorB.publicPrice : r1_vB || vendorB.publicPrice),
      });
    }

    return dataPoints;
  }, [logs, vendorA, vendorB]);

  // Dimension sizing for responsive SVG
  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Determine pricing scale
  const pricesList = [
    vendorA.publicPrice,
    vendorB.publicPrice,
    vendorA.minPrice,
    vendorB.minPrice,
    targetUnitPrice,
    ...chartData.map(d => d.vA),
    ...chartData.map(d => d.vB),
  ];

  const maxPrice = Math.max(...pricesList) * 1.05;
  const minPrice = Math.max(0, Math.min(...pricesList) * 0.92);

  // Price coordinate mapper
  const getX = (round: number, totalPoints: number) => {
    if (totalPoints <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (round / 2) * chartWidth;
  };

  const getY = (price: number) => {
    const scale = (price - minPrice) / (maxPrice - minPrice);
    return paddingTop + chartHeight - scale * chartHeight;
  };

  // Generate grid markers
  const yGridLines = useMemo(() => {
    const lines = [];
    const step = (maxPrice - minPrice) / 4;
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + step * i;
      lines.push(Math.round(price));
    }
    return lines;
  }, [minPrice, maxPrice]);

  // Generate SVG path coordinate strings
  const vAPath = useMemo(() => {
    if (chartData.length === 0) return "";
    return chartData
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(d.round, 3)} ${getY(d.vA)}`)
      .join(" ");
  }, [chartData, maxPrice, minPrice]);

  const vBPath = useMemo(() => {
    if (chartData.length === 0) return "";
    return chartData
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(d.round, 3)} ${getY(d.vB)}`)
      .join(" ");
  }, [chartData, maxPrice, minPrice]);

  const activeWinner = useMemo(() => {
    const isSettled = logs.some(l => l.type === "agreement");
    if (!isSettled) return null;
    const finalLog = logs.find(l => l.type === "agreement");
    if (!finalLog) return null;
    return finalLog.message.toLowerCase().includes(vendorA.name.toLowerCase()) ? "vendor_a" : "vendor_b";
  }, [logs, vendorA, vendorB]);

  return (
    <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4.5 space-y-3 shadow-inner relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <div className="flex items-center gap-1.5 font-mono">
          <TrendingDown className="w-6 h-6 text-emerald-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Dynamic Bidding Graph</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-slate-400">{vendorA.name.split(" ")[0]}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">{vendorB.name.split(" ")[0]}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 border-t border-dashed border-amber-500"></span>
            <span className="text-slate-400">Target</span>
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {yGridLines.map((price, i) => {
            const y = getY(price);
            return (
              <g key={i} className="opacity-25">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  ${price.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          <g className="opacity-50">
            <text x={getX(0, 3)} y={height - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Catalog</text>
            <text x={getX(1, 3)} y={height - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Round 1</text>
            <text x={getX(2, 3)} y={height - 15} textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Final</text>
          </g>

          {/* Horizontal Line for Target Price */}
          <g>
            <line
              x1={paddingLeft}
              y1={getY(targetUnitPrice)}
              x2={width - paddingRight}
              y2={getY(targetUnitPrice)}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              className="opacity-70"
            />
            <rect
              x={width - paddingRight - 85}
              y={getY(targetUnitPrice) - 8}
              width="80"
              height="15"
              rx="3"
              fill="#78350f"
              stroke="#d97706"
              strokeWidth="1"
              className="opacity-90"
            />
            <text
              x={width - paddingRight - 45}
              y={getY(targetUnitPrice) + 2}
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Target: ${targetUnitPrice}
            </text>
          </g>

          {/* Solid line curves */}
          {/* Vendor A Path */}
          {vAPath && (
            <path
              d={vAPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Vendor B Path */}
          {vBPath && (
            <path
              d={vBPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* Data nodes */}
          {chartData.map((d, i) => {
            const x = getX(d.round, 3);
            const yA = getY(d.vA);
            const yB = getY(d.vB);

            const isWinnerA = d.round === 2 && activeWinner === "vendor_a";
            const isWinnerB = d.round === 2 && activeWinner === "vendor_b";

            return (
              <g key={i}>
                {/* Vendor A points */}
                <circle
                  cx={x}
                  cy={yA}
                  r={isWinnerA ? "6" : "4"}
                  fill={isWinnerA ? "#fda4af" : "#f43f5e"}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  className="cursor-pointer hover:r-7 transition-all"
                />
                {isWinnerA && (
                  <circle cx={x} cy={yA} r="10" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" />
                )}

                {/* Vendor B points */}
                <circle
                  cx={x}
                  cy={yB}
                  r={isWinnerB ? "6" : "4"}
                  fill={isWinnerB ? "#6ee7b7" : "#10b981"}
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  className="cursor-pointer hover:r-7 transition-all"
                />
                {isWinnerB && (
                  <circle cx={x} cy={yB} r="10" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic State Overlay Cards */}
        {isNegotiating && chartData.length === 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30 backdrop-blur-[1px] rounded-lg">
            <div className="bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-center shadow-lg flex items-center gap-2 font-mono">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              <span className="text-[10px] text-slate-300">Evaluating Round 1 secret boundaries...</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Vendor A Limits display card */}
        <div className="bg-slate-950 border border-slate-900 rounded-lg p-2 font-mono text-[9px] relative">
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></div>
          <span className="block text-slate-500 font-bold uppercase tracking-wider">{vendorA.name.split(" ")[0]} Cell Status</span>
          <div className="flex justify-between mt-1 text-slate-400">
            <span>Public: ${vendorA.publicPrice}</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400">Floor: $*** (Hidden)</span>
          </div>
        </div>

        {/* Vendor B Limits display card */}
        <div className="bg-slate-950 border border-slate-900 rounded-lg p-2 font-mono text-[9px] relative">
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="block text-slate-500 font-bold uppercase tracking-wider">{vendorB.name.split(" ")[0]} Cell Status</span>
          <div className="flex justify-between mt-1 text-slate-400">
            <span>Public: ${vendorB.publicPrice}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">Floor: $*** (Hidden)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
