import React, { useState, useRef } from 'react';

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UploadFile({
  onUploadSuccess,
  uploadType = 'mous'
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      setUploadError('');
      setFile(selectedFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadError('');
      setFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', uploadType);

    let interval;

    try {
      // fake progress animation
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 150);

      const response = await fetch(
        `${API}/api/upload/pdf`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned invalid response. Check backend.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.msg || data.message || "Upload failed");
      }

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        // ✅ FIXED: safer extraction
        const filename =
          data.file?.filename ||
          data.file?.name ||
          data.filename ||
          file.name;

        // URL for preview/download
        const fileUrl =
          data.file?.url ||
          data.url ||
          `${API}/uploads/${filename}`;

        console.log("✅ Uploaded File:", { filename, url: fileUrl });

        // ✅ IMPORTANT FIX: send object (NOT string)
        onUploadSuccess({
          filename,
          url: fileUrl
        });

        setUploading(false);
        setFile(null);
        setProgress(0);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 500);

    } catch (err) {
      console.error("🚨 Upload Error:", err);

      clearInterval(interval);

      setUploadError(err.message);

      alert("Upload failed: " + err.message);

      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full space-y-4">

      {uploadError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
            🚨 {uploadError}
          </p>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative group border-2 border-dashed rounded-[32px] p-10 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden ${
          isDragging
            ? 'border-rp-blue bg-rp-blue/10 scale-[1.02]'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />

        {!file ? (
          <>
            <div className="text-3xl">📂</div>

            <p className="text-[10px] font-black text-white uppercase tracking-widest">
              Drop PDF or Click to Upload
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase rounded-xl"
            >
              Select File
            </button>
          </>
        ) : (
          <div className="w-full space-y-4">

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
              <div>
                <p className="text-white text-[10px] font-black uppercase">
                  {file.name}
                </p>
                <p className="text-[8px] text-rp-gold">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setUploadError('');
                }}
                className="text-rose-400"
              >
                ✕
              </button>
            </div>

            {uploading ? (
              <div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rp-blue transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[8px] text-center text-rp-blue font-black mt-2">
                  Uploading... {progress}%
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={uploadFile}
                className="w-full py-4 bg-rp-blue text-white rounded-2xl font-black uppercase text-[10px]"
              >
                Upload Document
              </button>
            )}

          </div>
        )}
      </div>
    </div>
  );
}