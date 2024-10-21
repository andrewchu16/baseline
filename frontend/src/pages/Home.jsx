function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-200">
      <h1 className="text-5xl mb-2 font-bold">Baseline</h1>
      <p className="mb-4 text-lg">
        The solution to fatigue-induced medical errors in healthcare
        professionals.
      </p>
      <a href="/dashboard">
        <button className="py-3 px-4 hover:translate-y-2 transition-transform shadow-md rounded-lg text-lg bg-neutral-100 hover:text-blue-600 text-blue-800">
          Connect Headset
        </button>
      </a>
    </div>
  );
}

export default Home;
