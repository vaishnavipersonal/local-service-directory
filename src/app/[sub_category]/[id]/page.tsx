import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDirectoryData } from '@/lib/sheets';
import { MapPin, Star, PhoneCall, MessageCircle, Clock, ShieldCheck, ChevronRight, Store } from 'lucide-react';

export const revalidate = 60; // Revalidate at most every 60 seconds

type Props = {
  params: Promise<{ sub_category: string; id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const directoryData = await getDirectoryData();
  const provider = directoryData.find((p) => p.id === params.id);

  if (!provider) {
    return {
      title: 'Provider Not Found',
    };
  }

  return {
    title: provider.meta_title || `${provider.business_name} - ${provider.sub_category} in ${provider.locality}`,
    description: provider.meta_description || `Contact ${provider.business_name} for ${provider.sub_category} services in ${provider.locality}. Call ${provider.contact_number}.`,
  };
}

export async function generateStaticParams() {
  const data = await getDirectoryData();
  return data.map((provider) => ({
    sub_category: provider.sub_category.toLowerCase(),
    id: provider.id,
  }));
}

export default async function ProviderPage(props: Props) {
  const params = await props.params;
  const categoryStr = params.sub_category;
  const idStr = params.id;
  const directoryData = await getDirectoryData();
  const provider = directoryData.find((p) => p.id === idStr);

  if (!provider) {
    notFound();
  }

  const decodedCategory = decodeURIComponent(categoryStr);
  const capitalizedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: provider.business_name,
    telephone: provider.contact_number,
    address: {
      '@type': 'PostalAddress',
      addressLocality: provider.locality,
    },
    ...(provider.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: provider.rating,
      }
    } : {})
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[10%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[140px] opacity-50 animate-float" />
      
      <div className="relative z-10 py-16 px-6 max-w-5xl mx-auto space-y-10 animate-fade-in-up">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-base text-slate-500 mb-8 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${categoryStr}`} className="hover:text-blue-600 transition-colors">{capitalizedCategory}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold truncate">{provider.business_name}</span>
        </div>

        {/* Profile Card Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left: Info */}
          <div className="flex-1 space-y-8 w-full">
            <div className="glass-card rounded-[3rem] p-10 md:p-14">
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-blue-100/80 text-blue-800 text-sm px-4 py-2 rounded-full font-bold inline-flex items-center border border-blue-200">
                  <Store className="w-4 h-4 mr-2" />
                  {provider.sub_category}
                </span>
                {provider.is_verified && (
                  <span className="bg-emerald-100/80 text-emerald-800 text-sm px-4 py-2 rounded-full font-bold inline-flex items-center border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verified by Saket Directory
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-8">
                {provider.business_name}
              </h1>

              {/* Bento Box Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 rounded-3xl p-6 border border-slate-100 flex items-start space-x-4">
                  <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Location</h3>
                    <p className="text-slate-600 font-medium mt-1">{provider.locality}, Saket</p>
                  </div>
                </div>

                <div className="bg-white/60 rounded-3xl p-6 border border-slate-100 flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Contact Number</h3>
                    <a href={`tel:${provider.contact_number}`} className="text-blue-600 font-bold text-xl mt-1 hover:underline block">
                      {provider.contact_number}
                    </a>
                  </div>
                </div>

                {provider.rating && (
                  <div className="bg-white/60 rounded-3xl p-6 border border-slate-100 flex items-start space-x-4">
                    <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Rating</h3>
                      <p className="text-slate-600 font-medium mt-1">{provider.rating} / 5.0</p>
                    </div>
                  </div>
                )}

                {provider.experience_years && (
                  <div className="bg-white/60 rounded-3xl p-6 border border-slate-100 flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Experience</h3>
                      <p className="text-slate-600 font-medium mt-1">{provider.experience_years} Years in Business</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions (Sticky) */}
          <div className="w-full lg:w-96 sticky top-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-[3rem] p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">Ready to book?</h3>
              <div className="space-y-4">
                <a 
                  href={`tel:${provider.contact_number}`} 
                  className="flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-md shadow-blue-200 hover:-translate-y-0.5 text-lg"
                >
                  <PhoneCall className="w-6 h-6" />
                  <span>Call Provider</span>
                </a>
                <a 
                  href={`https://wa.me/${provider.whatsapp_number}?text=Hi,%20I%20found%20you%20on%20the%20Local%20Service%20Directory.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all shadow-md shadow-emerald-200 hover:-translate-y-0.5 text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
              <p className="text-center text-sm text-slate-500 font-medium mt-6">
                Average response time: &lt; 1 hour
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
