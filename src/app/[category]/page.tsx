import { Metadata } from 'next';
import Link from 'next/link';
import { getDirectoryData } from '@/lib/sheets';
import { MapPin, Star, PhoneCall, MessageCircle, Clock, ChevronRight } from 'lucide-react';

export const revalidate = 60; // Revalidate at most every 60 seconds

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const category = params.category;
  
  const decodedCategory = decodeURIComponent(category);
  const capitalizedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  return {
    title: `${capitalizedCategory} in your area | Local Service Directory`,
    description: `Find trusted, verified ${decodedCategory} in your local area. Contact them directly via phone or WhatsApp.`,
  };
}

export async function generateStaticParams() {
  const data = await getDirectoryData();
  const categories = new Set(data.map(provider => provider.category.toLowerCase()));
  
  return Array.from(categories).map(category => ({
    category,
  }));
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const categoryStr = params.category;
  const decodedCategory = decodeURIComponent(categoryStr);
  const capitalizedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
  
  const directoryData = await getDirectoryData();
  const providers = directoryData.filter(
    (provider) => provider.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Breadcrumb / Header */}
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{capitalizedCategory}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {capitalizedCategory} in your area
          </h1>
          <p className="text-gray-600 mt-2">
            Showing {providers.length} {providers.length === 1 ? 'provider' : 'providers'}
          </p>
        </div>

        {/* Listing Grid */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{provider.business_name}</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{provider.locality}</span>
                    </div>
                  </div>
                  {provider.is_verified && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 mb-6 text-sm">
                  {provider.rating && (
                    <div className="flex items-center text-amber-500 font-medium">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {provider.rating}
                    </div>
                  )}
                  {provider.experience_years && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                      {provider.experience_years} Years Exp.
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href={`tel:${provider.contact_number}`} 
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call Now</span>
                    </a>
                    <a 
                      href={`https://wa.me/${provider.whatsapp_number}?text=Hi,%20I%20found%20you%20on%20the%20Local%20Service%20Directory.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <Link 
                    href={`/${categoryStr}/${provider.id}`}
                    className="block text-center w-full py-2.5 text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-xl text-gray-500">No {decodedCategory} found in your area right now.</p>
            <Link href="/" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
              Browse other categories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
