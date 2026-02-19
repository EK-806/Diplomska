import { Outlet } from 'react-router-dom';
import HeaderTemplate from './templates/HeaderTemplate';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground max-w-none">
      <HeaderTemplate/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
}

export default App;