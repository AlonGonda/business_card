export interface ContactInfo {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
  website: string;
}

// Escape special characters in vCard fields
function escapeVCardField(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export function generateVCard(contact: ContactInfo): string {
  // Split name into first and last name for better iPhone compatibility
  const nameParts = contact.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardField(contact.name)}`,
    `N:${escapeVCardField(lastName)};${escapeVCardField(firstName)};;;`,
    `TITLE:${escapeVCardField(contact.title)}`,
    `ORG:${escapeVCardField(contact.organization)}`,
    `TEL;TYPE=CELL,VOICE:${contact.phone}`,
    `EMAIL;TYPE=INTERNET,HOME:${contact.email}`,
    `URL;TYPE=WORK:${contact.website}`,
    'END:VCARD',
  ].join('\r\n'); // Use \r\n for better cross-platform compatibility

  return vcard;
}

export function downloadVCard(contact: ContactInfo, filename: string = 'contact.vcf'): void {
  const vcard = generateVCard(contact);
  // Use 'text/vcard' or 'text/x-vcard' for better iPhone compatibility
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  // Add attribute for iOS
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

