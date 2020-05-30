import React, { useState,useEffect } from 'react';
import { FlatList, View, StyleSheet,RefreshControl} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import Bill from '../components/Bill';
import {TouchableRipple, Dialog,Portal,Paragraph,Button,Provider} from 'react-native-paper';
import colors from '../assets/colors';
import * as SQLite from 'expo-sqlite';
import {updateDate,createTable} from '../database/sqlitedb'
const db=SQLite.openDatabase("billList.db");


const BillHomeScreen=({navigation}) =>{
  const [alertVisible,setAlertVisible]=useState(false)
  const [billList,setBillList]=useState([])
  const [delid,setDelid]=useState('')
  const deleteBillPrompt =(delid) =>{
    setDelid(delid)
    setAlertVisible(true)
    /*db.transaction(
      tx =>{
        tx.executeSql(`delete from bills where id = ?;`, [a]);
        tx.executeSql(`select * from bills`, [], (_,{ rows }) =>
        {setBillList(rows["_array"])}
      );
      }
    )*/
  }
  const hideDialog=() =>{
    setAlertVisible(false)
  }
  const editBill=(data) =>{
    navigation.navigate('EditBill',data)
  }
  const deleteBill=() =>{
    db.transaction(
      tx =>{
        tx.executeSql(`delete from bills where id = ?;`, [delid]);
        tx.executeSql(`select * from bills`, [], (_,{ rows }) =>
        {setBillList(rows["_array"])}
      );
      }
    )
    setAlertVisible(false)
  }
  const onRefresh=()=> {
    //Clear old data of the list
    setBillList([])

    //Call the Service to get the latest data
    //SQLiteDb.updateDate()
    db.transaction(
      tx => {tx.executeSql(`select * from bills`, [], (_,{ rows }) =>
      {setBillList(rows["_array"])}
    );}

    )
    
  }

  useEffect(()=>{
    createTable()
    updateDate()
    db.transaction(
      tx => {
        tx.executeSql(`select * from bills`, [], (_,{ rows }) =>{
          setBillList(rows["_array"])
        });
        //tx.executeSql(`delete from bills;`);
        //tx.executeSql('drop table bills');
      }
    )
  },[])
  const didFocusSubscription = navigation.addListener(
    'didFocus',
    payload => {
      db.transaction(
        tx =>{
          tx.executeSql(`select * from bills`, [], (_,{ rows }) =>
          {setBillList(rows["_array"])}
        );
        }
      )
    }
  );
    return <View style={styles.base}>
        <FlatList data={billList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Bill data={item} del={(delid) =>deleteBillPrompt(delid)} edit={data => editBill(data)}/>}
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={false}
        onRefresh={onRefresh}/>} 
         />
        <Provider>
        <Portal>
          <Dialog
             visible={alertVisible}
             onDismiss={hideDialog}
             style={styles.dialogBackground}>
            <Dialog.Title style={styles.dialogTitle}>Delete</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={styles.dialogBody}>Do you want to delete this bill?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button color={colors.primary} onPress={deleteBill}>Delete</Button>
              <Button color={colors.primary} onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        </Provider>
  </View>  
}
BillHomeScreen.navigationOptions = screenProps =>({
  title: 'Bills',
        headerStyle: {
        backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {  
          fontWeight: 'bold',  
      },
      headerRight: () => (<View style={styles.radius}>
        <TouchableRipple style={styles.ripple}
        onPress={() => screenProps.navigation.navigate('NewBill')}>
        <MaterialIcons style={styles.add} size={30} name= "add" />
        </TouchableRipple>
        </View>
      ),
      headerLeft: ()=> (<View style={styles.menuradius}>
        <TouchableRipple style={styles.ripple}
        onPress={() => screenProps.navigation.openDrawer()}>
        <MaterialIcons style={styles.menu} size={30} name= "menu" />
        </TouchableRipple>
        </View>

      ),
      animationEnabled: false,

})
const styles=StyleSheet.create({
  radius:{
    borderRadius:20,
    width:40,
    height:40,
    right:15,
    overflow: 'hidden'
  },
  add:{
    color:colors.text,
    right:-5,
    top:5
  },
  menu:{
    color:colors.text,
    left:5,
    top:5
  },
  menuradius:{
    borderRadius:20,
    width:40,
    height:40,
    left:15,
    overflow: 'hidden'

  },
  ripple:{position:'absolute',
    width:40,
    height:40,
    borderRadius:25,
    zIndex:999,
  },
base:{
  flex: 1,
backgroundColor: colors.dark,
},
dialogTitle:{
  color:colors.primary,
  fontSize:20

},
dialogBody:{
  color:colors.text,
  fontSize:18
},
dialogBackground:{
  backgroundColor:colors.darke3
}

});
export default BillHomeScreen;
