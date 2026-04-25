import { useState, useRef } from 'react';
import { Upload, X, Loader2, Copy, Check, FileText } from 'lucide-react';
import { bulkUploadFiles } from '../../services/api';
import { formatImgUrl } from '../../utils/formatters';

export default function BulkUploader() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const data = await bulkUploadFiles(files);
      // API returns { urls: [...], message: '...' } — extract the urls array
      const urlList = Array.isArray(data) ? data : (data.urls || []);
      const mapped = urlList.map((url, i) => ({
        url,
        originalName: files[i]?.name || `file-${i}`
      }));
      setResults(prev => [...mapped, ...prev]);
    } catch (err) {
      alert('Bulk upload failed: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadCSV = () => {
    const headers = 'Original Name,Public URL\n';
    const rows = results.map(r => `"${r.originalName}","${r.url}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uploaded_images_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-800">Bulk Image Uploader</h2>
          <p className="text-xs text-gray-400 font-medium">Upload multiple images and get URLs for CSV bulk loading</p>
        </div>
        <div className="flex gap-2">
            {results.length > 0 && (
                <button 
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                >
                  <FileText size={14} /> Download Map (CSV)
                </button>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:bg-gray-400"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
        </div>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <div className="p-6">
        {results.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <Upload className="mx-auto h-12 w-12 text-gray-200 mb-4" />
            <p className="text-sm text-gray-400 font-medium">No files uploaded yet. Select files to generate URLs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Original Name</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Public URL</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map((res, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={formatImgUrl(res.url)} alt="Uploaded" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-4 text-xs font-bold text-gray-700">{res.originalName}</td>
                    <td className="py-4 font-mono text-[10px] text-blue-500 truncate max-w-[300px]">{res.url}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => copyToClipboard(res.url, idx)}
                        className={`p-2 rounded-lg transition-all ${copiedIndex === idx ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
                      >
                        {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
