import React,{useContext} from "react";
import ContactList from "../Layout/ContactList"
import ConversationChat from "../Layout/ConversationChat"
import ChatMessage from "./ChatMessage";
import Home from "../Home";
import Navbar from "./Navbar";
import SentMessageBar from "./SentMessageBar";
import LoginChatHub from "./LoginChatHub";
import Context from "../../context/Context";

export default function LayOut(){

    const {isLogedUser} = useContext(Context)
 

    return(
     <>
      {isLogedUser === false ?
      <LoginChatHub/> 
      : 
      <>
       <Navbar/>
        <Home/>     
       <SentMessageBar/>
       </>
      }
     </>
    )
}