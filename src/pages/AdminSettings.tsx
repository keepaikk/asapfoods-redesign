import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Save, Upload, Link } from 'lucide-react';

interface SiteSettings {
  heroImage: string;
  logoImage: string;
  eventBanner: string;
  phone: string;
  whatsappMessage: string;
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantAddress?: string;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      onChange(res.url);
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            mode === 'url' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Link className="h-3 w-3" /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            mode === 'upload' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Upload className="h-3 w-3" /> Upload
        </button>
      </div>
      {mode === 'url' ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 file:font-bold hover:file:bg-orange-100"
          />
          {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
        </div>
      )}
      {value && (
        <img
          src={value}
          alt={label}
          className="mt-2 w-full h-32 object-cover rounded-lg"
        />
      )}
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroImage: '',
    logoImage: '',
    eventBanner: '',
    phone: '',
    whatsappMessage: '',
    restaurantLat: 5.6891,
    restaurantLng: -0.1869,
    restaurantAddress: 'Kwabenya, Accra, Ghana',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      alert('Settings saved!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
      <h2 className="text-lg font-black">Site Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageField
            label="Hero Image"
            value={settings.heroImage}
            onChange={(url) => setSettings({ ...settings, heroImage: url })}
          />
          <ImageField
            label="Logo Image"
            value={settings.logoImage}
            onChange={(url) => setSettings({ ...settings, logoImage: url })}
          />
          <div className="md:col-span-2">
            <ImageField
              label="Event Banner"
              value={settings.eventBanner}
              onChange={(url) => setSettings({ ...settings, eventBanner: url })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">WhatsApp Phone Number</label>
            <input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">WhatsApp Default Message</label>
            <input
              value={settings.whatsappMessage}
              onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="md:col-span-2 border-t pt-4 mt-2">
            <p className="text-xs font-bold uppercase mb-3 text-gray-500">Restaurant Location</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={settings.restaurantLat ?? ''}
                  onChange={(e) => setSettings({ ...settings, restaurantLat: parseFloat(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={settings.restaurantLng ?? ''}
                  onChange={(e) => setSettings({ ...settings, restaurantLng: parseFloat(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase mb-1">Address</label>
                <input
                  value={settings.restaurantAddress || ''}
                  onChange={(e) => setSettings({ ...settings, restaurantAddress: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors disabled:opacity-50"
        >
          <Save className="inline h-4 w-4 mr-1" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
