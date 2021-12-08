import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
  I18nManager,
} from 'react-native';

import Header from '../components/Header';
import TabBar from '../components/TabBar';

const windowWidth = Dimensions.get('window').width;

export default class AddNumberScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newNumber: '',
    }
  }

  goWhatsApp = () => {
    const url = "https://il.acard.app/whatsapp-" + global.currentUser + "?phone=" + this.state.newNumber;
    Linking.openURL(url)
      .catch((err) => console.error('An error occurred', err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} />
        <TabBar activeIndex={4} navigation={this.props.navigation} />
        <View style={styles.body}>
          <View style={styles.addNumber}>
            <TextInput
              style={styles.input}
              value={this.state.newNumber}
              placeholder={I18nManager.isRTL ? 'הזן מספר טלפון' : 'Add phone number'}
              placeholderTextColor="#6e6f72"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              keyboardType="numeric"
              textContentType="telephoneNumber"
              onChangeText={(newNumber) => this.setState({ newNumber })}
            />
            <TouchableOpacity onPress={this.goWhatsApp}>
              <View style={styles.btnWhatsApp}>
                <Image
                  style={styles.imgWhatsApp}
                  source={require('aCard/images/whatsapp.png')}
                  resizeMode='contain'
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            {
              I18nManager.isRTL
                ?
                'על מנת לשתף את ההודעה המובנת שלך, ' +
                'יש להזין מספר טלפון נייד או מספר וואטסאפ ביזנס תיקני.'
                :
                'To share your WhatsApp message with new number, enter ' +
                'valid mobile phone number or a WhatsApp Business number'
            }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  body: {
    flex: 1,
    backgroundColor: '#d1e2e7',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  addNumber: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    width: windowWidth - 70,
    height: 50,
  },
  btnWhatsApp: {
    backgroundColor: '#25d366',
  },
  imgWhatsApp: {
    margin: 10,
    width: 30,
    height: 30,
  },
  description: {
    marginVertical: 20,
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 18,
    textAlign: 'left',
    color: '#7c8081',
  }
})