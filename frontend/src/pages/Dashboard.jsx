import AlphaRhythmGraph from '../components/AlphaRhythmGraph';
import ThetaRhythmGraph from '../components/ThetaRhythmGraph';
import DcGraph from '../components/DcGraph';
import Navbar from '../components/Navbar';
import Status from '../components/Status';
import { Helmet } from 'react-helmet';


function Dashboard() {
  return (
    <div className="h-screen w-screen flex">
      <Helmet>
        <title>Baseline | Dashboard</title>
      </Helmet>
      <aside className="h-screen w-44 bg-red-50">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow bg-red-100 grid grid-cols-2 grid-rows-2 p-4">
        <Status />
        <AlphaRhythmGraph />
        <ThetaRhythmGraph />
        <DcGraph />
      </main>
    </div>
  );
}

export default Dashboard;