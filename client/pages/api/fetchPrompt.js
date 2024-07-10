// pages/api/fetchPrompt.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST requests are allowed" });
    return;
  }

  const { prompt } = req.body;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB5hiWdyEZelu7uMM6P2-nv9h1BtVOzTIc",
      requestOptions
    );
    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching response" });
  }
}
