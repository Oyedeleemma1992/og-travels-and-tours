import { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, Package, Plane, Hotel, BookOpen, MessageSquare, Phone, LogOut, Plus, LogIn, X, Trash2, Edit, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStorage, setStorage, generateId } from '../lib/storage';
import { mockPackages } from '../data';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/v1/vacations');
      if (response.ok) {
        const data = await response.json();
        setPackages(Array.isArray(data) ? data : []);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.warn("API not available for admin packages, falling back to local storage");
      let pkg = getStorage('vacation_packages');
      if (!pkg || pkg.length === 0) {
        setStorage('vacation_packages', mockPackages);
        pkg = mockPackages;
      } else {
        const needsUpdate = pkg.some((p) => p.images && p.images.length < 5);
        if (needsUpdate) {
          pkg = mockPackages;
          setStorage('vacation_packages', mockPackages);
        }
      }
      setPackages(pkg);
    }

    // Others from localStorage
    setFlights(getStorage('flight_bookings') || []);
    setHotels(getStorage('hotel_reservations') || []);
    setContacts(getStorage('contact_messages') || []);
    
    // Fetch blogs from API
    try {
      const response = await fetch('/api/v1/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(Array.isArray(data) ? data : []);
      } else {
        setBlogs(getStorage('blog_posts') || []);
      }
    } catch(err) {
      console.warn("API not available for admin blogs, falling back to local storage");
      setBlogs(getStorage('blog_posts') || []);
    }

    // Fetch reviews from API
    try {
      const response = await fetch('/api/v1/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } else {
        setReviews(getStorage('reviews') || []);
      }
    } catch(err) {
      console.warn("API not available for admin reviews, falling back to local storage");
      setReviews(getStorage('reviews') || []);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Oluwasambo2020@') {
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
  };

  const tabs = [
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'flights', label: 'Flight Bookings', icon: Plane },
    { id: 'hotels', label: 'Hotel Reservations', icon: Hotel },
    { id: 'blogs', label: 'Blog Posts', icon: BookOpen },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'contacts', label: 'Contacts', icon: Phone },
  ];

  const deleteItem = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    
    if (type === 'blogs') {
      try {
        const res = await fetch(`/api/v1/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
          return;
        } else {
          alert('Failed to delete blog via API. Deleting locally.');
        }
      } catch (err) {
        console.warn('API not available for deleting blog, deleting locally.');
      }
    } else if (type === 'packages') {
      try {
        const res = await fetch(`/api/v1/vacations/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
          return;
        } else {
          alert('Failed to delete package via API. Deleting locally.');
        }
      } catch (err) {
        console.warn('API not available for deleting package, deleting locally.');
      }
    }

    const listMap = {
      'packages': { list: packages, set: setPackages, key: 'vacation_packages' },
      'flights': { list: flights, set: setFlights, key: 'flight_bookings' },
      'hotels': { list: hotels, set: setHotels, key: 'hotel_reservations' },
      'blogs': { list: blogs, set: setBlogs, key: 'blog_posts' },
      'reviews': { list: reviews, set: setReviews, key: 'reviews' },
      'contacts': { list: contacts, set: setContacts, key: 'contact_messages' },
    };
    const conf = listMap[type];
    const updated = conf.list.filter(item => (item.id || item._id) !== id);
    conf.set(updated);
    setStorage(conf.key, updated);
  };

  // State for forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [currentEdit, setCurrentEdit] = useState(null);
  
  const openForm = (type, item = null) => {
    setFormType(type);
    setCurrentEdit(item || (type === 'blogs' ? { author: 'Kayode Oyedele' } : {}));
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const conf = {
      'packages': { list: packages, set: setPackages, key: 'vacation_packages' },
      'blogs': { list: blogs, set: setBlogs, key: 'blog_posts' },
      'reviews': { list: reviews, set: setReviews, key: 'reviews' }
    }[formType];
    
    if (formType === 'blogs') {
      try {
        const toTitleCase = (str) => {
          return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
        };
        
        const formData = new FormData();
        formData.append('title', toTitleCase(currentEdit.title || ''));
        if (currentEdit.excerpt) formData.append('excerpt', currentEdit.excerpt);
        formData.append('content', currentEdit.content || '');
        formData.append('author', currentEdit.author || 'Kayode Oyedele');
        if (currentEdit.imageFile) {
          formData.append('image', currentEdit.imageFile);
        }

        const url = currentEdit.id || currentEdit._id ? `/api/v1/blogs/${currentEdit.id || currentEdit._id}` : '/api/v1/blogs';
        const method = currentEdit.id || currentEdit._id ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          body: formData
        });
        if (response.ok) {
          setIsFormOpen(false);
          fetchData();
          return;
        } else {
          alert(`Failed to save blog via API (${response.status}). Saving locally instead.`);
        }
      } catch (err) {
        console.error('Error saving blog:', err);
        alert('Error saving blog to API. Saving locally instead.');
      }
    }

    if (formType === 'packages') {
      try {
        const formData = new FormData();
        if (currentEdit.id || currentEdit._id) {
          formData.append('id', currentEdit.id || currentEdit._id);
        }
        formData.append('title', currentEdit.title || '');
        formData.append('destination', currentEdit.destination || '');
        formData.append('description', currentEdit.overview || ''); // User said description, we use overview locally
        formData.append('price', currentEdit.price || '');
        
        if (currentEdit.imageFiles && currentEdit.imageFiles.length > 0) {
          Array.from(currentEdit.imageFiles).forEach((file: any) => {
            formData.append('images', file);
          });
        }

        const response = await fetch('/api/v1/vacations/update', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          setIsFormOpen(false);
          fetchData();
          return;
        } else {
          alert('Failed to update package on API. Saving locally instead.');
        }
      } catch (err) {
        console.error('Error updating package:', err);
        alert('Error updating package to API. Saving locally instead.');
      }
    }

    let updated;
    if (!currentEdit.id) {
      updated = [{ ...currentEdit, id: formType === 'packages' ? 'pkg-' + Date.now() : generateId(), date: new Date().toISOString() }, ...conf.list];
    } else {
      updated = conf.list.map(i => i.id === currentEdit.id ? currentEdit : i);
    }
    conf.set(updated);
    setStorage(conf.key, updated);
    
    setIsFormOpen(false);
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full relative">
          <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-blue-950 flex items-center gap-2 text-sm font-medium transition-colors">
            <Home className="w-4 h-4" /> Home
          </Link>
          <div className="flex justify-center mb-6 mt-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-950">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-blue-950 mb-2">Admin Access</h2>
          <p className="text-center text-slate-500 mb-8">Enter the admin password to continue</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
              />
            </div>
            <button type="submit" className="w-full bg-blue-950 text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" /> Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-950 text-white p-6 flex flex-col hidden md:flex fixed h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-8 h-8 text-yellow-500" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 mb-8 text-slate-300 hover:bg-blue-900 hover:text-white rounded-xl transition-colors">
          <Home className="w-5 h-5" /> Back to Website
        </Link>
        <nav className="flex-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-blue-900 text-yellow-500 font-semibold' : 'hover:bg-blue-900/50 text-slate-300'}`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-auto w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Top Bar */}
          <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <Link to="/" className="flex items-center gap-2 text-blue-950 font-bold">
              <Home className="w-5 h-5 text-yellow-500" /> Home
            </Link>
            <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-950 capitalize">{activeTab.replace('_', ' ')}</h2>
            {(activeTab === 'packages' || activeTab === 'blogs' || activeTab === 'reviews') && (
              <button onClick={() => openForm(activeTab)} className="bg-yellow-500 text-blue-950 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New
              </button>
            )}
          </div>

          {/* Table container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">Details</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'packages' && packages.map(pkg => (
                    <tr key={pkg.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{pkg.title}</div>
                        <div className="text-sm text-slate-500">{pkg.destination} - {pkg.price}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openForm('packages', pkg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('packages', pkg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'flights' && flights.map(f => (
                    <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{f.full_name} ({f.email})</div>
                        <div className="text-sm text-slate-500">{f.departure_city} to {f.destination} on {f.departure_date}</div>
                        <div className="text-xs text-slate-400 mt-1">Class: {f.cabin_class} | Adults: {f.adults} | Children: {f.children}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteItem('flights', f.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'hotels' && hotels.map(h => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{h.full_name} ({h.email})</div>
                        <div className="text-sm text-slate-500">{h.destination} | Check-in: {h.check_in_date} | Rooms: {h.rooms}</div>
                        <div className="text-xs text-slate-400 mt-1">Budget: {h.budget} | Preference: {h.hotel_preference}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteItem('hotels', h.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'blogs' && blogs.map(b => (
                    <tr key={b.id || b._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{b.title}</div>
                        <div className="text-sm text-slate-500">Author: {b.author || 'Anonymous'} | Date: {b.date ? new Date(b.date).toLocaleDateString() : 'Recent'}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openForm('blogs', b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('blogs', b.id || b._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'reviews' && reviews.map(r => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{r.name}</div>
                        <div className="text-sm text-slate-500">Rating: {r.rating}/5</div>
                        <div className="text-xs text-slate-400 mt-1">"{r.text}"</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openForm('reviews', r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem('reviews', r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'contacts' && contacts.map(c => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-blue-950">{c.first_name} {c.last_name}</div>
                        <div className="text-sm text-slate-500">{c.email} | Subject: {c.subject || c.service_requested || 'General'}</div>
                        <div className="text-xs text-slate-400 mt-1">"{c.message || c.additional_details}"</div>
                        {c.service_requested === 'Admission Assistance' && (
                          <div className="text-xs text-slate-500 mt-2 bg-slate-100 p-2 rounded">
                            <span className="font-semibold">Dest:</span> {c.study_destination === 'Other' ? c.study_destination_other : c.study_destination} | 
                            <span className="font-semibold"> Lvl:</span> {c.level_of_study === 'Other' ? c.level_of_study_other : c.level_of_study} | 
                            <span className="font-semibold"> Course:</span> {c.preferred_course} | 
                            <span className="font-semibold"> Intake:</span> {c.preferred_intake === 'Other' ? c.preferred_intake_other : c.preferred_intake} <br />
                            <span className="font-semibold">Highest Qual:</span> {c.highest_qualification} ({c.graduation_year}) | 
                            <span className="font-semibold"> Passport:</span> {c.has_passport} | 
                            <span className="font-semibold"> Studied Abroad:</span> {c.studied_abroad}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteItem('contacts', c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeTab === 'packages' && packages.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
              {activeTab === 'flights' && flights.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
              {activeTab === 'hotels' && hotels.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
              {activeTab === 'blogs' && blogs.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
              {activeTab === 'reviews' && reviews.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
              {activeTab === 'contacts' && contacts.length === 0 && <div className="p-8 text-center text-slate-500">No data found.</div>}
            </div>
          </div>
        </div>
      </main>

      {/* Forms Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-blue-950 capitalize">{currentEdit?.id ? 'Edit' : 'Add'} {formType}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formType === 'packages' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input required type="text" value={currentEdit?.title || ''} onChange={e => setCurrentEdit({...currentEdit, title: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                    <input required type="text" value={currentEdit?.destination || ''} onChange={e => setCurrentEdit({...currentEdit, destination: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                      <select value={currentEdit?.price?.includes('₦') ? 'NGN' : 'USD'} onChange={e => {
                        const isNGN = e.target.value === 'NGN';
                        const symbol = isNGN ? '₦' : '$';
                        const num = currentEdit?.price?.replace(/[^0-9,.]/g, '') || '';
                        setCurrentEdit({...currentEdit, price: symbol + num});
                      }} className="w-full rounded-xl border border-slate-300 px-4 py-2">
                        <option value="USD">USD ($)</option>
                        <option value="NGN">Naira (₦)</option>
                      </select>
                    </div>
                    <div className="w-2/3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                      <input required type="text" value={currentEdit?.price?.replace(/[^0-9,.]/g, '') || ''} onChange={e => {
                        const symbol = currentEdit?.price?.includes('₦') ? '₦' : '$';
                        setCurrentEdit({...currentEdit, price: symbol + e.target.value});
                      }} className="w-full rounded-xl border border-slate-300 px-4 py-2" placeholder="e.g. 1,000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image Upload (Select multiple)</label>
                    <input type="file" multiple accept="image/*" onChange={e => {
                      if (e.target.files) {
                        setCurrentEdit({...currentEdit, imageFiles: e.target.files});
                      }
                    }} className="w-full rounded-xl border border-slate-300 px-4 py-2 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Overview</label>
                    <textarea required rows={4} value={currentEdit?.overview || ''} onChange={e => setCurrentEdit({...currentEdit, overview: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2"></textarea>
                  </div>
                </>
              )}
              {formType === 'blogs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input required type="text" value={currentEdit?.title || ''} onChange={e => setCurrentEdit({...currentEdit, title: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
                    <textarea required rows={2} value={currentEdit?.excerpt || ''} onChange={e => setCurrentEdit({...currentEdit, excerpt: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image Upload</label>
                    <input type="file" accept="image/*" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setCurrentEdit({...currentEdit, imageFile: e.target.files[0]});
                      }
                    }} className="w-full rounded-xl border border-slate-300 px-4 py-2 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                    <input type="text" value={currentEdit?.author || ''} onChange={e => setCurrentEdit({...currentEdit, author: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                    <textarea required rows={6} value={currentEdit?.content || ''} onChange={e => setCurrentEdit({...currentEdit, content: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2"></textarea>
                  </div>
                </>
              )}
              {formType === 'reviews' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Author Name</label>
                    <input required type="text" value={currentEdit?.name || ''} onChange={e => setCurrentEdit({...currentEdit, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
                    <input required type="number" min="1" max="5" value={currentEdit?.rating || 5} onChange={e => setCurrentEdit({...currentEdit, rating: parseInt(e.target.value)})} className="w-full rounded-xl border border-slate-300 px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Review Text</label>
                    <textarea required rows={4} value={currentEdit?.text || ''} onChange={e => setCurrentEdit({...currentEdit, text: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2"></textarea>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-blue-950 text-white hover:bg-blue-900 font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
