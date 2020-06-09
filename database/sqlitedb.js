import * as SQLite from 'expo-sqlite';
const db=SQLite.openDatabase("billList.db");
import moment from 'moment';

  var data2
  export const executeSql = async (sql, params = []) => {
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

  export const addBillSQL = async (data) => {
    await executeSql(`insert into bills (id,billname,amount,billdate,category,frequency,billURL,prevbill) values(?,?,?,?,?,?,?,?)`,
    [data.id,data.billName,data.amount,data.date,data.category,data.frequency,data.billURL,data.prevBill]);
  }

  export const updateDate=async ()=>{
          await select()
          var dateadd={
            "Monthly":2592000000,
            "Quarterly":7776000000,
            "Annually":31104000000,

          };
          for (var i=0;i<data2.length;i++)
          {
            var oldDate=parseInt(data2[i]["billdate"])
           
          if(oldDate<Date.now())
           {
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
              oldDateString = date.toString() + '/' + month.toString() + '/' + year.toString();
              if(data2[i]['frequency']=='Monthly')
              {if(month=='12')
              var nd=date+'/'+'01'+'/'+(d.getFullYear()+1).toString()
              else var nd=date+'/'+(d.getMonth()+2).toString()+'/'+year
              var newDate=moment(nd,'DD/MM/YYYY').toDate().getTime().toString()}
              else if(data2[i]['frequency']=='Quarterly')
              {if((d.getMonth()+1)>=10)
                var nd=date+'/'+(d.getMonth()+4-12).toString()+'/'+(d.getFullYear()+1).toString()
                else
                var nd=date+'/'+(d.getMonth()+4).toString()+'/'+year
              var newDate=moment(nd,'DD/MM/YYYY').toDate().getTime().toString()}
              else if(data2[i]['frequency']=='Annually')
              {var nd=date+'/'+month+'/'+(year+1).toString()
              var newDate=moment(nd,'DD/MM/YYYY').toDate().getTime().toString()}
            await executeSql('update bills set prevbill = ?,billdate = ? where id = ?;',
             [oldDateString,newDate,data2[i]["id"]]);
             console.log(newDate)
           }
          }
        }