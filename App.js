import React from 'react'
import {StyleSheet,View,SafeAreaView,ScrollView} from 'react-native'
import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import BillHomeScreen from './screens/BillHomeScreen';
import NewBill from './screens/NewBill';
import EditBill from './screens/EditBill';
import ExpenseHomeScreen from './screens/ExpenseHomeScreen'
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer'
import colors from './assets/colors';
import {Provider} from 'react-redux'
import configureStore from './redux/store'
const BillStack=createStackNavigator(
  {
  Home: BillHomeScreen,
  NewBill: NewBill,
  EditBill:EditBill
}, 
{
  initialRouteName:'Home',

}
);
const ExpenseStack=createStackNavigator(
  {
    Home: ExpenseHomeScreen
  },{
    initialRouteName:'Home'
  });
const customComponent = (props) =>(
  <SafeAreaView style ={{flex:1}}>
    <View style={{height:150,backgroundColor:colors.primary}}>
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)
const MyDrawerNavigator= createDrawerNavigator({
  Bills: {screen:BillStack},
  Expenses:{screen:ExpenseStack}
},
{
  initialRouteName:'Bills',
  drawerWidth:250,
  drawerPosition:'left',
  drawerBackgroundColor: colors.darke2,
  contentComponent: customComponent,
  contentOptions:{
  activeTintColor:colors.primary,
  inactiveTintColor:colors.text
  }
})
const AppContainer=createAppContainer(MyDrawerNavigator)
const store=configureStore()
const App = () =>{
  return(
    <Provider store={store}>
      <AppContainer/>
    </Provider>
  )
}
export default App

