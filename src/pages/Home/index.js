import React, { Component } from 'react';
import { Text, 
  TextInput, 
  View ,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  BackHandler,
  ToastAndroid
} from 'react-native';
import { Divider,ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';

import PTRView from 'react-native-pull-to-refresh';

const axios = require('axios');
import configs from '../../../config'

import styles from './Home.style'
import Header from './Header'
import Tab from './Tab'
import Story from './Story'
import CreateStatusButton from './CreateStatusButton'
import Status from './Status'

export default class index extends Component {
  constructor(){
    super()
    this.state={
     post: [],
     story:  require('../../data/story.json'),
     isRefreshing: false,

      token:""
    }
    setInterval(this._getData,1500)
  }

  _getData = async () =>{
    that = this
    const valueToken= await AsyncStorage.getItem('token')
         let config = {
          headers: {
            'Authorization': 'jwt ' + valueToken
          }
        }
    axios.get(`http://${configs.ipaddress}:3000/feeds`,config)
    .then(function (response) {
      console.log(response.data.data)
      that.setState({
        post:response.data.data
      })
    })
    
    .catch(function (error) {
      console.log(error);
    });
  }
  
  async componentWillMount(){
    that = this
    const valueToken= await AsyncStorage.getItem('token')
    this.setState({
      token:valueToken
    })
    if(valueToken == null ){
      await Navigation.push(this.props.componentId,{
         component:{
           name:"Login"
         }
       });
      }else{
        BackHandler.removeEventListener('hardwareBackPress');
     }
     let config = {
      headers: {
        'Authorization': 'jwt ' + valueToken
      }
    }
    axios.get(`http://${configs.ipaddress}:3000/feeds`,config)
    .then(function (response) {
      console.log(response.data.data)
      that.setState({
        post:response.data.data
      })
    })
    
    .catch(function (error) {
      console.log(error);
    });
   }
   cekRefresh(){
     
   }
   componentDidAppear() {
     this.onRefresh()
     this.setState({isRefreshing: true});
    }
    componentDidDisappear() {
      this.setState({isRefreshing: false});
  }


  onRefresh() {
    // Simulate fetching data from the server
    this.componentWillMount()
  }

  render() {
    return (
      <View style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#30477c' translucent = {true} />

        {/* Search */}
           <Header />
          {/* Tab */}
            <Tab componentId={this.props.componentId}  />
              <ScrollView isRefreshing= {this.state.isRefreshing}
                onRefresh= {this.onRefresh.bind(this)}
                showsVerticalScrollIndicator={false} >
              <PTRView>
                  {/* Story */}
              <Story data={this.state.story}  />
                <View style={{backgroundColor:'#dddde3',width:'100%'}} >
                  {/* update status */}
                <CreateStatusButton componentId={this.props.componentId} />   
                  {/* Post */}
                    <Status data={this.state.post}/>     
                  </View>
                </PTRView>
              </ScrollView>
        </View>
     
    );
  }
}
