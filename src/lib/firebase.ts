import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  onSnapshot, 
  setDoc, 
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Guest, WeddingSettings } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline, using local state fallback.");
    }
  }
}

// Default wedding document ID
export const DEFAULT_WEDDING_ID = 'rohan-priya-2026';

// Firestore CRUD operations with real-time sync
export function subscribeToGuests(
  weddingId: string,
  onUpdate: (guests: Guest[]) => void,
  onError?: (err: any) => void
) {
  const guestsRef = collection(db, 'weddings', weddingId, 'guests');
  return onSnapshot(
    guestsRef,
    (snapshot) => {
      const guestsList: Guest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        guestsList.push({
          id: docSnap.id,
          name: data.name || 'Guest Family',
          phone: data.phone || '',
          side: data.side || 'Groom',
          relation: data.relation || 'Friend',
          status: data.status || 'pending',
          adults: typeof data.adults === 'number' ? data.adults : 2,
          kids: typeof data.kids === 'number' ? data.kids : 0,
          vegPax: typeof data.vegPax === 'number' ? data.vegPax : 0,
          nonVegPax: typeof data.nonVegPax === 'number' ? data.nonVegPax : 0,
          arrivalTimeSlot: data.arrivalTimeSlot || '',
          note: data.note || '',
          reminderSentCount: data.reminderSentCount || 0,
          lastReminderAt: data.lastReminderAt || '',
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      });
      onUpdate(guestsList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, `weddings/${weddingId}/guests`);
      if (onError) onError(error);
    }
  );
}

export function subscribeToWeddingSettings(
  weddingId: string,
  onUpdate: (settings: WeddingSettings) => void
) {
  const weddingRef = doc(db, 'weddings', weddingId);
  return onSnapshot(
    weddingRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate({
          groomName: data.groomName || 'Rohan',
          brideName: data.brideName || 'Priya',
          weddingDate: data.weddingDate || 'Saturday, 14th November 2026',
          venueName: data.venueName || 'The Grand Peacock Palace',
          venueAddress: data.venueAddress || 'Chhatarpur Farms, Mandi Road, New Delhi',
          plateCost: typeof data.plateCost === 'number' ? data.plateCost : 1500,
          bufferPercent: typeof data.bufferPercent === 'number' ? data.bufferPercent : 10,
          cateringDeadlineDate: data.cateringDeadlineDate || '10th November 2026',
          hostPhone: data.hostPhone || '+919876543210',
        });
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `weddings/${weddingId}`);
    }
  );
}

export async function saveGuestToFirestore(weddingId: string, guest: Guest) {
  const path = `weddings/${weddingId}/guests/${guest.id}`;
  try {
    const guestRef = doc(db, 'weddings', weddingId, 'guests', guest.id);
    await setDoc(guestRef, {
      ...guest,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function saveSettingsToFirestore(weddingId: string, settings: WeddingSettings) {
  const path = `weddings/${weddingId}`;
  try {
    const weddingRef = doc(db, 'weddings', weddingId);
    await setDoc(weddingRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteGuestFromFirestore(weddingId: string, guestId: string) {
  const path = `weddings/${weddingId}/guests/${guestId}`;
  try {
    const guestRef = doc(db, 'weddings', weddingId, 'guests', guestId);
    await deleteDoc(guestRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
}

export async function seedInitialFirestoreDataIfEmpty(
  weddingId: string,
  initialSettings: WeddingSettings,
  initialGuests: Guest[]
) {
  try {
    const weddingRef = doc(db, 'weddings', weddingId);
    await setDoc(weddingRef, initialSettings, { merge: true });

    const guestsSnap = await getDocs(collection(db, 'weddings', weddingId, 'guests'));
    if (guestsSnap.empty) {
      for (const g of initialGuests) {
        await setDoc(doc(db, 'weddings', weddingId, 'guests', g.id), g);
      }
    }
  } catch (error) {
    console.warn("Could not seed initial data to Firestore (may be offline):", error);
  }
}

testConnection();
