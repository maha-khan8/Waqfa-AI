import React, { useState } from 'react';
import {
  Home,
  Compass,
  MapPin,
  ClipboardList,
  Sparkles,
  BookOpen,
  User,
  Menu,
  X,
  ArrowRight,
  UserPlus,
  Users,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: StudentProfile;
  hasRoadmap: boolean;
  isGenerating?: boolean;
  savedSessionsCount?: number;
  onStartNewRoadmap?: () => void;
  onOpenProfilesModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  hasRoadmap,
  isGenerating,
  savedSessionsCount = 0,
  onStartNewRoadmap,
  onOpenProfilesModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic nav items based on whether user has generated their roadmap
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(hasRoadmap ? [{ id: 'dashboard', label: 'Dashboard', icon: Compass }] : []),
    { id: 'blueprint', label: 'Student Blueprint', icon: User },
    ...(hasRoadmap
      ? [
          { id: 'roadmap', label: 'My Roadmap', icon: MapPin },
          { id: 'tracker', label: 'Applications', icon: ClipboardList },
          { id: 'skills', label: 'Skills & Projects', icon: Sparkles },
        ]
      : []),
    { id: 'guide', label: 'Planning Guide', icon: BookOpen },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const displayName = profile.name.trim();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Plain Text Branding: "Waqfa" only, no decorative icons, clickable to return Home */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-baseline gap-2.5 cursor-pointer group select-none"
            title="Return to Home"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-['Space_Grotesk'] hover:text-teal-700 transition-colors">
              Waqfa
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              Pause, but with purpose.
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Primary Action Button / Multi-student session status */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Saved profiles quick switcher if multiple exist */}
            {savedSessionsCount > 1 && onOpenProfilesModal && (
              <button
                onClick={onOpenProfilesModal}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                title="View and switch between saved student profiles"
              >
                <Users className="w-3.5 h-3.5 text-teal-600" />
                <span>Students ({savedSessionsCount})</span>
              </button>
            )}

            {/* Start for Another Student quick button */}
            {hasRoadmap && onStartNewRoadmap && (
              <button
                onClick={onStartNewRoadmap}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50/60 hover:bg-teal-100/70 text-teal-800 text-xs font-medium transition-colors cursor-pointer"
                title="Start a new planning session for another student without overwriting current data"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                <span>New Student</span>
              </button>
            )}

            {displayName ? (
              <div
                onClick={() => handleNavClick('blueprint')}
                className="text-right cursor-pointer hover:opacity-80 transition-opacity pl-1"
                title="View Student Blueprint"
              >
                <div className="text-xs font-semibold text-slate-800">{displayName}</div>
                <div className="text-[11px] text-teal-700 truncate max-w-[120px]">
                  {profile.qualification || 'Your Profile'}
                </div>
              </div>
            ) : null}

            {!hasRoadmap ? (
              <button
                onClick={() => handleNavClick('blueprint')}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-xs shadow-teal-600/20 transition-all font-medium disabled:opacity-50 cursor-pointer"
              >
                <span>Create My Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('roadmap')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!hasRoadmap ? (
              <button
                onClick={() => handleNavClick('blueprint')}
                className="px-2.5 py-1 text-xs font-semibold bg-teal-600 text-white rounded-lg"
              >
                Create
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2.5 pb-4 space-y-1 shadow-sm">
          {displayName && (
            <div className="p-2.5 mb-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-800">{displayName}</div>
                <div className="text-[11px] text-teal-700">
                  {profile.qualification || 'Your Profile'}
                </div>
              </div>
              <button
                onClick={() => handleNavClick('blueprint')}
                className="text-xs text-teal-700 font-medium underline"
              >
                Edit
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile actions for multi-student planning */}
          {hasRoadmap && onStartNewRoadmap && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartNewRoadmap();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 mt-2 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200"
            >
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>Start for Another Student</span>
            </button>
          )}

          {savedSessionsCount > 1 && onOpenProfilesModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfilesModal();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Users className="w-4 h-4 text-teal-600" />
              <span>Switch Saved Student ({savedSessionsCount})</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
