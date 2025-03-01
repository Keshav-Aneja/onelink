function App() {
  async function handleAuth() {
    try {
      window.location.href = "http://localhost:8080/api/auth/google";
    } catch (error) {
      console.log("ERROR", error);
    }
  }
  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleProtected() {
    try {
      const response = await fetch("http://localhost:8080/api/auth/protected", {
        method: "GET",
        credentials: "include",
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-[#0f0f0b] w-full h-screen text-white text-5xl font-semibold flex flex-col items-center justify-center gap-4">
      OneLink
      <br />
      <p className="text-xl font-normal text-blue-300">Coming Soon!</p>
      <div className="w-full flex items-center justify-center">
        <button
          onClick={handleAuth}
          className="text-lg bg-white px-12 py-3 rounded-full rounded-r-none text-black cursor-pointer border border-white min-w-48"
        >
          Google Auth
        </button>
        <button
          onClick={handleProtected}
          className="text-lg bg-white px-12 py-3  text-black cursor-pointer border border-white border-x-0 min-w-48"
        >
          Protected
        </button>
        <button
          onClick={handleLogout}
          className="text-lg bg-white px-12 py-3 rounded-full rounded-l-none text-black cursor-pointer border border-white min-w-48"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
