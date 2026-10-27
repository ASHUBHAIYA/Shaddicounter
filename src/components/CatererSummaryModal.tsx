import React from 'react';
import { 
  X, 
  Printer, 
  UtensilsCrossed, 
  Calendar, 
  MapPin,
  TrendingDown,
  Users,
  ShieldCheck
} from 'lucide-react';
import { Guest, WeddingSettings } from '../types';

interface CatererSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  settings: WeddingSettings;
  totalConfirmedPax: number;
  totalVegPax: number;
  totalNonVegPax: number;
  cateringSavings: number;
}

export const CatererSummaryModal: React.FC<CatererSummaryModalProps> = ({
  isOpen,
  onClose,
  guests,
  settings,
  totalConfirmedPax,
  cateringSavings,
}) => {
  if (!isOpen) return null;

  const bufferPax = Math.round((totalConfirmedPax * settings.bufferPercent) / 100);
  const recommendedPrepPax = totalConfirmedPax + bufferPax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl shadow-2xl max-w-2xl w-full border border-amber-300/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="bg-[#590817] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <UtensilsCrossed className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-wedding text-base font-bold text-amber-100">
              Halwai & Caterer Headcount Handover Sheet
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#420511] text-xs font-bold shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800 print:p-0">
          <div className="border-b-2 border-stone-800 pb-4 text-center">
            <span className="font-serif-wedding text-[11px] font-bold tracking-widest text-[#590817] uppercase">
              Catering Production & Plate Guarantee
            </span>
            <h2 className="font-serif-wedding text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {settings.groomName} & {settings.brideName}’s Royal Wedding
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-600 mt-2">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#590817]" />
                <span>{settings.weddingDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#590817]" />
                <span>{settings.venueName}</span>
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Confirmed Pax
              </span>
              <span className="text-3xl font-extrabold text-stone-900 block mt-1">
                {totalConfirmedPax}
              </span>
              <span className="text-[10px] text-stone-500">Live RSVP Verified</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-center">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Safety Buffer ({settings.bufferPercent}%)
              </span>
              <span className="text-3xl font-extrabold text-amber-950 block mt-1">
                +{bufferPax}
              </span>
              <span className="text-[10px] text-amber-800 font-medium">Extra contingency</span>
            </div>

            <div className="p-4 bg-[#590817]/10 rounded-2xl border border-[#590817]/30 text-center">
              <span className="text-[11px] font-bold text-[#590817] uppercase tracking-wider block">
                Total Prep Order
              </span>
              <span className="text-3xl font-extrabold text-[#590817] block mt-1">
                {recommendedPrepPax}
              </span>
              <span className="text-[10px] text-stone-600 font-medium">Plates to prepare</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
            <span className="font-semibold">Prevented Plate Wastage Savings:</span>
            <strong className="text-base text-emerald-800">₹{cateringSavings.toLocaleString('en-IN')}</strong>
          </div>

          {/* Sign-Off */}
          <div className="pt-6 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs text-stone-600">
            <div>
              <p className="font-semibold text-stone-800">Wedding Host Sign-Off:</p>
              <div className="h-12 border-b border-stone-300 mt-2"></div>
            </div>
            <div>
              <p className="font-semibold text-stone-800">Catering Manager Sign-Off:</p>
              <div className="h-12 border-b border-stone-300 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
