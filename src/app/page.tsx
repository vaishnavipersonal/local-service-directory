import Link from 'next/link';
import { getDirectoryData } from '@/lib/sheets';
import { Wrench, Zap, PaintRoller, Home, Hammer, ShieldCheck, MapPin, Store, HelpCircle, Heart, UserPlus, Clock, Star, Quote } from 'lucide-react';

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

  const featuredProviders = directoryData.filter((row) => row.is_verified);

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

        {/* Category Grid Section */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-slate-900">Browse by Category</h2>
          </div>
          
          {uniqueCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uniqueCategories.map((category) => (
                <Link 
                  key={category.name} 
                  href={`/${category.name.toLowerCase()}`}
                  className="glass-card group p-8 rounded-[2rem] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-5"
                >
                  <div className="p-6 bg-slate-50/80 rounded-full group-hover:bg-blue-50 transition-colors shadow-sm border border-slate-200">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-base text-slate-500 font-medium mt-1">
                      {category.count} {category.count === 1 ? 'provider' : 'providers'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-[3rem]">
              <p className="text-slate-500 text-xl font-medium">No categories found. Add some data to your Google Sheet!</p>
            </div>
          )}
        </section>

        {/* Featured Providers Section */}
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
            <h2 className="text-4xl font-bold text-slate-900">Featured Providers</h2>
          </div>

          {featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProviders.map((provider) => (
                <div key={provider.id} className="glass-card rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-inner border border-blue-200">
                        {provider.business_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-slate-900 line-clamp-1">{provider.business_name}</h3>
                        <div className="flex items-center text-base text-slate-500 space-x-2 mt-1.5 font-medium">
                          <Store className="w-4 h-4" />
                          <span>{provider.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-200/80">
                    <div className="flex items-center text-slate-600 font-medium text-lg">
                      <MapPin className="w-5 h-5 mr-2.5 text-slate-400" />
                      {provider.locality}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-[3rem]">
              <p className="text-slate-500 text-xl font-medium">No verified providers featured yet.</p>
            </div>
          )}
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
