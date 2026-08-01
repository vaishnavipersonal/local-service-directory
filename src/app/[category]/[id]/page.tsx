import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDirectoryData } from '@/lib/sheets';
import { MapPin, Star, PhoneCall, MessageCircle, Clock, ShieldCheck, ChevronRight, Store } from 'lucide-react';

type Props = {
  params: Promise<{ category: string; id: string }>;
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
    title: provider.meta_title || `${provider.business_name} - ${provider.category} in ${provider.locality}`,
    description: provider.meta_description || `Contact ${provider.business_name} for ${provider.category} services in ${provider.locality}. Call ${provider.contact_number}.`,
  };
}

export async function generateStaticParams() {
  const data = await getDirectoryData();
  return data.map((provider) => ({
    category: provider.category.toLowerCase(),
    id: provider.id,
  }));
}

export default async function ProviderPage(props: Props) {
  const params = await props.params;
  const categoryStr = params.category;
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
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/${categoryStr}`} className="hover:text-blue-600 transition-colors">{capitalizedCategory}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{provider.business_name}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Left: Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium inline-flex items-center">
                    <Store className="w-3 h-3 mr-1.5" />
                    {provider.category}
                  </span>
                  {provider.is_verified && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium inline-flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1.5" />
                      Verified
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {provider.business_name}
                </h1>
              </div>

              <div className="space-y-3 text-lg">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {provider.locality}
                </div>
                {provider.rating && (
                  <div className="flex items-center text-amber-500 font-medium">
                    <Star className="w-5 h-5 mr-3 fill-current" />
                    {provider.rating} Rating
                  </div>
                )}
                {provider.experience_years && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-gray-400" />
                    {provider.experience_years} Years of Experience
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-72 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Contact Provider</h3>
              <a 
                href={`tel:${provider.contact_number}`} 
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors w-full text-lg"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Now</span>
              </a>
              <a 
                href={`https://wa.me/${provider.whatsapp_number}?text=Hi,%20I%20found%20you%20on%20the%20Local%20Service%20Directory.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-medium transition-colors w-full text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
