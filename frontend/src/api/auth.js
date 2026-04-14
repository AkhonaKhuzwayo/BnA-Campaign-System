import api from './client';
export const loginOfficial = (data) => api.post('/auth/login/official', data);
export const loginGuest = (data) => api.post('/auth/login/guest', data);
export const loginAdmin = (data) => api.post('/auth/login/admin', data);
export const selectCampaign = (data) => api.post('/auth/select-campaign', data);
export const getCampaigns = () => api.get('/admin/campaigns');
