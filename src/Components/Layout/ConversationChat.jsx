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
         const getMessages = getActiveChat?.message?.map((msg) => msg)
         setActiveChat(getActiveChat)
         setMessagesOfActiveChat(getMessages)
           console.log("This chat is active: ",activeChat)
           setIsActiveChat(!isActiveChat)

    },[chat])

   /* useEffect(() =>{

        if(activeChat?.isChatConversationActive ===true ){
         const getmsg =   activeChat?.message?.map(msg => ({        
              ...msg,
              isReaded : msg?.senderConnectionId !== currentUserConnectionId ?  msg.isReaded = true : msg.isReaded
            }))
                setMessagesOfActiveChat(getmsg)
           }
           
   },[isActiveChat]) */

  


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