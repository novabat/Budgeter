import React, { useState,useEffect } from 'react';
import { FlatList, View, StyleSheet,RefreshControl} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {TouchableRipple, Dialog,Portal,Paragraph,Button,Provider} from 'react-native-paper';
import colors from '../assets/colors';
import * as SQLite from 'expo-sqlite';
import {updateDate,createTable} from '../database/sqlitedb'

const ExpenseHomeScreen=()=>{
    return <View style={styles.base}>

    </View>
}
ExpenseHomeScreen.navigationOptions = screenProps =>({
    title: 'Expenses',
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
    base:{
        flex: 1,
        backgroundColor: colors.dark,
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
})

export default ExpenseHomeScreen