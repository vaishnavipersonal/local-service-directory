import { Metadata } from 'next';
import Link from 'next/link';
import { getDirectoryData } from '@/lib/sheets';
import { MapPin, Star, PhoneCall, MessageCircle, Clock, ChevronRight } from 'lucide-react';

export const revalidate = 60; // Revalidate at most every 60 seconds

type Props = {
  params: Promise<{ sub_category: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const subCategory = params.sub_category;
  
  const decodedCategory = decodeURIComponent(subCategory);
  const capitalizedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  return {
    title: `${capitalizedCategory} in Saket | Local Service Directory`,
    description: `Find trusted, verified ${decodedCategory} in Saket, South Delhi. Contact them directly via phone or WhatsApp.`,
  };
}

export async function generateStaticParams() {
  const data = await getDirectoryData();
  const subCategories = new Set(data.map(provider => provider.sub_category.toLowerCase()));
  
  return Array.from(subCategories).map(sub_category => ({
    sub_category,
  }));
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const categoryStr = params.sub_category;
  const decodedCategory = decodeURIComponent(categoryStr);
  const capitalizedCategory = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
  
  const directoryData = await getDirectoryData();
  const providers = directoryData.filter(
    (provider) => provider.sub_category.toLowerCase() === decodedCategory.toLowerCase()
  );

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 py-16 px-6 max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb / Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center space-x-2 text-base text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold">{capitalizedCategory}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Best {capitalizedCategory} in <span className="text-blue-600">Saket</span>
          </h1>
          <p className="text-xl text-slate-600 mt-4 font-medium">
            Showing {providers.length} verified {providers.length === 1 ? 'professional' : 'professionals'} ready to help.
          </p>
        </div>

        {/* Listing Grid */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {providers.map((provider) => (
              <div key={provider.id} className="glass-card rounded-[2.5rem] p-8 flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{provider.business_name}</h2>
                    <div className="flex items-center text-base text-slate-500 mt-2 space-x-1.5 font-medium">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span>{provider.locality}, Saket</span>
                    </div>
                  </div>
                  {provider.is_verified && (
                    <span className="bg-emerald-100 text-emerald-700 text-sm px-3.5 py-1.5 rounded-full font-bold shadow-sm border border-emerald-200">
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 mb-8 text-base">
                  {provider.rating && (
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-5 h-5 mr-1.5 fill-current" />
                      {provider.rating}
                    </div>
                  )}
                  {provider.experience_years && (
                    <div className="flex items-center text-slate-600 font-medium">
                      <Clock className="w-5 h-5 mr-2 text-slate-400" />
                      {provider.experience_years} Years Exp.
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href={`tel:${provider.contact_number}`} 
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-md shadow-blue-200 text-lg"
                    >
                      <PhoneCall className="w-5 h-5" />
                      <span>Call</span>
                    </a>
                    <a 
                      href={`https://wa.me/${provider.whatsapp_number}?text=Hi,%20I%20found%20you%20on%20the%20Local%20Service%20Directory.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl font-bold transition-colors shadow-md shadow-emerald-200 text-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <Link 
                    href={`/${categoryStr}/${provider.id}`}
                    className="block text-center w-full py-3.5 text-blue-700 font-bold bg-blue-50/50 hover:bg-blue-100 rounded-2xl transition-colors border border-blue-100"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card rounded-[3rem] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl text-slate-500 font-medium">No {decodedCategory} found in Saket right now.</p>
            <Link href="/" className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md">
              Browse other categories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
