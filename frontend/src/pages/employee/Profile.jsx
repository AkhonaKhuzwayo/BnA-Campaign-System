import { useState, useEffect } from 'react';
import AppLayout from '../../layouts/AppLayout';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { getProfile, updateProfile, uploadDocument, getDocuments } from '../../api/employee';

const DOC_TYPES = [
  { key: 'id_copy', label: 'Certified ID Copy' },
  { key: 'bank_proof', label: 'Proof of Bank' },
  { key: 'residence', label: 'Proof of Residence' },
  { key: 'contract', label: 'Signed Contract' },
];

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [homeAddress, setHomeAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState({});

  useEffect(() => {
    getProfile().then(r => { setProfile(r.data); setHomeAddress(r.data.home_address || ''); });
    getDocuments().then(r => setDocuments(r.data));
  }, []);

  async function saveAddress(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      await updateProfile({ home_address: homeAddress });
      setSaveMsg('Address saved!');
    } catch (err) {
      setSaveMsg(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDocUpload(docType, file) {
    setUploadingDoc(p => ({...p, [docType]: true}));
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('document_type', docType);
      await uploadDocument(fd);
      const r = await getDocuments();
      setDocuments(r.data);
    } catch {}
    setUploadingDoc(p => ({...p, [docType]: false}));
  }

  const uploadedTypes = new Set(documents.map(d => d.document_type));

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-white mb-6">My Profile</h1>
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="font-semibold text-white mb-4">Personal Information</h2>
            <div className="space-y-3">
              {[['First Name', profile.first_name], ['Last Name', profile.last_name], ['Phone', profile.phone], ['Email', profile.email]].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-bna-secondary text-sm">{label}</span>
                  <span className="text-white text-sm">{value || '—'}</span>
                </div>
              ))}
            </div>
            <form onSubmit={saveAddress} className="mt-4 space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-bna-secondary">Home Address</label>
                <textarea value={homeAddress} onChange={e => setHomeAddress(e.target.value)} rows={3}
                  className="bg-bna-black border border-bna-border rounded px-3 py-2 text-white placeholder-bna-secondary focus:outline-none focus:border-bna-teal resize-none" />
              </div>
              {saveMsg && <p className="text-bna-teal text-xs">{saveMsg}</p>}
              <Button type="submit" variant="primary" disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</Button>
            </form>
          </Card>
          <Card>
            <h2 className="font-semibold text-white mb-4">Documents</h2>
            <div className="space-y-3">
              {DOC_TYPES.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-bna-black/50 rounded p-3">
                  <div>
                    <p className="text-white text-sm">{label}</p>
                    {uploadedTypes.has(key)
                      ? <span className="text-xs text-green-400">✓ Uploaded</span>
                      : <span className="text-xs text-bna-secondary">Not uploaded</span>}
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                      onChange={e => e.target.files[0] && handleDocUpload(key, e.target.files[0])} />
                    <span className="text-xs bg-bna-btn hover:bg-bna-btn-hover text-white px-3 py-1 rounded transition-colors">
                      {uploadingDoc[key] ? 'Uploading...' : uploadedTypes.has(key) ? 'Replace' : 'Upload'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  );
}
