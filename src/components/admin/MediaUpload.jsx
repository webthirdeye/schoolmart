import { useState, useRef } from 'react';
import { Upload, X, Loader2, Play, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../../services/api';
import { formatImgUrl } from '../../utils/formatters';

export default function MediaUpload({ value, onChange, label = "Media" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$|^data:video\//i) || url.includes('/video/') || url.includes('vimeo') || url.includes('youtube');
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB for videos
      setError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const res = await uploadFile(file);
      onChange(res.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</label>
        {value && (
          <button 
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1"
          >
            <X size={10} /> Remove
          </button>
        )}
      </div>

      <div className="relative group">
        {value ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
            {isVideo(value) ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <video src={formatImgUrl(value)} className="max-w-full max-h-full" muted />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={32} className="text-white opacity-70" />
                </div>
              </div>
            ) : (
              <img src={formatImgUrl(value)} alt="Preview" className="w-full h-full object-contain" />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 backdrop-blur text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white flex items-center gap-1.5 transition-all"
              >
                <Upload size={12} /> Replace
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 group"
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-blue-500" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Upload size={20} />
                </div>
                <div className="text-center px-4">
                  <p className="text-xs font-bold">Click to upload Media</p>
                  <p className="text-[9px] font-medium opacity-60">Images or MP4 Videos (Max 10MB)</p>
                </div>
              </>
            )}
          </button>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*,video/*" 
          className="hidden" 
        />
      </div>

      <div className="mt-2">
         <input 
           type="text" 
           value={value || ''} 
           onChange={e => onChange(e.target.value)}
           placeholder="URL: https://... (or upload above)"
           className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500"
         />
      </div>

      {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}
    </div>
  );
}
