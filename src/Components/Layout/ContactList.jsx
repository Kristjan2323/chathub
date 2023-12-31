import React,{useSttate,useEffect, useState, useContext} from "react";
import defaultProfilePic from "../../images/person_favicon.png"
import groupIcon from "../../images/group.png"
import DoubleTick from "../../images/checkmark-double-svgrepo-com.svg"
import DoubleTickBlue from "../../images/double-tick-blue-50.png"
import {  registerReceiveMessageHandler,markMessageAsReaded,registerReceiveGroupMessageHandler,
    registerReceivePrivateMessageHandler,registerReceiveMessageJoinRoomHandler,
    sendMessage} from "../../clientSignalR"
    import useGlobalState from "../../context/useGlobalState";
import Context from "../../context/Context";


export default function ContactList(){

const{contact,currentUserConnectionId,filterContact,chat,actions} = useContext(Context)
const[recieveMessage, setRecieveMessage] = useState(null)
const[activeChat, setActiveChat] = useState()
const[isFilterContactActive, setIsFilterContactActive] = useState(false)

function handleSetChatActive(connectionId){
   
  const selectedContact = chat?.find((itemChat) => itemChat.connectionId === connectionId);
   if(selectedContact){
 selectedContact.isChatConversationActive = true;

 markMessageAsReaded('',currentUserConnectionId,connectionId)
}


const updateChat = chat?.map(chatItem => ({
  ...chatItem,
  isChatConversationActive: chatItem.connectionId === connectionId,
  message: (chatItem.message || []).map(messageItem => ({
    ...messageItem,
    isReaded: true,
  })),
}))

actions({type: "setChat", payload:updateChat})
}

useEffect(() =>{
  const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
  setActiveChat(getActiveChat)
},[chat])


useEffect(()=>{
 if(contact.length> 0){
  setIsFilterContactActive(true)
 }
 else{
  setIsFilterContactActive(false)
 }
},[filterContact])


function getLastMessage(connectionId) {
  const currentChat = chat?.find((chatItem) => chatItem?.connectionId === connectionId);

  if (!currentChat || !currentChat.message || currentChat.message.length === 0) {
    return null;
  }

  const lastMessageObject = currentChat.message[currentChat.message.length - 1];

  if (!lastMessageObject) {
    return null; // or any other default value or indicator
  }

  let lastMessage = lastMessageObject.messageSent;

  if (React.isValidElement(lastMessage)) {
    // If it's a React element, get its text content
    lastMessage = lastMessage.props.children;
  }

  let lastMessage23Characters = '';

  if (lastMessage?.length > 20) {
    lastMessage23Characters = lastMessage.substring(0, 20) + '...';
  } else {
    lastMessage23Characters = lastMessage;
  }

  return lastMessage23Characters;
}


function getLastMessageStatus(connectionId){
  const currentChat = chat?.find((chatItem ) => chatItem?.connectionId === connectionId)
     const lastMessageObject = currentChat?.message[currentChat.message?.length - 1]
  
  return lastMessageObject
}

function getNumberOfUnreadedMessages(connectionId){
  const currentChat = chat?.find((chatItem ) => chatItem?.connectionId === connectionId)
  const unreadedMessages = currentChat?.message?.filter(msg => msg.isReaded === false)
  return unreadedMessages.length
}

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

// send incoming message in chat
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


  function GetDateTimeNow(){
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime
}


    return(
        <section className="section-contactList">
          {isFilterContactActive === false ?
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
                          {getLastMessageStatus(cont.connectionId)?.isOutgoing ===true ?
                            <img className="checkMarg-icon" 
                            src={ getLastMessageStatus(cont.connectionId)?.isReaded === true ? DoubleTickBlue : DoubleTick } 
                            alt="checkMark" /> :<span>&nbsp;</span>}
                            <p className="last-message-sent">{ getLastMessage(cont.connectionId)}</p>  
                            {getNumberOfUnreadedMessages(cont.connectionId) > 0 && 
                            getLastMessageStatus(cont.connectionId)?.isOutgoing === false ? 
                            <p className="number-unreaded-messages">{getNumberOfUnreadedMessages(cont.connectionId)}</p>
                           : <span>&nbsp;</span>}
                        </div>                    
                    </div>
                    <div className="last-message-sent-cont">
                     <p className="time-last-message">{GetDateTimeNow()}</p>
                    </div>
                    </div>
                </div>
            </div>  
          ))}    
                 </div>  :  
                 <div>
                 {filterContact?.map((cont,index) => (         
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
                                 {getLastMessageStatus(cont.connectionId)?.isOutgoing ===true ?
                                   <img className="checkMarg-icon" 
                                   src={ getLastMessageStatus(cont.connectionId)?.isReaded === true ? DoubleTickBlue : DoubleTick } 
                                   alt="checkMark" /> :<span>&nbsp;</span>}
                                   <p className="last-message-sent">{ getLastMessage(cont.connectionId)}</p>  
                                   {getNumberOfUnreadedMessages(cont.connectionId) > 0 && 
                                   getLastMessageStatus(cont.connectionId)?.isOutgoing === false ? 
                                   <p className="number-unreaded-messages">{getNumberOfUnreadedMessages(cont.connectionId)}</p>
                                  : <span>&nbsp;</span>}
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
                 }        
        </section>
    )
}