import AlphaRhythmGraph from '../components/AlphaRhythmGraph';
import ThetaRhythmGraph from '../components/ThetaRhythmGraph';
import DcGraph from '../components/DcGraph';
import Navbar from '../components/Navbar';
import Status from '../components/Status';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';

function Dashboard() {

  useEffect(() => {
    const element = document.getElementById('dashboard');
    
    // Add class when component mounts
    if (element) {
      element.classList.add('active');
    }

    // Cleanup: Remove class when component unmounts
    return () => {
      if (element) {
        element.classList.remove('active');
      }
    };
  }, []); 

  return (
    <div className="h-screen w-screen flex bg-neutral-200">
      <Helmet>
        <title>Baseline | Dashboard</title>
      </Helmet>
      <aside className="h-screen w-52 p-4 pr-2">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow grid grid-cols-2 grid-rows-2 gap-3 pl-2 p-4">
        <Status />
        <AlphaRhythmGraph />
        <ThetaRhythmGraph />
        <DcGraph />
      </main>
    </div>
  );
}

export default Dashboard;