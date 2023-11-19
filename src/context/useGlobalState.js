import {useState} from "react"

const useGlobalState = () => {
      const[contact,setContact] = useState([])
      const[filterContact,setFilterContact] = useState()
      const[chat,setChat] = useState([])
      const[currentUserConnectionId,setCurrentUserConnectionId] = useState('')



const actions = (action) => {
    const {type, payload} = action;
    switch(type){
        case 'setContact' :
        return setContact(payload)
        case 'setFilterContact' :
            return setFilterContact(payload)
         case 'setCurrentUserConnectionId' :
            return setCurrentUserConnectionId(payload)
            case 'setChat' :
              return setChat(payload)
        default:
            return {contact,chat,filterContact,currentUserConnectionId}
    }
}
return {contact,chat,filterContact,actions,currentUserConnectionId}

}

export default useGlobalState;