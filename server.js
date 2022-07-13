const { response } = require("express");
const express = require("express");
const { Socket } = require("socket.io");
const app = express();

const dbConnect = require("./db");
dbConnect();

const comment = require("./models/comment");

app.use(express.json());

//Routes
app.post("/api.comments", (req, res) => {
  const comment = new comment({
    username: req.body.username,
    comment: req.body.comment,
  });

  comment.save().then((response) => {
    res.send(response);
  });
});

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/api/comments", (req, res) => {
  Comment.find().then(function (comments) {
    res.send(comments);
  });
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(`New connection : ${socket.id}`);
  //Recieve event
  socket.on("comment", (data) => {
    // console.log(data);
    data.time = Date();
    socket.broadcast.emit("comment", data);
  });
});

socket.on("typing", (data) => {
  socket.broadcast.emit("typing", data);
});
