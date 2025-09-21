import './App.css';
import AppRouter from './routers/AppRouter.tsx';
import AppRouterMobile from './routers/AppRouterMobile.tsx'; // Импортируйте мобильный маршрутизатор
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { useState, useEffect } from 'react';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  const handleResize = () => {
    if (window.innerWidth < 1000) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <Theme preset={presetGpnDefault}>
        {isMobile ? <AppRouterMobile /> : <AppRouter />}
      </Theme>
    </div>
  );
}

export default App;