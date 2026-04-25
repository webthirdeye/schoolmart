import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { formatImgUrl } from '../utils/formatters';
import { 
    ArrowLeft, ShoppingCart, MessageSquare, Download, Share2, 
    ShieldCheck, Truck, RotateCcw, Award, CheckCircle2,
    Info, Star, Package, MapPin
} from 'lucide-react';

const ProductPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getProducts({ slug }).then(res => {
            if (res && res.length > 0) {
                setProduct(res[0]);
            }
            setLoading(false);
        });
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-sm-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <Package size={64} className="text-gray-300 mb-4" />
            <h1 className="text-2xl font-black text-gray-900 uppercase">Product Not Found</h1>
            <p className="text-gray-500 mt-2 mb-8 uppercase text-[12px] font-bold tracking-widest">The item you are looking for might have been moved or renamed.</p>
            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-sm-blue text-white rounded-xl font-black uppercase text-[12px] tracking-widest">Go Back</button>
        </div>
    );

    return (
        <main className="min-h-screen bg-white">
            {/* Breadcrumb / Navigation */}
            <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-400 hover:text-sm-blue transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Back to Collections</span>
                </button>
                <div className="flex items-center gap-6">
                    <button className="text-gray-300 hover:text-gray-900 transition-colors"><Share2 size={18}/></button>
                    <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-sm-blue transition-colors">Request Catalog</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Product Imagery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[40px] overflow-hidden bg-gray-50 border border-gray-100 shadow-xl relative group">
                            <img 
                                src={formatImgUrl(product.image)} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-12 group- transition-transform duration-700"
                            />
                            {product.isFeatured && (
                                <div className="absolute top-8 left-8 px-4 py-2 bg-sm-yellow text-gray-900 font-black rounded-full text-[10px] uppercase tracking-widest shadow-lg">
                                    Featured Selection
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 p-4 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                    <img src={formatImgUrl(product.image)} className="w-full h-full object-contain" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sm-blue/10 text-sm-blue rounded-full w-fit mb-6">
                            <CheckCircle2 size={12}/>
                            <span className="text-[10px] font-black uppercase tracking-widest">{product.category} / {product.subcategory}</span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight leading-[0.9] mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex text-sm-yellow">
                                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">ISO 9001 Certified Quality</span>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 mb-10">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-black text-gray-900 tracking-tighter">₹ {parseFloat(product.price).toLocaleString()}</span>
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Institutional Pricing</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                {product.description || "High-performance institutional equipment engineered for durability and ergonomic efficiency in modern classroom environments."}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex-1 py-5 bg-sm-blue text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                                    Request Quote <ArrowLeft className="rotate-180" size={18} />
                                </button>
                                <button className="flex-1 py-5 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                                    Chat with Expert <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Specs / Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {[
                                { icon: ShieldCheck, label: "Warranty", val: "5 Years" },
                                { icon: Truck, label: "Delivery", val: "7-10 Days" },
                                { icon: RotateCcw, label: "Returns", val: "30 Days" }
                            ].map((spec, i) => (
                                <div key={i} className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                                    <spec.icon className="text-sm-blue mb-2" size={20} />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
                                    <span className="text-[11px] font-black text-gray-900 uppercase">{spec.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Additional Info Accordion style */}
                        <div className="space-y-4 border-t border-gray-100 pt-10">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Info size={20}/></div>
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Technical Specifications</span>
                                </div>
                                <ArrowLeft className="-rotate-90 text-gray-300" size={20} />
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><MapPin size={20}/></div>
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Installation & Logistics</span>
                                </div>
                                <ArrowLeft className="-rotate-90 text-gray-300" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductPost;
