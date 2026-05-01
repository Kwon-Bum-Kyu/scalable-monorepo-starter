import "./App.css";

import { Typography } from "@repo/ui";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Suspense fallback={<Typography variant="h1">Loading...</Typography>}>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </Suspense>
  );
}

export default App;
