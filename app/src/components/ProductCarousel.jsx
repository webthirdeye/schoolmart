import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMSBlock } from '../hooks/useCMSBlock';

const DEFAULTS = {
  heading: 'Recommended Products',
  items: [
    {
      title: 'Digital Classrooms',
      subtitle: 'Next-gen learning tech',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      path: '/digital'
    },
    {
      title: 'Modern Furniture',
      subtitle: 'Ergonomic designs',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
      path: '/furniture'
    },
    {
      title: 'Sports Facilities',
      subtitle: 'Indoor & Outdoor',
      img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      path: '/sports'
    },
    {
        title: 'Science Labs',
        subtitle: 'Hands-on learning',
        img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
        path: '/science'
    }
  ]
};

const ProductCarousel = () => {
    const { data } = useCMSBlock('home', 'product_carousel', DEFAULTS);
    const d = { ...DEFAULTS, ...data };
    const items = d.items?.length ? d.items : DEFAULTS.items;

    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: false, 
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="py-2">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h2 className="text-gray-900 text-xl font-black font-heading uppercase tracking-tight">
                    {d.heading}
                </h2>
                <div className="flex gap-2">
                    <button onClick={scrollPrev} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                        <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <button onClick={scrollNext} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm">
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex">
                    {items.map((item, i) => (
                        <div key={i} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pr-2 first:pl-0 last:pr-0">
                            <Link 
                                to={item.path || '#'} 
                                className="block relative h-48 rounded-[20px] overflow-hidden group shadow-sm border border-gray-300 transition-transform duration-500"
                            >
                                <img 
                                    src={item.img} 
                                    alt={item.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300" />
                                
                                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                    <h3 className="text-white font-black text-base font-heading leading-tight uppercase tracking-wide">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                                        {item.subtitle}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1 text-white">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
                                        <ArrowRight size={12} />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;
