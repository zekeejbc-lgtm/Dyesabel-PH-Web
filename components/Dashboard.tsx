
import React, { useState } from 'react';
import { User, Chapter, ChapterActivity } from '../types';
import { 
  LayoutDashboard, Activity, Users, LogOut, Plus, Trash2, 
  Edit2, ShieldAlert, Image, MapPin, UserCircle, Save, 
  X, Calendar, Mail, Phone, Camera, Type
} from 'lucide-react';

interface DashboardProps {
  user: User;
  chapters: Chapter[];
  onUpdateChapters: (chapters: Chapter[]) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, chapters, onUpdateChapters, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'chapters'>('overview');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<ChapterActivity | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Chapter>>({});
  const [activityFormData, setActivityFormData] = useState<Partial<ChapterActivity>>({});

  // Role Checks
  const isAuditor = user.role === 'auditor';
  const isAdmin = user.role === 'admin';
  const isHead = user.role === 'chapter_head';

  const currentChapter = chapters.find(c => c.id === user.chapterId) || chapters[0];

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    onUpdateChapters(chapters.map(c => c.id === updatedChapter.id ? updatedChapter : c));
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const chapter = chapters.find(c => c.id === (isHead ? user.chapterId : isEditing))!;
    const activities = chapter.activities || [];
    
    let newActivities;
    if (activityToEdit) {
      newActivities = activities.map(a => a.id === activityToEdit.id ? { ...a, ...activityFormData } as ChapterActivity : a);
    } else {
      const newActivity = {
        ...activityFormData,
        id: `act-${Date.now()}`,
        imageUrl: activityFormData.imageUrl || `https://picsum.photos/seed/${Date.now()}/400/300`
      } as ChapterActivity;
      newActivities = [newActivity, ...activities];
    }

