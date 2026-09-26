import { QRDataState } from '../types';

/**
 * Formats data state into QR code standard compliant text
 */
export function generateQRPayload(state: QRDataState): string {
  switch (state.type) {
    case 'url': {
      let url = state.url.trim();
      if (!url) return 'https://mriya.ua';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'wifi': {
      const { ssid, password, encryption, hidden } = state.wifi;
      const cleanSsid = (ssid || 'Guest_WiFi').replace(/([\\;,:"])/g, '\\$1');
      const cleanPass = (password || '').replace(/([\\;,:"])/g, '\\$1');
      const secType = encryption === 'nopass' ? 'nopass' : encryption;
      return `WIFI:T:${secType};S:${cleanSsid};P:${cleanPass};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const { firstName, lastName, phone, email, company, title, website, note } = state.vcard;
      const fullName = `${lastName} ${firstName}`.trim() || 'Тарас Шевченко';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${lastName || ''};${firstName || ''};;;`,
        `FN:${fullName}`,
        company ? `ORG:${company}` : '',
        title ? `TITLE:${title}` : '',
        phone ? `TEL;TYPE=CELL,VOICE:${phone}` : '',
        email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : '',
        website ? `URL:${website.startsWith('http') ? website : 'https://' + website}` : '',
        note ? `NOTE:${note}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }

    case 'email': {
      const { email, subject, body } = state.email;
      const queryParams = [];
      if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`);
      if (body) queryParams.push(`body=${encodeURIComponent(body)}`);
      const qs = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      return `mailto:${email || 'hello@example.com'}${qs}`;
    }

    case 'phone': {
      const num = state.phone.trim() || '+380501234567';
      return `tel:${num}`;
    }

    case 'sms': {
      const num = state.sms.phone.trim() || '+380501234567';
      const msg = state.sms.message || '';
      return `smsto:${num}:${msg}`;
    }

    case 'crypto': {
      const { currency, address, amount } = state.crypto;
      const addr = address.trim();
      if (!addr) {
        if (currency === 'monobank') return 'https://send.monobank.ua/jar/example';
        return '0x0000000000000000000000000000000000000000';
      }
      if (currency === 'ethereum') {
        return amount ? `ethereum:${addr}?value=${amount}` : `ethereum:${addr}`;
      } else if (currency === 'bitcoin') {
        return amount ? `bitcoin:${addr}?amount=${amount}` : `bitcoin:${addr}`;
      } else if (currency === 'monobank') {
        return addr.startsWith('http') ? addr : `https://send.monobank.ua/jar/${addr}`;
      } else {
        return addr;
      }
    }

    case 'text':
    default:
      return state.text || 'Слава Україні! Героям слава!';
  }
}
