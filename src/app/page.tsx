import Link from 'next/link';
import { getDirectoryData } from '@/lib/sheets';
import { Wrench, Zap, PaintRoller, Home, Hammer, ShieldCheck, MapPin, Store, HelpCircle } from 'lucide-react';

export const revalidate = 60; // Revalidate at most every 60 seconds

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) return <Wrench className="w-6 h-6 text-blue-500" />;
  if (cat.includes('electric')) return <Zap className="w-6 h-6 text-yellow-500" />;
  if (cat.includes('paint')) return <PaintRoller className="w-6 h-6 text-pink-500" />;
  if (cat.includes('clean') || cat.includes('maid')) return <Home className="w-6 h-6 text-emerald-500" />;
  if (cat.includes('construct') || cat.includes('build')) return <Hammer className="w-6 h-6 text-orange-500" />;
  return <HelpCircle className="w-6 h-6 text-gray-500" />;
};

export default async function HomePage() {
  const directoryData = await getDirectoryData();

  // Extract categories and their counts
  const categoryCounts = directoryData.reduce((acc, row) => {
    if (row.category) {
      acc[row.category] = (acc[row.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const uniqueCategories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Extract featured providers
  const featuredProviders = directoryData.filter((row) => row.is_verified);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find Trusted Local Services
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Discover verified professionals in your area. From plumbers to electricians, we've got you covered.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Category Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          </div>
          
          {uniqueCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uniqueCategories.map((category) => (
                <Link 
                  key={category.name} 
                  href={`/${category.name.toLowerCase()}`}
                  className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-blue-200 flex flex-col items-center text-center space-y-4"
                >
                  <div className="p-4 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.count} {category.count === 1 ? 'provider' : 'providers'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-gray-500 text-lg">No categories found. Add some data to your Google Sheet!</p>
            </div>
          )}
        </section>

        {/* Featured Providers Section */}
        <section>
          <div className="flex items-center space-x-2 mb-8">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <h2 className="text-3xl font-bold text-gray-900">Featured Providers</h2>
          </div>

          {featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {provider.business_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{provider.business_name}</h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-1">
                          <Store className="w-3 h-3" />
                          <span>{provider.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                      {provider.locality}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-gray-500 text-lg">No verified providers featured yet.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
