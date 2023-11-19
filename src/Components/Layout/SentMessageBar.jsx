import React,{useContext,useState,useEffect}   from "react";
import EmojiIcons from "../../images/emoji.png"
import AtachFileIcons from "../../images/attach-file.png"
import VoiceIcon from "../../images/voice.png"
import SentMessageIcon from "../../images/paper.png"
import {sendPrivateMessage,sendGroupMessage,registerMarkMessageAsReaded} from "../../clientSignalR"
import Context from "../../context/Context";
import { nanoid } from "nanoid";

export default function SentMessageBar(){

  const{contact,chat,currentUserConnectionId,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
    const[messagesOfActiveChat, setMessagesOfActiveChat] = useState()
    const[typedMessage,setTypedMessage] = useState('')
    const[currentMessageId,setCurrentMessageId] = useState('')
    const[recieveMessage, setRecieveMessage] = useState(null)
    const[isMessageReaded,setIsMessageReaded] = useState(false)

    useEffect(() =>{
         const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
         const getMessages = getActiveChat?.message?.map((msg) => msg)
         setActiveChat(getActiveChat)
         setMessagesOfActiveChat(getMessages)
    
    },[chat])

    useEffect(() =>{
      if(chat.length === 0) return
      const getCurrentChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
      registerMarkMessageAsReaded((messageId, receiverConnectionId, senderConnectionId) =>{
        if(receiverConnectionId === undefined || receiverConnectionId === null || receiverConnectionId === '') return
        if (getCurrentChat) {
          const updatedMessages = getCurrentChat.message.map(messageItem => ({
            ...messageItem,
            isReaded: true,
          }));
    
          actions({ type: "setChat", payload: chat.map(chatItem => 
            chatItem?.connectionId === receiverConnectionId ? { ...chatItem, message: updatedMessages } : chatItem
          ) });

        } else {
          console.log("getCurrentChat not found for connectionId:", receiverConnectionId);
        }
  
      })
      
    })

  function sendMessage(){
    try {
     if(activeChat && typedMessage){
      const getMessageId = nanoid();
      setCurrentMessageId(getMessageId)
      if(activeChat.chatType === 'privateChat'){
        sendPrivateMessage('Kristi',typedMessage,activeChat.connectionId,currentMessageId)
      }
      else{
        sendGroupMessage(typedMessage,activeChat.connectionId,currentMessageId)
      }
      updateActiveChat()
      handleSetChatActive()
      setTypedMessage('')
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


  

  const messageModel = {
    messageSent : typedMessage,
    messageId : currentMessageId,
    senderName: contact?.name,
    senderConnectionId: currentUserConnectionId,
    isOutgoing : true,
    isReaded : false,
    dateTimeSent : GetDateTimeNow()
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
  


//degjon per mesazhin e derguar

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