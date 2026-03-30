import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 text-center max-w-2xl">
        <p className="font-display font-bold text-brand-600 uppercase tracking-[0.3em] text-sm mb-8 animate-fade-in-up">Error 404</p>
        
        <h1 className="font-display text-7xl md:text-9xl font-bold uppercase tracking-tighter mb-8 leading-none">
          Lost <br />
          <span className="text-outline">In Code</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-12 max-w-lg mx-auto">
          The page you're looking for has been moved, deleted, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-display font-bold uppercase tracking-widest hover:bg-brand-100 transition-all group"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          
          <Link 
            href="/our-work" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white font-display font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>View Portfolio</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-600 text-[10px] font-display font-bold uppercase tracking-[0.5em]">
        Dreamy Codes &copy; 2026
      </div>
    </div>
  );
}
