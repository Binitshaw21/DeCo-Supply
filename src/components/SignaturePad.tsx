import React, { useRef, useState, useEffect } from "react";
import { PenTool, Trash2, Check, Lock } from "lucide-react";

interface SignaturePadProps {
  onSignStatusChange: (isSigned: boolean) => void;
  poId: string;
}

export default function SignaturePad({ onSignStatusChange, poId }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Initialize and size the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on CSS layout bounding
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Apply high-end canvas graphics settings
    ctx.strokeStyle = "#38bdf8"; // cyan-sky blue
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Clear and draw background instructions
    clearCanvas();
  }, [poId]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Handle touch vs mouse coordinates
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (!isSigned) {
      setIsSigned(true);
      onSignStatusChange(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw signature guideline dashed line
    ctx.strokeStyle = "rgba(71, 85, 105, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 35);
    ctx.lineTo(canvas.width - 20, canvas.height - 35);
    ctx.stroke();

    // Reset settings back to ink brush
    ctx.strokeStyle = "#0ea5e9"; // Bright ocean blue
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]); // clear dash

    setIsSigned(false);
    onSignStatusChange(false);
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
          <PenTool className="w-5 h-5 text-emerald-400" />
          Secure Digital Signature Pad
        </span>
        <button
          onClick={clearCanvas}
          className="text-slate-500 hover:text-slate-300 hover:bg-slate-900 p-1 rounded transition-colors cursor-pointer"
          title="Reset Signature"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="relative h-28 bg-[#040406] border border-slate-900/60 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Dynamic Watermark details */}
        {!isSigned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-40">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Sign with Cursor/Touch to Authorize</span>
            <span className="text-[8px] font-mono text-slate-600 uppercase mt-1">PO KEY ID: {poId}</span>
          </div>
        )}

        {isSigned && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[9px] font-mono text-emerald-400 font-bold uppercase select-none pointer-events-none">
            <Check className="w-4 h-4" />
            Signed Verified
          </div>
        )}

        {/* Signature Line Marker Label */}
        <span className="absolute bottom-2 left-5 text-[8px] font-mono text-slate-500 uppercase pointer-events-none select-none">
          X - Procurement Officer Authorization
        </span>
      </div>

      <p className="text-[8.5px] font-mono text-slate-500 leading-normal">
        By signing, you commit this purchase order transaction block hash to the zero-knowledge distributed consensus ledger.
      </p>
    </div>
  );
}
