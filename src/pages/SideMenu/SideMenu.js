import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { View, StyleSheet, Image, TouchableHighlight, Text } from 'react-native';

import api from '../../services/api';
import { whileStatement } from '@babel/types';

class SideMenu extends Component {

  logout = async () => {
    try {
        const response = await api.post('/logout');
        this.props.rerender();

    } catch (_err) {
        console.log(_err);
    }
}
  
  render () {
    return (
      <View style={styles.container}>
        <Image 
          source={require('../../images/logo_com_nome.png')}
          style={styles.logo}/>
        
        <TouchableHighlight underlayColor='#DCDCDC' onPress={() => {
            this.props.navigation.navigate('AShow');
            this.props.navigation.closeDrawer();
              }} style={{height: 50, marginTop: 10}}>
              <Text style={styles.text}>AShows Iniciadas</Text>
        </TouchableHighlight>
       
        <TouchableHighlight underlayColor='#DCDCDC' onPress={() => {
            this.logout();
            this.props.navigation.navigate('SignIn');
            this.props.navigation.closeDrawer();
              }} style={{height: 50, marginTop: 10}}>
              <Text style={styles.text}>Sair</Text>
        </TouchableHighlight>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', 
    backgroundColor:'#000',
  },
  logo:{
    margin: 20,
    height: 60, 
    width: 250,
    bottom: 10,
    right: 10,
  },
  text: {
    marginTop: 12,
    marginLeft: 15,
    fontWeight: '700',
    fontSize: 18,
    color:'#fff'

  }
});

SideMenu.propTypes = {
  navigation: PropTypes.object
};


export default SideMenu;