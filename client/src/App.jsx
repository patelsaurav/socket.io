import { useState, useEffect, useMemo } from 'react';
import { io } from "socket.io-client";
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');  // State for the message input
  const [room ,setRoom]=useState('');
  const [roomname,setRoomName] =useState()
  const socket =useMemo(()=>io("http://localhost:3001"),[]) ;

  useEffect(() => {
    socket.on('connect', () => {
      console.log("User connected with Id:", socket.id);  // Logs when socket connects
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    
    socket.on("recive-message", (s) => {
      console.log("message-recieved",s);
    });

    // Clean up socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (message.trim()) {
      socket.emit("message", {message,room});  // Emit message to server
      console.log("Message sent:", message);
        setMessage('');  // Clear the input field after sending
    }
  };

  const handleSubmitRoom = (event) => {
    event.preventDefault();
    
      socket.emit("join-room", roomname);  // Emit message to server
     
  };
  return (
    <div>
      <h1>Socket.io Example</h1>
      <p>Count: {count}</p>
      <form onSubmit={handleSubmitRoom}>
        <input
          type="text"
          value={roomname}
          onChange={(e) => setRoomName(e.target.value)}  // Update message state on input change
          placeholder="Type your message"
        />
      
        <button type="submit">Send room</button>
      </form> 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}  // Update message state on input change
          placeholder="Type your message"
        />
         <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}  // Update message state on input change
          placeholder="Type your room"
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default App;
