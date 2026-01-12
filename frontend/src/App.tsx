// import React, { useEffect, useState } from "react";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import useTimer from "./hooks/useTimer";
// import { ping } from "./api";

// export default function App() {
//   const [msg, setMsg] = useState("Loading...");
//   const { seconds } = useTimer();

//   useEffect(() => {
//     ping().then(setMsg).catch(() => setMsg("API error"));
//   }, []);

//   return (
//     <div>
//       <Header />
//       <div style={{ padding: 16 }}>
//         <p>Uptime: {seconds}s</p>
//         <p>{msg}</p>
//         <Home />
//       </div>
//     </div>
//   );
// }

import NotesDemoPage from "./pages/NotesDemoPage";

export default function App() {
  return <NotesDemoPage />;
}
