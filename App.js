import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import NewBill from './screens/NewBill';
import EditBill from './screens/EditBill';

const navigator=createStackNavigator(
  {
  Home: HomeScreen,
  NewBill: NewBill,
  EditBill:EditBill
}, 
{
  initialRouteName:'Home',

}
);



export default createAppContainer(navigator);
