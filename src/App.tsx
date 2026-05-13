import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import AdminLayout from '@/pages/AdminLayout';
import AdminMenu from '@/pages/AdminMenu';
import AdminSettings from '@/pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminMenu />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
