import { useState } from 'react';
import AppLayout from '../../layouts/AppLayout';
import ClockWidget from '../../components/ClockWidget';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { uploadPhotos, submitActivation } from '../../api/employee';
import { MapPinIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const LOCATIONS = ['DUT', 'UKZN', 'MUT'];

export default function EmployeeHome() {
  const [location, setLocation] = useState('');
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [batchId, setBatchId] = useState(null);
  const [customers, setCustomers] = useState([{ first_name: '', surname: '', id_number: '' }]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function addCustomer() {
    setCustomers(prev => [...prev, { first_name: '', surname: '', id_number: '' }]);
  }
  function removeCustomer(i) {
    setCustomers(prev => prev.filter((_, idx) => idx !== i));
  }
  function updateCustomer(i, field, value) {
    setCustomers(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  async function handlePhotoUpload() {
    if (!location) return setError('Please select a location first');
    if (photos.length === 0) return setError('Please select at least one photo');
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      photos.forEach(p => fd.append('photos', p));
      const { data } = await uploadPhotos(fd);
      setBatchId(data.batch_id);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!location) return setError('Location is required');
    setSubmitting(true);
    setError('');
    try {
      await submitActivation({ batch_id: batchId, location, customers });
      setSuccess(`Successfully submitted ${customers.length} customer(s)!`);
      setStep(1);
      setPhotos([]);
      setBatchId(null);
      setCustomers([{ first_name: '', surname: '', id_number: '' }]);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ClockWidget />
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MapPinIcon className="w-5 h-5 text-bna-teal" />
            <h3 className="font-semibold text-white">Location</h3>
          </div>
          <select value={location} onChange={e => setLocation(e.target.value)}
            className="w-full bg-bna-black border border-bna-border rounded px-3 py-2 text-white focus:outline-none focus:border-bna-teal">
            <option value="">Select location...</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Card>
      </div>

      {success && <div className="bg-green-900/50 border border-green-600 rounded p-3 mb-4 text-green-300 text-sm">{success}</div>}
      {error && <div className="bg-red-900/50 border border-red-600 rounded p-3 mb-4 text-red-300 text-sm">{error}</div>}

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <PhotoIcon className="w-5 h-5 text-bna-teal" />
          <h3 className="font-semibold text-white">Bulk Activation Upload</h3>
          <span className="ml-auto text-xs text-bna-secondary bg-bna-btn px-2 py-0.5 rounded">Step {step} of 2</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-bna-border rounded-lg p-6 text-center">
              <input type="file" multiple accept="image/*,application/pdf" className="hidden" id="photos"
                onChange={e => setPhotos(Array.from(e.target.files))} />
              <label htmlFor="photos" className="cursor-pointer">
                <PhotoIcon className="w-10 h-10 text-bna-secondary mx-auto mb-2" />
                <p className="text-bna-secondary text-sm">Click to select activation photos</p>
                {photos.length > 0 && <p className="text-bna-teal text-sm mt-1">{photos.length} file(s) selected</p>}
              </label>
            </div>
            <Button onClick={handlePhotoUpload} disabled={uploading} variant="primary">
              {uploading ? 'Uploading...' : 'Upload Photos & Continue'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-bna-secondary text-sm">Photos uploaded. Now enter customer details:</p>
            <div className="space-y-3">
              {customers.map((c, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-bna-black/50 p-3 rounded">
                  <input placeholder="First Name*" value={c.first_name} onChange={e => updateCustomer(i, 'first_name', e.target.value)}
                    className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white placeholder-bna-secondary text-sm focus:outline-none focus:border-bna-teal" />
                  <input placeholder="Surname*" value={c.surname} onChange={e => updateCustomer(i, 'surname', e.target.value)}
                    className="bg-bna-dark border border-bna-border rounded px-3 py-2 text-white placeholder-bna-secondary text-sm focus:outline-none focus:border-bna-teal" />
                  <div className="flex gap-2">
                    <input placeholder="ID Number" value={c.id_number} onChange={e => updateCustomer(i, 'id_number', e.target.value)}
                      className="flex-1 bg-bna-dark border border-bna-border rounded px-3 py-2 text-white placeholder-bna-secondary text-sm focus:outline-none focus:border-bna-teal" />
                    {customers.length > 1 && (
                      <button onClick={() => removeCustomer(i)} className="text-red-400 hover:text-red-300 px-2">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={addCustomer} variant="ghost">
                <PlusIcon className="w-4 h-4 mr-1 inline" /> Add Customer
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} variant="primary">
                {submitting ? 'Submitting...' : `Submit ${customers.length} Customer(s)`}
              </Button>
              <Button onClick={() => { setStep(1); setPhotos([]); setBatchId(null); }} variant="ghost">Back</Button>
            </div>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
