import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  I18nManager
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.headerArea}>
        <Image
          style={styles.markImg}
          source={require('aCard/images/mark.png')}
          resizeMode='contain'
        />
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingScreen')} >
          <Image source={require('aCard/images/setting.png')} style={styles.btnSetting} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerArea: {
    flexDirection: I18nManager.isRTL ? 'row-reverse': 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  markImg: {
    width: windowWidth * 0.4,
    height: windowHeight * 0.1,
  },
  btnSetting: {
    width: windowHeight * 0.1 - 30,
    height: windowHeight * 0.1 - 30,
    tintColor: '#4aa2c4',
  },
})