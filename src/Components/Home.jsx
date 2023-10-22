import React from "react";
import ContactList from "./Layout/ContactList";
import ConversationChat from "./Layout/ConversationChat";

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