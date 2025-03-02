import './index.css';
import { useState } from "react";

const ColdStartAlert = () => {
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  return (
    <>
      {isAlertOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsAlertOpen(false)}
              className="absolute top-2 right-2 text-gray-600 text-l font-bold"
            >
              ×
            </button>
            <h2 className="text-l text-gray-700 font-semibold mb-2">Cold Start Notice</h2>
            <p className="text-gray-700">
              This app is currently a prototype.
              The backend is hosted on Render’s
              free tier, which spins down after
              15 minutes of inactivity. When you
              first access the app, it may take
              a couple of minutes to start up.
              Please wait and reload the page
              if needed.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ColdStartAlert;
