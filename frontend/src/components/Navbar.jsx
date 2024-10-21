function Navbar() {
  return (
    <nav className="flex flex-col h-full w-full p-4 rounded-lg bg-neutral-100 drop-shadow-sm">
      <h2 className="font-bold text-2xl mb-4">Menu</h2>
      <div className="flex-grow flex flex-col gap-2">
        <a href="/dashboard" id="dashboard" className="hover:font-bold">
          <p>Dashboard</p>
        </a>
        <a href="/upload-baseline" id="baseline" className="hover:font-bold">
          <p>Record Baseline</p>
        </a>
        <a href="/upload-current" id="current" className="hover:font-bold">
          <p>Record Activity</p>
        </a>
      </div>
      <div className="flex flex-col items-center pb-3">
        <a
          href="/"
          className="hover:text-blue-600 text-blue-800 transition-colors hover:font-bold text-lg rounded-lg drop-shadow-md"
        >
          Disconnect
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
