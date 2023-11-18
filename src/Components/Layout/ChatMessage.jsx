import React, {useState,useEffect,useContext} from "react";
import Context from "../../context/Context";
import DoubleTick from "../../images/checkmark-double-svgrepo-com.svg"
import DoubleTickBlue from "../../images/double-tick-blue-50.png"
export default function ChatMessage({message,messageSender,isReaded,isOutgoing,timeSent}){

    const {contact,currentUserConnectionId,groupContact,chat,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
   
    useEffect(() =>{
      const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
      setActiveChat(getActiveChat)
     
       
      },[chat])


    if (message === undefined) {
        // Return null if message is undefined to avoid rendering
        return null;
      }

          
    const messageClas = isOutgoing ? 'outgoing-message' : 'incoming-message';
 

    return(
         <section>
        <div className="message-conatiner">
            {activeChat?.chatType === 'privateChat' ?            
            <div className={`chat-message ${messageClas} outgoing-message-chatGroup`}>
                <p>{message} </p>  
             <div className="mesage-sent-time">
                <p>{timeSent}</p>  
                {isOutgoing && 
              <p> <img className="double-ticket-message" src={isReaded ? DoubleTickBlue : DoubleTick} alt="double-ticket" /></p>
                }
             </div>
            </div>   
             :
             <div className={`chat-message ${messageClas} outgoing-message-chatGroup`}>
             <div>
                <p className="message-sender">{messageSender}</p>
                <p>{message} </p>   
             </div> 
          <div className="mesage-sent-time">
             <p>{timeSent}</p>  
               {isOutgoing &&
            <p> <img className="double-ticket-message" src={isReaded ? DoubleTickBlue : DoubleTick} alt="double-ticket" /></p>
             }
          </div>
         </div>  
           }              
        </div>
        </section>
    )
}