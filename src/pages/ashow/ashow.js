import React, { Component } from 'react';
import { TextInput } from 'react-native';

import { StatusBar,
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    Alert,
    ScrollView,
 } from 'react-native';

import api from '../../services/api';

import {
    Container,
    NewButtonContainer,
    ButtonText,
    Label,
    Input,
} from './styles';

export default class Main extends Component {

    /*static navigationOptions = {
        title: "AShow Moura",
        headerStyle: {
            backgroundColor: "#008000",
            shadowOpacity: 0.25,
            shadowOffset: {
            height: 1,
            },
            shadowRadius: 5,
        },
        headerTintColor: "#FFF",
        headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
        },
    };*/

    state = {
        ashows: [],
        modalVisible: false,
        ashowSelected: {},
        campusSelected: [],
        placeSelected: {},
        groupSelected: {},
        objectsSelected: {},
        occurrenceSelected: {},
        description_resolution: ''
    };

    componentDidMount() {
        this.loadAShows();
    }

      buttonFinishedClicked = (ashow) => {
        Alert.alert(
          "Finalizar Demanda",
          "Deseja Finalizar essa demanda?",
          [
            {
              text: "Cancelar",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Sim", onPress: () => this.finishAShow(ashow) }
          ],
          { cancelable: false }
        );
      };

    loadAShows = async () => {
        try {
            const response = await api.get('/occurrences/viewOngoingDemands');

            console.log(response);

            this.setState({ ashows: response.data });
        } catch (_err) {
            console.log(_err);
            this.setState({ ashows: [] });
            //alert('Houve um problema ao carregar as AShows!');
        }
    }

    setModalVisible(visible, ashow) {
        this.setState({modalVisible: visible});
        
        if(ashow){
            var obj = ashow.occurrences.objects;
            this.setState({
                ashowSelected: ashow,
                occurrenceSelected: ashow.occurrences,
                campusSelected:  ashow.occurrences.campus,
                objectsSelected:  ashow.occurrences.objects,
                placeSelected: obj.places,
                groupSelected: ashow.occurrences.group_occurrences,
            });
            ;
            console.log('ASHOW', this.state.ashowSelected);
        }
    }

    

    finishAShow= async (ashow) => {
        try {
            if(this.state.description_resolution.length == 0){
                alert('A descrição é obrigatória!');
                return ;
            } else if(this.state.description_resolution.length < 10) {
                alert('A descrição deve ter no minímo 10 caracteres!');
                return ;
            }
            const response = await api.put(`/occurrences/forwardclose/${ashow.id}`, 
            { description_resolution: this.state.description_resolution})
            .catch(
                () => alert('Houve um problema ao finalizar a AShow!')
            );

            console.log(response);

            if(response.data.id){
                this.setModalVisible(!this.state.modalVisible);
                this.loadAShows();

            }

        } catch (_err) {
            alert('Houve um problema ao finalizar a AShow!');
        }

    }

    handleDecriptionResolutionChange = (description_resolution) => {
        this.setState({ description_resolution });
    };

    renderItem = ({ item }) => (
    <ScrollView>
        <View style={styles.ashowContainer}>
            <View style={styles.containerSituation}>
                {item.situation === 0 ?
                    <Text style={styles.ashowSituationClose}>Não Iniciada</Text> : <Text></Text>}
                {item.situation === 1 ?
                    <Text style={styles.ashowSituationOpen}>Iniciada</Text> : <Text></Text>}
                {item.situation === 2 ?
                    <Text style={styles.ashowSituationFiled}>Finalizada</Text> : <Text></Text>}
            </View>

            <Text style={styles.ashowTitle}>{item.occurrences.group_occurrences.name}</Text>
            <Text style={styles.ashowDescription}>{item.occurrences.objects.places.name} - {item.occurrences.objects.name}</Text>
            <Text style={styles.ashowDescription}>Campus: {item.occurrences.campus.name}</Text>
            <Text style={styles.ashowDescription}>Criada por: {item.occurrences.user.name}</Text>
            <Text style={styles.ashowDescriptionSmall}>Criado em: {item.created_at}</Text>
            <View style={styles.ashowContainerButton}>

                <TouchableOpacity
                    style={styles.ashowButton}
                    onPress={() => {
                        this.setModalVisible(true, item);
                    }}>
                        <Text style={styles.ashowButtonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>
    

            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}>
                <View style={{marginTop: 60, marginHorizontal: 15}}>
                    <View>
                    <Text style={styles.ashowTitle}>Decrição:</Text>
                    <Text style={styles.ashowDescription}>{this.state.occurrenceSelected.description}</Text>

                    <Text style={styles.ashowTitle}>Criada em:</Text>
                    <Text style={styles.ashowDescription}>{this.state.occurrenceSelected.created_at}</Text>

                    <Text style={styles.ashowTitle}>Criada por:</Text>
                    <Text style={styles.ashowDescription}>{item.occurrences.user.name}</Text>

                    <Text style={styles.ashowTitle}>Campus:</Text>
                    <Text style={styles.ashowDescription}>{this.state.campusSelected.name}</Text>


                    <Text style={styles.ashowTitle}>Grupo da Ocorrência:</Text>
                    <Text style={styles.ashowDescription}>{this.state.groupSelected.name}</Text>

                    <Text style={styles.ashowTitle}>Local:</Text>
                    <Text style={styles.ashowDescription}>{this.state.placeSelected.name}</Text>

                    
                    <Text style={styles.ashowTitle}>Objeto:</Text>
                    <Text style={styles.ashowDescription}> {this.state.objectsSelected.name}</Text>

                    <Text style={styles.ashowTitle}>Descrição da Resolução: {this.state.occurrenceSelected.description_resolution}</Text>
                    
                    <Input
                        placeholder=""
                        value={this.state.description_resolution}
                        onChangeText={this.handleDecriptionResolutionChange}
                        autoCapitalize="none"
                        autoCorrect={false}/>
                    <View style={styles.viewButtonsModal}>

                        <TouchableHighlight
                            style={styles.buttonModal}
                            onPress={() => {
                                this.buttonFinishedClicked(this.state.ashowSelected);
                            }}>
                            <Text style={styles.ashowButtonText}>Finalizar</Text>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={styles.buttonModal}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={styles.ashowButtonText}>Fechar</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
                </View>
            </Modal>
        </View>
    </ScrollView>    
    );

    loadMore = () => {
        /*const {page, productInfo } = this.state;

        if (page === productInfo.pages ) return ;

        const pageNumber = page + 1;

        this.loadProducts(pageNumber);*/

    }

    handleNewAshow = () => {
        this.props.navigation.navigate('CreateAShow');
    };

    render() {
        return (
            <Container>
                <StatusBar barStyle="light-content" />

                <View style={styles.container}>
                    <FlatList
                        contentContainerStyle={styles.list}
                        data={this.state.ashows}
                        keyExtractor={(item, index) => item.id.toString() }
                        renderItem={this.renderItem}
                        onEndReached={this.loadMore}
                        onEndReachedThreshold={0.1}
                        />
                </View>


            </Container>
        );
    }
}
/*
<NewButtonContainer onPress={this.handleNewAshow}>
                    <ButtonText>+ AShow</ButtonText>
                </NewButtonContainer>*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa"
    },
    list: {
        padding: 20
    },
    ashowContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 5,
        padding: 20,
        marginBottom: 20
    },
    ashowContainerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    ashowTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
    },

    ashowDescription: {
        fontSize: 15,
        color: "#999",
        marginTop: 5,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    ashowDescriptionSmall: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
        lineHeight: 24
    },
    ashowButton: {
        height: 40,
        width: 120,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#DA552F",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    ashowButtonText: {
        fontSize: 16,
        color: "#DA552F",
        fontWeight: "bold"
    },
    containerSituation: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20,
        borderRadius:50

    },
    ashowSituationOpen: {
        fontSize: 9,
        alignSelf: 'flex-start',
        backgroundColor: '#228B22',
        color: '#FFF',
        padding: 3,
        fontWeight: "bold"
    },
    ashowSituationClose: {
        fontSize: 9,
        alignSelf: 'flex-start',
        backgroundColor: '#8B0000',
        color: '#FFF',
        padding: 3,
        fontWeight: "bold"
    },
    ashowSituationFiled: {
        fontSize: 9,
        alignSelf: 'flex-start',
        backgroundColor: '#4F4F4F',
        color: '#FFF',
        padding: 3,
        fontWeight: "bold"
    },
    buttonNewAShow: {
        alignSelf: 'flex-end',
        alignItems:'center',
        justifyContent:'center',
        width:80,
        height:80,
        backgroundColor:'#008000',
        borderRadius:50,
        position:'absolute',
        bottom: 10,
        right: 10,
    },
    textNewAShow: {
        color: '#FFF',
        fontSize: 45,
        fontWeight: "bold",
    },
    //MODAL
    viewButtonsModal: {
        flex: 1,
        flexDirection: 'column',

    },
    labelModal: {
       margin: 10,
       alignItems: 'flex-start',
       alignSelf: 'flex-start',
       justifyContent: 'flex-start',
       fontSize: 16,
       fontWeight: 'bold'
    },
    buttonModal: {
        height: 40,
        width: '100%',
        marginHorizontal: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#DA552F",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    }


});
