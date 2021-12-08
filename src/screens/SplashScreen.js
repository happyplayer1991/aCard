import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    try {
      const username = await AsyncStorage.getItem('UserName');
      if (username !== null) {
        global.currentUser = username;
        this.props.navigation.navigate('mainStack');
      } else {
        setTimeout(() => { this.props.navigation.navigate('LoginScreen'); }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.backImg}
          source={require('aCard/images/splash.jpg')}
          resizeMode='contain'
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backImg: {
    width: windowWidth,
    height: windowHeight,
  }
})