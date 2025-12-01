import React, { useState } from "react";
// import StartScreen from "./pages/start_screen";
// import TransitionVideo from "./components/transitionVideo";
import GameScreen from "./pages/game_screen";
import SuccessEnd from "./pages/success_screen";
import FailEnd from "./pages/fail_screen";
import StartScreen from "./pages/start_screen"; // uncomment if needed
import TransitionVideo from "./components/transitionVideo"; // uncomment if needed

const App: React.FC = () => {
  // Corrected state type
  const [screen, setScreen] = useState<"start" | "video" | "game" | "success" | "fail">("start");

  return (
    <>
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("video")} />
      )}

      {screen === "video" && (
        <TransitionVideo onEnd={() => setScreen("game")} />
      )}

      {screen === "game" && (
        <GameScreen
          Success={() => setScreen("success")}
          Fail={() => setScreen("fail")}
        />
      )}

      {screen === "success" && <SuccessEnd BackToHome={() => setScreen("start")} />}
      {screen === "fail" && <FailEnd BackToHome={() => setScreen("start")} />}
    </>
  );
};

export default App;
