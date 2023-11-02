import React, {useContext, useEffect,useState} from "react";
import newChatIcon from "../../images/newChat.png"
import filterChatsIcon from "../../images/filterChats.png"
import searchIcon from "../../images/searchIcon.png"
import Context from "../../context/Context";
import {getPersonalConnectionId, startHubConnection,sendPrivateMessage,
  registerReceiveMessageHandler,registerSendConnectedUsersHandler,
  sendMessage,createNewContact,registerGetUserId,getAllConnectedUsers,registerConnectionIdExist} from "../../clientSignalR"
import useGlobalState from "../../context/useGlobalState";


export default function Navbar(){
const[showCreateChat,setShowCreateChat] = useState(false)
const[showNewChatForm, setNewChatForm]= useState(false)
const[inputConectionId,setInputConnectionId] =useState('')
const[inputName,setInputName] = useState('')
const[userConnectionId,setUserConnectionId] = useState(null)
const {contact,chat,actions} = useContext(Context)
const[usersC,setUsers] = useState('')
  
useEffect(() =>{
  startHubConnection();
 

},[])

useEffect(() =>{
  

  getPersonalConnectionId() 
},[])

function getPersonalConnectionId() {
  new Promise((resolve, reject) => {
    try {
      registerGetUserId((result) => {
        const userConId = result;
        resolve(userConId);
      });
    } catch (error) {
      console.error("This error occurred: ", error);
      reject(error);
    }
  })
    .then((userConId) => {
      setUserConnectionId(userConId);
    })
    .catch((error) => {
      console.error("Promise error: ", error);
    });
}


console.log("This is user connId: ",userConnectionId)

useEffect(() =>{
 console.log("chat::" , chat)
},[chat])


const handleCreateNewContact = async () =>{
  try {
   
    createNewContact(inputName,inputConectionId);
    if(checkIfUserExistInContacList(inputConectionId) === true) {
       console.log("User already exist in your contacts.")
       return
    }
   
    const connectionidExist = await checkIfUserConnectionIdExsit();
    if(connectionidExist === true){
      const contactModel = {
            name :inputName,
            connectionId : inputConectionId
          }
          actions({type: "setContact", payload:[...contact,contactModel]})  
          createConversationChatForNewContact(inputName,inputConectionId)
    }
     
  } catch (error) {
    console.log("An error occured when trying to create a new contact:" , error)
  }
}



function checkIfUserConnectionIdExsit(){
  return new Promise((resolve, reject) => {
  try {
    let connectionIdExist = false;
    registerConnectionIdExist((result) => {
   // console.log("Does Connection Id exist: ", result)
    connectionIdExist = result;
   
    resolve(connectionIdExist)
  })
  } catch (error) {
    console.log(error)
    reject(error)
  } 
   });
}

function checkIfUserExistInContacList(connectionId){
 const userExistInContacList = contact?.some((item) => item.connectionId === connectionId)
 console.log("Does user exist in contacts:",userExistInContacList)
 return userExistInContacList;
}

function createConversationChatForNewContact(name, connectionId){

  const chatModel  = {
    connectionId :connectionId,
    user : name,
    isChatConversationActive: false,
    
     message: [
        {
            messageSent : 'Contact 2 sent this message!',
            dateTimeSent : '',
            isOutgoing : true
        }
   
     ],
    
        
  }

  actions({type: "setChat", payload:[...chat,chatModel]})  

}

  const chatModel2  = {
    connectionId : '',
    user : '',
    isChatConversationActive: false,
    chatMessages: {
     incommingMessages: [
        {
            inMessage : '',
            dateTimeSent : ''
        }
     ],
     outcomingMessages: [
        {
            outMessage : '',
            dateTimeSent : ''
        }
     ]
    }       
  }

 function handleShowCart() {
  setShowCreateChat(!showCreateChat)
  setNewChatForm(false)
  console.log("dddd")
 }

 function handleShowNewChatForm(){
  setShowCreateChat(false)
  setNewChatForm(true)
 }
 const handleInputConnectionId = (event) => {
  setInputConnectionId(event.target.value)
 }

 const handleInputName = (event) =>{
  setInputName(event.target.value)
 }

    return(
        <nav>
            <div className="nav">
                <div className="nav-container">
              <div>
                <h2>Chats</h2>
              </div>
              <div className="chat-icon-container">
                <img className="chat-icon" onClick={handleShowCart} src={newChatIcon} alt="new-Caht" />
                <img className="chat-icon"  src={filterChatsIcon} alt="filter-chats"  />
              </div>
              {showCreateChat &&
              <div className="create-chat-dropdown-cont">
                
                  <p className="new-chat" onClick={handleShowNewChatForm}> New Chat</p>
                  <p className="new-grup">New Group</p>
               
              </div>
              }
              {showNewChatForm &&
             <div className="new-chat-form-container">
              <p>Please enter:</p>
               <input 
               
               type="text"
               value={inputConectionId}
               placeholder="Conection Id"
               onChange={handleInputConnectionId}
               required
               />
               <input 
                type="text"
                value={inputName}
                placeholder="Name"
                onChange={handleInputName}
                required
               />
               <button onClick={handleCreateNewContact} className="btn-create-contact">Create New Contact</button>
             </div>
             }
              </div>
              <div className="search-container">
                <img src={searchIcon} alt="search-icon" className="search-icon" />
                <input type="search" placeholder="Search..." />
              </div>
            </div>
        </nav>
    )
}