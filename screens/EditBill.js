import React, {Component} from 'react';
import {Text, View, StyleSheet,ScrollView } from 'react-native';
import colors from '../assets/colors';
import {
  FilledTextField,
} from 'react-native-material-textfield';
import { Button } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import * as SQLite from 'expo-sqlite'
import moment from "moment";
import {category,frequency} from '../assets/commonData'
import {connect} from 'react-redux'
import {editBill} from '../redux/Bill/billActions'

const db = SQLite.openDatabase("billList.db");

class EditBill extends React.Component {

  constructor(props) {
    super(props);
    this.state = 
    {billDate: this.billDateConversion(this.props.navigation.getParam('billdate')),
    amount:JSON.stringify(this.props.navigation.getParam('amount')),
    billName:this.props.navigation.getParam('billname'),
    billURL:this.props.navigation.getParam('billURL'),
    category:this.props.navigation.getParam('category'),
    frequency:this.props.navigation.getParam('frequency'),
  dateError:false};
  };
formatText =(text)=>{
      if(text.length>10)
      {text=text.substring(0,10)}
      if(text.length==2 || text.length==5)
      {text+='/';}
      return text
  
 };
 billDateConversion=(x)=>{
    x=parseInt(x)
    var date=new Date(x)
    var datestring
    var day=date.getDate().toString()
    day=day.padStart(2,'0')
    var month=(date.getMonth()+1).toString()
    month=month.padStart(2,'0')
    var year=date.getFullYear().toString() 
    datestring=day+"/"+month+"/"+year
    return datestring
     

 }
 submit=()=>{
   var dateErr=0;
   var billNameErr=0;
   var amountErr=0;
   this.setState({dateError:false});
   this.setState({billNameError:false});
   this.setState({amountError:false});
   var today=moment().toDate().getTime()
   var date=moment(this.state.billDate,"DD/MM/YYYY").toDate().getTime()
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
    var data={
        id:this.props.navigation.getParam('id'),
        billName:this.state.billName,
        amount:amount,
        billDate:date.toString(),
        category:this.state.category,
        frequency:this.state.frequency,
        billURL:this.state.billURL,
      
    }
    this.props.editBill(data)
  /*db.transaction(
    tx =>{
      tx.executeSql(`update bills set billname=?,amount=?,billdate=?,category=?,frequency=?,billURL=? where id=?`,
      [this.state.billName,amount,date.toString(),this.state.category,this.state.frequency,this.state.billURL,this.props.navigation.getParam('id')]);
    },
  )*/
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
       value={this.state.category}
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
       value={this.state.frequency}
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
  EditBill['navigationOptions'] = () =>({
        title: 'Edit Bill',
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
const mapStateToProps = state =>{
  return{
    bills:state.billReducer.billList
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    editBill:(id)=>dispatch(editBill(id))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(EditBill);
