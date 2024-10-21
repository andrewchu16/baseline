import AlphaRhythmGraph from '../components/AlphaRhythmGraph';
import ThetaRhythmGraph from '../components/ThetaRhythmGraph';
import Navbar from '../components/Navbar';
import Status from '../components/Status';
import { Helmet } from 'react-helmet';

function Dashboard() {
  return (
    <div className="h-screen w-screen">
      <Helmet>
        <title>Baseline | Dashboard</title>
      </Helmet>
    </div>
  );
}

export default Dashboard;