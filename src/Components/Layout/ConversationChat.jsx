import React, {useEffect, useState,useContext} from "react";
import ChatMessage from "./ChatMessage";
import Context from "../../context/Context";
import { registerReceivePrivateMessageHandler } from "../../clientSignalR";

export default function ConversationChat(){

    const[recieveMessage, setRecieveMessage] = useState()
    const{contact,chat,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
    const[messagesOfActiveChat, setMessagesOfActiveChat] = useState()
   
    useEffect(() =>{
         const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
         const getMessages = getActiveChat?.message?.map((msg) => msg)
         setActiveChat(getActiveChat)
         setMessagesOfActiveChat(getMessages)
           console.log("This chat is active: ",activeChat)
           console.log("Messages  active: ",messagesOfActiveChat)
    },[chat])

   
    const chatModel  = {
        connectionId :'',
        user : '',
        isChatConversationActive: false,
        
         message: [
            {
                messageSent : '',
                dateTimeSent : '',
                isOutgoing : true
            }      
         ],     
      }
    
      
    return(
             
            <div className="chat-conversation">   
            {activeChat && messagesOfActiveChat?.map((msg, index) => (      

            <ChatMessage 
                key={index}               
                message={msg?.messageSent}
                isOutgoing={msg?.isOutgoing}             
            />
            )) }
           
            </div>  
       
       
      
    )
}