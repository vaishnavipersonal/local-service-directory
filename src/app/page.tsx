import Link from 'next/link';
import CategoryAccordion from '@/components/CategoryAccordion';
import { getDirectoryData } from '@/lib/sheets';
import { Wrench, Zap, PaintRoller, Home, Hammer, ShieldCheck, MapPin, Store, HelpCircle, Heart, UserPlus, Clock, Star, Quote, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export const revalidate = 60; // Revalidate at most every 60 seconds

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) return <Wrench className="w-6 h-6 text-blue-500" />;
  if (cat.includes('electric')) return <Zap className="w-6 h-6 text-yellow-500" />;
  if (cat.includes('paint')) return <PaintRoller className="w-6 h-6 text-pink-500" />;
  if (cat.includes('clean') || cat.includes('maid')) return <Home className="w-6 h-6 text-emerald-500" />;
  if (cat.includes('construct') || cat.includes('build')) return <Hammer className="w-6 h-6 text-orange-500" />;
  return <HelpCircle className="w-6 h-6 text-slate-400" />;
};

const SAKET_FACTS = [
  "Did you know? Saket is named after the mythological ancient city of Ayodhya.",
  "Saket was one of the first areas in Delhi to pioneer the 'Mall Culture' with Anupam PVR in 1997.",
  "Home to the sprawling Garden of Five Senses, a 20-acre park perfect for evening walks.",
  "Select Citywalk in Saket is one of the highest-grossing shopping centers in India.",
  "Saket is uniquely divided into alphabetized residential blocks from A to N.",
  "It is nestled right next to the historic Qutub Minar complex.",
];

const REVIEWS = [
  { id: 1, name: "Aarti S.", role: "New Resident, J-Block", text: "Just moved to Saket and this directory helped me find a reliable electrician in 5 minutes. A lifesaver for new residents!", rating: 5 },
  { id: 2, name: "Mr. & Mrs. Kapoor", role: "Long-time Residents", text: "As senior citizens, we love how easy it is to read and use this website. We found a great plumber who arrived promptly.", rating: 5 },
  { id: 3, name: "Rohan D.", role: "Short-term Stayer", text: "Was here for a 3-month project and needed some tailoring done quickly. Found the perfect shop immediately. So convenient.", rating: 4 },
];

