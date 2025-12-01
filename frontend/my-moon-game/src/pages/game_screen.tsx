import React, { useEffect, useState, useRef } from "react";
import g_scr1 from "./assets/gameScreen.png";
import moon from "../components/assets/moon.png";
import alienImg from "../components/assets/alienShip.png";

import { INITIAL_TIME, Alien, MissionResult } from "../constants";
import Dashboard from "../components/dashboard"
import Controls from "../interactors/controls"
import { Moon, DiscoOverlay, InfraredOverlay } from "../components/overlays";





const GameScreen: React.FC<MissionResult> = ({ Success, Fail }) => {
  // Game global variables
  const [time, setTime] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(true);
  const [missionFailed, setMissionFailed] = useState(false);
  const [alienWarning, setAlienWarning] = useState("");

  // Lights & controls
  const [lightsOn, setLightsOn] = useState(false);
  const [lightColor, setLightColor] = useState("#ff0000");
  const [speed, setSpeed] = useState(0);
  const [cabinPressureOn, setCabinPressureOn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [thrustersEjected, setThrustersEjected] = useState(false);
  const [landingGearOn, setLandingGearOn] = useState(false);
  const [navigationOn, setNavigationOn] = useState(false);
  const [discoOn, setDiscoOn] = useState(false);
  const [infraredOn, setInfraredOn] = useState(false);

  // Alien & target state
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);

  // Failure trigger
  const triggerFailure = (reason?: string) => {
    if (reason) console.warn("Mission failed:", reason);
    setMissionFailed(true);
    setIsRunning(false);
  };

  // Spawn aliens
  const spawnNextAlien = () => {
    const nextAlien: Alien = {
      x: 100 + Math.random() * 1000,
      y: 100 + Math.random() * 400,
      alive: true,
      spawnTime: Date.now(),
    };
    setAliens((prev) => [...prev, nextAlien]);
  };
  //Fire Blaster logic
  const fireBlast = () => {
    if (!target) return;
    let killed = false;
    setAliens((prev) =>
      prev.map((a) => {
        if (a.alive && a.x === target.x && a.y === target.y) {
          killed = true;
          return { ...a, alive: false };
        }
        return a;
      })
    );
    setTarget(null);
    if (killed) setTimeout(spawnNextAlien, 500);
  };

////////////////////////////////////////
//GAME LOGIC
////////////////////////////////////////
  // Countdown and alien timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime((prev) => {
        const roundedSpeed = Math.max(Math.round(speed), 1);
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return Math.max(prev - roundedSpeed, 0);
      });

      setAliens((prev) => {
        const now = Date.now();
        let warning = "";
        prev.forEach((a) => {
          if (a.alive) {
            const aliveTime = now - a.spawnTime;
            if (aliveTime > 20000) {
              triggerFailure("An alien was on screen too long!");
            } else if (aliveTime > 5000) {
              warning = "Hurry! Kill the alien!";
            }
          }
        });
        setAlienWarning(warning);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, speed]);
  
  // Random alien spawns while time > 0
  useEffect(() => {
  if (!isRunning) return;
  let timer: ReturnType<typeof setTimeout>;

  const spawnRandomAlien = () => {
    if (time > 0) {
      spawnNextAlien();
      const nextTime = 5000 + Math.random() * 5000;
      timer = setTimeout(spawnRandomAlien, nextTime);
    }
  };
  spawnRandomAlien();
  return () => clearTimeout(timer);
}, [isRunning]);


  //  time updates correctly
  const timeRef = useRef(time);
  useEffect(() => { timeRef.current = time; }, [time]);
  
  // Starts Timed events
  const startTimeRef = useRef(Date.now());
  
  // Tracks all timed based events 
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds

      // Warn player to toggle air pressure & eject thrusters within 30s
      if (elapsed <= 30 && (!cabinPressureOn || !thrustersEjected)) {
        setStatusMessage("⚠ Toggle Air Pressure & Eject Thrusters within 30s!");
      }

      // Check if 30s elapsed without actions
      if (elapsed > 30) {
        if (!cabinPressureOn || !thrustersEjected) {
          triggerFailure("Failed to toggle air pressure or eject thrusters in time!");
        }
      }

      // Check landing gear before distance < 1000
      if (time < 1000 && !landingGearOn) {
        triggerFailure("Failed to deploy landing gear before reaching 1000 distance!");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, cabinPressureOn, landingGearOn, thrustersEjected, time]);

  // Success / Failure mechanic 
  useEffect(() => {
    if (time === 0) Success();
  }, [time, Success]);
  useEffect(() => {
    if (missionFailed) Fail();
  }, [missionFailed, Fail]);

  // Click handlers
  const handleAlienClick = (alien: Alien) => setTarget({ x: alien.x, y: alien.y });
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest(".alien")) setTarget(null);
};
//////////////////////////////////////////////
////////////////////////////////////////////// 
  
return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${g_scr1})`,
        backgroundSize: "100% 100%",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={handleScreenClick}>
     {/* Dashboard object that displays messages and stats */}
      <Dashboard
        time={time}
        landingGearOn={landingGearOn}
        cabinPressureOn={cabinPressureOn}
        statusMessage={statusMessage}
        alienWarning={alienWarning}
        aliens={aliens}/>
      {/* Control objects that contains the interactors */}
      <Controls
        lightsOn={lightsOn}
        lightColor={lightColor}
        speed={speed}
        cabinPressureOn={cabinPressureOn}
        statusMessage={statusMessage}
        thrustersEjected={thrustersEjected}
        landingGearOn={landingGearOn}
        navigationOn={navigationOn}
        discoOn={discoOn}
        infraredOn={infraredOn}

        setLightsOn={setLightsOn}
        setLightColor={setLightColor}
        setSpeed={setSpeed}
        setCabinPressureOn={setCabinPressureOn}
        setStatusMessage={setStatusMessage}
        setThrustersEjected={setThrustersEjected}
        setLandingGearOn={setLandingGearOn}
        setNavigationOn={setNavigationOn}
        setDiscoOn={setDiscoOn}
        setInfraredOn={setInfraredOn}

        triggerFailure={triggerFailure}
        fireBlast={fireBlast}/>
      {/* Moon object that controls moon growing as you approach */}
      <Moon time={time} />
      {/* Controls the disco effect */}
      <DiscoOverlay enabled={discoOn} />
      {/* Controls the infared effect */}
      <InfraredOverlay enabled={infraredOn} />

      
      {/* Aliens */}
      {aliens.map((a, i) => 
      a.alive && 
      <img 
        key={i} 
        src={alienImg} 
        className="alien" 
        onClick={(e) => { e.stopPropagation(); handleAlienClick(a); }}
        style={{ position: "absolute", 
                top: a.y, 
                left: a.x, 
                width: 50, 
                height: 50, 
                zIndex: 900, 
                cursor: "pointer" }} />)}

      {/* Target marker */}
      {target && 
        <div style={{ position: "absolute", 
                      top: target.y, 
                      left: target.x, 
                      width: 60, 
                      height: 60, 
                      border: "3px solid orange", 
                      borderRadius: "50%", 
                      pointerEvents: "none", 
                      zIndex: 950, 
                      transform: "translate(-50%, -50%)" }} />}
        </div>
  );
};

export default GameScreen;
