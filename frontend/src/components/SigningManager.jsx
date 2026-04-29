import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SigningManager({ mouId, partnerName, onComplete }) {
  const { token } = useAuth();
  const [isSigning, setIsSigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleApprove = async () => {
    setIsSigning(true);
    
    // Artificial delay to simulate "Digital Encryption/Verification"
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/mou/sign/${mouId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        });

        if (response.ok) {
          setIsSuccess(true);
          setTimeout(() => {
            onComplete(); // Refresh the dashboard
            setIsSigning(false);
          }, 2000);
        } else {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.msg || body.message || 'Signing failed');
        }
      } catch (err) {
        console.error("Signing Error:", err);
        alert(err.message || 'Unable to sign MoU');
        setIsSigning(false);
      }
    }, 1500);
  };

  return (
    <div className="relative">
      {!isSuccess ? (
        <button 
          onClick={handleApprove}
          disabled={isSigning}
          className={`relative overflow-hidden group px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            isSigning 
            ? 'bg-rp-slate border-white/10 text-gray-500 cursor-wait' 
            : 'bg-rp-blue border-rp-accent/30 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95'
          }`}
        >
          <span className={isSigning ? 'opacity-0' : 'opacity-100'}>Authorize & Sign</span>
          
          {isSigning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-rp-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      ) : (
        <div className="flex items-center gap-2 text-emerald-400 animate-fade-up">
          <span className="text-lg">Verified</span>
          <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Overlay Modal for the "Signing Ceremony" */}
      {isSigning && !isSuccess && (
        <div className="fixed inset-0 z- flex items-center justify-center bg-rp-slate/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel p-12 rounded-[40px] border border-white/10 text-center max-w-sm space-y-6 shadow-2xl">
            <div className="relative inline-block">
               <div className="w-24 h-24 border-2 border-rp-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl animate-pulse">🖋️</span>
               </div>
               <div className="absolute inset-0 border-2 border-rp-gold rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Executive Authorization</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Applying Digital Seal for <br/>
                <span className="text-rp-gold">{partnerName}</span>
              </p>
            </div>
            
            <div className="h-1 w-32 bg-white/5 mx-auto rounded-full overflow-hidden">
               <div className="h-full bg-rp-blue animate-shimmer"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}