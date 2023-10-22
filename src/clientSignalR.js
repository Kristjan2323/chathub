import * as signalR from "@microsoft/signalr"

const hubUrl = "https://localhost:7080/chathub/"
const hubConnection = new signalR.HubConnectionBuilder()
.withUrl(hubUrl)
.configureLogging(signalR.LogLevel.Information)
.build()

const startConnection = async () =>{
    try {
        await hubConnection.start()
    } catch (error) {
        console.log(error)
    }
}