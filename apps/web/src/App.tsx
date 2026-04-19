import "./App.css";

import { Typography } from "@repo/ui";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Suspense fallback={<Typography variant="h1">Loading...</Typography>}>
      <main className={`min-h-screen min-w-[100vh]`}>
        <Outlet />
      </main>
    </Suspense>
  );
}

export default App;
