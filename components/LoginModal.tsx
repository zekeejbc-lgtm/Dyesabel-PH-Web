import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, User, Lock, Info } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{message: string, visible: boolean} | null>(null);

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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setToast({ message: "Please contact the administrator or local chapter officer for assistance.", visible: true });
    
    // Hide toast after 4 seconds
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(username);
      // Reset form
      setUsername('');
      setPassword('');
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-ocean-deep/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Toast Notification */}
      <div className={`absolute top-10 left-0 right-0 z-[110] flex justify-center pointer-events-none transition-all duration-500 ${toast?.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-ocean-deep text-white px-6 py-4 rounded-xl shadow-2xl border border-primary-cyan/30 flex items-center gap-3 backdrop-blur-xl max-w-sm mx-4 pointer-events-auto">
          <div className="p-2 bg-primary-cyan/20 rounded-full text-primary-cyan">
             <Info size={20} />
          </div>
          <p className="text-sm font-medium leading-tight">{toast?.message}</p>
          <button 
            onClick={() => setToast(prev => prev ? { ...prev, visible: false } : null)}
            className="ml-2 text-white/50 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

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
          <div className="relative inline-block group cursor-default mb-6">
             {/* Glow Effect matching Header mechanism */}
             <div className="absolute inset-0 bg-primary-cyan/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             
             <img 
               src="https://i.imgur.com/CQCKjQM.png" 
               alt="Dyesabel Logo" 
               className="relative w-24 h-24 object-contain rounded-full z-10 drop-shadow-xl transform transition-transform duration-300"
             />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-ocean-deep dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-ocean-deep/60 dark:text-gray-400 mt-2 text-sm font-medium">Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-ocean-deep dark:text-gray-300 ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-blue transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-primary-blue dark:text-primary-cyan hover:underline hover:text-primary-cyan dark:hover:text-primary-blue transition-colors focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-ocean-deep to-primary-blue hover:from-primary-blue hover:to-primary-cyan text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-cyan/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg tracking-wide mt-4"
          >
            Sign In
          </button>
          
          <div className="text-center text-xs text-gray-500 mt-2">
            Demo Logins: "auditor", "admin", "head"
          </div>
        </form>
      </div>
    </div>
  );
};