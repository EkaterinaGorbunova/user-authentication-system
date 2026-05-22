import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import path from "path";
import helmet from "helmet";
import passportMiddleware from './middleware/passportMiddleware';
import flash from 'express-flash';

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      password?:string;
      role: 'user' | 'admin';
    }
  }
}

const port = process.env.port || 8000;

const app = express();

app.use(helmet());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());

import indexRoute from "./routes/indexRoute";
import authRoute from "./routes/authRoute";
import adminRoute from "./routes/adminRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on http://localhost:${port}`);
});

export default app