import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { COLORS, FONTS } from '../../constants/theme';
import { Button } from '../ui/button';
import { Menu, User, LogOut } from 'lucide-react';
import { ResumeIQLogo } from '../brand/ResumeIQLogo';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show header on login/signup pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[#2A2E3B]/50"
      style={{ backgroundColor: `${COLORS.background}CC` }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="cursor-pointer flex items-center"
          onClick={() => navigate('/')}
        >
          <ResumeIQLogo size="md" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Upload Resume', path: '/upload' },
            { label: 'History', path: '/history' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium transition-colors hover:text-[#C6FF00]"
              style={{ 
                color: location.pathname === item.path ? COLORS.accent : COLORS.textMuted,
                fontFamily: FONTS.body 
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1E222F] flex items-center justify-center text-[#F5F2E8] border border-[#2A2E3B]">
                  <User size={16} />
                </div>
                <span className="hidden md:inline text-sm font-medium" style={{ color: COLORS.text }}>
                  {user.name}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-[#2A2E3B]" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm hover:text-[#FF4D4D] transition-colors"
                style={{ color: COLORS.textMuted }}
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
