import {useState} from "react"

const useGlobalState = () => {
      const[contact,setContact] = useState([])
      const[groupContact,setGroupContact] = useState()
      const[chat,setChat] = useState([])
      const[currentUserConnectionId,setCurrentUserConnectionId] = useState('')



const actions = (action) => {
    const {type, payload} = action;
    switch(type){
        case 'setContact' :
        return setContact(payload)
        case 'setGroupContact' :
            return setGroupContact(payload)
         case 'setCurrentUserConnectionId' :
            return setCurrentUserConnectionId(payload)
            case 'setChat' :
              return setChat(payload)
        default:
            return {contact,chat,groupContact,currentUserConnectionId}
    }
}
return {contact,chat,groupContact,actions,currentUserConnectionId}

}

export default useGlobalState;