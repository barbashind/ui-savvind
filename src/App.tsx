import './App.css';
import AppRouter from './routers/AppRouter.tsx';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

function App() {
  return (
    
    <div className="App">
      <Theme preset={presetGpnDefault}>
          <AppRouter/>
      </Theme>
    </div>
  );
}

export default App;