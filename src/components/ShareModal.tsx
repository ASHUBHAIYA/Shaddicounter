import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  QrCode, 
  ExternalLink, 
  Globe, 
  Smartphone, 
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { WeddingSettings } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WeddingSettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Determine current origin or fallback
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shaadicount.in';
  const guestRsvpUrl = `${origin}?view=guest`;
  const plannerUrl = `${origin}?view=planner`;

  const inviteMessage = `🌸 *Wedding Invitation & RSVP for ${settings.groomName} & ${settings.brideName}* 🌸\n\n` +
    `With the blessings of our elders, we cordially invite you to celebrate our wedding on *${settings.weddingDate}* at *${settings.venueName}*.\n\n` +
    `Please tap the link below to confirm your family's attendance in 10 seconds:\n\n` +
    `👉 *Confirm RSVP Here:* ${guestRsvpUrl}\n\n` +
    `With love & regards,\nThe Family 🙏`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(guestRsvpUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyInviteMessage = () => {
    navigator.clipboard.writeText(inviteMessage);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate SVG QR Code URL using public Google Chart API or QR service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(guestRsvpUrl)}&color=59-8-23`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] rounded-3xl shadow-2xl max-w-xl w-full border border-amber-300/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#540817] to-[#730D23] text-[#FAF7F2] p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-wedding text-base font-bold text-amber-100">
                Share & Deploy ShaadiCount
              </h3>
              <p className="text-[11px] text-amber-200/80">
                Instant guest links, WhatsApp invitation, QR code & deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 text-amber-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-800">
          {/* Section 1: Guest RSVP Link */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-[#730D23]" />
                <span>Guest RSVP Public Link</span>
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active & Live
              </span>
            </div>
            <p className="text-stone-500 text-[11px]">
              Direct link that opens directly into the mobile-optimized RSVP card:
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={guestRsvpUrl}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-700 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="shrink-0 flex items-center space-x-1 px-4 py-2 bg-[#540817] hover:bg-[#3D040F] text-white rounded-xl font-bold text-xs shadow-xs transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Share via WhatsApp & Card Message */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Pre-Drafted WhatsApp Invitation Message</span>
              </label>
              <button
                onClick={handleCopyInviteMessage}
                className="text-[11px] font-semibold text-[#730D23] hover:underline flex items-center space-x-1"
              >
                {copiedInvite ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedInvite ? 'Copied Message!' : 'Copy Full Text'}</span>
              </button>
            </div>

            <div className="bg-[#EFEAE2] p-3 rounded-2xl border border-stone-300">
              <div className="bg-white p-3 rounded-xl shadow-xs text-xs text-stone-800 whitespace-pre-line leading-relaxed font-sans border-l-4 border-emerald-600">
                {inviteMessage}
              </div>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Directly to WhatsApp Contacts / Family Groups</span>
            </button>
          </div>

          {/* Section 3: QR Code for Wedding Card Printing */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-serif-wedding font-bold text-xs uppercase tracking-wider text-[#540817] flex items-center justify-center sm:justify-start space-x-1.5">
                <QrCode className="w-4 h-4 text-amber-700" />
                <span>Print QR Code on Wedding Cards</span>
              </span>
              <p className="text-[11px] text-stone-600 max-w-xs">
                Guests can scan this QR code with their mobile phone camera to RSVP instantly without typing any web link.
              </p>
              <a
                href={qrCodeUrl}
                download="ShaadiCount_RSVP_QRCode.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#540817] hover:underline pt-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download High-Res QR Image</span>
              </a>
            </div>

            <div className="p-2 bg-white rounded-2xl shadow-sm border border-stone-200 shrink-0">
              <img
                src={qrCodeUrl}
                alt="ShaadiCount RSVP QR Code"
                className="w-28 h-28 rounded-lg"
              />
            </div>
          </div>

          {/* Section 4: Custom Domain & Deployment Guide */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="font-bold text-stone-800 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-[#540817]" />
              <span>Hosting & Custom Domain Options</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px] leading-relaxed">
              <li>
                <strong>Instant Live Sharing:</strong> Your app is currently deployed and running on Google Cloud Run. Anyone with the URL can access it right now.
              </li>
              <li>
                <strong>Custom Wedding Domain (e.g. rohanwedsprriya.in):</strong> You can deploy this exact repository to <strong>Vercel</strong> or <strong>Netlify</strong> with 1-click by connecting your GitHub repo, then add your custom domain in their DNS settings.
              </li>
              <li>
                <strong>Firebase Realtime Sync:</strong> Cloud persistence is enabled with live Firestore updates across all guest mobile devices.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
