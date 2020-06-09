import React, { useState,useEffect } from 'react';
import { FlatList, View, StyleSheet,RefreshControl,ActivityIndicator,Text} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import Bill from '../components/Bill';
import {TouchableRipple, Dialog,Portal,Paragraph,Button,Provider,} from 'react-native-paper';
import colors from '../assets/colors';
import * as SQLite from 'expo-sqlite';
import {updateDate,createTable} from '../database/sqlitedb'
import {getBills,deleteBill} from '../redux/Bill/billActions'
import {connect} from 'react-redux'

const db=SQLite.openDatabase("billList.db");


const BillHomeScreen=(props) =>{
  const [alertVisible,setAlertVisible]=useState(false)
  const [delid,setDelid]=useState('')
  const deleteBillPrompt =(delid) =>{
    setDelid(delid)
    setAlertVisible(true)
  }
  const hideDialog=() =>{
    setAlertVisible(false)
  }
  const editBill=(data) =>{
    props.navigation.navigate('EditBill',data)
  }
  const deleteBill=() =>{
    props.deleteBill(delid)
    setAlertVisible(false)
  }
  const onRefresh=()=> {
    updateDate()
    props.getBills()
  }

  useEffect( ()=>{
    const listener = props.navigation.addListener('didFocus',async() => {
      createTable()
      await updateDate()
      props.getBills()
    })
    return function cleanup(){
      listener.remove();
    }
  },[])
    return (
      
    <View style={styles.base}>
      {props.isLoading?
      <ActivityIndicator />:
      <View>
        <FlatList data={props.bills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Bill data={item} del={(delid) =>deleteBillPrompt(delid)} edit={data => editBill(data)}/>}
        refreshControl={
          <RefreshControl
            refreshing={false}
        onRefresh={onRefresh}/>} 
         />
         </View>
        }
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
  </View>)
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

const mapStateToProps = state =>{
  return{
    isLoading:state.billReducer.isLoading,
    bills:state.billReducer.billList
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    getBills: ()=>dispatch(getBills()),
    deleteBill:(id)=>dispatch(deleteBill(id))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(BillHomeScreen);
