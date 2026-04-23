const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ProductManager.jsx', 'utf-8');

// 1. Add isSaving state
content = content.replace(
  /const \[loading, setLoading\] = useState\(true\);/,
  `const [loading, setLoading] = useState(true);\n  const [isSaving, setIsSaving] = useState(false);`
);

// 2. Update handleSave to use isSaving
content = content.replace(
  /const handleSave = async \(e\) => \{[\s\S]*?load\(\);\n  \};/,
  `const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const pId = editing.id || editing.id;
      if (pId) await updateProduct(pId, editing);
      else await createProduct(editing);
      setEditing(null);
      load();
    } catch (err) {
      alert('Error saving card: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };`
);

// 3. Remove 'required' from Card Name input
content = content.replace(
  /<label className="text-\[10px\] font-black uppercase tracking-widest text-gray-400">Card Name \*\<\/label>\s*<input required value=\{editing\.name \|\| ''\}/g,
  `<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Card Name (Optional)</label>\n            <input value={editing.name || ''}`
);

// 4. Disable submit button while saving
content = content.replace(
  /<button type="submit" className="px-6 py-2\.5 bg-blue-600/g,
  `<button type="submit" disabled={isSaving} className={\`px-6 py-2.5 \${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} `
);

fs.writeFileSync('src/pages/admin/ProductManager.jsx', content, 'utf-8');
