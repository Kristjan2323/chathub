import React, {useEffect, useState,useContext,useRef} from "react";
import ChatMessage from "./ChatMessage";
import Context from "../../context/Context";


export default function ConversationChat(){

    const{logedUser,chat,actions} = useContext(Context)
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
           <>
           {activeChat?.isChatConversationActive === true ? 
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
        :
        <div className="show-welcome-message-container">
            <div className="welcome-message">
                <h2> Hello {logedUser?.name}! 🚀</h2>
               <p>Create new contacts and start chating... 💬</p>
             
            </div>
        </div>  
        }
            </>
       
      
    )
}