import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PlannerDashboard } from './components/PlannerDashboard';
import { GuestRSVPView } from './components/GuestRSVPView';
import { WhatsAppBroadcastModal } from './components/WhatsAppBroadcastModal';
import { CatererSummaryModal } from './components/CatererSummaryModal';
import { EditGuestModal } from './components/EditGuestModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareModal } from './components/ShareModal';
import { INITIAL_GUESTS, INITIAL_WEDDING_SETTINGS } from './data/mockData';
import { Guest, WeddingSettings } from './types';
import { 
  DEFAULT_WEDDING_ID, 
  subscribeToGuests, 
  subscribeToWeddingSettings, 
  saveGuestToFirestore, 
  saveSettingsToFirestore, 
  deleteGuestFromFirestore,
  seedInitialFirestoreDataIfEmpty
} from './lib/firebase';

export default function App() {
  // Support direct guest link: e.g. /?view=guest
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialViewParam = queryParams.get('view');
  const initialGuestParam = queryParams.get('guestId');

  // Load initial state with localStorage fallback
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem('shaadicount_guests_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GUESTS;
  });

  const [settings, setSettings] = useState<WeddingSettings>(() => {
    try {
      const saved = localStorage.getItem('shaadicount_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WEDDING_SETTINGS;
  });

  const [activeView, setActiveView] = useState<'planner' | 'guest'>(
    initialViewParam === 'guest' ? 'guest' : 'planner'
  );
  const [guestViewportMode, setGuestViewportMode] = useState<'phone' | 'desktop'>('phone');
  const [activeGuestId, setActiveGuestId] = useState<string>(
    initialGuestParam || guests[0]?.id || 'g-1'
  );

  // Modals state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isCatererSheetOpen, setIsCatererSheetOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditGuestModalOpen, setIsEditGuestModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);

  // Real-Time Firestore Synchronization
  useEffect(() => {
    seedInitialFirestoreDataIfEmpty(DEFAULT_WEDDING_ID, INITIAL_WEDDING_SETTINGS, INITIAL_GUESTS);

    const unsubscribeGuests = subscribeToGuests(DEFAULT_WEDDING_ID, (cloudGuests) => {
      if (cloudGuests && cloudGuests.length > 0) {
        setGuests(cloudGuests);
        try {
          localStorage.setItem('shaadicount_guests_v1', JSON.stringify(cloudGuests));
        } catch {
          // ignore
        }
      }
    });

    const unsubscribeSettings = subscribeToWeddingSettings(DEFAULT_WEDDING_ID, (cloudSettings) => {
      if (cloudSettings) {
        setSettings(cloudSettings);
        try {
          localStorage.setItem('shaadicount_settings_v1', JSON.stringify(cloudSettings));
        } catch {
          // ignore
        }
      }
    });

    return () => {
      unsubscribeGuests();
      unsubscribeSettings();
    };
  }, []);

  // Derived Catering Calculations
  const sumOfPax = guests.reduce((acc, g) => acc + g.adults + g.kids, 0);
  const totalInvitedPax = Math.max(sumOfPax, 400);

  const confirmedGuests = guests.filter((g) => g.status === 'confirmed');
  const totalConfirmedPax = confirmedGuests.reduce((acc, g) => acc + g.adults + g.kids, 0);
  const totalVegPax = confirmedGuests.reduce((acc, g) => acc + g.vegPax, 0);
  const totalNonVegPax = confirmedGuests.reduce((acc, g) => acc + g.nonVegPax, 0);

  // Catering Savings: [Total Invited - Confirmed Attending] * plateCost
  const platesAverted = Math.max(0, totalInvitedPax - totalConfirmedPax);
  const cateringSavings = platesAverted * settings.plateCost;

  // Handlers for Guest Management
  const handleUpdateGuest = async (updatedGuest: Guest) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))
    );
    try {
      localStorage.setItem('shaadicount_guests_v1', JSON.stringify(guests));
      await saveGuestToFirestore(DEFAULT_WEDDING_ID, updatedGuest);
    } catch (e) {
      console.warn("Could not sync guest to cloud (saved locally):", e);
    }
  };

  const handleAddNewOrSaveGuest = async (guestData: Partial<Guest>) => {
    if (guestData.id) {
      const updated = {
        ...guests.find((g) => g.id === guestData.id),
        ...guestData,
        updatedAt: new Date().toISOString(),
      } as Guest;

      setGuests((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      try {
        await saveGuestToFirestore(DEFAULT_WEDDING_ID, updated);
      } catch (e) {
        console.warn("Could not sync guest edit to cloud:", e);
      }
    } else {
      const newId = `g-${Date.now()}`;
      const newGuest: Guest = {
        id: newId,
        name: guestData.name || 'New Guest Family',
        phone: guestData.phone || '+91 99999 00000',
        side: guestData.side || 'Groom',
        relation: guestData.relation || 'Friend',
        status: guestData.status || 'pending',
        adults: guestData.adults || 2,
        kids: guestData.kids || 0,
        vegPax: 0,
        nonVegPax: 0,
        arrivalTimeSlot: '',
        note: guestData.note || '',
        reminderSentCount: 0,
        updatedAt: new Date().toISOString(),
      };
      setGuests((prev) => [newGuest, ...prev]);
      try {
        await saveGuestToFirestore(DEFAULT_WEDDING_ID, newGuest);
      } catch (e) {
        console.warn("Could not save new guest to cloud:", e);
      }
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    if (activeGuestId === guestId && guests.length > 1) {
      const remaining = guests.filter((g) => g.id !== guestId);
      setActiveGuestId(remaining[0].id);
    }
    try {
      await deleteGuestFromFirestore(DEFAULT_WEDDING_ID, guestId);
    } catch (e) {
      console.warn("Could not delete guest from cloud:", e);
    }
  };

  const handleSaveSettings = async (newSettings: WeddingSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('shaadicount_settings_v1', JSON.stringify(newSettings));
      await saveSettingsToFirestore(DEFAULT_WEDDING_ID, newSettings);
    } catch (e) {
      console.warn("Could not save settings to cloud:", e);
    }
  };

  const handleMarkReminded = (guestId: string) => {
    const target = guests.find((g) => g.id === guestId);
    if (target) {
      const updated = {
        ...target,
        reminderSentCount: target.reminderSentCount + 1,
        lastReminderAt: 'Just now',
        updatedAt: new Date().toISOString(),
      };
      handleUpdateGuest(updated);
    }
  };

  const handleMarkAllReminded = (guestIds: string[]) => {
    const idSet = new Set(guestIds);
    setGuests((prev) =>
      prev.map((g) => {
        if (idSet.has(g.id)) {
          const updated = {
            ...g,
            reminderSentCount: g.reminderSentCount + 1,
            lastReminderAt: 'Just now',
            updatedAt: new Date().toISOString(),
          };
          saveGuestToFirestore(DEFAULT_WEDDING_ID, updated).catch(() => {});
          return updated;
        }
        return g;
      })
    );
  };

  const handleOpenEditModal = (guest: Partial<Guest>) => {
    setGuestToEdit(guest.id ? (guest as Guest) : null);
    setIsEditGuestModalOpen(true);
  };

  const handleSelectGuestToRSVP = (guestId: string) => {
    setActiveGuestId(guestId);
    setActiveView('guest');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-mandala-pattern text-stone-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        guestViewportMode={guestViewportMode}
        setGuestViewportMode={setGuestViewportMode}
        settings={settings}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenCatererSheet={() => setIsCatererSheetOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        totalConfirmedPax={totalConfirmedPax}
        cateringSavings={cateringSavings}
      />

      {/* Main App Content */}
      <main className="flex-1">
        {activeView === 'planner' ? (
          <PlannerDashboard
            guests={guests}
            settings={settings}
            onUpdateGuest={handleUpdateGuest}
            onAddNewGuest={handleOpenEditModal}
            onDeleteGuest={handleDeleteGuest}
            onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
            onOpenCatererSheet={() => setIsCatererSheetOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onSelectGuestToRSVP={handleSelectGuestToRSVP}
          />
        ) : (
          <GuestRSVPView
            guests={guests}
            settings={settings}
            activeGuestId={activeGuestId}
            setActiveGuestId={setActiveGuestId}
            onUpdateGuest={handleUpdateGuest}
            onAddNewGuest={handleAddNewOrSaveGuest}
            viewportMode={guestViewportMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-6 px-4 border-t border-amber-900/30 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif-wedding font-bold text-amber-400 text-sm">ShaadiCount</span>
            <span className="text-stone-500">•</span>
            <span>Indian Wedding RSVP & Food Wastage Prevention Tool</span>
          </div>
          <div className="flex items-center space-x-3 text-stone-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Firestore Real-Time Cloud Sync Active</span>
            </span>
            <span className="text-stone-600">•</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-amber-300 hover:underline"
            >
              Share Live App
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        settings={settings}
      />

      <WhatsAppBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        guests={guests}
        settings={settings}
        onMarkReminded={handleMarkReminded}
        onMarkAllReminded={handleMarkAllReminded}
      />

      <CatererSummaryModal
        isOpen={isCatererSheetOpen}
        onClose={() => setIsCatererSheetOpen(false)}
        guests={guests}
        settings={settings}
        totalConfirmedPax={totalConfirmedPax}
        totalVegPax={totalVegPax}
        totalNonVegPax={totalNonVegPax}
        cateringSavings={cateringSavings}
      />

      <EditGuestModal
        isOpen={isEditGuestModalOpen}
        onClose={() => {
          setIsEditGuestModalOpen(false);
          setGuestToEdit(null);
        }}
        guest={guestToEdit}
        onSave={handleAddNewOrSaveGuest}
        onDelete={handleDeleteGuest}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        totalInvitedPax={totalInvitedPax}
      />
    </div>
  );
}
