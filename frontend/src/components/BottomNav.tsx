import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoGameController, IoInformationCircle, IoPerson } from 'react-icons/io5';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: IoHome, label: 'Home' },
    { path: '/game', icon: IoGameController, label: 'Play' },
    { path: '/info', icon: IoInformationCircle, label: 'Info' },
    { path: '/user', icon: IoPerson, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800 z-50 pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
