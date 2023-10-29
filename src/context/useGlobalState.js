import {useState} from "react"

const useGlobalState = () => {
      const[contact,setContact] = useState([])
      const[chat,setChat] = useState([])
      

const actions = (action) => {
    const {type, payload} = action;
    switch(type){
        case 'setContact' :
        return setContact(payload)
         case 'setChat' :
            return setChat(payload)
        default:
            return contact,chat
    }
}
return {contact,chat,actions}

}

export default useGlobalState;