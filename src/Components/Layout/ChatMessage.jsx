import React, {useState,useEffect} from "react";

export default function ChatMessage({message,isOutgoing,sentTime}){
    if (message === undefined) {
        // Return null if message is undefined to avoid rendering
        return null;
      }
    const messageClas = isOutgoing ? 'outgoing-message' : 'incoming-message';
         console.log(message)
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
  
    return(
        <section>
        <div className="message-conatiner">
            <div className={`chat-message ${messageClas}`}>
                <div>
                    {message}   
                </div> 
             <div className="mesage-sent-time">
                <p>{formattedTime}</p>  
             </div>
            </div>
           
        </div>
        </section>
    )
}