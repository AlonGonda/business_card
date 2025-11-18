import BusinessCard from '@/components/BusinessCard'
import { ContactInfo } from '@/lib/vcard'

const contact: ContactInfo = {
  name: 'Alon Gonda',
  title: 'Professional Saxophonist',
  organization: 'Professional Saxophone Performances',
  phone: '+972522586385',
  email: 'alongonda@gmail.com',
  website: 'https://www.instagram.com/alon.saxophone',
}

const whatsappUrl = 'https://wa.me/972522586385'
const instagramUrl = 'https://www.instagram.com/alon.saxophone?igsh=MWtwdm5ieWpuOHRpcA%3D%3D&utm_source=qr'
const services = 'Professional saxophone performances for events, weddings, corporate functions, and private occasions. Each performance is crafted with attention to detail and musical excellence.'

export default function Home() {
  return (
    <main className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[512px] h-full max-h-full flex items-center justify-center">
        <BusinessCard
          contact={contact}
          whatsappUrl={whatsappUrl}
          instagramUrl={instagramUrl}
          services={services}
        />
      </div>
    </main>
  )
}
