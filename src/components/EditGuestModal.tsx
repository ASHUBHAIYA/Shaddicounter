import React, { useState, useEffect } from 'react';
import { X, Trash2, UserPlus, Edit3 } from 'lucide-react';
import { Guest, GuestStatus, WeddingSide } from '../types';

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onSave: (guestData: Partial<Guest>) => void;
  onDelete?: (guestId: string) => void;
}

export const EditGuestModal: React.FC<EditGuestModalProps> = ({
  isOpen,
  onClose,
  guest,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(guest);

  const [name, setName] = useState(guest?.name || '');
  const [phone, setPhone] = useState(guest?.phone || '+91 ');
  const [side, setSide] = useState<WeddingSide>(guest?.side || 'Groom');
  const [relation, setRelation] = useState(guest?.relation || 'Family Friends');
  const [status, setStatus] = useState<GuestStatus>(guest?.status || 'pending');
  const [adults, setAdults] = useState<number>(guest ? guest.adults : 2);
  const [kids, setKids] = useState<number>(guest ? guest.kids : 0);

  useEffect(() => {
    if (guest) {
      setName(guest.name);
      setPhone(guest.phone);
      setSide(guest.side);
      setRelation(guest.relation);
      setStatus(guest.status);
      setAdults(guest.adults);
      setKids(guest.kids);
    } else {
      setName('');
      setPhone('+91 ');
      setSide('Groom');
      setRelation('Family Friends');
      setStatus('pending');
      setAdults(2);
      setKids(0);
    }
  }, [guest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(guest ? { id: guest.id } : {}),
      name: name.trim() || 'Guest Family',
      phone,
      side,
      relation,
      status,
      adults: status === 'declined' ? 0 : adults,
      kids: status === 'declined' ? 0 : kids,
      vegPax: 0,
      nonVegPax: 0,
      arrivalTimeSlot: '',
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl shadow-2xl max-w-md w-full border border-amber-300/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#590817] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isEditing ? <Edit3 className="w-5 h-5 text-amber-300" /> : <UserPlus className="w-5 h-5 text-amber-300" />}
            <h3 className="font-serif-wedding text-base font-bold text-amber-100">
              {isEditing ? `Edit: ${guest?.name}` : 'Add Wedding Guest / Family'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {/* Guest Name & Phone */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Guest / Family Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Verma Family / Ritu Jain (Optional)"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#590817]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                WhatsApp Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:ring-2 focus:ring-[#590817]"
              />
            </div>
          </div>

          {/* Wedding Side & Relation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Family Side
              </label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value as WeddingSide)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none"
              >
                <option value="Groom">Groom's Side</option>
                <option value="Bride">Bride's Side</option>
                <option value="Common">Common</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                Circle / Relation
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="e.g. Uncle, Friend"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* RSVP Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1.5">
              RSVP Status
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['confirmed', 'tentative', 'declined', 'pending'] as GuestStatus[]).map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold capitalize transition ${
                    status === st
                      ? st === 'confirmed'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : st === 'tentative'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : st === 'declined'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-stone-700 text-white border-stone-700'
                      : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Pax */}
          {status !== 'declined' && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Kids</label>
                <input
                  type="number"
                  min="0"
                  value={kids}
                  onChange={(e) => setKids(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (guest && confirm(`Delete ${guest.name}?`)) {
                    onDelete(guest.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-1 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-50 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#590817] hover:bg-[#420511] text-white rounded-xl font-bold text-xs shadow-sm transition"
              >
                {isEditing ? 'Save' : 'Add Guest'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
