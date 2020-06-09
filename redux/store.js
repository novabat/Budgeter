import {createStore,combineReducers,applyMiddleware} from 'redux'
import billReducer from './Bill/billReducer'
import thunk from 'redux-thunk'

const rootReducer=combineReducers({
    billReducer:billReducer
})
const configureStore = ()=> createStore(rootReducer,applyMiddleware(thunk))

export default configureStore