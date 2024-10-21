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
      <aside className="h-screen w-52 p-3">
        <Navbar />
      </aside>
      <main className="h-screen flex-grow grid grid-cols-2 grid-rows-2 gap-2 p-3">
        <Status />
        <AlphaRhythmGraph />
        <ThetaRhythmGraph />
        <DcGraph />
      </main>
    </div>
  );
}

export default Dashboard;