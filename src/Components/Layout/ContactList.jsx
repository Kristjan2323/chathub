import React,{useSttate,useEffect, useState, useContext} from "react";
import defaultProfilePic from "../../images/person_favicon.png"
import groupIcon from "../../images/group.png"
import checkMark from "../../images/checkmark-double-svgrepo-com.svg"
import {getPersonalConnectionId, startHubConnection,
    registerReceiveMessageHandler,markMessageAsReaded,registerReceiveGroupMessageHandler,
    registerReceivePrivateMessageHandler,registerReceiveMessageJoinRoomHandler,
    sendMessage} from "../../clientSignalR"
    import useGlobalState from "../../context/useGlobalState";
import Context from "../../context/Context";


export default function ContactList(){

const{contact,currentUserConnectionId,chat,actions} = useContext(Context)
const[recieveMessage, setRecieveMessage] = useState(null)
const[isMessageReaded,setIsMessageReaded] = useState(false)
const[lastMessage,setLastMessage] = useState(null)
const[activeChat, setActiveChat] = useState()
const[isChatSetActive, setIsChatSetActive] = useState(false)

function handleSetChatActive(connectionId){
   
  const selectedContact = chat?.find((itemChat) => itemChat.connectionId === connectionId);
  console.log("Selected chat contact:", selectedContact)
  if(selectedContact){
   selectedContact.isChatConversationActive = true;
   markMessageAsReaded('',currentUserConnectionId,connectionId)
  }
  
 /* const updateMessagesAsReaded = selectedContact?.message?.map(msg => ({
    ...msg,
    isReaded : msg.isReaded = true
  }))*/

const updateChat = chat?.map(chatItem => ({
    ...chatItem,
    isChatConversationActive: chatItem.connectionId === connectionId
}))

  actions({type: "setChat", payload:updateChat})
}

useEffect(() =>{
  const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
  setActiveChat(getActiveChat)
  if(!getActiveChat) return
 
  setIsChatSetActive(!isChatSetActive)
},[chat])



function getLastMessage(connectionId){
  const currentChat = chat?.find((chatItem ) => chatItem?.connectionId === connectionId)
     const lastMessage = currentChat?.message[currentChat.message?.length - 1]
     console.log("sms e fundit:: ", lastMessage)
  return lastMessage?.messageSent
}

//listen for the new message that is incoming
useEffect(() => {
    registerReceivePrivateMessageHandler((user, message,senderConnectionId, listenSenderId,messageId,chatType) => {
      if(user === null || user === undefined || message === null || message === undefined) return;
      const receiveMessageModel = {
        fromUser: user,
        message: message,
        messageId : messageId,
        fromReceiverId: listenSenderId,
        senderConnectionId : senderConnectionId,
        chatType : chatType
      };
    
      setRecieveMessage(receiveMessageModel)
      console.log("ky bobi po dergon sms",user)
    });
  }, []);

  /* notify the team that new member has enter*/
  useEffect(() => {
    registerReceiveMessageJoinRoomHandler((sender,userJoined,room) =>{
      const message = (
        <p>
          <strong>{`Member ${userJoined}`}</strong> has joined the group.
        </p>
      );
      const receiveMessageModel = {
        fromUser: sender,
        message: message,
        fromReceiverId: room,
        senderConnectionId : room,
        chatType: 'groupChat'
      };
    
      setRecieveMessage(receiveMessageModel)
      console.log(sender,room,userJoined)
    })
  })

  //add new incoming message in chat conversation
  useEffect(() => {
    if (recieveMessage) {
      if(!recieveMessage.message) return;
     
      AddMessageToChat();    
     
      console.log("conn Id e derguesit:: ",recieveMessage.senderConnectionId)
    }
  }, [recieveMessage]);
  
function checkIfMessageIsReaded(senderConnectionId,currentUserConnectionId,messageId){
  if(activeChat?.connectionId === senderConnectionId ){
    markMessageAsReaded(messageId,currentUserConnectionId,senderConnectionId)
    return true
  }
  else{
    return false
  }
}

  function AddMessageToChat() {
    if (!chat) return;
    if(currentUserConnectionId === recieveMessage.senderConnectionId) return;
    console.log("Ky eshte essage model qe morem: ",recieveMessage)
      console.log("Ky eshte chati: ",chat)
     const messageModel = {
        messageSent: recieveMessage?.message,
        messageId: recieveMessage?.messageId,
        senderName: recieveMessage?.fromUser,
        senderConnectionId: recieveMessage?.fromReceiverId,
        isOutgoing: false,
        isReaded : checkIfMessageIsReaded(recieveMessage?.senderConnectionId,recieveMessage?.fromReceiverId,recieveMessage?.messageId),
        dateTimeSent: GetDateTimeNow()
      };

    const updatedChat = chat.map(chatItem => {
      if(recieveMessage?.chatType === 'privateChat'){
         if (chatItem?.connectionId === recieveMessage?.senderConnectionId) {
        return {
          ...chatItem,
          message: [...chatItem.message, messageModel]  // Add the new message to the chatItem's message array
        };
      } else {
        return chatItem; // Keep other chatItems as they are
      }
      }
      if(recieveMessage?.chatType === 'groupChat'){
        if (chatItem.connectionId === recieveMessage?.fromReceiverId) {
          return {
            ...chatItem,
            message: [...chatItem.message, messageModel]  // Add the new message to the chatItem's message array
          };
        } else {
          return chatItem; // Keep other chatItems as they are
        }
      }
     
    });
    console.log("kte chatin po mundohemi ta upd: ",updatedChat)
    actions({ type: "setChat", payload: updatedChat });
  }

  const handleReadMessage = (messageId) => {
    const updatedChat = chat.map(chatItem => {
      if (chatItem.connectionId === recieveMessage?.fromReceiverId) {
        const updatedMessages = chatItem.message.map(msg => {
          if (msg.id === messageId) {
         
            return {
              ...msg,
              isReaded: true,
            };
          } else {
            return msg; // Keep other messages as they are
          }
        });
  
        return {
          ...chatItem,
          message: updatedMessages,
        };
      } else {
        return chatItem; // Keep other chatItems as they are
      }
    });
  
    console.log("Updated chat after reading message: ", updatedChat);
    actions({ type: "setChat", payload: updatedChat });
  };
  

  const messageModel = {
    messageSent : recieveMessage?.message,
    dateTimeSent : GetDateTimeNow(),
    isOutgoing : false,
    isReaded : false
  }
  
const isCurrentUserSenderOfMessage = () =>{
  let isCurrentUserTheSender = false
  
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
                        <img className="profile-image" 
                        src={cont.chatType === 'privateChat' ? defaultProfilePic: groupIcon}
                         alt="profile-picture" />
                        
                    </div>
                    <div className="contact-cntainer">
                    <div className="contact-name-time-container">
                        <p className="contact-name">{cont.name}</p>
                        <div className="message-checkMark-container">
                            <img className="checkMarg-icon" src={checkMark} alt="checkMark" />
                            <p className="last-message-sent">{getLastMessage(cont.connectionId)}</p>  
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