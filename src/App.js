import React, {useState, useEffect} from 'react';
import Username from './components/Username';
import Chat from './components/Chat';
import io from 'socket.io-client';
import './App.css'

function App() {

  const [user, setUser] = useState(false);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)


  const setActiveUser = () => {
    setUser(false)
  }

  const setCurrUser = (user, username) => {
    setUser(user)
    setUsername(username);
  }

  useEffect(() => {
    if(user){
      const socket = io('http://localhost:5000/')
      socket.emit('new-user', username)
      changeMessages('you', 'You', 'joined')
      setSocket(socket)
    }
  }, [user])

  const setMessagesEmpty = () => {
    setMessages([])
  }

  const changeMessages = (classname, user, message) => {
    setMessages([...messages, {
      classname,
      user,
      message
    }])
  }


  return (
    <div className="App">
      { !user ?
      <>
        <div className="header">React Community Chat App</div>
        <Username setCurrUser={setCurrUser}/>
      </>
      :
      <Chat setMessagesEmpty={setMessagesEmpty} socket={socket} messages={messages} changeMessages={changeMessages} username={username} setActiveUser= {setActiveUser}/>
      }
    </div>
  );
}

export default App;
