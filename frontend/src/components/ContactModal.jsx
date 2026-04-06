import React from 'react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    // FIXED: Added z- to ensure it stays above the Home page z-10 layers
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      
      {/* Background Overlay: Changed bg-rp-slate to a more cinematic transparent black */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="glass-panel w-full max-w-xl rounded-[40px] border border-white/10 p-10 relative z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-rp-gold animate-pulse"></div>
            <h3 className="text-[10px] font-black text-rp-gold uppercase tracking-[0.4em]">
              Secure Link Established
            </h3>
          </div>
          <p className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
            Initialize <span className="text-rp-blue italic">Correspondence</span>
          </p>
        </header>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Organization</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-rp-blue focus:bg-white/10 outline-none transition-all font-bold" 
                placeholder="Institution Name" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Priority Level</label>
              <div className="relative">
                <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-rp-blue focus:bg-white/10 outline-none transition-all appearance-none font-bold cursor-pointer">
                  <option className="bg-rp-slate text-white">Routine Partnership</option>
                  <option className="bg-rp-slate text-white">Regional Integration</option>
                  <option className="bg-rp-slate text-white">Urgent Infrastructure</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Message Payload</label>
            <textarea 
              rows="4" 
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:border-rp-blue focus:bg-white/10 outline-none transition-all resize-none font-medium" 
              placeholder="Briefly describe the collaborative goal..."
            ></textarea>
          </div>

          <button 
            type="button" 
            className="w-full bg-rp-blue text-white font-black uppercase tracking-[0.3em] text-[11px] py-6 rounded-2xl shadow-xl shadow-blue-900/40 hover:bg-rp-gold hover:text-white transition-all active:scale-[0.98]"
          >
            Transmit Signal
          </button>
        </form>

        <button 
          onClick={onClose} 
          className="mt-8 w-full text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] hover:text-white transition-colors flex items-center justify-center gap-2 group"
        >
          <span className="w-4 h-[1px] bg-gray-800 group-hover:bg-white transition-all"></span>
          Abort Communication
          <span className="w-4 h-[1px] bg-gray-800 group-hover:bg-white transition-all"></span>
        </button>
      </div>
    </div>
  );
}