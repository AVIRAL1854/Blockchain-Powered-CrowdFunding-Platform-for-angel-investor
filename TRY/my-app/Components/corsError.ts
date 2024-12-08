import NextCors from "nextjs-cors";

export async function corsMiddleware(req, res) {
  await NextCors(req, res, {
    // Define your CORS options
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*", // Allow all origins (you can specify a specific domain instead of "*")
    optionsSuccessStatus: 200, // For older browsers compatibility
  });
}
