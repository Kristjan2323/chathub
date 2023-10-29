import React,{useSttate,useEffect, useState, useContext} from "react";
import defaultProfilePic from "../../images/person_favicon.png"
import checkMark from "../../images/checkmark-double-svgrepo-com.svg"
import {getPersonalConnectionId, startHubConnection,
    registerReceiveMessageHandler,
    sendMessage} from "../../clientSignalR"
    import useGlobalState from "../../context/useGlobalState";
import { useCallback } from "react";
import Context from "../../context/Context";


export default function ContactList(){

const{contact,chat,actions} = useContext(Context)


useEffect(()=>{
    startHubConnection();
    console.log("This one is in ContactList: ",contact)
    console.log("ChatList: ",chat)
},[chat,contact])

function handleSetChatActive(connectionId){
  const selectedContact = chat?.find((itemChat) => itemChat.connectionId === connectionId);
  console.log("Selected chat contact:", selectedContact)
  selectedContact.isChatConversationActive = true;

const updateChat = chat?.map(chatItem => ({
    ...chatItem,
    isChatConversationActive: chatItem.connectionId === connectionId
}))


  actions({type: "setChat", payload:updateChat})
}

const currentDateTime = new Date();
const hours = currentDateTime.getHours().toString().padStart(2, '0');
const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
const formattedTime = `${hours}:${minutes}`;
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
                     <p className="time-last-message">{formattedTime}</p>
                    </div>
                    </div>
                </div>
            </div>  
          ))}    
                 </div>             
        </section>
    )
}