import React, {useContext, useEffect,useState,useRef} from "react";
import newChatIcon from "../../images/newChat.png"
import filterChatsIcon from "../../images/filterChats.png"
import videoCallIcon from "../../images/video-call.png"
import voiceCallIcon from "../../images/voice-call.png"
import searchIcon from "../../images/searchIcon.png"
import defaultProfilePic from "../../images/person_favicon.png"
import groupIcon from "../../images/group.png"
import Context from "../../context/Context";
import {getPersonalConnectionId, startHubConnection,createNewGroup,sendPrivateMessage,checkIfAlreadyRoomExist,
  registerReceiveMessageHandler,registerSendConnectedUsersHandler,registerReceiveMessageJoinRoomHandler,
  registerRecieveVerificationRoomExist,
  sendMessage,createNewContact,registerGetUserId,getAllConnectedUsers,registerConnectionIdExist} from "../../clientSignalR"
import useGlobalState from "../../context/useGlobalState";


export default function Navbar(){
const[showCreateChat,setShowCreateChat] = useState(false)
const[showNewChatForm, setNewChatForm]= useState(false)
const[showNewGroupForm, setNewGroupForm]= useState(false)
const[inputConectionId,setInputConnectionId] =useState('')
const[inputRoomName,setInputRoomName] =useState('')
const[inputName,setInputName] = useState('')
const[userConnectionId,setUserConnectionId] = useState('')
const {contact,currentUserConnectionId,groupContact,chat,actions} = useContext(Context)
const[activeChat, setActiveChat] = useState()
let newChatFormRef = useRef();
useEffect(() =>{
  startHubConnection();
},[1])

useEffect(() =>{
  getPersonalConnectionId() 
},[])


function getPersonalConnectionId() {
  new Promise((resolve, reject) => {
    try {
      registerGetUserId((result) => {
        const userConId = result;
         actions({type: "setCurrentUserConnectionId", payload:userConId})  
        resolve(userConId);
      });
    } catch (error) {
      console.error("This error occurred while listeming for GetConnectionId: ", error);
      reject(error);
    }
  })
    .then((userConId) => {
      setUserConnectionId(userConId);
     // actions({type: "setCurrentUserConnectionId", payload:userConId})  
    })
    .catch((error) => {
      console.error("Promise error: ", error);
    });
}

 
console.log("This is user currentUserConnectionId: ",currentUserConnectionId)

useEffect(() =>{
  const getActiveChat = chat?.find((chatItem ) => chatItem?.isChatConversationActive === true)
  setActiveChat(getActiveChat)

},[chat])

console.log("Ky eshte active chat in nav: ",activeChat)



const handleCreateNewContact = async () =>{
  try {
   
    createNewContact(inputName,inputConectionId);
    if(checkIfUserExistInContacList(inputConectionId) === true) {
       console.log("User already exist in your contacts.")
       return
    }
   
    const connectionidExist = await checkIfUserConnectionIdExsit();
    console.log("conID exisist:::::" , connectionidExist)
    if(connectionidExist === true){
       const chatType = 'privateChat';
      const contactModel = {
            name :inputName,
            connectionId : inputConectionId,
            chatType : chatType
          }
          actions({type: "setContact", payload:[...contact,contactModel]})  
         
          createConversationChatForNewContact(inputName,inputConectionId,chatType)
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

function createConversationChatForNewContact(name, connectionId, chatType){
  const chatModel  = {
    connectionId :connectionId,
    user : name,
    isChatConversationActive: true,
    chatType : chatType,
     message: [
        {
            messageSent : 'Contact 2 sent this message!',
            senderName: '',
            senderConnectionId: '',
            dateTimeSent : '',
            isOutgoing : true
        } 
     ],       
  }

  actions({type: "setChat", payload:[...chat,chatModel]})  
}

const handleCreateNewGroup = async () => {
  const UserRoomConnection = {
    Room: inputRoomName,
    User: inputName,
  };

  try {
   const doesRoomExist = await checkIfAlreadyExistARoomWithSameName();

    if (doesRoomExist) {
      console.log("Room already exists");
      return;
    } 

     createNewGroup(UserRoomConnection);

    const registerHandlerPromise = new Promise((resolve, reject) => {
      try {       
          const chatType = 'groupChat';
          createGroupChat(inputRoomName, chatType);
          createConversationChatForNewContact(inputName, inputRoomName, chatType);
         
          resolve(); // Resolve the promise when the handler is done
      
      } catch (error) {
        console.log("Error registering message handler", error);
        reject(error);
      }
    });

    await registerHandlerPromise; // Wait for the promise to resolve
  } catch (error) {
    console.error("Error creating a new group chat: ", error);
  }
};


const createGroupChat = (roomName,chatType) =>{
  const contactModel = {
    name :roomName,
    connectionId : roomName,
    chatType : chatType
  }
  actions({type: "setContact", payload:[...contact,contactModel]})  
}



const checkIfAlreadyExistARoomWithSameName = () =>{
  return new Promise ((resolve,reject) => {
    try {
      let roomExist = false;
      checkIfAlreadyRoomExist(inputRoomName);
      registerRecieveVerificationRoomExist((result) =>{
        console.log("doesRoomExist ",result)
        roomExist = result;
        resolve(roomExist)
      })   
   } 
   catch (error) {
      console.error("This error ocured while creating new group Chat: ",error)
      reject(error)
     }
   })
}



 function handleShowCart() {
  setShowCreateChat(!showCreateChat)
  setNewChatForm(false)
  setNewGroupForm(false)
 }

 function handleShowNewChatForm(){
  setShowCreateChat(false)
  setNewChatForm(true)
  setNewGroupForm(false)
 }

 function handleShowNewGroupForm(){
  setShowCreateChat(false)
  setNewGroupForm(true)
  setNewChatForm(false)
 }

 const handleInputConnectionId = (event) => {
  setInputConnectionId(event.target.value)
 }

 const handleInputRoomName = (event) => {
  setInputRoomName(event.target.value)
 }

 const handleInputName = (event) =>{
  setInputName(event.target.value)
 }

 useEffect(() => {
  let handleClickOutside = (e) => {
     if(newChatFormRef?.current){
       setShowCreateChat(false);
      setNewGroupForm(false);
      setNewChatForm(false);
    console.log(newChatFormRef.current)
     }
     
  };

  document.addEventListener('click', handleClickOutside);

  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

    return(
        <nav >
          <div className="navContact-navChar-container">
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
              <div className="create-chat-dropdown-cont" >
                
                  <p className="new-chat" onClick={handleShowNewChatForm}> New Chat</p>
                  <p className="new-grup" onClick={handleShowNewGroupForm}>New Group</p>
               
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
               {showNewGroupForm &&
             <div className="new-chat-form-container" >
              <p>Please enter:</p>
               <input               
               type="text"
               value={inputRoomName}
               placeholder="Group Name"
               onChange={handleInputRoomName}
               required
               />
               <input 
                type="text"
                value={inputName}
                placeholder="Your Name"
                onChange={handleInputName}
                required
               />
               <button onClick={handleCreateNewGroup} className="btn-create-contact">Create New Group</button>
             </div>
             }
              </div>
              <div className="search-container">
                <img src={searchIcon} alt="search-icon" className="search-icon" />
                <input type="search" placeholder="Search..." />
              </div>
            </div>
            {activeChat ? 
            <div className="chatConversation-navbar">
              <div className="userDetails-chatConversation">
                <img src={activeChat.chatType === 'privateChat' ? defaultProfilePic : groupIcon} 
                alt="profile-pic"  />
                <p>{activeChat.chatType === 'privateChat' ? activeChat?.user : activeChat?.connectionId}</p>
              </div>
              <div className="calling-icons-container">
                <img src={videoCallIcon} alt="camera-icon" />
                <img src={voiceCallIcon} alt="call-icon" />
              </div>
             
              </div>
              : 
              <div className="chatConversation-navbar">
              <div className="userDetails-chatConversation">
               
              </div>
              <div className="calling-icons-container">
                
              </div>
             
              </div>}
            </div>
        </nav>
    )
}