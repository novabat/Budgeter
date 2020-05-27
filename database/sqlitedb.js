import React,{useState} from 'react';
import * as SQLite from 'expo-sqlite';
const db=SQLite.openDatabase("billList.db");

  var data2
  const executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) => db.transaction(tx => {
      tx.executeSql(sql, params, (_, { rows }) => resolve(rows["_array"]))
    }))
  }
    
  
  export const createTable=()=>{
        db.transaction(
            tx =>{
              tx.executeSql(`create table if not exists bills (id text primary key,billname text,billURL text,amount integer,billdate text,category text,frequency text,prevbill text);`);
                }
        )
                    }

  export const select = async () => {
    await executeSql('select * from bills', []).then(data => {data2=data} )
      }
  export const updateDate=async ()=>{
          await select()
          var dateadd={
            "Monthly":2592000000,
            "Quarterly":7776000000,
            "Annualy":31104000000,

          };
          for (var i=0;i<data2.length;i++)
          {
            var oldDate=parseInt(data2[i]["billdate"])
           
            if(oldDate-Date.now()<0)
           {
            var newDate=parseInt(data2[i]["billdate"])+dateadd[data2[i]["frequency"]];
            newDate=newDate.toString()
            var d=new Date(oldDate)
            var date=d.getDate().toString(),
                month=(d.getMonth()+1).toString(),
                year=d.getFullYear().toString(),
                oldDateString=''
                if (date.length === 1) {                           // pad to two digits if needed
                  date = '0' + date;
              }
              if (month.length === 1) {                           // pad to two digits if needed
                  month = '0' + month;
              }
              oldDateString = date + '/' + month + '/' + year;
            executeSql('update bills set prevbill = ?,billdate = ? where id = ?;',
             [oldDateString,newDate,data2[i]["id"]]);
           }
          }
        }