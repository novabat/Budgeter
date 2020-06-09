import * as React from 'react';
import { Text, View, StyleSheet,Linking} from 'react-native';
import { TouchableRipple,Button } from 'react-native-paper';
import colors from '../assets/colors'
import {MaterialIcons} from '@expo/vector-icons';
const Bill = ({data,del,edit}) =>{
  const PayButton=()=>{
    if(data['billURL']=='')
    return null
    else
    return <Button mode="contained" style={styles.paybtn}
    onPress={() => Linking.openURL('https://'+data['billURL'])}>Pay</Button> 
  }
  const duecalc=() => {
    var date=new Date(parseInt(data['billdate']))
    var datestring
    var day=date.getDate().toString()
    day=day.padStart(2,'0')
    var month=(date.getMonth()+1).toString()
    month=month.padStart(2,'0')
    var year=date.getFullYear().toString() 
    datestring=day+"/"+month+"/"+year
    return "Bill is due on: "+datestring

  }
    return <TouchableRipple
    borderless={true}
   onPress={() =>edit(data)}> 
    <View style={styles.cardStyle}>
    <View style={[styles.header,{backgroundColor:colors[data['category']]}]}>
      <Text style={styles.title}>{data['category']}</Text>
      <View style={styles.radius}>
        <TouchableRipple style={styles.ripple}
        onPress={() => del(data.id)}>
        <MaterialIcons style={styles.del} size={30} name= "delete" />
        </TouchableRipple>
      </View>
    </View>
    <Text style={styles.billname}>{data['billname']}</Text>
    <Text style={styles.due}>{duecalc()}</Text>
    <Text style={styles.prevbill}>Previous Bill: {data['prevbill']}</Text>
    <Text style={styles.amount}>₹ {data['amount']}</Text>
    <Text style={styles.frequency}>{data['frequency']}</Text>
    <View style={{flex:1}}>
    <PayButton/>
    </View>
  </View>
  </TouchableRipple>
}

const styles=StyleSheet.create({
  header:{
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    flexDirection:'row'
  },
  title:{
    color:colors.text,
    fontSize:22,
    fontWeight:'bold',
    margin:12,
    left:3
  },
  billname:{
    margin:5,
    left:10,
    top:6,
    fontWeight:"bold",
    fontSize:20,
    color:colors.text
  },
  due:{
    top:10,
    margin:5, 
    fontSize:16,
    color:colors.text,
    left:10

  },
  amount:{
    position:'absolute',
    color:colors.text,
    fontWeight:'bold',
    fontSize:20,
    right:20,
    top:80
  },
  frequency:{
    position:'absolute',
    top:105,
    fontSize:16,
    color:colors.text,
    right:20

  },
  prevbill:{
    top:10,
    margin:5,
    fontSize:16,
    color:colors.text,
    left:10

  },
  cardStyle:{
        marginHorizontal:10,
        marginTop:20,
        elevation:1,
        backgroundColor:colors.darke1,
        borderRadius:10,
        height:200
    },
    radius:{
      position:'absolute',
      borderRadius:20,
      width:40,
      height:40,
      right:15,
      top:5,
      overflow: 'hidden'
    },
  paybtn:{
    position:'absolute',
    marginTop:15,
    width:'30%',
    alignSelf:'flex-start',
    right:15,
    bottom:15,
    backgroundColor:colors.primary
  },
  resetbtn:{
    position:'absolute',
    marginTop:20,
    left:15,
    bottom:15,
    backgroundColor:colors.primary

  },
    del:{
      color:colors.del,
      right:-5,
      top:5
    },
    ripple:{position:'absolute',
      width:40,
      height:40,
      borderRadius:25,
      zIndex:999,
    },
})

export default Bill;