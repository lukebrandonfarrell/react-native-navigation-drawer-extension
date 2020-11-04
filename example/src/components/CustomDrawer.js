import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import DrawerButton from './DrawerButton';

const Buttons = [
  {
    id: 1,
    name: 'Home Page',
    component: 'HomePage',
  },
  {
    id: 2,
    name: 'Page 1',
    component: 'Page1',
  },
  {
    id: 3,
    name: 'Page 2',
    component: 'Page2',
  },
  {
    id: 4,
    name: 'Another Page',
    component: 'AnotherPage',
  },
];

const CustomDrawer = ({parentComponentId}) => {
  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text style={styles.bodyText}>Custom Drawer</Text>

        {Buttons.map((button) => {
          return (
            <DrawerButton
              key={button.id}
              component={button.component}
              name={button.name}
              parentComponentId={parentComponentId}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
  },

  bodyText: {
    fontSize: 20,
    margin: 20,
    textAlign: 'center',
  },
});

export default CustomDrawer;
