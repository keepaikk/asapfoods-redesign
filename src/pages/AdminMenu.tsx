import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plus, Pencil, Trash2, Star, Upload, Link } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  featured?: boolean;
  available?: boolean;
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    popular: false,
    featured: false,
    available: true,
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allItems, cats] = await Promise.all([
        api.getMenuAll(),
        api.getCategories(),
      ]);
      setItems(allItems);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      popular: false,
      featured: false,
      available: true,
    });
    setEditing(null);
    setImageMode('url');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
    };
    try {
      if (editing) {
        await api.updateMenuItem(editing.id, payload);
      } else {
        await api.createMenuItem(payload);
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      popular: item.popular || false,
      featured: item.featured || false,
      available: item.available !== false,
    });
    setImageMode('url');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    await api.deleteMenuItem(id);
    fetchData();
  };

  const toggleField = async (id: string, field: string, value: boolean) => {
    await api.updateMenuItem(id, { [field]: value });
    fetchData();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border space-y-4"
      >
        <h2 className="text-lg font-black">
          {editing ? 'Edit Item' : 'Add New Item'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Price (GH₵)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Category</label>
            <input
              list="categories"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Image</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  imageMode === 'url' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Link className="h-3 w-3" /> URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  imageMode === 'upload' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Upload className="h-3 w-3" /> Upload
              </button>
            </div>
            {imageMode === 'url' ? (
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                required={!editing}
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 file:font-bold hover:file:bg-orange-100"
                />
                {uploading && (
                  <p className="text-xs text-gray-500">Uploading...</p>
                )}
              </div>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={2}
              required
            />
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => setForm({ ...form, popular: e.target.checked })}
            />
            Popular
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
            />
            Available
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors"
          >
            {editing ? 'Update Item' : (<><Plus className="inline h-4 w-4 mr-1" /> Add Item</>)}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-full text-sm font-bold border hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-bold">Image</th>
              <th className="px-4 py-3 text-left font-bold">Name</th>
              <th className="px-4 py-3 text-left font-bold">Category</th>
              <th className="px-4 py-3 text-left font-bold">Price</th>
              <th className="px-4 py-3 text-left font-bold">Flags</th>
              <th className="px-4 py-3 text-left font-bold">Available</th>
              <th className="px-4 py-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3 font-bold">{item.name}</td>
                <td className="px-4 py-3 text-gray-600">{item.category}</td>
                <td className="px-4 py-3 font-bold">GH₵{item.price}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {item.popular && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">Popular</span>
                    )}
                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">Featured</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleField(item.id, 'available', !item.available)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.available !== false ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.available !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