    handleUpdateChapter({ ...chapter, activities: newActivities });
    setIsAddingActivity(false);
    setActivityToEdit(null);
    setActivityFormData({});
  };

  const handleDeleteActivity = (chapterId: string, activityId: string) => {
    if (window.confirm('Delete this activity?')) {
      const chapter = chapters.find(c => c.id === chapterId)!;
      const newActivities = (chapter.activities || []).filter(a => a.id !== activityId);
      handleUpdateChapter({ ...chapter, activities: newActivities });
    }
  };

  // Add missing handleSave and handleDelete functions
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      const newChapter: Chapter = {
        ...formData,
        id: (formData.name || 'new').toLowerCase().replace(/\s+/g, '-'),
        logo: formData.logo || 'https://i.imgur.com/CQCKjQM.png',
        activities: [],
      } as Chapter;
      onUpdateChapters([...chapters, newChapter]);
      setIsAdding(false);
    } else if (isEditing) {
      const existing = chapters.find(c => c.id === isEditing);
      if (existing) {
        handleUpdateChapter({ ...existing, ...formData });
      }
      setIsEditing(null);
    }
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      onUpdateChapters(chapters.filter(c => c.id !== id));
    }
  };

  // Shared Edit Modal for simple text fields
  const [inlineEditField, setInlineEditField] = useState<{field: keyof Chapter, label: string} | null>(null);

  const handleInlineSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inlineEditField) {
      handleUpdateChapter({ ...currentChapter, ...formData });
      setInlineEditField(null);
    }
  };

  const SystemHealth = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-card p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4">
          <ShieldAlert /> System Diagnosis (Auditor Exclusive)
        </h3>
        <div className="space-y-4">
          <div>
             <div className="flex justify-between text-sm mb-1 text-white"><span>Server Load</span><span>34%</span></div>
             <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-green-500 rounded-full w-[34%]"></div></div>
          </div>
          <div>
             <div className="flex justify-between text-sm mb-1 text-white"><span>Database Health</span><span>98%</span></div>
             <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-blue-500 rounded-full w-[98%]"></div></div>
          </div>
          <div>
             <div className="flex justify-between text-sm mb-1 text-white"><span>API Latency</span><span>45ms</span></div>
             <div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-purple-500 rounded-full w-[15%]"></div></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Chapter Head Editor View - Mirrors ChapterDetail.tsx
  const ChapterHeadEditor = () => {
    const chapter = currentChapter;
    
    return (
      <div className="relative min-h-screen pb-20 -m-6 md:-m-10 bg-ocean-dark overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[45vh] min-h-[350px] flex items-end pb-12 overflow-hidden mb-8">
          <div className="absolute inset-0 z-0">
            <img 
              src={chapter.image || 'https://picsum.photos/1200/600'} 
              alt={chapter.name} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean-dark/40 to-transparent"></div>
            <button 
              onClick={() => { setInlineEditField({field: 'image', label: 'Cover Image URL'}); setFormData({image: chapter.image}); }}
              className="absolute top-10 right-10 p-3 bg-primary-blue hover:bg-primary-cyan text-white rounded-full shadow-xl transition-all z-20 group"
            >
              <Camera size={20} />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-ocean-deep px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Edit Cover</span>
            </button>
          </div>

          <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-2 flex-shrink-0 group">
              <img src={chapter.logo} className="w-full h-full object-cover rounded-full" />
              <button 
                onClick={() => { setInlineEditField({field: 'logo', label: 'Logo URL'}); setFormData({logo: chapter.logo}); }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 size={24} className="text-white" />
              </button>
            </div>
            <div className="text-center md:text-left text-white mb-2 relative group flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{chapter.name}</h1>
                <button onClick={() => { setInlineEditField({field: 'name', label: 'Chapter Name'}); setFormData({name: chapter.name}); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16}/></button>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 font-medium text-lg mt-1 group">
                <MapPin size={20} className="text-primary-cyan" />
                {chapter.location}
                <button onClick={() => { setInlineEditField({field: 'location', label: 'Location'}); setFormData({location: chapter.location}); }} className="p-1 bg-white/10 hover:bg-white/20 rounded-lg text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div className="glass-card p-8 rounded-3xl relative group">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-1 bg-primary-cyan rounded-full"></span>
                  About the Chapter
                  <button onClick={() => { setInlineEditField({field: 'description', label: 'About Description'}); setFormData({description: chapter.description}); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity ml-auto"><Edit2 size={16}/></button>
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {chapter.description || "Start adding your chapter story here..."}
                </p>
              </div>

              {/* Activities CRUD */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-1 bg-primary-blue rounded-full"></span>
                    Recent Activities
                  </h2>
                  <button 
                    onClick={() => { setIsAddingActivity(true); setActivityFormData({}); }}
                    className="flex items-center gap-2 bg-primary-blue hover:bg-primary-cyan px-4 py-2 rounded-xl text-white font-bold transition-all shadow-lg"
                  >
                    <Plus size={18} /> Add Activity
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(chapter.activities || []).map((activity) => (
                    <div key={activity.id} className="glass-card p-5 rounded-2xl flex flex-col md:flex-row gap-6 border border-white/5 hover:border-white/20 transition-all group">
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                        <img src={activity.imageUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <button onClick={() => { setActivityToEdit(activity); setActivityFormData(activity); setIsAddingActivity(true); }} className="p-2 bg-primary-blue rounded-lg text-white"><Edit2 size={16}/></button>
                          <button onClick={() => handleDeleteActivity(chapter.id, activity.id)} className="p-2 bg-red-500 rounded-lg text-white"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 text-primary-cyan text-sm font-bold mb-1">
                          <Calendar size={14} /> <span>{activity.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{activity.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                  {(!chapter.activities || chapter.activities.length === 0) && (
                    <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-2xl text-gray-500">
                      No activities recorded yet. Click 'Add Activity' to show off your chapter's work!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass-card p-8 rounded-3xl border-t-4 border-primary-cyan relative group">
                <h3 className="text-xl font-bold text-white mb-6 flex justify-between">
                  Contact Info
                  <button onClick={() => { setInlineEditField({field: 'email', label: 'Contact Details'}); setFormData({email: chapter.email, phone: chapter.phone, facebook: chapter.facebook}); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16}/></button>
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Mail size={18} className="text-primary-cyan" />
                    <span className="truncate">{chapter.email || 'Email not set'}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Phone size={18} className="text-primary-cyan" />
                    <span>{chapter.phone || 'Phone not set'}</span>
                  </li>
                  <li className="flex items-center gap-6 pt-4 justify-center border-t border-white/5">
                     <Edit2 size={14} className="text-gray-600" />
                     <span className="text-xs text-gray-500">Linked to landing page</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card p-8 rounded-3xl relative group">
                <h3 className="text-xl font-bold text-white mb-6 flex justify-between">
                  Chapter Leadership
                  <button onClick={() => { setInlineEditField({field: 'president', label: 'Chapter President'}); setFormData({president: chapter.president}); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-primary-cyan opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={16}/></button>
                </h3>
                <div className="flex items-center gap-4">
                  <UserCircle size={40} className="text-primary-blue" />
                  <div>
                    <h4 className="font-bold text-white">{chapter.president || 'No President Name'}</h4>
                    <p className="text-xs text-primary-cyan uppercase font-bold tracking-wider">President</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Save Reminder (Optional) */}
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
           <div className="bg-primary-cyan text-ocean-deep px-4 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2">
              <Save size={18} /> Live Changes Active
           </div>
        </div>

        {/* Activity Edit/Add Modal */}
        {(isAddingActivity || activityToEdit) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-ocean-deep border border-white/20 p-8 rounded-[2rem] w-full max-w-xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {activityToEdit ? 'Edit Activity' : 'Add New Activity'}
                </h3>
                <button onClick={() => { setIsAddingActivity(false); setActivityToEdit(null); }} className="p-2 text-gray-500 hover:text-white"><X/></button>
              </div>
              <form onSubmit={handleSaveActivity} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                  <input 
                    required
                    type="text" 
                    value={activityFormData.title || ''} 
                    onChange={e => setActivityFormData({...activityFormData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none"
                    placeholder="e.g. Tree Planting Drive"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                    <input 
                      required
                      type="text" 
                      value={activityFormData.date || ''} 
                      onChange={e => setActivityFormData({...activityFormData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none"
                      placeholder="e.g. Oct 20, 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                    <input 
                      type="text" 
                      value={activityFormData.imageUrl || ''} 
                      onChange={e => setActivityFormData({...activityFormData, imageUrl: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none"
                      placeholder="https://picsum.photos/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={activityFormData.description || ''} 
                    onChange={e => setActivityFormData({...activityFormData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-primary-cyan outline-none"
                    placeholder="Briefly describe what happened..."
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-primary-blue hover:bg-primary-cyan text-white font-black rounded-xl transition-all shadow-lg text-lg">
                  {activityToEdit ? 'Save Activity' : 'Post Activity'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Inline Edit Modal */}
        {inlineEditField && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-ocean-deep border border-white/20 p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Edit {inlineEditField.label}</h3>
                <form onSubmit={handleInlineSave} className="space-y-4">
                   {inlineEditField.field === 'description' ? (
                     <textarea 
                        rows={6}
                        value={formData[inlineEditField.field] as string || ''} 
                        onChange={e => setFormData({...formData, [inlineEditField.field]: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary-cyan outline-none"
                     />
                   ) : (
                     <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-bold">{inlineEditField.label}</label>
                          <input 
                            type="text" 
                            value={formData[inlineEditField.field] as string || ''} 
                            onChange={e => setFormData({...formData, [inlineEditField.field]: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary-cyan outline-none mt-1"
                          />
                        </div>
                        {inlineEditField.field === 'email' && (
                          <>
                            <div>
                               <label className="text-xs text-gray-500 uppercase font-bold">Phone</label>
                               <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary-cyan outline-none mt-1" />
                            </div>
                            <div>
                               <label className="text-xs text-gray-500 uppercase font-bold">Facebook URL</label>
                               <input type="text" value={formData.facebook || ''} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary-cyan outline-none mt-1" />
                            </div>
                          </>
                        )}
                     </div>
                   )}
                   <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setInlineEditField(null)} className="flex-1 py-3 text-white hover:bg-white/10 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="flex-1 py-3 bg-primary-blue hover:bg-primary-cyan text-white font-bold rounded-xl shadow-lg">Save</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  };

  const AdminChapterForm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-ocean-deep border border-white/20 p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-white mb-6">
          {isAdding ? 'Add New Chapter' : 'Edit Chapter Details'}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Chapter Name</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 pl-10 text-white focus:border-primary-cyan outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.location || ''} 
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 pl-10 text-white focus:border-primary-cyan outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-white hover:bg-white/10 rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-primary-blue hover:bg-primary-cyan text-white font-bold rounded-lg transition-colors">Save Chapter</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ocean-dark flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-ocean-deep border-r border-white/5 flex flex-col z-40">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <img src="https://i.imgur.com/CQCKjQM.png" className="w-8 h-8 rounded-full" />
          <div>
            <h1 className="text-white font-bold">Dyesabel PH</h1>
            <p className="text-xs text-primary-cyan uppercase font-bold tracking-wider">{user.role}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {!isHead && (
            <>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-primary-blue text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <LayoutDashboard size={20} /> Overview
              </button>
              
              {isAuditor && (
                <button 
                  onClick={() => setActiveTab('health')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'health' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Activity size={20} /> System Health
                </button>
              )}
            </>
          )}

          <button 
            onClick={() => setActiveTab('chapters')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'chapters' || isHead ? 'bg-primary-cyan text-ocean-deep font-bold shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            {isHead ? <LayoutDashboard size={20} /> : <Users size={20} />}
            {isHead ? 'My Chapter' : 'Manage Chapters'}
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {!isHead && (
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'health' && 'System Diagnostics'}
              {activeTab === 'chapters' && 'Chapter Management'}
            </h2>
            <div className="flex items-center gap-3">
               <span className="text-white/60 text-sm">Welcome, <span className="text-white font-bold">{user.username}</span></span>
            </div>
          </header>
        )}

        {isHead ? (
          <ChapterHeadEditor />
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-primary-blue/20 to-transparent border border-white/10">
                  <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Chapters</h3>
                  <p className="text-4xl font-black text-white">{chapters.length}</p>
                </div>
              </div>
            )}

            {activeTab === 'health' && isAuditor && <SystemHealth />}

            {activeTab === 'chapters' && (
              <div className="space-y-6">
                {(isAdmin || isAuditor) && (
                  <div className="flex justify-end">
                    {isAdmin && (
                      <button 
                        onClick={() => { setIsAdding(true); setFormData({}); }}
                        className="flex items-center gap-2 bg-primary-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg"
                      >
                        <Plus size={18} /> Add Chapter
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {chapters.map(chapter => (
                    <div key={chapter.id} className="glass-card p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
                      <img src={chapter.logo} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white">{chapter.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {chapter.location}</span>
                          <span className="flex items-center gap-1"><UserCircle size={14} /> {chapter.president || 'No President'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setIsEditing(chapter.id); setFormData(chapter); }} className="p-2 bg-white/5 hover:bg-white/20 text-primary-cyan rounded-lg"><Edit2 size={18} /></button>
                        {isAdmin && <button onClick={() => handleDelete(chapter.id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={18} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(isEditing || isAdding) && !isHead && <AdminChapterForm />}
    </div>
  );
};
