import { NextResponse } from 'next/server'
import JSZip from 'jszip'
import crypto from 'crypto'

export async function GET() {
  try {
    // Create pass.json
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.digitalbusinesscard.alon',
      serialNumber: '1',
      teamIdentifier: 'TEAM123456',
      organizationName: 'Alon Gonda',
      description: 'Digital Business Card',
      logoText: 'Alon Gonda',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      labelColor: 'rgb(20, 184, 166)',
      generic: {
        primaryFields: [
          {
            key: 'name',
            label: 'Name',
            value: 'Alon Gonda',
          },
        ],
        secondaryFields: [
          {
            key: 'title',
            label: 'Title',
            value: 'Professional Saxophonist',
          },
        ],
        auxiliaryFields: [
          {
            key: 'phone',
            label: 'Phone',
            value: '052-2586385',
          },
        ],
        backFields: [
          {
            key: 'email',
            label: 'Email',
            value: 'alongonda@gmail.com',
          },
          {
            key: 'website',
            label: 'Instagram',
            value: '@alon.saxophone',
          },
          {
            key: 'services',
            label: 'Services',
            value: 'Professional saxophone performances for events, weddings, corporate functions, and private occasions.',
          },
        ],
      },
      associatedStoreIdentifiers: [],
    }

    const passJsonString = JSON.stringify(passJson)

    // Create manifest with SHA1 hashes
    const manifest: Record<string, string> = {
      'pass.json': passJsonString,
    }

    // Calculate SHA1 hashes for manifest
    const manifestJson: Record<string, string> = {}
    for (const [file, content] of Object.entries(manifest)) {
      const hash = crypto.createHash('sha1').update(content).digest('hex')
      manifestJson[file] = hash
    }

    // Create zip file
    const zip = new JSZip()
    zip.file('pass.json', passJsonString)
    zip.file('manifest.json', JSON.stringify(manifestJson))
    
    // Note: For a fully functional wallet pass, you need to sign it with Apple certificates
    // This creates an unsigned pass which may work for testing but will show a warning
    // For production, you need:
    // 1. Apple Developer account
    // 2. Pass Type ID certificate
    // 3. Sign the manifest with the certificate
    zip.file('signature', '')

    // Generate zip buffer
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    })

    // Return as .pkpass file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': 'attachment; filename="alon-gonda-card.pkpass"',
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating wallet pass:', error)
    return NextResponse.json(
      { error: 'Failed to generate wallet pass' },
      { status: 500 }
    )
  }
}

