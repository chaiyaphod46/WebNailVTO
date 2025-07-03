import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import Popup from "./components/Popup";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const textures = useRef([]);

  const [currentSet, setCurrentSet] = useState("set17"); // default to set17

  useEffect(() => {
    // Function to get the id from URL and update the state
    const fetchSetFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id && `set${id}` in nailSets) {
        setCurrentSet(`set${id}`);
      } else {
        setCurrentSet("set17"); // Fallback to default set
      }
    }

    // Call the function when the component is mounted
    fetchSetFromURL();
  }, []); // Empty dependency array to run once when the component mounts

  useEffect(() => {
    setShowPopup(true);
  }, []);

  const nailSets = {
    set1: ["01", "01", "01", "01", "01"],
    set2: ["02", "02", "02", "02", "02"],
    set5: ["05-2", "05", "05-2", "05", "05-2"],
    set11: ["11", "11", "11", "11", "11"],
    set12: ["12", "12", "12", "12", "12"],
    set15: ["15-1", "15", "15-1", "15", "15-1"],
    set17: ["17", "17", "17", "17", "17"],
    set19: ["19-2", "19-1", "19", "19-2", "19"],
    set20: ["20", "20", "20", "20", "20"],
    set21: ["21", "21-2", "21-1", "21-2", "21"],
    set27: ["27", "27-2", "27-3", "27-4", "27-5"],
    set28: ["28", "28", "28", "28", "28"],
    set29: ["29", "29", "29", "29", "29"],
    set30: ["30-1", "30", "30-1", "30", "30-1"],
    set31: ["31-1", "31", "31-2", "31", "31-1"],
    set32: ["32", "32-1", "32", "32-1", "32"],
    set33: ["33", "33-2", "33-2", "33-1", "33"],
    set34: ["34", "34", "34", "34", "34"],
    set35: ["35", "35-1", "35", "35-1", "35"],
    set36: ["36", "36", "36", "36", "36"],
    set37: ["37", "37", "37", "37", "37"],
    set38: ["38-1", "38", "38-2", "38", "38-2"],
    set39: ["39-1", "39", "39-1", "39", "39-1"],
    set40: ["40-1", "40", "40", "40-1", "40-1"],
    set41: ["41", "41", "41", "41", "41"],
    set42: ["42", "42-1", "42", "42-1", "42"],
    set43: ["43", "43", "43", "43", "43"],
    set44: ["44", "44", "44", "44", "44"],
    set45: ["45", "45", "45", "45", "45"],
    set46: ["46", "46-1", "46", "46", "46"],
    set73: ["73-2", "73", "73-1", "73-3", "73-4"],
    set76: ["76", "76-1", "76-2", "76-1", "76"],
    set77: ["77", "77-1", "77-3", "77-2", "77"],
    set78: ["78-1", "78-1", "78-2", "78-3", "78"],
    set79: ["79", "79-1", "79-2", "79-1", "79"],
    set80: ["80-1", "80-2", "80", "80-2", "80"],
    set81: ["81-3", "81-2", "81", "81-3", "81-2"],
    set82: ["82", "82", "82-1", "82-2", "82"],
    set83: ["83", "83", "83", "83", "83"],
    set84: ["84", "84", "84", "84", "84"],
    set86: ["86", "86", "86", "86", "86"],
    set87: ["87", "87", "87", "87", "87"],
    set88: ["88", "88", "88", "88", "88"],
    set90: ["90", "90", "90", "90", "90"],
    set91: ["91", "91", "91", "91", "91"],
    set92: ["92", "92", "92", "92", "92"],
    set93: ["93", "93", "93", "93", "93"],
    set94: ["94", "94", "94", "94", "94"],
    set95: ["95", "95", "95", "95", "95"],
    set96: ["96", "96", "96", "96", "96"],
    set97: ["97", "97", "97", "97", "97"],
    set98: ["98", "98", "98", "98", "98"],
    set99: ["99", "99", "99", "99-1", "99"],
    set100: ["100", "100", "100", "100-1", "100"],
    set101: ["101", "101", "101", "101", "101"],
    set102: ["102-2", "102", "102-1", "102", "102"],
    set103: ["103", "103-1", "103-1", "103-1", "103"],
  };

  // Load the set of textures when the current set changes
  useEffect(() => {
    const newTextures = nailSets[currentSet].map((texture) => {
      const image = new Image();
      image.src = `/nail/${texture}.png`;
      image.onload = () => {
        console.log(`Nail texture ${texture} loaded.`);
      };
      return image;
    });

    textures.current = newTextures;
  }, [currentSet]);

  useEffect(() => {
    tf.setBackend("webgl")
      .then(() => console.log("TensorFlow.js backend set to WebGL."))
      .catch((error) =>
        console.error("Error setting TensorFlow.js backend:", error)
      );
  }, []);

  const runHandpose = async () => {
    try {
      const net = await handpose.load();
      console.log("Handpose model loaded.");
      setInterval(() => {
        detect(net);
      }, 1);
    } catch (error) {
      console.error("Error loading Handpose model:", error);
    }
  };

  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hands = await net.estimateHands(video);
      console.log(hands);

      const ctx = canvasRef.current.getContext("2d");
      drawHand(hands, ctx);

      if (hands.length > 0) {
        const landmarks = hands[0].landmarks;
        placeNailTextures(landmarks, ctx);
      }
    }
  };

  const placeNailTextures = (landmarks, ctx) => {
    const fingertipIndices = [4, 8, 12, 16, 20];
    const knuckleIndices = [3, 7, 11, 15, 19]; // Knuckles to compare with fingertips
  
    fingertipIndices.forEach((tipIndex, i) => {
      const tipPosition = landmarks[tipIndex];
      const knucklePosition = landmarks[knuckleIndices[i]];
      const image = textures.current[i];
  
      if (tipPosition && knucklePosition && image.complete) {
        const x = canvasRef.current.width - tipPosition[0]; // Reverse X position
        const y = tipPosition[1];
  
        // Check if the finger is bent by comparing y positions of knuckle and tip.
        const isBent = knucklePosition[1] < tipPosition[1];
  
        ctx.save(); 
  
        // Move to the center of the image for flipping transformation
        ctx.translate(x, y);
  
        if (isBent) {
          // Flip the image vertically by scaling Y axis by -1
          ctx.scale(1, -1);
        }
  
        // Draw image centered at (0, 0) as we've translated the context
        ctx.drawImage(image, -15, -15, 30, 30);
  
        ctx.restore();
      }
    });
  };

  const drawHand = (predictions, ctx) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        const fingertipIndices = [4, 8, 12, 16, 20];
        fingertipIndices.forEach((index) => {
          const x = landmarks[index][0];
          const y = landmarks[index][1];

          ctx.beginPath();
          // ctx.arc(x, y, 5, 0, 3 * Math.PI);
          // ctx.fillStyle = "red";
          ctx.fill();
        });
      });
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  return (
    <div className="App">
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <header className="App-header">
        <Webcam
  ref={webcamRef}
  mirrored={true}
  style={{
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 9,
    width: "100%",
    height: "100vh",
    objectFit: "cover"
  }}
/>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: "100%",
            height: "100vh"
          }}
        />
  
        {/* Control buttons */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {Object.keys(nailSets).map((setKey) => (
            <button
              key={setKey}
              className={`btn ${currentSet === setKey ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setCurrentSet(setKey)}
            >
              {setKey.replace('set', 'Set ')}
            </button>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;