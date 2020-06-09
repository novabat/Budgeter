import {ADD_BILL,DELETE_BILL,GET_BILLS,GET_BILLS_START,EDIT_BILL} from './billTypes'
import { category } from '../../assets/commonData'

const initialState = {
    isLoading:false,
    billList : []
}

const billReducer = (state=initialState,action) =>{
    switch(action.type){
    case ADD_BILL: 
        return {...state,
        billList:state.billList.push(action.value)}

    case GET_BILLS_START:
        return {...state,isLoading:true}

    case GET_BILLS:
        return {...state,isLoading:false,billList:action.value}
    
    case DELETE_BILL:
        return {...state,billList:state.billList.filter((item)=>item.id!=action.value)}
    
    case EDIT_BILL:
        var x=state.billList
        for (i in x)
        {if(i.id==action.value.id)
        {
            i.billName=action.value.billName
            i.amount=action.value.amount
            i.billDate=action.value.billDate
            i.category=action.value.category
            i.frequency=action.value.frequency
            i.billURL=action.value.billURL
            break;
        }}
        return {...state,billList:x}
        
    default: return state
}
}

export default billReducer