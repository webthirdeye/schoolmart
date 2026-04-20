import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMSPage } from '../hooks/useCMSBlock';
import CMSMedia from '../components/ui/CMSMedia';

const AboutUs = () => {
    const navigate = useNavigate();
    const { blocks, loading } = useCMSPage('aboutus');
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-black uppercase tracking-widest text-sm-blue text-[12px]">Loading...</div>;

    const hero = blocks?.inner_page_hero || {
      titleHtml: 'The <span class="text-sm-blue">Collective</span>',
      subtitle: 'SchoolMart is a platform built by architects, designers, and school innovators for the modern educational landscape.',
      mediaType: 'image',
      img: 'https://images.unsplash.com/photo-152305085306e-8c333bf48974?w=1200&q=80'
    };

    // Instant loading with fallbacks

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-24">
                    <h1 
                        className="text-7xl lg:text-9xl font-black text-gray-900 uppercase tracking-tighter leading-[0.85] mb-8"
                        dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
                    />
                    <p className="text-2xl text-gray-500 font-medium leading-relaxed">
                        {hero.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="rounded-[40px] overflow-hidden aspect-video shadow-2xl relative">
                        <CMSMedia 
                            mediaType={hero.mediaType} 
                            mediaUrl={hero.mediaUrl} 
                            fallbackImg={hero.img} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Our Mission</h2>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            To empower educational institutions with world-class infrastructure, cutting-edge technology, and expert design consultation, making excellence accessible and affordable.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-8">
                            <div>
                                <div className="text-5xl font-black text-sm-blue mb-2">4000+</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Partner Schools</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black text-sm-blue mb-2">7+</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Years Excellence</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
