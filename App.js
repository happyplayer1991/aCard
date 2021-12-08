import React, { Component } from 'react';

import AppStack from './src/screens';

global.currentUser = null;

export default class App extends Component {
  render() {
    return (
      <AppStack />
    );
  }
}