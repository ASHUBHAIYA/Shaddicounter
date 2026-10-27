import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingDown, 
  MessageSquare, 
  Search, 
  Plus, 
  Edit3, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Printer, 
  Check, 
  HelpCircle, 
  Share2 
} from 'lucide-react';
import { Guest, GuestStatus, WeddingSettings, WeddingSide } from '../types';
import { WHATSAPP_TEMPLATES } from '../data/mockData';

interface PlannerDashboardProps {
  guests: Guest[];
  settings: WeddingSettings;
  onUpdateGuest: (updatedGuest: Guest) => void;
  onAddNewGuest: (guestData: Partial<Guest>) => void;
  onDeleteGuest: (guestId: string) => void;
  onOpenBroadcastModal: () => void;
  onOpenCatererSheet: () => void;
  onOpenSettings: () => void;
  onOpenShareModal: () => void;
  onSelectGuestToRSVP: (guestId: string) => void;
}

export const PlannerDashboard: React.FC<PlannerDashboardProps> = ({
  guests,
  settings,
  onUpdateGuest,
  onAddNewGuest,
  onDeleteGuest,
  onOpenBroadcastModal,
  onOpenCatererSheet,
  onOpenSettings,
  onOpenShareModal,
  onSelectGuestToRSVP,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GuestStatus>('all');
  const [sideFilter, setSideFilter] = useState<'all' | WeddingSide>('all');

  // KPI Calculations
  const sumOfAllGuestsPax = guests.reduce((sum, g) => sum + g.adults + g.kids, 0);
  const totalInvitedPax = Math.max(sumOfAllGuestsPax, 400);

  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const confirmedPax = confirmedGuests.reduce((sum, g) => sum + g.adults + g.kids, 0);
  const confirmedAdults = confirmedGuests.reduce((sum, g) => sum + g.adults, 0);
  const confirmedKids = confirmedGuests.reduce((sum, g) => sum + g.kids, 0);

  const declinedGuests = guests.filter((g) => g.status === 'declined');
  const declinedPax = declinedGuests.reduce((sum, g) => {
    return sum + (g.adults + g.kids > 0 ? g.adults + g.kids : 2);
  }, 0);

  const tentativeGuests = guests.filter((g) => g.status === 'tentative');
  const tentativePax = tentativeGuests.reduce((sum, g) => sum + g.adults + g.kids, 0);

  const pendingGuests = guests.filter((g) => g.status === 'pending');
  const pendingPax = pendingGuests.reduce((sum, g) => sum + g.adults + g.kids, 0);

  const totalUnconfirmedPax = tentativePax + pendingPax;

  // Catering Savings
  const platesAverted = Math.max(0, totalInvitedPax - confirmedPax);
  const cateringSavings = platesAverted * settings.plateCost;

  // Buffer preparation
  const bufferPlates = Math.round((confirmedPax * settings.bufferPercent) / 100);
  const recommendedPrepPlates = confirmedPax + bufferPlates;

  // Filtered Guests list
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery) ||
      g.relation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    const matchesSide = sideFilter === 'all' || g.side === sideFilter;

    return matchesSearch && matchesStatus && matchesSide;
  });

  const handleQuickWhatsAppReminder = (guest: Guest) => {
    const template = WHATSAPP_TEMPLATES[0];
    const cleanPhone = guest.phone.replace(/[^0-9]/g, '');
    const rsvpLink = `https://shaadicount.in/rsvp/${guest.id}`;
    const text = template.body(
      guest.name,
      settings.groomName,
      settings.brideName,
      settings.weddingDate,
      rsvpLink
    );
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    onUpdateGuest({
      ...guest,
      reminderSentCount: guest.reminderSentCount + 1,
      lastReminderAt: 'Just now',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Side', 'Relation', 'Phone', 'Status', 'Total Pax', 'Adults', 'Kids', 'Reminders Sent'];
    const rows = guests.map((g) => [
      `"${g.name}"`,
      `"${g.side}"`,
      `"${g.relation}"`,
      `"${g.phone}"`,
      `"${g.status}"`,
      g.adults + g.kids,
      g.adults,
      g.kids,
      g.reminderSentCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShaadiCount_${settings.groomName}_${settings.brideName}_RSVP.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-7">
      {/* Hero Welcome Card */}
      <div className="relative bg-gradient-to-r from-[#590817] via-[#730D23] to-[#4A0613] rounded-3xl p-6 sm:p-8 text-[#FAF7F2] shadow-xl border border-amber-300/30 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-serif-wedding tracking-widest uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Cloud RSVP & Catering Control</span>
          </div>
          <h2 className="font-serif-wedding text-2xl sm:text-3xl font-extrabold text-amber-100 tracking-wide">
            {settings.groomName} & {settings.brideName}’s Wedding Reception
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1.5 max-w-2xl">
            {settings.weddingDate} • {settings.venueName} • Plate Cost: ₹{settings.plateCost.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Share & Invite Button */}
          <button
            onClick={onOpenShareModal}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#DFC07A] hover:to-[#D4AF37] text-[#3D040F] text-xs sm:text-sm font-bold shadow-md transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share & Invite Link</span>
          </button>

          <button
            onClick={onOpenBroadcastModal}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Reminders</span>
          </button>

          <button
            onClick={onOpenCatererSheet}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-300/30 text-xs sm:text-sm font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Caterer Sheet</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-300/30 text-xs transition"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Invited */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-stone-200/90 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Invited</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-stone-900 font-serif-wedding">
              {totalInvitedPax} <span className="text-sm font-sans text-stone-500 font-medium">Pax</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-1">Invited Guest Capacity</div>
          </div>
        </div>

        {/* Confirmed Attending */}
        <div className="bg-emerald-50/70 rounded-3xl p-5 shadow-xs border border-emerald-300 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Confirmed Attending</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-950 font-serif-wedding">
              {confirmedPax} <span className="text-sm font-sans text-emerald-700 font-medium">Pax</span>
            </div>
            <div className="text-[11px] text-emerald-800 font-medium mt-1">
              {confirmedAdults} Adults + {confirmedKids} Kids
            </div>
          </div>
        </div>

        {/* Regrets / Declined */}
        <div className="bg-rose-50/70 rounded-3xl p-5 shadow-xs border border-rose-300 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-rose-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Regrets / Declined</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-rose-950 font-serif-wedding">
              {declinedPax} <span className="text-sm font-sans text-rose-700 font-medium">Pax</span>
            </div>
            <div className="text-[11px] text-rose-700 mt-1">{declinedGuests.length} Families Can't Attend</div>
          </div>
        </div>

        {/* Pending / Tentative */}
        <div className="bg-amber-50/70 rounded-3xl p-5 shadow-xs border border-amber-300 flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending / Tentative</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-950 font-serif-wedding">
              {totalUnconfirmedPax} <span className="text-sm font-sans text-amber-800 font-medium">Pax</span>
            </div>
            <div className="text-[11px] text-amber-800 mt-1">{pendingGuests.length} Pending • {tentativeGuests.length} Tentative</div>
          </div>
        </div>

        {/* Estimated Catering Savings */}
        <div className="bg-gradient-to-br from-[#590817] to-[#3D040F] text-amber-100 rounded-3xl p-5 shadow-md border border-amber-400/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Catering Savings</span>
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              ₹{settings.plateCost}/plate
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-100 font-serif-wedding">
              ₹{cateringSavings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-200/80 mt-1">
              Saved from prevented plate wastage
            </div>
          </div>
        </div>
      </div>

      {/* Caterer Guarantee & Safety Buffer Summary */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#996515] p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#FAF7F2] rounded-[14px] flex items-center justify-center text-[#590817]">
              <Sparkles className="w-6 h-6 text-[#730D23]" />
            </div>
          </div>
          <div>
            <h4 className="font-serif-wedding font-bold text-stone-900 text-sm sm:text-base">
              Recommended Caterer Plate Count Guarantee
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Lock final order at <strong className="text-stone-900">{recommendedPrepPlates} Plates</strong> ({confirmedPax} confirmed + {bufferPlates} safety buffer of {settings.bufferPercent}%) to prevent food waste while ensuring no shortage.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="shrink-0 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#590817] font-semibold text-xs border border-amber-300 transition"
        >
          Adjust Buffer ({settings.bufferPercent}%) & Cost
        </button>
      </div>

      {/* Master Guest List Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-stone-200 overflow-hidden">
        {/* Table Filter Strip */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#FAF7F2]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest or family name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#730D23] outline-none"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto text-xs pb-1 sm:pb-0">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'tentative', label: 'Tentative' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'declined', label: 'Declined' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? 'bg-[#590817] text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value as any)}
              className="text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 font-medium text-stone-700 outline-none"
            >
              <option value="all">All Sides</option>
              <option value="Groom">Groom's Side</option>
              <option value="Bride">Bride's Side</option>
              <option value="Common">Common</option>
            </select>

            <button
              onClick={() => onAddNewGuest({})}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#590817] hover:bg-[#420511] text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Guest / Family</th>
                <th className="py-3 px-4">Side & Circle</th>
                <th className="py-3 px-4 text-center">RSVP Status</th>
                <th className="py-3 px-4 text-center">Pax (Guests)</th>
                <th className="py-3 px-4 text-center">WhatsApp Reminder</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => {
                  const totalGuestPax = guest.adults + guest.kids;
                  return (
                    <tr key={guest.id} className="hover:bg-amber-50/30 transition">
                      {/* Name & Phone */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-stone-900">{guest.name}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{guest.phone}</div>
                      </td>

                      {/* Side & Relation */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-0.5 ${
                          guest.side === 'Groom'
                            ? 'bg-blue-100 text-blue-800'
                            : guest.side === 'Bride'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {guest.side}
                        </span>
                        <div className="text-xs text-stone-600">{guest.relation}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                          guest.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : guest.status === 'tentative'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : guest.status === 'declined'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}>
                          {guest.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {guest.status === 'tentative' && <HelpCircle className="w-3 h-3 text-amber-600" />}
                          {guest.status === 'declined' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {guest.status === 'pending' && <Clock className="w-3 h-3 text-stone-500" />}
                          <span>{guest.status}</span>
                        </span>
                      </td>

                      {/* Pax */}
                      <td className="py-3.5 px-4 text-center">
                        {guest.status === 'declined' ? (
                          <span className="text-stone-400">0 Pax</span>
                        ) : (
                          <div>
                            <span className="font-extrabold text-stone-900 text-sm">
                              {totalGuestPax} Pax
                            </span>
                            <div className="text-[10px] text-stone-500">
                              {guest.adults} Adults{guest.kids > 0 ? `, ${guest.kids} Kids` : ''}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* WhatsApp Reminder */}
                      <td className="py-3.5 px-4 text-center">
                        {guest.reminderSentCount > 0 ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Sent ({guest.reminderSentCount})</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">Not sent yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleQuickWhatsAppReminder(guest)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectGuestToRSVP(guest.id)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition"
                            title="Open RSVP Portal for this guest"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onAddNewGuest(guest)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                            title="Edit Guest"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No guests match the current search & filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <div>
            Showing <strong className="text-stone-800">{filteredGuests.length}</strong> of{' '}
            <strong className="text-stone-800">{guests.length}</strong> guest entries
          </div>
          <div className="flex items-center space-x-3">
            <span>Confirmed: <strong className="text-emerald-700">{confirmedPax} Pax</strong></span>
            <span>•</span>
            <span>Pending/Tentative: <strong className="text-amber-800">{totalUnconfirmedPax} Pax</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
