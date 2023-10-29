import React from "react";
import ContactList from "../Layout/ContactList"
import ConversationChat from "../Layout/ConversationChat"
import ChatMessage from "./ChatMessage";
import Home from "../Home";
import Navbar from "./Navbar";
import SentMessageBar from "./SentMessageBar";
export default function LayOut(){


    return(
        <>
        <Navbar/>
        <Home/>
       <SentMessageBar/>

   </>
    )
}