import React from "react";
import newChatIcon from "../../images/newChat.png"
import filterChatsIcon from "../../images/filterChats.png"
import searchIcon from "../../images/searchIcon.png"

export default function Navbar(){

    return(
        <nav>
            <div className="nav">
                <div className="nav-container">
              <div>
                <h2>Chats</h2>
              </div>
              <div className="chat-icon-container">
                <img className="chat-icon" src={newChatIcon} alt="new-Caht"  />
                <img className="chat-icon" src={filterChatsIcon} alt="filter-chats"  />
              </div>
              </div>
              <div className="search-container">
                <img src={searchIcon} alt="search-icon" className="search-icon" />
                <input type="search" placeholder="Search..." />
              </div>
            </div>
        </nav>
    )
}