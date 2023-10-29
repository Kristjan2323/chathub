import * as signalR from "@microsoft/signalr"

const hubUrl = "https://localhost:7080/chathub/"
const hubConnection = new signalR.HubConnectionBuilder()
.withUrl(hubUrl)
.configureLogging(signalR.LogLevel.Information)
.build()

const startHubConnection = async () =>{
    try {
        await hubConnection.start();
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

const registerReceiveMessageHandler = (handler) =>{
    hubConnection.on("ReceiveMessage",handler)
}

const registerConnectionIdExist =  (handler) => {
    try {
         hubConnection.on("ConnectionIdExist",handler)
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

const getPersonalConnectionId = (name) =>{
    try {
        hubConnection.invoke("GetPersonalConnectionId",name)
    } catch (error) {
        
    }
}

const getAllConnectedUsers = async () =>{
    try {
        hubConnection.invoke("GetAllConnectedUsers")
    } catch (error) {
        console.error("Error whiletrying to get connected users: ", error);
    }
}

export {startHubConnection,createNewContact,getPersonalConnectionId,sendMessage,
    registerReceiveMessageHandler,getAllConnectedUsers,registerConnectionIdExist,registerSendConnectedUsersHandler};