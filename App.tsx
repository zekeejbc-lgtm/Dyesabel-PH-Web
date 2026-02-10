import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Slogan } from './components/Slogan';
import { Pillars } from './components/Stories';
import { Chapters } from './components/Chapters';
import { ChapterDetail } from './components/ChapterDetail';
import { Partners } from './components/Partners';
import { Founders } from './components/Founders';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { DonatePage } from './components/DonatePage';
import { PillarDetail } from './components/PillarDetail';
import { Dashboard } from './components/Dashboard';
import { Chapter, Pillar, User } from './types';

// Initial Chapter Data
const INITIAL_CHAPTERS: Chapter[] = [
  { 
    id: 'tagum', 
    name: 'Tagum Chapter', 
    location: 'Tagum City, Davao del Norte', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/tagum/1200/600',
    description: 'Leading the way in urban biodiversity conservation within Tagum City, focusing on sustainable waste management and green spaces.',
    president: 'Juan Dela Cruz',
    email: 'dyesabeltagum@gmail.com',
    phone: '(084) 123-4567',
    facebook: 'https://www.facebook.com/profile.php?id=61578133816723',
    activities: [
      { id: 't1', title: 'Urban Garden Project', description: 'Establishing edible gardens in public schools.', date: 'Oct 12, 2024', imageUrl: 'https://picsum.photos/seed/garden/400/300' },
      { id: 't2', title: 'Plastic-Free Tagum', description: 'A city-wide campaign to reduce single-use plastics.', date: 'Sept 5, 2024', imageUrl: 'https://picsum.photos/seed/plastic/400/300' }
    ]
  },
  { 
    id: 'nabunturan', 
    name: 'Nabunturan Chapter', 
    location: 'Nabunturan, Davao de Oro', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/nabunturan/1200/600',
    description: 'Championing river rehabilitation and watershed protection in the heart of Davao de Oro.',
    president: 'Maria Santos',
    email: 'nabunturan@dyesabel.ph',
    phone: '(088) 234-5678',
    activities: [
      { id: 'n1', title: 'River Cleanup', description: 'Removing 2 tons of waste from the main river systems.', date: 'Oct 2, 2024', imageUrl: 'https://picsum.photos/seed/river/400/300' }
    ]
  },
  { 
    id: 'mati', 
    name: 'Mati Chapter', 
    location: 'Mati City, Davao Oriental', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/mati/1200/600',
    description: 'Protectors of our coastal heritage, the Mati Chapter focuses on marine life conservation and sustainable tourism.',
    president: 'Pedro Penduko',
    email: 'mati@dyesabel.ph',
    phone: '(087) 345-6789',
    activities: []
  },
  { 
    id: 'mabini', 
    name: 'Mabini Chapter', 
    location: 'Mabini, Davao de Oro', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/mabini/1200/600',
    description: 'Empowering local communities through agro-forestry and sustainable livelihood programs.',
    president: 'Jose Rizal',
    email: 'mabini@dyesabel.ph',
    phone: '(088) 456-7890',
    activities: []
  },
  { 
    id: 'maco', 
    name: 'Maco Chapter', 
    location: 'Maco, Davao de Oro', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/maco/1200/600',
    description: 'Advocating for responsible mining practices and reforestation in the mineral-rich areas of Maco.',
    president: 'Andres Bonifacio',
    email: 'maco@dyesabel.ph',
    phone: '(088) 567-8901',
    activities: []
  },
  { 
    id: 'new-corella', 
    name: 'New Corella Chapter', 
    location: 'New Corella, Davao del Norte', 
    logo: 'https://i.imgur.com/CQCKjQM.png',
    image: 'https://picsum.photos/seed/corella/1200/600',
    description: 'Guardians of the highland springs and waterfalls, ensuring clean water access for all.',
    president: 'Gabriela Silang',
    email: 'newcorella@dyesabel.ph',
    phone: '(084) 678-9012',
    activities: []
  },
];

