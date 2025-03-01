function App() {
  async function handleAuth() {
    try {
      window.location.href = "http://localhost:8080/api/auth/google";
    } catch (error) {
      console.log("ERROR", error);
    }
  }
  return (
    <div className="bg-[#0f0f0b] w-full h-screen text-white text-5xl font-semibold flex flex-col items-center justify-center gap-4">
      OneLink
      <br />
      <p className="text-xl font-normal text-blue-300">Coming Soon!</p>
      <button
        onClick={handleAuth}
        className="text-lg bg-white px-12 py-3 rounded-full text-black cursor-pointer"
      >
        Google Auth
      </button>
    </div>
  );
}

export default App;
