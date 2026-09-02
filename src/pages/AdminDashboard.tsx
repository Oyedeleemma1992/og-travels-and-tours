import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, LayoutDashboard, Map, Image as ImageIcon, MessageSquare, Settings, Users, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'home', label: 'Homepage Content', icon: Home },
    { id: 'packages', label: 'Vacation Packages', icon: Map },
    { id: 'blog', label: 'Blog Management', icon: BookOpen },
    { id: 'testimonials', label: 'Testimonials & Reviews', icon: Users },
    { id: 'media', label: 'Media Gallery', icon: ImageIcon },
    { id: 'inquiries', label: 'Inquiries & Bookings', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-blue-950 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-blue-900">
          <h2 className="text-2xl font-bold text-yellow-500">Admin Portal</h2>
          <p className="text-blue-200 text-sm mt-1">Manage Website Content</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id 
                    ? "bg-blue-900 text-white" 
                    : "text-blue-200 hover:bg-blue-900/50 hover:text-white"
                )}
              >
                <tab.icon className="mr-3 h-5 w-5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-blue-200 hover:bg-red-900/50 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Header (minimal) */}
      <div className="md:hidden flex items-center justify-between bg-blue-950 p-4 text-white">
        <h2 className="text-xl font-bold text-yellow-500">Admin Portal</h2>
        <button onClick={handleLogout}><LogOut className="h-6 w-6" /></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 mt-1">Manage and update your website content.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
            <Settings className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Cloud Database Required</h3>
            <p className="text-slate-500 max-w-md">
              The {tabs.find(t => t.id === activeTab)?.label} module is being initialized. 
              The system requires a cloud database (Firestore) to securely store and manage your content, packages, and images.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
