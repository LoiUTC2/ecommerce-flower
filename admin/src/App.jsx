import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const fetchAPI = async () => {
    const res = await fetch("http://localhost:5000/");
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        🛠 Flower Shop Admin Panel
      </h1>
      <button
        onClick={fetchAPI}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
      >
        Fetch API
      </button>
      {message && <p className="mt-4 text-blue-800">{message}</p>}
    </div>
  );
}

export default App;
