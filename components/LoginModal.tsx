import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ocean-deep/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content - Dynamic sizing added */}
      <div 
        className={`relative w-[95%] sm:w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#051923] rounded-[2rem] shadow-2xl border border-white/10 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'} p-6 md:p-8 custom-scrollbar`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-ocean-deep/5 dark:border-white/10 p-4">
             <img 
               src="https://i.imgur.com/CQCKjQM.png" 
               alt="Dyesabel Logo" 
               className="w-full h-full object-contain drop-shadow-md"
             />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-ocean-deep dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-ocean-deep/60 dark:text-gray-400 mt-2 text-sm font-medium">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-ocean-deep dark:text-gray-300 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Enter your username"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-ocean-deep dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all font-medium placeholder:font-normal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-ocean-deep dark:text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-blue transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-ocean-deep dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all font-medium placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ocean-deep dark:hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <a href="#" className="text-xs font-bold text-primary-blue dark:text-primary-cyan hover:underline hover:text-primary-cyan dark:hover:text-primary-blue transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-ocean-deep to-primary-blue hover:from-primary-blue hover:to-primary-cyan text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-cyan/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg tracking-wide mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};