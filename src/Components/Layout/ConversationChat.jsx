import React, {useEffect, useState} from "react";
import ChatMessage from "./ChatMessage";


export default function ConversationChat(){

 const sampleMessage = [
        {text:'Hello bro this is a kong text lets see what irs doing', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false}
      ]
    const[message, setmessage] = useState(sampleMessage)
      
    return(
        <section>
          
            <div className="chat-conversation">
           {message?.map((msg, index)=>(
            <ChatMessage 
                key={index}
                message={msg.text}
                isOutgoing={msg.isOutgoing}
              
            />
           ))}
        
            </div>     
        </section>
    )
}