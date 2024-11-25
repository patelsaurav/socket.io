
// You can use third-party tools like Socket.IO Monitor to visually track and monitor your Socket.IO server in a web interface. This tool provides a real-time view of connected clients, emitted events, and messages.
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors"

let port = 3001;

const app = express();
// Express server and socket.io server connection
const server = createServer(app);
    
const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",  // Allow requests from the React frontend
      methods: ["GET", "POST"],
    }
  });
  
io.use((socket,next)=>{
next()
})
io.on("connection", (socket) => {
  console.log("User connected with Id", socket.id);
  socket.emit("welcome",`welcome to server ${socket.id}`) //everyone get message
  socket.broadcast.emit("welcome",`joined to server ${socket.id}`) //expect current socket everyone get id
  
  socket.on("disconnect",()=>{
    console.log("user dissconected",socket.id )
  })

  
  socket.on("message",({room,message})=>{

    //this is send message to a room or socket id
    io.to(room).emit("recive-message",message)
    
    // io.emit("recive-message",data)  //sended to entire circuit who listing recive-message 
  })

  socket.on("join-room",(message)=>{
   //join room is used to join room 
    socket.join(message)
    console.log("user joined room",message)
  })

});

app.get("/", (req, res) => {          
  res.send("Hello World");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
