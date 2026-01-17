import { useState } from "react";
import Configurator from "./Configurator";
import RackBuilder from "./RackBuilder";

export default function DigitalTwin({ privateDcData, setPrivateDcData }) {
  return (
    <div className="grid grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
      {/* Configuration Panel */}
      <section className="col-span-12 lg:col-span-4 bg-black/40 rounded-3xl border border-white/5 overflow-y-auto custom-scrollbar backdrop-blur-sm p-6">
        <h3 className="text-white font-medium text-lg mb-6 tracking-tight flex items-center gap-2">
          <span className="w-1 h-6 bg-finops-accent rounded-full" />
          Configuration
        </h3>
        <Configurator data={privateDcData} onChange={setPrivateDcData} />
      </section>

      {/* 3D Rack Visualization */}
      <section className="col-span-12 lg:col-span-8 h-[600px] lg:h-auto bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)] opacity-50" />

        <RackBuilder clusters={privateDcData.clusters} utilization={75} />

        {/* Status Indicator (Moved to Top Right) */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full border border-white/10 backdrop-blur-md z-20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-finops-muted font-medium">
            System Nominal
          </span>
        </div>

        {/* Overlay Metrics (Moved to Bottom Right) */}
        <div className="absolute bottom-8 right-8 z-10 pointer-events-none text-right">
          <h3 className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-2">
            Live Diagram
          </h3>
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <span className="text-4xl font-bold text-white leading-none">
              {privateDcData.rackCount}
            </span>
            <span className="text-xs text-finops-muted uppercase tracking-wider font-bold text-left w-16 leading-tight">
              Active Racks
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
