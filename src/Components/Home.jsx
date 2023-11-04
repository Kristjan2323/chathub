import React, {useEffect,useLayoutEffect, useState,useContext,useRef} from "react";
import ContactList from "./Layout/ContactList";
import ConversationChat from "./Layout/ConversationChat";
import Context from "../context/Context";

export default function Home(){

  const{contact,chat,actions} = useContext(Context)
  const [canScroll, setCanScroll] = useState(false)
  const scrollableContainerRef = useRef(null);

   useEffect(() => {
    setCanScroll((prevCanScroll) => !prevCanScroll);
  
   },[chat])
    
   useEffect(() => {
   
    scrollableContainerRef?.current?.scrollIntoView();
   },[canScroll])

    return(
        <main>
          <div className="main-container">
            <div className="main-contact-list scrollable-container">
                <ContactList/>
            </div>
            <div className="main-contact-list main-contact-list-chat  scrollable-container ">
             
                <ConversationChat/>    
                <div ref={scrollableContainerRef} />
            </div>
          </div>
        </main>
    )
}