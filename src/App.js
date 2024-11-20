import React, { useState } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const { transcript: liveTranscript, resetTranscript } = useSpeechRecognition();

  const apiKey = "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";

  const translateText = async (text) => {
    const endpoint = "https://api.openai.com/v1/chat/completions";
    let retries = 3;
    let delay = 1000; // Start with a 1-second delay

    while (retries > 0) {
      try {
        const response = await axios.post(
          endpoint,
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: `Translate this medical text to Spanish: ${text}` },
            ],
            max_tokens: 100,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        setTranslation(response.data.choices[0].message.content.trim());
        return;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          alert("Too many requests, please try again later.");
          console.warn("Rate limit exceeded. Retrying...");
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Increase delay exponentially
          retries -= 1;
        } else {
          // throw error;
          console.log(error, "error")
        }
      }
    }

    // throw new Error("Exceeded maximum retries due to rate limits.");
  };

  const handleStop = () => {
    setTranscript(liveTranscript);
    SpeechRecognition.stopListening();
    translateText(liveTranscript);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#121212",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          color: "Blue",
          // textShadow: "0px 0px 8px rgba(0, 230, 118, 0.8)",
          transition: "color 0.3s",
        }}
      >
        Healthcare Translation App
      </h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={SpeechRecognition.startListening}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#333",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
            color: "#00e676",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Start Speaking
        </button>
        <button
          onClick={handleStop}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#333",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
            color: "#00e676",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#333",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
            color: "#00e676",
            cursor: "pointer",
            transition: "transform 0.2s, background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#444")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#333")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Reset
        </button>
      </div>
      <div
        style={{
          width: "80%",
          backgroundColor: "#1e1e1e",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.8)",
          marginBottom: "20px",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <p style={{ marginBottom: "10px" }}>
          <strong>Live Transcript:</strong> {liveTranscript || "No input yet."}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Final Transcript:</strong> {transcript || "No input yet."}
        </p>
        <p style={{ marginBottom: "10px" }}>
          <strong>Translation:</strong> {translation || "No translation yet."}
        </p>
      </div>
    </div>
  );
};

export default App;
