import React,{useContext,useState,useEffect}   from "react";
import EmojiIcons from "../../images/emoji.png"
import AtachFileIcons from "../../images/attach-file.png"
import VoiceIcon from "../../images/voice.png"
import SentMessageIcon from "../../images/paper.png"
import {sendPrivateMessage,sendGroupMessage} from "../../clientSignalR"
import Context from "../../context/Context";

export default function SentMessageBar(){

  const{contact,chat,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
    const[messagesOfActiveChat, setMessagesOfActiveChat] = useState()
    const[typedMessage,setTypedMessage] = useState('')
   
    useEffect(() =>{
         const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
         const getMessages = getActiveChat?.message?.map((msg) => msg)
         setActiveChat(getActiveChat)
         setMessagesOfActiveChat(getMessages)
           console.log("This chat is active: ",activeChat)
           console.log("Messages  active: ",messagesOfActiveChat)
    },[chat])

  function sendMessage(){
    try {
     if(activeChat && typedMessage){
      if(activeChat.chatType === 'privateChat'){
        sendPrivateMessage('Kristi',typedMessage,activeChat.connectionId)
      }
      else{
        sendGroupMessage(typedMessage,activeChat.connectionId)
      }
      updateActiveChat()
      handleSetChatActive()
     setTypedMessage('')
     console.log(chat)
     }
        
    } catch (error) {
      console.log("Error in updateing active chat: ",error)
    }   
  }

 
  const  updateActiveChat = () => {
    setActiveChat((prevActiveChat) => ({
      ...prevActiveChat,
      prevActiveChat : prevActiveChat.message.push(messageModel)
    }))
  }
  
console.log(activeChat)
  const messageModel = {
    messageSent : typedMessage,
    dateTimeSent : GetDateTimeNow(),
    isOutgoing : true
  }

  function handleSetChatActive(){
  
    const updateChat = chat?.map(chatItem => {
      if (chatItem.connectionId === activeChat.connectionId) {
        return activeChat; // If connectionId matches, set chatItem to activeChat
      } else {
        return chatItem; // Otherwise, keep the chatItem as it is
      }
    });
   
    actions({type: "setChat", payload:updateChat})  
  }
  
  const handleTypedMessage = (event) =>{  
    setTypedMessage(event.target.value)
  }

  function handleKeyPress(event) {
    if (event?.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form element
      document.getElementById("submitMessage").click();
    }
  }
   
  function GetDateTimeNow(){
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
}
    return(
      <section>       
        <div className="sent-message-bar">
          <div></div>
        <div className="sent-message-section-container">
          <div className="sent-message-section-icons">
            <img src={EmojiIcons} alt="emoji-icon" />
            <img src={AtachFileIcons} alt="atach-file-icon" />
            <img src={VoiceIcon} alt="voice-icon" />
          </div>
          <input
          value={typedMessage}
          onChange={handleTypedMessage}
          onKeyDown={handleKeyPress}
          className="input-sent-message"
            type="text"
            placeholder="Type a message..."
          />
          <div className="sentMessage-icon-cont">
            <img id="submitMessage" className="sentMessage-icon" onClick={sendMessage} src={SentMessageIcon} alt="aent-message-icon" />
          </div>
        </div>
      </div>
      </section>
    );
}