import React, { useState } from 'react';
import { X, Settings2, IndianRupee, Percent, Calendar, MapPin, Phone } from 'lucide-react';
import { WeddingSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WeddingSettings;
  onSaveSettings: (settings: WeddingSettings) => void;
  totalInvitedPax: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  totalInvitedPax,
}) => {
  if (!isOpen) return null;

  const [groomName, setGroomName] = useState(settings.groomName);
  const [brideName, setBrideName] = useState(settings.brideName);
  const [weddingDate, setWeddingDate] = useState(settings.weddingDate);
  const [venueName, setVenueName] = useState(settings.venueName);
  const [venueAddress, setVenueAddress] = useState(settings.venueAddress);
  const [plateCost, setPlateCost] = useState(settings.plateCost);
  const [bufferPercent, setBufferPercent] = useState(settings.bufferPercent);
  const [hostPhone, setHostPhone] = useState(settings.hostPhone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      groomName,
      brideName,
      weddingDate,
      venueName,
      venueAddress,
      plateCost: Number(plateCost) || 1500,
      bufferPercent: Number(bufferPercent) || 10,
      hostPhone,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-2xl shadow-2xl max-w-lg w-full border border-amber-300/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#780016] text-[#FAF7F2] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif-wedding text-base font-bold text-amber-100">
              Catering Economics & Wedding Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Couple Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Groom's Name
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-[#780016]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Bride's Name
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:ring-2 focus:ring-[#780016]"
              />
            </div>
          </div>

          {/* Catering Plate Cost & Buffer */}
          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-3">
            <div className="font-serif-wedding text-xs font-bold text-amber-950 uppercase tracking-wider">
              Catering Wastage & Cost Engine
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <IndianRupee className="w-3.5 h-3.5 text-[#780016]" />
                  <span>Plate Cost (₹ per plate)</span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  required
                  value={plateCost}
                  onChange={(e) => setPlateCost(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-bold text-stone-900"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">Standard Indian buffet plate</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Percent className="w-3.5 h-3.5 text-amber-700" />
                  <span>Safety Buffer Margin</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  required
                  value={bufferPercent}
                  onChange={(e) => setBufferPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-bold text-stone-900"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">Recommended 5% to 10%</span>
              </div>
            </div>
          </div>

          {/* Date & Venue */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Wedding Date
            </label>
            <input
              type="text"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
              Host WhatsApp Contact
            </label>
            <input
              type="text"
              value={hostPhone}
              onChange={(e) => setHostPhone(e.target.value)}
              placeholder="+919876543210"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#780016] hover:bg-[#590010] text-white rounded-xl font-bold text-xs shadow-sm transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
