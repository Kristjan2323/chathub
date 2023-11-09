import * as signalR from "@microsoft/signalr"

const hubUrl = "https://localhost:7080/chathub/"
const hubConnection = new signalR.HubConnectionBuilder()
.withUrl(hubUrl)
.configureLogging(signalR.LogLevel.Information)
.build()

const startHubConnection = async () =>{
    try {
        await hubConnection.start();
        await getPersonalConnectionId();
    } catch (error) {
        console.log("Error while starting the SignalR connection: ",error)
    }
};

const createNewContact = async (user, connectionId ) =>{
    try {
        await hubConnection.invoke("CreateNewContact", user, connectionId)
    } catch (error) {

    }
}

const createNewGroup = async (UserRoomConnection) =>{
    try {
        await hubConnection.invoke("JoinRoom",UserRoomConnection)
    } catch (error) {
        console.error(error)
    }
}

const registerReceiveMessageHandler = (handler) =>{
    hubConnection.on("ReceiveMessage",handler)
}

const registerReceiveMessageJoinRoomHandler = (sender, message, room) =>{
    try {
          hubConnection.on("RecieveMessageJoinRoom",sender, message, room)
    } catch (error) {
        console.error("Error while creating group contact: ",error)
    }
  
}

const registerReceivePrivateMessageHandler = (user, message,listenSenderId) => {
    try {
        hubConnection.on("ReceivePrivateMessage",user, message,listenSenderId)
    } catch (error) {
        console.log("Error while listening for private message: ",error)
    }
    
}

const registerConnectionIdExist =  (handler) => {
    try {
         hubConnection.on("ConnectionIdExist",handler)
    } catch (error) {
        
    }
}
const registerRecieveVerificationRoomExist =  (handler) => {
    try {
         hubConnection.on("RecieveVerificationRoomExist",handler)
    } catch (error) {
        
    }
}

const registerSendConnectedUsersHandler = (handler) =>{
    hubConnection.on("GetAllConnectedUsers",handler)
}

const sendMessage = async (user, message) => {
    try {
      await hubConnection.invoke("SendMessage", user, message);
    } catch (err) {
      console.error("Error while sending message: ", err);
    }
  };

  const sendPrivateMessage = async (senderName,message,receiverConnectionId) =>{
    try {
         await hubConnection.invoke("SendPrivateMessage",senderName,message,receiverConnectionId)
    } catch (error) {
        console.error("Error occured while sending private message: ", error);
    }
   
  }

  const sendGroupMessage = async (message, room) =>{
    try {
       await hubConnection.invoke("SendGroupMessage",message, room) 
    } catch (error) {
        console.error(error)
    }
     
  }

  const registerRecieveGroupMessage =  (handler) =>{
     hubConnection.on("ReceiveGroupMessage",handler)
  }

const getPersonalConnectionId = async () =>{
    try {
        if(hubConnection.state === signalR.HubConnectionState.Connected)
       await hubConnection.invoke("GetPersonalConnectionId")
    } catch (error) {
        console.error("Error while geeting connection Id: ", error);
    }
}

const registerGetUserId = (result) =>{
    try {
           hubConnection.on("GetUserId", result)
    } catch (error) {
        console.error("Error while geeting connection Id: ", error);
    }
 
}

const getAllConnectedUsers = async () =>{
    try {
        hubConnection.invoke("GetAllConnectedUsers")
    } catch (error) {
        console.error("Error whiletrying to get connected users: ", error);
    }
}

const checkIfAlreadyRoomExist = async (room) =>{
    try {
         await hubConnection.invoke("CheckIfAlreadyExistARoomWithSameName",room)
    } catch (error) {
        console.log(error)
    }
   
}

export {startHubConnection,createNewContact,createNewGroup,getPersonalConnectionId,sendMessage,checkIfAlreadyRoomExist,
    registerReceiveMessageHandler,getAllConnectedUsers,registerRecieveVerificationRoomExist,
    registerConnectionIdExist,registerReceiveMessageJoinRoomHandler,sendGroupMessage,registerRecieveGroupMessage,
    registerGetUserId,registerSendConnectedUsersHandler,sendPrivateMessage,registerReceivePrivateMessageHandler};