export default async function HomePage() {
  const directoryData = await getDirectoryData();

  const groupedCategories = directoryData.reduce((acc, row) => {
    const mainCat = row.category || 'Other Services';
    const subCat = row.sub_category;
    
    if (!acc[mainCat]) {
      acc[mainCat] = {};
    }
    if (subCat) {
      acc[mainCat][subCat] = (acc[mainCat][subCat] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const formattedGroupedCategories = Object.entries(groupedCategories).reduce((acc, [mainCat, subCats]) => {
    acc[mainCat] = Object.entries(subCats).map(([name, count]) => ({ name, count }));
    return acc;
  }, {} as Record<string, { name: string, count: number }[]>);

  const featuredProviders = directoryData.filter((row) => row.is_featured);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 animate-float" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-emerald-50 rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 lg:pt-32 lg:pb-24 text-center max-w-5xl mx-auto animate-fade-in-up">
          <span className="inline-flex items-center py-1.5 px-4 rounded-full bg-blue-50 text-blue-700 font-bold text-sm mb-6 border border-blue-100 shadow-sm">
            <MapPin className="w-4 h-4 mr-1.5" />
            Dedicated to Saket, South Delhi
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            The most trusted local services in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Saket.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Discover verified, top-rated professionals right in your neighborhood. Fast, easy, and built for the Saket community.
          </p>
        </section>

        {/* Quirky Facts Marquee */}
        <div className="w-full bg-white border-y border-slate-200 py-5 overflow-hidden flex items-center shadow-sm">
          <div className="flex w-[200%] animate-marquee whitespace-nowrap">
            {[...SAKET_FACTS, ...SAKET_FACTS].map((fact, i) => (
              <div key={i} className="flex items-center mx-10 text-slate-700 font-semibold text-lg">
                <span className="text-emerald-500 mr-3 text-xl">✦</span> {fact}
              </div>
            ))}
          </div>
        </div>

        {/* ICP Section (Who is this for?) */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Made for everyone in Saket</h2>
            <p className="text-xl text-slate-600 font-medium">Whether you're here for a month or a lifetime, we've got you covered.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-rose-100">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Couples & Families</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                From deep-cleaning services to setting up a new nursery, find safe, vetted help for your home.
              </p>
            </div>
            <div className="glass-card rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                <UserPlus className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">New Residents</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Just moved to Saket? Skip the hassle of asking around. Discover the best local electricians and plumbers instantly.
              </p>
            </div>
            <div className="glass-card rounded-[2.5rem] p-10 text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-20 h-20 mx-auto bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-amber-100">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Short-term Stayers</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Visiting for work or studies? Quickly find tailors, launderers, and handymen without any commitments.
              </p>
            </div>
          </div>
        </section>

        {/* Category Hierarchy Section */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold text-slate-900">Browse by Category</h2>
          </div>
          
          <CategoryAccordion groupedCategories={formattedGroupedCategories} />
        </section>

        {/* Featured Providers Section */}
        <section className="py-24 px-0 max-w-[1400px] mx-auto overflow-hidden relative">
          <div className="px-6 md:px-12 flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Providers</h2>
              </div>
              <p className="text-slate-500 text-lg font-medium">Trusted professionals, ready to help</p>
            </div>
            <div className="hidden md:flex space-x-3">
              <button className="w-11 h-11 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="w-11 h-11 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {featuredProviders.length > 0 ? (
            <div className="flex overflow-x-auto pb-10 pt-4 px-6 md:px-12 gap-6 snap-x snap-mandatory hide-scrollbar">
              {featuredProviders.map((provider) => {
                const icon = getCategoryIcon(provider.sub_category);
                
                // Hardcode local image override for featured providers
                const localImageOverrides: Record<string, string> = {
                  'FK Plumbing work': '/featured/fk-plumbing.png',
                  'Alok Plumbing Services': '/featured/alok-plumbing.jpg',
                  'AS PLUMBING CONTRACTOR': '/featured/as-plumbing.jpg',
                  'S & A Wooden work & contractor': '/featured/sa-wooden.png',
                };
                
                // Normalise the name to handle case sensitivity and spaces
                const normalizedBusinessName = Object.keys(localImageOverrides).find(
                  name => name.toLowerCase().trim() === provider.business_name.toLowerCase().trim()
                );
                
                const finalImageUrl = normalizedBusinessName ? localImageOverrides[normalizedBusinessName] : provider.image_url;

                return (
                  <div key={provider.id} className="min-w-[340px] max-w-[340px] bg-white rounded-[24px] shadow-sm border border-slate-100/80 flex flex-col snap-start hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    {/* Top Image */}
                    <div className="h-48 w-full bg-slate-100 rounded-t-[24px] relative">
                      {finalImageUrl ? (
                        <img src={finalImageUrl} alt={provider.business_name} className="w-full h-full object-cover rounded-t-[24px]" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-t-[24px]" />
                      )}
                      
                      {/* Icon Overlap */}
                      <div className="absolute -bottom-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
                        {icon}
                      </div>
                    </div>
                    
                    <div className="p-7 pt-10 flex flex-col flex-1">
                      <h3 className="font-extrabold text-xl text-slate-900 mb-1">{provider.business_name}</h3>
                      <div className="flex items-center text-sm text-slate-500 mb-5 font-medium">
                        <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
                        {provider.locality}, Saket
                      </div>
                      
                      {/* Badges */}
                      <div className="mb-6">
                        <span className="inline-block bg-[#f0f7ff] text-[#0066cc] text-[11px] font-bold px-3 py-1.5 rounded-md">
                          {provider.badges || "Quick response • Affordable • Reliable"}
                        </span>
                      </div>
                      
                      {/* Services */}
                      <div className="mb-8 flex-1">
                        <h4 className="text-[13px] font-bold text-slate-900 mb-2.5">Services</h4>
                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                          {provider.services || "General services, Consultation, Diagnostics, Repair, Maintenance"}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-4 mt-auto">
                        <a 
                          href={`/${provider.sub_category.toLowerCase()}/${provider.id}`}
                          className="flex-[0.4] border border-slate-200 rounded-xl flex items-center justify-center py-3 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <MapPin className="w-5 h-5" />
                        </a>
                        <a 
                          href={`https://wa.me/${provider.whatsapp_number}?text=Hi,%20I%20found%20you%20on%20the%20Local%20Service%20Directory.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#12b959] hover:bg-[#0f9e4c] text-white rounded-xl flex items-center justify-center py-3 font-bold text-[15px] transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-5 h-5 mr-1.5" />
                          Chat
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-[3rem] mx-6 md:mx-12 border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-lg font-medium">No verified providers featured yet.</p>
            </div>
          )}
          
          <div className="text-center mt-4 mb-8 flex items-center justify-center text-[13px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 mr-1.5 opacity-70" />
            All providers are background verified and trusted by our community.
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-24 px-6 bg-white/60 backdrop-blur-2xl border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Trusted by Your Neighbors</h2>
              <p className="text-xl text-slate-600 font-medium">See what the Saket community is saying about our platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REVIEWS.map((review) => (
                <div key={review.id} className="glass-card rounded-[2.5rem] p-10 relative">
                  <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-100 rotate-180" />
                  <div className="flex space-x-1.5 mb-8">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xl leading-relaxed italic mb-10 relative z-10 font-medium">
                    "{review.text}"
                  </p>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900">{review.name}</h4>
                    <p className="text-base text-slate-500 font-medium">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center text-slate-500 font-medium text-lg">
          <p>© {new Date().getFullYear()} Saket Local Service Directory. Built with ❤️ for South Delhi.</p>
        </footer>
      </div>
    </main>
  );
}
