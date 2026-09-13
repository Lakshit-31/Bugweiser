import AdminApp from '@/admin-frontend/AdminApp';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return <AdminApp onLogout={onLogout} />;
}
