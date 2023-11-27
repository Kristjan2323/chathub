import React, {useEffect,useContext, useState} from "react";
import Context from "../../context/Context";
import { startHubConnection ,registerGetUserId} from "../../clientSignalR"
  
  


export default function LoginChatHub(){

    const {contact,currentUserConnectionId,logedUser,isLogedUser,filterContact,chat,actions} = useContext(Context)
    const [inputName,setInputName] = useState('')

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
          
           // actions({type: "setCurrentUserConnectionId", payload:userConId})  
          })
          .catch((error) => {
            console.error("Promise error: ", error);
          });
      }

const handleInputConnectionid = (event) =>{
    const inputConnId = event.target.value
}

const handleInputName = (event) =>{
    const inputNameEntered = event.target.value
    setInputName(inputNameEntered)
    console.log(inputName)
}

const handleLogIn = () =>{
  if(currentUserConnectionId && inputName){
    const logedUserModel = {
      name:inputName,
      connectionId: currentUserConnectionId
    }
    
    actions({type: "setLogedUser", payload:logedUserModel})  
    actions({type: "setIsLogedUser", payload:true})
  }
  else{
    console.log("Name and ConnecionId are required.")
  }
}
console.log(logedUser)

    return(

        <section className="section-login-top">
           <div className="section-login">
            <div className="login-container">
            <h1 className="welcome-label">Welcome to ChatHub</h1>
            <input
             className="inputLogin inputLogin-connid"
            type="text"
            value={currentUserConnectionId && currentUserConnectionId}
            onChange={handleInputConnectionid}
            placeholder="Connection Id"
            readOnly
            required
            />
             <input 
             className="inputLogin inputLogin-name"
            type="text"
            value={inputName}
            onChange={handleInputName}
            placeholder="Name"
            required
            />
            <button 
            className="inputLogin btn-inputLogin"
            onClick={handleLogIn}
            >           
              Login
              </button>
            </div></div>
        </section>
    )
}