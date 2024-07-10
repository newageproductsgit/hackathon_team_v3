import React, { useState } from "react";

const ChatWindow = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    if (!prompt) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/fetchPrompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const result = await res.json();
      const responseText = result.candidates[0].content.parts[0].text;
      setResponse(responseText);
    } catch (error) {
      setError("Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glassContainer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <h3>
        Waiting for someone? <br />
        Boost your knowlegde with our AI Assistant!
      </h3>
      <textarea
        style={{
          resize: "none",
          background: "white",
          borderRadius: "10px",
          padding: "10px",
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here"
        rows={3}
        cols={50}
      />
      <br />
      <button
        onClick={handleFetch}
        disabled={loading}
        className="button-1"
        style={{ margin: "0 20%" }}
      >
        {loading ? "Fetching..." : "Send"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          marginTop: "10px",
          maxHeight: "200px",
          overflowY: "scroll",
          overflowX: "hidden",
          border: "2px solid white",
          borderRadius: "10px",
          padding:"10px"
        }}
      >
        {response && <pre>{response}</pre>}
      </div>
    </div>
  );
};

export default ChatWindow;
