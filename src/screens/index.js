import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import LastCallScreen from './LastCallScreen';
import ContactsScreen from './ContactsScreen';
import PinedScreen from './PinedScreen';
import AddNumberScreen from './AddNumberScreen';
import SettingScreen from './SettingScreen';

const mainStack = createStackNavigator({
  LastCallScreen: { 
    screen: LastCallScreen, 
    navigationOptions: { headerShown: false },
  },
  ContactsScreen: { 
    screen: ContactsScreen, 
    navigationOptions: { headerShown: false },
  },
  PinedScreen: {
    screen: PinedScreen, 
    navigationOptions: { headerShown: false },
  },
  AddNumberScreen: {
    screen: AddNumberScreen, 
    navigationOptions: { headerShown: false },
  },
  SettingScreen: {
    screen: SettingScreen, 
    navigationOptions: { headerShown: false },
  },
});

const AppStack = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: { headerShown: false },
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: { headerShown: false },
  },
  mainStack: {
    screen: mainStack,
    navigationOptions: { headerShown: false },
  },
});

export default createAppContainer(AppStack);
