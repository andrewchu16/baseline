function Home() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-sky-200">
            <h1 className="text-2xl mb-2">Baseline</h1>
            <a href="/dashboard">
            <button className="py-3 px-4 hover:translate-y-2 transition-transform shadow-md rounded-lg bg-white">connect headset</button>
            </a>
        </div>
    );
}

export default Home;