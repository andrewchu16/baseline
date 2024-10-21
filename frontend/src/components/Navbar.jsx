function Navbar() {
  return (
    <nav className="flex flex-col h-full w-full p-2 rounded-lg bg-sky-300">
      <h2>Menu</h2>
      <div className="flex-grow">
        <a href="/dashboard" id="dashboard">
          <p>Dashboard</p>
        </a>
        <a href="/upload-baseline" id="baseline">
          <p>Record Baseline</p>
        </a>
        <a href="/upload-current" id="current">
          <p>Record Activity</p>
        </a>
      </div>
      <div className="flex flex-col items-center pb-3">
        <a href="/">
          <button className="py-3 px-4 hover:text-blue-800 transition-colors rounded-lg bg-white">
            Disconnect
          </button>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
