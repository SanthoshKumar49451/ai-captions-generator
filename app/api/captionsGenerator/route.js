import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";






async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return Buffer.from(bytes).toString("base64");
}
console.log(process.env.GOOGLE_API_KEY, "GOOGLE_API_KEY");
export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  console.log("api key verified", process.env.GOOGLE_API_KEY);

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file uploaded" }, { status: 400 });
    }

    const base64 = await fileToBase64(file);
    const mimeType = file.type;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log("Model initialized:", model);

    const prompt = `
Generate exactly 10 unique, creative, and social-media-ready captions for the image.
Return them as a **numbered list**, with each caption on a new line.
Do not include any explanations or extra text — just the list of captions.
`;


    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);
    console.log("Content generated:", result);

    const response = await result.response;
    console.log(response)
    const text = await response.text();
    console.log(text)
    const captions = text
      .split(/\n+/)
      .flatMap((line) =>
        line
          .split(/(?<=\.)\s+/)
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
      )
      .filter(Boolean)
      .slice(0, 10)
      .map((title) => ({ title }));


    return NextResponse.json({ captions });

  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Failed to generate captions" }, { status: 500 });
  }
}
