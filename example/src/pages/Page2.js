import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNNDrawer} from 'react-native-navigation-drawer-extension';

const Page2 = (props) => {
  const onPress = () => {
    RNNDrawer.showDrawer({
      component: {
        name: 'CustomDrawer',
        passProps: {
          direction: 'left',
          dismissWhenTouchOutside: true,
          fadeOpacity: 0.6,
          drawerScreenWidth: '75%' || 445,
          drawerScreenHeight: '100%' || 700,
          parentComponentId: props.componentId,
        },
      },
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text style={styles.headlineText}>Page2 View</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
          <Text style={styles.buttonText}>Open Drawer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  headlineText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },

  buttonContainer: {
    width: '90%',
    backgroundColor: '#44475a',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },

  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
});

export default Page2;
