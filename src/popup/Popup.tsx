import { useState } from 'react';

function Popup() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-80 p-4">
      <h1 className="text-2xl font-bold mb-4">Whale Extension</h1>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Count:</span>
          <span className="font-semibold">{count}</span>
        </div>
        <button
          onClick={() => setCount(count + 1)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export default Popup;
