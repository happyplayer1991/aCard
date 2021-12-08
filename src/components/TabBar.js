import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  I18nManager,
} from 'react-native';

const windowHeight = Dimensions.get('window').height;

export default class TabBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => this.props.navigation.replace('LastCallScreen')} >
            <View style={
              this.props.activeIndex === 1
                ? styles.btnActive
                : styles.btnUnActive
            }>
              <Image
                source={require('aCard/images/phone-in-talk.png')}
                style={styles.btnTabImg}
                resizeMode='contain'
              />
              <Text style={styles.btnTabText}>
                {I18nManager.isRTL ? 'שיחות אחרונות' : 'Last calls'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.replace('ContactsScreen')} >
            <View style={
              this.props.activeIndex === 2
                ? styles.btnActive
                : styles.btnUnActive
            }>
              <Image
                source={require('aCard/images/contact.png')}
                style={styles.btnTabImg}
                resizeMode='contain'
              />
              <Text style={styles.btnTabText}>
                {I18nManager.isRTL ? 'אנשי קשר' : 'Contacts'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.replace('PinedScreen')} >
            <View style={
              this.props.activeIndex === 3
                ? styles.btnActive
                : styles.btnUnActive
            }>
              <Image
                source={require('aCard/images/pin.png')}
                style={styles.btnTabImg}
                resizeMode='contain'
              />
              <Text style={styles.btnTabText}>
                {I18nManager.isRTL ? 'מסומנים' : 'Pined'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.replace('AddNumberScreen')} >
            <View style={
              this.props.activeIndex === 4
                ? styles.btnActive
                : styles.btnUnActive
            }>
              <Image
                source={require('aCard/images/whatsapp.png')}
                style={styles.btnTabImg}
                resizeMode='contain'
              />
              <Text style={styles.btnTabText}>
                {I18nManager.isRTL ? 'הזן מספר' : 'Add number'}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.1 - 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#47a4c5',
  },
  btnUnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#4291b0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  btnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#387a94',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  btnTabImg: {
    width: 12,
    height: 12,
    tintColor: '#ffffff',
  },
  btnTabText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
})