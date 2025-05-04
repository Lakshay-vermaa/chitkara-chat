const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const session = require("express-session");
const passport = require("passport");
const path = require("path");

require("./auth");

app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
  secret: "secret-session-key",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/home.html")
);

let userCount = 0;

io.on("connection", socket => {
  userCount++;
  io.emit("userCount", userCount);

  socket.on("disconnect", () => {
    userCount--;
    io.emit("userCount", userCount);
  });
});

http.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});


//  node server/server.js