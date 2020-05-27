import React, {Component} from 'react';
import {Text, View, StyleSheet,ScrollView,TextInput } from 'react-native';
import colors from '../assets/colors';
import {FilledTextField} from 'react-native-material-textfield';
import {ObjectID} from 'bson';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import * as SQLite from 'expo-sqlite'
import moment from "moment";
import {category,frequency} from '../assets/commonData'

const db = SQLite.openDatabase("billList.db");


class NewBill extends React.Component {

  constructor(props) {
    super(props);
    this.state = 
    {billDate: '',
    amount:'',
    billName:'',
    billURL:'',
    category:'Tax',
    frequency:'Monthly',
  dateError:false};
  };
formatText =(text)=>{
      if(text.length>10)
      {text=text.substring(0,10)}
      if(text.length==2 || text.length==5)
      {text+='/';}
      return text
  
 };
 submit=()=>{
   var dateErr=0;
   var billNameErr=0;
   var amountErr=0;
   this.setState({dateError:false});
   this.setState({billNameError:false});
   this.setState({amountError:false});
   var today=moment().toDate().getTime()
   var date=moment(this.state.billDate,"DD/MM/YYYY").toDate().getTime()
   date+=86400000  //add 1 day so that difference calculation is accurate
   if(!(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(this.state.billDate))||date<today)
   {
    this.setState({dateError:true});
    dateErr=1;
   }
   if(this.state.billName=='')
   {
     billNameErr=1;
     this.setState({billNameError:true});
   }
   if(this.state.amount=='')
   {
     amountErr=1;
     this.setState({amountError:true});
   }
   if(dateErr==0 && billNameErr==0 && amountErr==0 )
    {var amount=parseInt(this.state.amount)
    var id= new ObjectID();
    id=id.toString()
  db.transaction(
    tx =>{
      tx.executeSql(`insert into bills (id,billname,amount,billdate,category,frequency,billURL,prevbill) values(?,?,?,?,?,?,?,?)`,
      [id,this.state.billName,amount,date.toString(),this.state.category,this.state.frequency,this.state.billURL,"NA"]);
      /*tx.executeSql(`select * from bills`, [], (_,{ rows }) =>
          {console.log(rows)}
        );*/
    },
  )
  this.props.navigation.navigate('Home')
  } 
}

  render(){

    
    return (

    <View style={styles.base}>
      
      <ScrollView>
      
      <FilledTextField
        textColor={colors.text}
        tintColor={colors.primary}
        baseColor={colors.text}
        value={this.state.billName}
        onChangeText={billName => this.setState({billName})}
        inputContainerStyle={styles.inputbox} label='Bill Name' />
        {
        this.state.billNameError ? <Text style={styles.errormes}>Mandatory</Text>:null
        }
      <FilledTextField
        textColor={colors.text}
        tintColor={colors.primary}
        value={this.state.amount}
        onChangeText={amount => this.setState({amount})}
        keyboardType='phone-pad'
        baseColor={colors.text}
        inputContainerStyle={styles.inputbox} label='Amount' />
        {
        this.state.amountError ? <Text style={styles.errormes}>Mandatory</Text>:null
        }
      <FilledTextField
        textColor={colors.text}
        tintColor={colors.primary}
        baseColor={colors.text}
        keyboardType='phone-pad'
        value={this.state.billDate}
        formatText={this.formatText}
        placeholder="DD/MM/YYYY"
        onChangeText={(billDate) => this.setState({billDate})}
        inputContainerStyle={styles.inputbox} label='Next Bill Date' />
        {
        this.state.dateError ? <Text style={styles.errormes}>Invalid Date</Text>:null
        }
        <FilledTextField
        textColor={colors.text}
        tintColor={colors.primary}
        baseColor={colors.text}
        value={this.state.billURL}
        placeholder="(Optional)"
        onChangeText={(billURL) => this.setState({billURL})}
        inputContainerStyle={styles.inputbox} label='Bill Payment Website' />
        <Dropdown
       value={category[0]['value']}
       labelFontSize={14}
       itemColor={colors.text}
       selectedItemColor={colors.text}
       pickerStyle={styles.picker}
        baseColor={colors.text}
        textColor={colors.text}
        onChangeText={category =>this.setState({category})}
        containerStyle={[{marginTop:30},styles.dropdown]}
        label='Category'
        dropdownPosition={1}
        animationDuration={100}
        data={category}
      />
      <Dropdown
       value={frequency[0]['value']}
       labelFontSize={14}
       itemColor={colors.text}
       selectedItemColor={colors.text}
       pickerStyle={styles.picker}
        baseColor={colors.text}
        textColor={colors.text}
        containerStyle={[{marginTop:35},styles.dropdown]}
        onChangeText={frequency =>this.setState({frequency})}
        label='Due'
        fontSize={16}
        dropdownPosition={1}
        animationDuration={100}
        data={frequency}
      />
      <Button style={styles.done} mode='contained' onPress={() =>this.submit() }>Done</Button>
      
        </ScrollView>
        
        </View>
    );
  }
  }
  NewBill['navigationOptions'] = screenProps =>({
        title: 'New Bill',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
  }) 
const styles = StyleSheet.create({

  base: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  inputbox: {
    height:65,
    marginTop: 30,
    marginHorizontal: 15,
    elevation: 2,
    backgroundColor: colors.darke2,
  },
  errormes:{
    color:colors.error,
    left:25

  },
  done:{
    marginHorizontal:15,
    marginTop:15,
    backgroundColor:colors.primary,
    marginBottom:70
  },
  dropdown:{
    borderTopLeftRadius:3,
    borderTopRightRadius:3,
    paddingLeft:10,
    marginHorizontal: 15,
    backgroundColor: colors.darke2,

  },
  picker:{
    backgroundColor:colors.darke3,
  },

});
export default NewBill;
