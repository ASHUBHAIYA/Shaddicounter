export type GuestStatus = 'confirmed' | 'declined' | 'tentative' | 'pending';

export type WeddingSide = 'Groom' | 'Bride' | 'Common';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  side: WeddingSide;
  relation: string;
  status: GuestStatus;
  adults: number;
  kids: number;
  vegPax: number;
  nonVegPax: number;
  arrivalTimeSlot: string;
  note?: string;
  reminderSentCount: number;
  lastReminderAt?: string;
  updatedAt: string;
}

export interface WeddingSettings {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  plateCost: number;
  bufferPercent: number;
  cateringDeadlineDate: string;
  hostPhone: string;
}
