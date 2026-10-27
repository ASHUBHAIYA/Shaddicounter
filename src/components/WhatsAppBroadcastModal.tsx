import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Users, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { Guest, WeddingSettings } from '../types';
import { WHATSAPP_TEMPLATES } from '../data/mockData';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  settings: WeddingSettings;
  onMarkReminded: (guestId: string) => void;
  onMarkAllReminded: (guestIds: string[]) => void;
}

export const WhatsAppBroadcastModal: React.FC<WhatsAppBroadcastModalProps> = ({
  isOpen,
  onClose,
  guests,
  settings,
  onMarkReminded,
  onMarkAllReminded,
}) => {
  if (!isOpen) return null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('warm-family');
  const [selectedGuestId, setSelectedGuestId] = useState<string>(
    guests.find((g) => g.status === 'pending' || g.status === 'tentative')?.id || guests[0]?.id || ''
  );
  const [filterType, setFilterType] = useState<'pending' | 'tentative' | 'all'>('pending');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];
  const template = WHATSAPP_TEMPLATES.find((t) => t.id === selectedTemplateId) || WHATSAPP_TEMPLATES[0];

  // Target guests based on filter
  const targetGuests = guests.filter((g) => {
    if (filterType === 'pending') return g.status === 'pending';
    if (filterType === 'tentative') return g.status === 'tentative';
    return true;
  });

  const generateLink = (guest: Guest) => {
    return `https://shaadicount.in/rsvp/${guest.id}`;
  };

  const messageText = selectedGuest
    ? template.body(
        selectedGuest.name,
        settings.groomName,
        settings.brideName,
        settings.weddingDate,
        generateLink(selectedGuest)
      )
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSingleWhatsApp = () => {
    if (!selectedGuest) return;
    const cleanPhone = selectedGuest.phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onMarkReminded(selectedGuest.id);
  };

  const handleRemindAllInBatch = () => {
    const ids = targetGuests.map((g) => g.id);
    onMarkAllReminded(ids);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-2xl shadow-2xl max-w-3xl w-full border border-amber-300/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#780016] to-[#8B1D2C] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-wedding text-lg font-bold text-amber-100">
                WhatsApp Polite RSVP Reminder Simulator
              </h3>
              <p className="text-xs text-amber-200/80">
                Personalized culturally graceful messages to reduce Indian wedding food waste
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Step 1: Select Template */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              1. Choose Pre-Drafted Culturally Nuanced Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {WHATSAPP_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedTemplateId === tmpl.id
                      ? 'border-[#780016] bg-amber-50/80 ring-1 ring-[#780016]'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900 inline-block mb-1.5">
                    {tmpl.language}
                  </div>
                  <div className="text-xs font-bold text-stone-900 line-clamp-2">
                    {tmpl.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Recipient Selection */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Select Recipient to Preview Message
              </label>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-stone-500 font-medium mr-1">Target:</span>
                <button
                  onClick={() => setFilterType('pending')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                    filterType === 'pending'
                      ? 'bg-[#780016] text-white'
                      : 'bg-white border text-stone-600'
                  }`}
                >
                  Pending ({guests.filter((g) => g.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilterType('tentative')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                    filterType === 'tentative'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white border text-stone-600'
                  }`}
                >
                  Tentative ({guests.filter((g) => g.status === 'tentative').length})
                </button>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                    filterType === 'all'
                      ? 'bg-stone-800 text-white'
                      : 'bg-white border text-stone-600'
                  }`}
                >
                  All ({guests.length})
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <select
                value={selectedGuestId}
                onChange={(e) => setSelectedGuestId(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-lg p-2 font-semibold text-stone-800 outline-none"
              >
                {targetGuests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.phone}) — {g.status.toUpperCase()} [{g.adults + g.kids} Pax] • Reminders: {g.reminderSentCount}
                  </option>
                ))}
              </select>

              {selectedGuest && (
                <div className="shrink-0 text-xs text-stone-600">
                  Last Reminded: <strong className="text-stone-900">{selectedGuest.lastReminderAt || 'Never'}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Live Message Preview (WhatsApp Chat Bubble style) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              WhatsApp Message Preview
            </label>
            <div className="bg-[#EFEAE2] p-4 rounded-xl border border-stone-300 shadow-inner">
              <div className="max-w-md bg-white rounded-lg p-3.5 shadow-sm text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans border-l-4 border-emerald-600">
                {messageText}
                <div className="text-right text-[10px] text-stone-400 mt-2 font-mono">
                  10:30 AM • Delivered ✓✓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleRemindAllInBatch}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold transition"
              title="Mark all targeted guests as reminded"
            >
              Mark Batch as Reminded ({targetGuests.length})
            </button>
          </div>

          <button
            onClick={handleSendSingleWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition"
          >
            <Send className="w-4 h-4" />
            <span>Open WhatsApp for {selectedGuest?.name.split(' ')[0] || 'Guest'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
