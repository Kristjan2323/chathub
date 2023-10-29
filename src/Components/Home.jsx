import React from "react";
import ContactList from "./Layout/ContactList";
import ConversationChat from "./Layout/ConversationChat";
import  SentMessageBar  from "./Layout//SentMessageBar";
import EmojiIcons from "../images/emoji.png"
import AtachFileIcons from "../images/attach-file.png"
import VoiceIcon from "../images/voice.png"
import SentMessageIcon from "../images/paper.png"

export default function Home(){

    return(
        <main>
          <div className="main-container">
            <div className="main-contact-list scrollable-container">
                <ContactList/>
            </div>
            <div className="main-contact-list main-contact-list-chat  scrollable-container" >
             
                <ConversationChat/>    
            
            </div>
          </div>
        </main>
    )
}