import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "https://trivia-scoring-backend.onrender.com";
export const socket = io(URL);
