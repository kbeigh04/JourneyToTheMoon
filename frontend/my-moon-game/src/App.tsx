import React, { useState } from "react";
import GameScreen from "./pages/game_screen";
import SuccessEnd from "./pages/success_screen";
import FailEnd from "./pages/fail_screen";
import StartScreen from "./pages/start_screen"; 
import TransitionVideo from "./components/transitionVideo"; 

const App: React.FC = () => {

  const [screen, setScreen] = useState<"start" | "video" | "game" | "success" | "fail">("start");

  return (
    <>
    {/* switch to start screen */}
      {screen === "start" && (
        <StartScreen onStart={() => setScreen("video")} />
      )}
    {/* switch to trasnition video */}
      {screen === "video" && (
        <TransitionVideo onEnd={() => setScreen("game")} />
      )}
    {/* switch to game play */}
      {screen === "game" && (
        <GameScreen
          Success={() => setScreen("success")}
          Fail={() => setScreen("fail")}
        />
      )}
    {/* switch to success end screen */}
      {screen === "success" && <SuccessEnd BackToHome={() => setScreen("start")} />}
    {/* switch to fail end screen */}
      {screen === "fail" && <FailEnd BackToHome={() => setScreen("start")} />}
    </>
  );
};

export default App;
