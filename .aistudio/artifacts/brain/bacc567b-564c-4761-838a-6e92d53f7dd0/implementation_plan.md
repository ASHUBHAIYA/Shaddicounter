# Deployment, Sharing & Firebase Real-Time Cloud Sync Plan for ShaadiCount

This plan outlines how to share and deploy **ShaadiCount** to real users, and connects Firebase Firestore so guest RSVPs submitted from guests' mobile phones instantly synchronize with the Host & Planner Dashboard in real time.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Decision**: You chose to connect **Firebase Cloud Persistence** so guest RSVPs sync live across all family members' and guests' devices in real time.
>
> **Sharing Mechanism**:
> - **Immediate Public Sharing**: The application is already running live on Google Cloud Run. You can share the **Shared App URL** with wedding guests immediately.
> - **In-App Share Tool**: We will add a dedicated **"Share Wedding Link"** modal with 1-click WhatsApp sharing, copy link, and QR Code generation for physical wedding invitation cards.
> - **Custom Domain / Production Deployment**: Instructions will be provided for hosting on Vercel, Netlify, or Firebase Hosting with a custom wedding domain (e.g. `rohanwedsprriya.com`).

---

### 1. Overview & Core Concept

- **What It Delivers**: 
  1. A real-time cloud-backed RSVP system where guests open the invitation on their phone, submit their attendance, and the host's dashboard updates in milliseconds without refreshing.
  2. A streamlined sharing interface with copyable guest links, WhatsApp invitation message composer, and downloadable QR code.
  3. Step-by-step guidance for production deployment to custom wedding domains.
- **Target Audience**: Wedding couple (Rohan & Priya), wedding planners, family members tracking headcount, and invited guests receiving WhatsApp links.
- **Primary Value**: Eliminates manual spreadsheets and WhatsApp note-taking; guarantees accurate headcount for caterers to cut plate wastage.

---

### 2. User Experience & Sharing Workflow

```
┌─────────────────────────────────┐       ┌───────────────────────────────────┐
│     Host / Planner Dashboard    │       │     Guest Mobile Phone (WhatsApp) │
│                                 │       │                                   │
│  1. Click "Share Wedding Link"  │       │  1. Receives link via WhatsApp    │
│  2. Copy Link / Send WhatsApp   ├──────►│  2. Opens elegant RSVP card       │
│  3. Real-time counter updates   │◄──────┤  3. Selects Attending & Pax       │
│     instantly via Firestore     │       │  4. Clicks "Confirm RSVP"         │
└─────────────────────────────────┘       └───────────────────────────────────┘
```

1. **Host Sharing Flow**:
   - Host clicks the new **"Share & Invite Guests"** button in the header.
   - Can copy the public Guest RSVP URL (`https://.../?view=guest`).
   - Can generate personalized WhatsApp invitations directly.
   - Can download a high-resolution QR code to print on wedding cards or banquet entrance signs.
2. **Guest RSVP Flow**:
   - Guest opens the link on their smartphone (in WhatsApp webview or mobile browser).
   - Card displays couple names, date, and venue.
   - Guest selects *Attending*, sets adults/kids count, and taps **Confirm RSVP**.
   - Firestore writes the record and fires instant real-time listener updates to the Host Dashboard.

---

### 3. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Cloud Run / Vite React App                        │
│                                                                             │
│   ┌─────────────────────┐               ┌────────────────────────────────┐  │
│   │ PlannerDashboard    │               │ GuestRSVPView                  │  │
│   │ (Real-time listener)│               │ (Frictionless RSVP submission) │  │
│   └──────────┬──────────┘               └───────────────┬────────────────┘  │
│              │                                          │                   │
│              ▼                                          ▼                   │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                 Firebase Service Layer (src/lib/firebase.ts)         │  │
│   │       - onSnapshot subscription for live dashboard synchronization   │  │
│   │       - setDoc / addDoc for guest RSVPs                              │  │
│   └──────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │       Google Cloud Firestore  │
                       │                               │
                       │  /weddings/{weddingId}        │
                       │    ├── settings (doc)         │
                       │    └── guests (collection)    │
                       │         ├── guest_1           │
                       │         └── guest_2           │
                       └───────────────────────────────┘
```

#### Firestore Collections:
1. `weddings/{weddingId}`:
   - `groomName`: string
   - `brideName`: string
   - `weddingDate`: string
   - `venueName`: string
   - `plateCost`: number
   - `bufferPercent`: number
   - `hostPhone`: string
2. `weddings/{weddingId}/guests/{guestId}`:
   - `name`: string (optional, defaults to "Guest Family")
   - `status`: `'confirmed' | 'tentative' | 'declined' | 'pending'`
   - `adults`: number
   - `kids`: number
   - `side`: `'Groom' | 'Bride' | 'Common'`
   - `phone`: string
   - `updatedAt`: timestamp

---

### 4. Implementation Steps

1. **Firebase Provisioning**:
   - Initiate Firebase setup UI (`show_aistudio_ui` with `ui_type: "firebase_setup"`).
   - Verify terms acceptance via `GetFirebaseTos`.
   - Provision Firestore database via `ProvisionFirebase` RPC.
2. **Security Rules & Blueprint**:
   - Create `firebase-blueprint.json` describing wedding settings and guest entities.
   - Draft zero-trust `firestore.rules` allowing public guest RSVP creation and host management.
   - Deploy security rules via `DeployRules` RPC.
3. **Firebase SDK Integration**:
   - Install `firebase` package.
   - Create `src/lib/firebase.ts` with connection testing and error handlers.
   - Connect `App.tsx` state to Firestore using `onSnapshot` with graceful offline fallback to `localStorage`.
4. **Share Modal & Direct Link Routing**:
   - Add a **"Share & Invite"** modal with:
     - Public Guest RSVP Link copy button.
     - WhatsApp invite generator with direct click-to-chat.
     - QR Code generator for physical cards.
   - Support URL query parameter `?view=guest` and `?guestId=...` so guests open directly in the mobile RSVP view.
5. **Deployment & Custom Domain Guide**:
   - Provide explicit, clear steps for:
     - Using the existing instant live Cloud Run link.
     - Deploying the repository to Vercel, Netlify, or Firebase Hosting with custom domain DNS settings.
