import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UploadBaseline from './pages/UploadBaseline';
import UploadCurrent from './pages/UploadCurrent';
import Dashboard from './pages/Dashboard';

function App() {
    return (
      <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload-baseline" element={<UploadBaseline />} />
            <Route path="/upload-current" element={<UploadCurrent />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;