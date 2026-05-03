import React, { useState } from 'react';
import { Lock, User, LogIn, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoIpnu from 'figma:asset/bde25cb6a659b7414d1d129468dba2c65f9589ed.png';
import logoIppnu from 'figma:asset/b163ae915bad27a92607ddcc8024114d2a613bba.png';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl" />
      
      {/* Animated Watermark Logos */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <ImageWithFallback src={logoIpnu} alt="" className="w-96 h-96 rotate-12" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex -space-x-4 mb-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-white rounded-3xl p-3 shadow-xl shadow-emerald-900/10 border border-emerald-100 z-10"
            >
              <ImageWithFallback src={logoIpnu} alt="IPNU" className="w-full h-full object-contain" />
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-20 h-20 bg-white rounded-3xl p-3 shadow-xl shadow-emerald-900/10 border border-emerald-100"
            >
              <ImageWithFallback src={logoIppnu} alt="IPPNU" className="w-full h-full object-contain" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-black text-emerald-900 tracking-tighter uppercase text-center">
            E-Arsip <br/> 
            <span className="text-emerald-600 text-sm tracking-widest font-bold">Desa Curug</span>
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl shadow-emerald-900/20 border border-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:text-emerald-700 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 group-focus-within:text-emerald-700 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all border-b-4 border-emerald-900/20 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk Sekarang <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-emerald-800/40 font-bold uppercase tracking-tighter">
            Pimpinan Ranting IPNU IPPNU <br/> Desa Curug &copy; 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
};