function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Content State
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  
  // Navigation State
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDonatePageOpen, setIsDonatePageOpen] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedPillar(null);
    setIsDonatePageOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSelectPillar = (pillar: Pillar) => {
    setSelectedPillar(pillar);
    setSelectedChapter(null);
    setIsDonatePageOpen(false);
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedChapter(null);
    setSelectedPillar(null);
    setIsDonatePageOpen(false);
    window.scrollTo(0, 0);
  };

  const handleDonateClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsDonatePageOpen(true);
    setSelectedChapter(null);
    setSelectedPillar(null);
  };

  const handleFooterNavigation = (sectionId: string) => {
    setSelectedChapter(null);
    setSelectedPillar(null);
    setIsDonatePageOpen(false);

    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  // Mock Login Logic
  const handleLogin = (username: string) => {
    const lowerUser = username.toLowerCase();
    
    if (lowerUser.includes('auditor')) {
      setCurrentUser({ username: 'Auditor User', role: 'auditor' });
    } else if (lowerUser.includes('admin')) {
      setCurrentUser({ username: 'Admin User', role: 'admin' });
    } else if (lowerUser.includes('head')) {
      // Assign the first chapter for demo purposes
      setCurrentUser({ 
        username: 'Chapter Head', 
        role: 'chapter_head',
        chapterId: chapters[0].id 
      });
    } else {
      alert("Role not found. Try 'auditor', 'admin', or 'head'");
      return;
    }
    
    setIsLoginModalOpen(false);
  };

  // If logged in, show dashboard
  if (currentUser) {
    return (
      <Dashboard 
        user={currentUser} 
        chapters={chapters}
        onUpdateChapters={setChapters}
        onLogout={() => setCurrentUser(null)}
      />
    );
  }

  return (
    <div className="min-h-screen relative text-ocean-deep dark:text-white transition-colors duration-500 overflow-x-hidden">
      {/* Global Dynamic Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700 bg-gradient-to-b from-ocean-light via-[#b2dfdb] to-ocean-mint dark:from-ocean-deep dark:via-[#021017] dark:to-ocean-dark">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary-cyan/20 dark:bg-primary-blue/20 rounded-full blur-[100px] animate-float opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-primary-blue/20 dark:bg-primary-cyan/10 rounded-full blur-[120px] animate-float opacity-50" style={{ animationDelay: '3s' }}></div>
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
             <div
               key={i}
               className="absolute bg-white/20 dark:bg-white/10 rounded-full blur-[1px] shadow-[inset_0_0_6px_rgba(255,255,255,0.4)] animate-rise"
               style={{
                 left: `${Math.random() * 100}%`,
                 width: `${Math.random() * 20 + 5}px`,
                 height: `${Math.random() * 20 + 5}px`,
                 animationDuration: `${Math.random() * 10 + 10}s`,
                 animationDelay: `${Math.random() * 15}s`,
                 bottom: '-50px',
               }}
             />
          ))}
        </div>
      </div>

      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onHomeClick={handleBackToHome} 
        onSignInClick={() => setIsLoginModalOpen(true)}
      />
      
      <main className="relative">
        {isDonatePageOpen ? (
          <DonatePage onBack={handleBackToHome} />
        ) : selectedPillar ? (
          <PillarDetail pillar={selectedPillar} onBack={handleBackToHome} />
        ) : selectedChapter ? (
          <ChapterDetail chapter={selectedChapter} onBack={handleBackToHome} />
        ) : (
          <>
            <Hero onDonateClick={handleDonateClick} />
            <Slogan />
            <Pillars onSelectPillar={handleSelectPillar} />
            <Chapters chapters={chapters} onSelectChapter={handleSelectChapter} />
            <Partners />
            <Founders />
          </>
        )}
      </main>
      
      {!isDonatePageOpen && (
        <Footer 
          onDonateClick={handleDonateClick} 
          onNavigate={handleFooterNavigation}
        />
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;