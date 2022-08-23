import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import useSound from 'use-sound';
import zero from './sounds/0.wav';
import one from './sounds/1.wav';
import two from './sounds/2.wav';
import three from './sounds/3.wav';
import four from './sounds/4.wav';
import five from './sounds/5.wav';
import six from './sounds/6.wav';
import seven from './sounds/7.wav';
import eight from './sounds/8.wav';
import nine from './sounds/9.wav';
import ten from './sounds/beep-07a.wav';

const delay = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);


function App() {
  const [showSave, setShowSave] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [filename, setFileName]=useState("")
  const [experimenter, setExperimenter] = useState(true)
  const [thirtySeconds, setThirtySeconds] = useState(0)
  const [pause, setPause] = useState(false)
  const [play10] = useSound(ten,  {
    playbackRate: 1.25,
    volume: 1.25,
  })
  const [play1] = useSound(one);
  const [play2] = useSound(two)
  const [play3] = useSound(three)
  const [play4] = useSound(four);
  const [play5] = useSound(five)
  const [play6] = useSound(six)
  const [play7] = useSound(seven);
  const [play8] = useSound(eight)
  const [play9] = useSound(nine)
  const [play0] = useSound(zero)
  
  const [state, setState] = useState(
    {arousalLevel: 0,
     isActive: false,
     arousalData: [],
     averageData: 0,
     seconds: 0
    }
    )
  
  function changeFileName(event){
    const val=event.target.value
    setFileName(val)
  }

  const headers = [
    { label: "Seconds", key: "seconds" },
    { label: "ArousalLevel", key: "arousalLevel" }
  ];

  useEffect(() => {
    let interval = null;
    if (state.isActive) {
      interval = setInterval(() => {
        const arousalDataPrev = state.arousalData
        const arousalObject = {seconds: state.seconds, arousalLevel: state.arousalLevel}
        arousalDataPrev.push(arousalObject)
        
        let seconds = state.seconds + 1
        
        setState((prev) => ({...prev, seconds: seconds, arousalData: arousalDataPrev}));
      
      }, 1000);
    } else if (!state.isActive && state.seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [state.isActive, state.seconds]);

  useEffect(() => {
    if (thirtySeconds !== 29 && pause === false) {
      let newThirtySeconds = thirtySeconds + 1
      setThirtySeconds(newThirtySeconds)
      console.log(thirtySeconds)
    } else if (pause === true) {
      setPause(false)
      setThirtySeconds(0)
    } else {
      play10()
      setPause(true)
    }
  }, [state.seconds])

  const handleMouseDown = function(e) {
    setThirtySeconds(0)
    e.preventDefault()
    console.log(`event type is ${e.type}`)
    const arousalLevelPrev = state.arousalLevel
    console.log(`previous arousal level is ${state.arousalLevel}`)
    let arousalLevelNew = 0
    if (e.type === "contextmenu") {
        if (arousalLevelPrev < 9) {
          console.log('level up')
          arousalLevelNew = arousalLevelPrev + 1;
          console.log(`current arousal level is ${arousalLevelNew}`)
          setState((prev) => ({...prev, arousalLevel: arousalLevelNew}));
          chooseSound(arousalLevelNew)
        } 
       
      } else if (e.type === "click") {
        if (arousalLevelPrev > 0) {
          console.log('level down')
          arousalLevelNew = arousalLevelPrev - 1;
          setState((prev) => ({...prev, arousalLevel: arousalLevelNew}));
          chooseSound(arousalLevelNew)
          
          
        } 
        
      }
    
  }

  

  const cancelButton = function() {
    setShowSave(false);
  }


  function toggle() {
  
    setState((prev) => ({...prev, isActive: !state.isActive}));
  }

  useEffect(() => {
    if (state.isActive) {
      window.addEventListener('click', handleMouseDown);
      window.addEventListener('contextmenu', handleMouseDown);
      

    return () => {
      window.removeEventListener('click', handleMouseDown);
      window.removeEventListener('contextmenu', handleMouseDown);
      
    };
    } else {
      window.removeEventListener('click', handleMouseDown);
      window.removeEventListener('contextmenu', handleMouseDown);
      
    }
    

  }, [state.isActive, handleMouseDown])
  

 
  const toggleView = function() {
    setExperimenter(!experimenter)
  }
  const chooseSound = function(level) {
    console.log(
    "choosing sound"
    )
    if (level === 0) {
      play0()
    } else if (level === 1) {
      play1()
    } else if (level === 2) {
      play2()
    } else if (level === 3) {
      play3()
    } else if (level === 4) {
      play4()
    } else if (level === 5) {
      play5()
    } else if (level === 6) {
      play6()
    } else if (level === 7) {
      play7()
    } else if (level === 8) {
      play8()
    } else if (level === 9) {
      play9()
    }
    
  }

  const showThanksTimer = function() {
    setShowThanks(false)
   
  }
  const averageScore = function(dataObject) {
    let totalScore = 0;
    let median = 0;

    for (let data of dataObject) {
      
      totalScore += data["arousalLevel"]
      median++;
      
    }

    const average = totalScore / median;
    
    setState((prev) => ({...prev, averageData: average}));

  }
  const clickSave = function() {
    setShowSave(false)
    setShowThanks(true)
    setTimeout(showThanksTimer, 5000)
    setState((prev) => ({...prev, seconds: 0, arousalLevel: 0}));

  }
  function reset() {
    setState((prev) => ({...prev, isActive: false}));
    
    setShowSave(true)
    averageScore(state.arousalData)
  }


  return (
    <div className="app">
      {experimenter &&
      <div>
      <div className="welcome">
        Experimenter View
      </div>
      <div className="time">
        Time:  {state.seconds}s
      </div>
      <div className="arousal">
        Arousal level is: {state.arousalLevel}
      </div>
      </div>
}
      {!experimenter &&
      <div className="arousal-participant">
       {state.arousalLevel}

      </div>
      
      }
      <div className="row">
        <button className="timerButton" onClick={toggle}>
          {state.isActive ? 'Pause' : 'Start'}
        </button>
        <button className="timerButton" onClick={reset}>
          Finish
        </button>
        {/* Average: {state.averageData} */}
        <div>
        {showSave &&
        <div>
          <form>
           <label>
            File Name: 
            <input value={filename} onChange={changeFileName} />
           </label>
         </form>
         <button className="view-button">
          <CSVLink
           headers={headers}
           data={state.arousalData}
           filename={filename}
           target="_blank"
           onClick={clickSave}
          >
           Export
          </CSVLink>
          </button>
          
          <button className="view-button" onClick={cancelButton}>
            Cancel Save
          </button>
        </div>
        }
        { showThanks &&
        <div>
          Your result has been saved!

        </div>

        }
         <button className="view-button" onClick={toggleView}>
          {experimenter? 'Participant View' : 'Experimenter View'}
        </button>
        
        </div>
      </div>
    </div>
  );
}

export default App;
