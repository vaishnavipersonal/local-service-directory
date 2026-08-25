'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Wrench, Zap, PaintRoller, Home, Hammer, HelpCircle, Layers } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) return <Wrench className="w-5 h-5 text-blue-500" />;
  if (cat.includes('electric')) return <Zap className="w-5 h-5 text-yellow-500" />;
  if (cat.includes('paint')) return <PaintRoller className="w-5 h-5 text-pink-500" />;
  if (cat.includes('clean') || cat.includes('maid')) return <Home className="w-5 h-5 text-emerald-500" />;
  if (cat.includes('construct') || cat.includes('build')) return <Hammer className="w-5 h-5 text-orange-500" />;
  return <HelpCircle className="w-5 h-5 text-slate-400" />;
};

type SubCategory = {
  name: string;
  count: number;
};

type CategoryAccordionProps = {
  groupedCategories: Record<string, SubCategory[]>;
};

export default function CategoryAccordion({ groupedCategories }: CategoryAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  const mainCategories = Object.keys(groupedCategories);

  if (mainCategories.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-[3rem]">
        <p className="text-slate-500 text-xl font-medium">No categories found. Add some data to your Google Sheet!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mainCategories.map((mainCategory) => {
        const isOpen = openCategory === mainCategory;
        const subCategories = groupedCategories[mainCategory];
        
        // Calculate total providers in this main category
        const totalProviders = subCategories.reduce((sum, sub) => sum + sub.count, 0);

        return (
          <div 
            key={mainCategory} 
            className={`glass-card rounded-[2rem] overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500/20 shadow-lg' : 'hover:shadow-md'}`}
          >
            {/* Header / Trigger */}
            <button
              onClick={() => toggleCategory(mainCategory)}
              className="w-full text-left p-6 md:p-8 flex items-center justify-between bg-white/50 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner border border-blue-100">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-slate-900">
                    {mainCategory || "Other Services"}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {subCategories.length} sub-categories • {totalProviders} providers
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            {/* Expandable Content */}
            <div 
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <div className="p-6 md:p-8 pt-0 border-t border-slate-100/60 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {subCategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={`/${sub.name.toLowerCase()}`}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex items-center space-x-4"
                      >
                        <div className="p-3 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
                          {getCategoryIcon(sub.name)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {sub.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {sub.count} {sub.count === 1 ? 'provider' : 'providers'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
