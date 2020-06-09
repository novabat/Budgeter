import {ADD_BILL,DELETE_BILL,GET_BILLS,GET_BILLS_START,EDIT_BILL} from './billTypes'
import * as SQLite from 'expo-sqlite';
import {executeSql} from '../../database/sqlitedb'

const db=SQLite.openDatabase("billList.db");

export const getBills = () =>{
    return (dispatch)=> {
        dispatch({type:GET_BILLS_START})
        executeSql('select * from bills', []).then(data => {
            dispatch({type:GET_BILLS,value:data})} )
        
    }
}
export const addBill = (value) =>{
    return (dispatch)=> {
        executeSql(`insert into bills (id,billname,amount,billdate,category,frequency,billURL,prevbill) values(?,?,?,?,?,?,?,?)`,
        [value.id,value.billName,value.amount,value.billDate,value.category,value.frequency,value.billURL,value.prevBill]).then(
            dispatch({type:ADD_BILL,value:value}))
    }
}
export const deleteBill = (value) =>{
    return (dispatch)=>{
        executeSql(`delete from bills where id = ?;`, [value]).then(
        dispatch({type:DELETE_BILL,value}))
    }
}
export const editBill =(value)=>{
    return (dispatch)=>{
        executeSql(`update bills set billname=?,amount=?,billdate=?,category=?,frequency=?,billURL=? where id=?`,
        [value.billName,value.amount,value.billDate,value.category,value.frequency,value.billURL,value.id]).then(
            dispatch({type:EDIT_BILL,value})
        )
    }
}