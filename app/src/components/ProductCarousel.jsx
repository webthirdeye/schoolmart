import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMSBlock } from '../hooks/useCMSBlock';
import { formatImgUrl } from '../utils/formatters';

const DEFAULTS = {
  heading: 'RECOMMENDED PRODUCTS',
  items: [
    {
      title: 'C-SHAPE STOOL',
      price: '3,500.00',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      path: '/furniture'
    },
    {
      title: 'CHEMISTRY LAB WORKSTATION',
      price: '7,500.00',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
      path: '/furniture'
    },
    {
      title: 'LAB WORK TABLES V2',
      price: '36,000.00',
      img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
      path: '/furniture'
    },
    {
      title: 'ERGONOMIC FACULTY CHAIR',
      price: '4,200.00',
      img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80',
      path: '/furniture'
    },
    {
      title: 'DIGITAL HUB MONITOR',
      price: '18,500.00',
      img: 'https://images.unsplash.com/photo-1558448231-314777598379?w=600&q=80',
      path: '/digital'
    },
    {
      title: 'STEM ROBOTICS KIT',
      price: '12,000.00',
      img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
      path: '/science'
    }
  ]
};

const ProductCarousel = () => {
    const { data } = useCMSBlock('home', 'product_carousel', DEFAULTS);
    const d = { ...DEFAULTS, ...data };
    const items = d.items?.length ? d.items : DEFAULTS.items;

    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true, 
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps'
    });

    // TICKER AUTOPLAY LOGIC
    useEffect(() => {
        if (!emblaApi) return;
        const intervalId = setInterval(() => {
            emblaApi.scrollNext();
        }, 4000); 
        return () => clearInterval(intervalId);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="py-1 px-4 max-w-7xl mx-auto relative group/carousel">
            {/* PERSISTENT EDGE CONTROLS - REFINED POSITIONING */}
            <button 
                onClick={scrollPrev} 
                className="absolute left-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-sm-blue hover:text-white transition-all shadow-xl active:scale-95"
                aria-label="Previous Products"
            >
                <ChevronLeft size={20} className="text-gray-400 group-hover:text-white" />
            </button>
            <button 
                onClick={scrollNext} 
                className="absolute right-0 top-[42%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-sm-blue hover:text-white transition-all shadow-xl active:scale-95"
                aria-label="Next Products"
            >
                <ChevronRight size={20} className="text-gray-400 group-hover:text-white" />
            </button>

            {/* CAROUSEL CARDS */}
            <div className="embla overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex -ml-4">
                    {items.map((item, i) => (
                        <div key={i} className="embla__slide flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_25%] min-w-0 pl-4 h-auto">
                            <div className="bg-white border border-transparent p-4 rounded-[20px] group transition-all duration-500 hover:shadow-xl h-full flex flex-col items-start text-left">
                                {/* Image Box - Full Performance Fit */}
                                <Link to={item.path || '#'} className="block w-full aspect-[1.1] overflow-hidden bg-[#F9F9F9] mb-4 rounded-xl relative transition-all">
                                    <img 
                                        src={formatImgUrl(item.img)} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    />
                                </Link>
                                
                                {/* Content Area - Compact */}
                                <div className="w-full flex flex-col gap-2 flex-grow px-2">
                                    <h3 className="text-[#1a1a1a] font-bold text-[13px] leading-tight uppercase font-heading tracking-tight group-hover:text-sm-blue transition-colors duration-300 line-clamp-1">
                                        {item.title}
                                    </h3>

                                    <div className="text-[#1a1a1a] font-black text-base leading-none mb-4">
                                        ₹{item.price || '0.00'}
                                    </div>
                                    
                                    <div className="mt-auto flex justify-center w-full">
                                        <Link 
                                            to={item.path || '#'} 
                                            className="w-full py-2.5 bg-[#F5F5F7] hover:bg-sm-blue hover:text-white text-[#1a1a1a] text-[10px] font-black uppercase transition-all rounded-full tracking-widest text-center shadow-sm active:scale-95 transition-all duration-300"
                                        >
                                            Add To Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCarousel;
