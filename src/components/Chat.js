import React, { useEffect, useState } from 'react';
import axios from 'axios'
import './Chat.css'
import send from '../send-button.svg';

export default function Chat(props) {
    const {setMessagesEmpty, socket, messages, changeMessages, username, setActiveUser} = props;
    const [active, setActive] = useState(0)
    const [user, setUser] = useState(false)
    const [currMessage, setCurrMessage] = useState("")

    useEffect(() => {
        axios.get('http://localhost:5000/getData/')
        .then(res => {
            if(user)    
                setActive(res.data)
            else{
                setActive(res.data + 1);
                setUser(true)
            }
        })
        .catch(e => console.log(e))
        if(socket){
            socket.on('new-user-message', (user) => {
                changeMessages(user, user, 'joined')
            })
            socket.on('new-message', (res) => {
                changeMessages(res.user, res.user, res.message)
            })
            socket.on('disconnect-message', user => {
                changeMessages(user, user, 'disconnected')
            })
        }
    }, [messages])

    const handleChange = (e) => {
        setCurrMessage(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(currMessage.length !== 0) {
            changeMessages('you', 'You', currMessage);
            socket.emit('send-message', currMessage)
            setCurrMessage("")
        }
    }

    const keyPressHandle = (e) => {
        if(e.key === 'Enter' && e.shiftKey){
            return
        }
        else if(e.key === 'Enter'){
            e.preventDefault()
            var f = document.forms['myForm']
            f.children[1].children[0].click()
            return
        }
    }

    return (
        <div className="body">
            <div className="message-container">
                {messages.map((message, i) => {
                    if(message.message === 'joined' || message.message === 'disconnected')
                        return <div className="join" key={i}>{message.user} {message.message}</div>
                    else
                        return(
                             <div id = "message" className ={message.classname} key={i}><b>{message.user}:</b> {message.message}</div>
                        )
                })}
            </div>
            <form id="myForm" onSubmit={handleSubmit}>
                <textarea type="submit" className="messageInput" value={currMessage} onChange={handleChange} onKeyDown={keyPressHandle}/>
                <div className="send-button-container"><img onClick={handleSubmit} src={send} alt="Send" className="send-button"/></div>
            </form>
            <p className="disconnect" onClick={() => {socket.disconnect();setMessagesEmpty(); setActiveUser(); setUser(false)}}>Disconnect</p> 
            <p className="active">Active: {active}</p>
        </div>
    )
}
