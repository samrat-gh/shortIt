import express from "express";
import "dotenv/config";

import { ConnectToDB } from "./db/db";
import shortUrl from "./routes/url";

const app = express();

ConnectToDB();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:8000",
//     credentials: true,
//   })
// );

app.use("/api/", shortUrl);
app.listen(process.env.PORT || 8000, () => {
  console.log("🚀");
});
