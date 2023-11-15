import React, {useEffect, useState,useContext,useRef} from "react";
import ChatMessage from "./ChatMessage";
import Context from "../../context/Context";
import { registerReceivePrivateMessageHandler } from "../../clientSignalR";

export default function ConversationChat(){

    const[recieveMessage, setRecieveMessage] = useState()
    const{contact,currentUserConnectionId,chat,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
    const[messagesOfActiveChat, setMessagesOfActiveChat] = useState()
    const[isActiveChat, setIsActiveChat] = useState(false)
   
    useEffect(() =>{
         const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
       
         setActiveChat(getActiveChat)  
           console.log("This chat is active: ",activeChat)
           setIsActiveChat(!isActiveChat)
           if(activeChat?.isChatConversationActive ===true ){
            const getmsg =   activeChat?.message?.map(msg => ({        
                 ...msg,
                 isReaded : msg?.senderConnectionId !== currentUserConnectionId ?  msg.isReaded = true : msg.isReaded
               }))
               setMessagesOfActiveChat(getmsg)
              }

    },[chat])

    useEffect(() =>{

         
    const updateChat = chat?.map(chatItem => {
      if (chatItem.connectionId === activeChat.connectionId) {
        return activeChat; // If connectionId matches, set chatItem to activeChat
      } else {
        return chatItem; // Otherwise, keep the chatItem as it is
      }
    });
   
    actions({type: "setChat", payload:updateChat})  
  
           

   },[])

   console.log("mwsfrfne ",messagesOfActiveChat)


    const chatModel  = {
        connectionId :'1',
        user : 'Kristi',
        isChatConversationActive: true,
        chatType:'groupChat',
         message: [
            {
                messageSent : 'This message is ingoing',
                dateTimeSent : '18:20',
                isOutgoing : false,
                isReaded : false
            }      
         ],     
      }


      
    return(
             
            <div className="chat-conversation">   
            {activeChat && messagesOfActiveChat?.map((msg, index) => (      

            <ChatMessage 
                key={index}               
                message={msg?.messageSent}
                messageSender={msg?.messageSender}
                isReaded={msg.isReaded}
                isOutgoing={msg?.isOutgoing}     
                timeSent = {msg?.dateTimeSent}        
            />
            )) }
          
            </div>  
       
       
      
    )
}