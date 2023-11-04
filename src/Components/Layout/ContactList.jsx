import React,{useSttate,useEffect, useState, useContext} from "react";
import defaultProfilePic from "../../images/person_favicon.png"
import checkMark from "../../images/checkmark-double-svgrepo-com.svg"
import {getPersonalConnectionId, startHubConnection,
    registerReceiveMessageHandler,registerReceivePrivateMessageHandler,
    sendMessage} from "../../clientSignalR"
    import useGlobalState from "../../context/useGlobalState";
import { useCallback } from "react";
import Context from "../../context/Context";


export default function ContactList(){

const{contact,chat,actions} = useContext(Context)
const[recieveMessage, setRecieveMessage] = useState(null)


function handleSetChatActive(connectionId){
   
  const selectedContact = chat?.find((itemChat) => itemChat.connectionId === connectionId);
  console.log("Selected chat contact:", selectedContact)
  if(selectedContact){
   selectedContact.isChatConversationActive = true;
  }
  

const updateChat = chat?.map(chatItem => ({
    ...chatItem,
    isChatConversationActive: chatItem.connectionId === connectionId
}))


  actions({type: "setChat", payload:updateChat})

}

useEffect(() => {
    registerReceivePrivateMessageHandler((user, message, listenSenderId) => {
      const receiveMessageModel = {
        fromUser: user,
        message: message,
        fromReceiverId: listenSenderId
      };
    
      setRecieveMessage(receiveMessageModel)
   
    });
  }, []);

  useEffect(() => {
    if (recieveMessage) {
      AddMessageToChat();
    }
  }, [recieveMessage]);
  
  function AddMessageToChat() {
    if (!chat) return;
    console.log("Ky eshte essage model qe morem: ",recieveMessage)
      console.log("Ky eshte chati: ",chat)
     const messageModel = {
        messageSent: recieveMessage?.message,
        dateTimeSent: GetDateTimeNow(),
        isOutgoing: false
      };

    const updatedChat = chat.map(chatItem => {
      if (chatItem.connectionId === recieveMessage?.fromReceiverId) {
        return {
          ...chatItem,
          message: [...chatItem.message, messageModel]  // Add the new message to the chatItem's message array
        };
      } else {
        return chatItem; // Keep other chatItems as they are
      }
    });
    console.log("kte chatin po mundohemi ta upd: ",updatedChat)
    actions({ type: "setChat", payload: updatedChat });
  }

  const messageModel = {
    messageSent : recieveMessage?.message,
    dateTimeSent : GetDateTimeNow(),
    isOutgoing : false
  }
  
  function GetDateTimeNow(){
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
}


    return(
        <section className="section-contactList">
          <div>
          {contact?.map((cont,index) => (         
            <div key={index} onClick={ () => handleSetChatActive(cont.connectionId)} className="container-contactList">
                <div className="single-chat-container">
                    <div className="profile-image-container">
                        <img className="profile-image" src={defaultProfilePic} alt="profile-picture" />
                    </div>
                    <div className="contact-cntainer">
                    <div className="contact-name-time-container">
                        <p className="contact-name">{cont.name}</p>
                        <div className="message-checkMark-container">
                            <img className="checkMarg-icon" src={checkMark} alt="checkMark" />
                            <p className="last-message-sent">Last message </p>  
                        </div>                    
                    </div>
                    <div className="last-message-sent-cont">
                     <p className="time-last-message">{GetDateTimeNow()}</p>
                    </div>
                    </div>
                </div>
            </div>  
          ))}    
                 </div>             
        </section>
    )
}