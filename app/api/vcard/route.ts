import { NextRequest, NextResponse } from 'next/server'
import { generateVCard, ContactInfo } from '@/lib/vcard'

// Contact information - matching the data from app/page.tsx
const contact: ContactInfo = {
  name: 'Alon Gonda',
  title: 'Professional Saxophonist',
  organization: 'Professional Saxophone Performances',
  phone: '+972522586385',
  email: 'alongonda@gmail.com',
  website: 'https://www.instagram.com/alon.saxophone',
}

export async function GET(request: NextRequest) {
  try {
    // Generate the vCard content
    const vcardData = generateVCard(contact)
    const filename = `${contact.name.replace(/\s+/g, '_')}.vcf`

    // Return the vCard file with proper headers for download
    return new NextResponse(vcardData, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating vCard:', error)
    return new NextResponse('Error generating contact file', { status: 500 })
  }
}

