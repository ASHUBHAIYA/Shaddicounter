import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Share2,
  Info,
  ArrowRight,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Guest, GuestStatus, WeddingSettings } from '../types';

interface GuestRSVPViewProps {
  guests: Guest[];
  settings: WeddingSettings;
  activeGuestId: string;
  setActiveGuestId: (id: string) => void;
  onUpdateGuest: (updatedGuest: Guest) => void;
  onAddNewGuest: (newGuest: Omit<Guest, 'id' | 'updatedAt' | 'reminderSentCount'>) => void;
  viewportMode: 'phone' | 'desktop';
}

export const GuestRSVPView: React.FC<GuestRSVPViewProps> = ({
  guests,
  settings,
  activeGuestId,
  setActiveGuestId,
  onUpdateGuest,
  viewportMode,
}) => {
  const currentGuest = guests.find((g) => g.id === activeGuestId) || guests[0];

  const [guestName, setGuestName] = useState(currentGuest ? currentGuest.name : '');
  const [phone, setPhone] = useState(currentGuest ? currentGuest.phone : '');
  const [status, setStatus] = useState<GuestStatus>(currentGuest ? currentGuest.status : 'confirmed');
  const [adults, setAdults] = useState<number>(currentGuest ? Math.max(1, currentGuest.adults) : 2);
  const [kids, setKids] = useState<number>(currentGuest ? currentGuest.kids : 0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (currentGuest) {
      setGuestName(currentGuest.name);
      setPhone(currentGuest.phone);
      setStatus(currentGuest.status === 'pending' ? 'confirmed' : currentGuest.status);
      setAdults(Math.max(1, currentGuest.adults));
      setKids(currentGuest.kids);
      setSubmitted(false);
    }
  }, [activeGuestId, currentGuest]);

  const totalPax = adults + kids;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#780016', '#F59E0B', '#10B981', '#E6C687'],
      });
    } catch {
      // ignore
    }
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalName = guestName.trim() || 'Guest Family';

    if (currentGuest) {
      onUpdateGuest({
        ...currentGuest,
        name: finalName,
        phone: phone || currentGuest.phone,
        status,
        adults: status === 'declined' ? 0 : adults,
        kids: status === 'declined' ? 0 : kids,
        updatedAt: new Date().toISOString(),
      });
    }

    setSubmitted(true);
    triggerCelebration();
  };

  const handleWhatsAppSubmit = () => {
    handleFormSubmit();
    const finalName = guestName.trim() || 'Guest Family';
    let msg = `🌸 *Wedding RSVP for ${settings.groomName} & ${settings.brideName}* 🌸\n\n`;
    msg += `Guest / Family: *${finalName}*\n`;
    if (status === 'confirmed') {
      msg += `Status: ✅ *Joyfully Attending!*\n`;
      msg += `Total Guests: *${totalPax}* (${adults} Adults${kids > 0 ? `, ${kids} Kids` : ''})\n`;
    } else if (status === 'tentative') {
      msg += `Status: ⏳ *Tentative* (Will confirm soon)\n`;
      msg += `Expected Guests: ~${totalPax}\n`;
    } else {
      msg += `Status: 🕊️ *Cannot Attend* (Sending heartfelt blessings!)\n`;
    }
    const cleanPhone = settings.hostPhone.replace(/\+/g, '').replace(/\s+/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Aesthetic Card Content
  const rsvpCardContent = (
    <div className="bg-[#FFFDF9] rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/30 max-w-lg mx-auto transition-all">
      {/* Royal Wedding Invitation Header */}
      <div className="relative bg-gradient-to-b from-[#6B1124] via-[#7B1123] to-[#540B18] text-[#FAF7F2] px-6 py-8 text-center overflow-hidden">
        {/* Subtle Decorative Golden Accents */}
        <div className="absolute top-3 left-4 text-amber-200/30 text-lg font-serif">✧</div>
        <div className="absolute top-3 right-4 text-amber-200/30 text-lg font-serif">✧</div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-[11px] font-serif-wedding tracking-widest uppercase mb-3">
          <span>|| शुभ विवाह ||</span>
        </div>

        <h2 className="font-serif-wedding text-3xl sm:text-4xl font-extrabold tracking-wide text-amber-100 drop-shadow-sm">
          {settings.groomName} <span className="text-amber-300 font-normal">&</span> {settings.brideName}
        </h2>
        <p className="text-xs text-amber-200/80 font-serif-wedding tracking-widest uppercase mt-1.5">
          Together with their families
        </p>

        {/* Date & Venue Badges */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-amber-100">
          <div className="flex items-center space-x-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-full border border-amber-300/20">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>{settings.weddingDate}</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-full border border-amber-300/20">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="truncate max-w-[220px]" title={settings.venueName}>
              {settings.venueName}
            </span>
          </div>
        </div>
      </div>

      {submitted ? (
        /* Confirmation Screen */
        <div className="p-8 text-center bg-gradient-to-b from-amber-50/40 via-white to-white">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300 shadow-sm animate-bounce">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>

          <h3 className="font-serif-wedding text-2xl font-bold text-stone-900 mb-1">
            RSVP Confirmed 🙏
          </h3>
          <p className="text-sm text-stone-600 mb-6">
            Thank you <strong className="text-[#6B1124]">{guestName.trim() || 'Dear Guest'}</strong>! Your response has been recorded.
          </p>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 text-left border border-amber-200/80 mb-6 space-y-3 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-stone-500 text-xs">Response</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                status === 'tentative' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {status === 'confirmed' ? 'Attending with Joy' : status === 'tentative' ? 'Tentative' : "Can't Make It"}
              </span>
            </div>

            {status !== 'declined' && (
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-xs">Total Guests</span>
                <span className="font-bold text-stone-900">{totalPax} Pax ({adults} Adults{kids > 0 ? `, ${kids} Kids` : ''})</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleWhatsAppSubmit}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-md transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Copy via WhatsApp</span>
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-medium transition"
            >
              Change Response
            </button>
          </div>
        </div>
      ) : (
        /* Aesthetic RSVP Form */
        <form onSubmit={handleFormSubmit} className="p-6 sm:p-7 space-y-6">
          {/* Guest / Family Name - OPTIONAL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase">
                Guest / Family Name
              </label>
              <span className="text-[11px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g., Sharma Family / Rajesh Verma"
              className="w-full px-4 py-2.5 text-sm bg-stone-50/80 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#7B1123] focus:bg-white outline-none transition placeholder:text-stone-400"
            />
          </div>

          {/* Will you be joining us? */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 tracking-wide uppercase mb-2.5">
              Will you be joining us?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Attending */}
              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                  status === 'confirmed'
                    ? 'border-[#7B1123] bg-gradient-to-b from-amber-50 to-white text-[#6B1124] font-bold shadow-sm ring-1 ring-[#7B1123]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition ${
                  status === 'confirmed' ? 'bg-[#7B1123] text-amber-100' : 'bg-stone-100 text-stone-500'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Attending</span>
              </button>

              {/* Tentative */}
              <button
                type="button"
                onClick={() => setStatus('tentative')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                  status === 'tentative'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold shadow-sm ring-1 ring-amber-500'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition ${
                  status === 'tentative' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Tentative</span>
              </button>

              {/* Can't Make It */}
              <button
                type="button"
                onClick={() => setStatus('declined')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                  status === 'declined'
                    ? 'border-stone-400 bg-stone-100 text-stone-900 font-bold shadow-sm ring-1 ring-stone-400'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition ${
                  status === 'declined' ? 'bg-stone-600 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Can't Make It</span>
              </button>
            </div>
          </div>

          {/* Number of Guests Attending (Only when attending or tentative) */}
          {status !== 'declined' && (
            <div className="pt-2 border-t border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 tracking-wide uppercase flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-[#7B1123]" />
                  <span>Number of Guests</span>
                </label>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/60">
                  {totalPax} Total
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Adults Stepper */}
                <div className="p-3 bg-stone-50/70 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="text-xs font-medium text-stone-700">Adults</div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-stone-900 w-5 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-[#7B1123] text-white font-bold hover:bg-[#600C1B] shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Kids Stepper */}
                <div className="p-3 bg-stone-50/70 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div className="text-xs font-medium text-stone-700">Kids</div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setKids(Math.max(0, kids - 1))}
                      disabled={kids <= 0}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-stone-900 w-5 text-center">{kids}</span>
                    <button
                      type="button"
                      onClick={() => setKids(kids + 1)}
                      className="w-7 h-7 rounded-lg bg-[#7B1123] text-white font-bold hover:bg-[#600C1B] shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Single Aesthetic CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#6B1124] to-[#87162E] hover:from-[#540B18] hover:to-[#6B1124] text-[#FAF7F2] font-serif-wedding font-bold text-sm tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Confirm RSVP</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      {/* Simulation Helper Strip */}
      <div className="mb-6 p-3 bg-amber-50/90 border border-amber-300/60 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-stone-700">
          <Info className="w-4 h-4 text-[#7B1123] shrink-0" />
          <span>
            <strong>Interactive Preview:</strong> Test RSVPing as different guests or with custom names:
          </span>
        </div>
        <select
          value={activeGuestId}
          onChange={(e) => setActiveGuestId(e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 outline-none w-full sm:w-auto"
        >
          {guests.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.adults + g.kids} Pax)
            </option>
          ))}
        </select>
      </div>

      {/* Main Viewport Container */}
      {viewportMode === 'phone' ? (
        <div className="flex justify-center items-center py-2">
          {/* Mobile Phone Mockup Frame */}
          <div className="relative w-full max-w-[390px] bg-stone-900 rounded-[50px] p-3 shadow-2xl ring-12 ring-stone-900/10 border-4 border-stone-700">
            {/* Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-950 ml-16"></div>
            </div>

            {/* In-App Browser Header */}
            <div className="bg-[#128C7E] text-white pt-7 pb-2 px-3 rounded-t-[38px] text-[11px] flex items-center justify-between">
              <span className="truncate opacity-90">rsvp.shaadicount.in/{settings.groomName.toLowerCase()}-{settings.brideName.toLowerCase()}</span>
              <Share2 className="w-3.5 h-3.5 shrink-0 opacity-80" />
            </div>

            {/* Scrollable screen */}
            <div className="max-h-[640px] overflow-y-auto rounded-b-[38px] bg-[#FAF7F2]">
              {rsvpCardContent}
            </div>

            {/* Bottom Bar */}
            <div className="w-32 h-1 bg-stone-500 rounded-full mx-auto mt-2.5 mb-1"></div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {rsvpCardContent}
        </div>
      )}
    </div>
  );
};
