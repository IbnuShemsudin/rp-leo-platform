import React, { useState, useRef } from 'react';

export default function UploadFile({ onUploadSuccess, uploadType = 'mous' }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // FIX 1: Access the first item to get the actual File binary
  const handleFileChange = (e) => {
  const selectedFiles = e.target.files;
  if (selectedFiles && selectedFiles.length > 0) {
    setFile(selectedFiles[0]); // ✅ FIX
  }
};

  const uploadFile = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    // This now sends the binary file correctly
    formData.append('file', file);
    formData.append('type', uploadType); 

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : prev));
      }, 100);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          onUploadSuccess(data.file);
          setUploading(false);
          setFile(null);
          setProgress(0);
        }, 500);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Uplink Error:", err);
      alert("Uplink Interrupted: " + err.message);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          // FIX 2: Again, grab the first file from the drop event
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]); // ✅ FIX
          }
        }}
        className={`relative group border-2 border-dashed rounded-[32px] p-10 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden ${
          isDragging ? 'border-rp-blue bg-rp-blue/10 scale-[1.02]' : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <div className="absolute inset-0 bg-rp-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.doc,.docx,.jpg,.png"
        />

        {!file ? (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-2xl">
              📂
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Drop Document Here</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">or click to browse local drive</p>
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="mt-2 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Select File
            </button>
          </>
        ) : (
          <div className="animate-in zoom-in duration-300 flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full">
              <div className="text-2xl">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{file.name}</p>
                <p className="text-[8px] font-bold text-rp-gold uppercase">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setFile(null)}
                className="text-gray-500 hover:text-rose-500 transition-colors px-2"
              >
                ✕
              </button>
            </div>

            {uploading ? (
              <div className="w-full space-y-2">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rp-blue transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[8px] font-black text-rp-blue uppercase tracking-widest text-center">Encrypting & Uploading... {progress}%</p>
              </div>
            ) : (
              <button 
                type="button"
                onClick={uploadFile}
                className="w-full py-4 bg-rp-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Initiate Data Uplink
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}