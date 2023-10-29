import React, {useEffect, useState,useContext} from "react";
import ChatMessage from "./ChatMessage";
import Context from "../../context/Context";
import EmojiIcons from "../../images/emoji.png"
import AtachFileIcons from "../../images/attach-file.png"
import VoiceIcon from "../../images/voice.png"
import SentMessageIcon from "../../images/paper.png"

export default function ConversationChat(){

 const sampleMessage = [
        {text:'Hello bro this is a kong text lets see what irs doing', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello bro this is a kong text lets see what irs doing', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello bro this is a kong text lets see what irs doing', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false},
        {text:'Hello', isOutgoing :true},
        {text:'Hello there!', isOutgoing :false}
      ]
    const[message, setmessage] = useState(sampleMessage)
    const{contact,chat,actions} = useContext(Context)
    const[activeChat, setActiveChat] = useState()
    const[messagesOfActiveChat, setMessagesOfActiveChat] = useState()
   
    useEffect(() =>{
         const getActiveChat = chat?.find((chatItem ) => chatItem.isChatConversationActive === true)
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
            {activeChat &&      
            <ChatMessage 
                key={activeChat?.connectionId}
                
                message={messagesOfActiveChat[0].messageSent}
                isOutgoing={messagesOfActiveChat[0]?.isOutgoing}             
            />
            }
           
            </div>  
       
       
      
    )
}