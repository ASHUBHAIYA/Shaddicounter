import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  LayoutDashboard, 
  Printer, 
  Settings2,
  TrendingDown,
  Calendar,
  MapPin,
  Share2
} from 'lucide-react';
import { WeddingSettings } from '../types';

interface NavbarProps {
  activeView: 'planner' | 'guest';
  setActiveView: (view: 'planner' | 'guest') => void;
  guestViewportMode: 'phone' | 'desktop';
  setGuestViewportMode: (mode: 'phone' | 'desktop') => void;
  settings: WeddingSettings;
  onOpenSettings: () => void;
  onOpenCatererSheet: () => void;
  onOpenShareModal: () => void;
  totalConfirmedPax: number;
  cateringSavings: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  guestViewportMode,
  setGuestViewportMode,
  settings,
  onOpenSettings,
  onOpenCatererSheet,
  onOpenShareModal,
  totalConfirmedPax,
  cateringSavings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#540817] text-[#FAF7F2] shadow-lg border-b border-[#D4AF37]/25 backdrop-blur-md">
      {/* Top Auspicious Status Bar */}
      <div className="bg-[#420511] px-4 sm:px-6 py-1.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between border-b border-amber-900/40">
        <div className="flex items-center space-x-2">
          <span className="font-serif-wedding text-amber-300 font-bold tracking-widest text-[11px]">
            || ॐ श्री गणेशाय नमः ||
          </span>
          <span className="hidden sm:inline text-amber-500/50">•</span>
          <span className="hidden sm:inline font-serif-wedding text-amber-100 tracking-wider text-[11px]">
            {settings.groomName} & {settings.brideName}’s Royal Wedding
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-emerald-300 font-medium bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>₹{cateringSavings.toLocaleString('en-IN')} Food Savings</span>
          </span>
          <span className="hidden md:inline text-amber-200/80 text-[11px]">
            Confirmed: <strong className="text-amber-100">{totalConfirmedPax} Pax</strong>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#996515] p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#540817] rounded-[10px] flex items-center justify-center text-amber-200 font-serif-wedding font-bold text-sm tracking-wider">
                SC
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-wedding text-lg font-bold tracking-wide text-amber-100">
                  ShaadiCount
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Cloud Live</span>
                </span>
              </div>
              <p className="text-[10px] text-amber-200/70 font-medium tracking-tight">
                Guest Headcount & Catering Optimization
              </p>
            </div>
          </div>

          {/* Quick mobile tools */}
          <div className="flex md:hidden items-center space-x-1.5">
            <button
              onClick={onOpenShareModal}
              className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-amber-950/50 text-amber-200 border border-amber-700/30"
              title="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenCatererSheet}
              className="p-1.5 rounded-lg bg-amber-400 text-amber-950 font-bold"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-[#3D040F] p-1 rounded-2xl border border-amber-400/20 shadow-inner w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveView('planner')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeView === 'planner'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#3D040F] shadow-sm font-bold'
                : 'text-amber-100/75 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Planner Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('guest')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeView === 'guest'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#3D040F] shadow-sm font-bold'
                : 'text-amber-100/75 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Guest RSVP Portal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="hidden md:flex items-center space-x-2">
          {activeView === 'guest' && (
            <div className="flex items-center bg-[#3D040F] rounded-xl p-0.5 border border-amber-700/40 text-xs">
              <button
                onClick={() => setGuestViewportMode('phone')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  guestViewportMode === 'phone'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-200/80 hover:text-white'
                }`}
              >
                Phone View
              </button>
              <button
                onClick={() => setGuestViewportMode('desktop')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  guestViewportMode === 'desktop'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-200/80 hover:text-white'
                }`}
              >
                Full Screen
              </button>
            </div>
          )}

          {/* Share & Invite Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Invite</span>
          </button>

          <button
            onClick={onOpenCatererSheet}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-300/30 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Caterer Sheet</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-amber-300 text-[#3D040F] text-xs font-bold transition shadow-xs"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
