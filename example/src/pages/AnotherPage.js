import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  RNNDrawer,
  SideMenuView,
} from 'react-native-navigation-drawer-extension';

const AnotherPage = (props) => {
  console.log(props);
  return (
    <SideMenuView
      style={styles.mainContainer}
      right={() =>
        RNNDrawer.showDrawer({
          component: {
            name: 'CustomDrawer',
            passProps: {
              direction: 'right',
              parentComponentId: props.componentId,
            },
          },
        })
      }>
      <Text style={styles.bodyText}>
        In this page, you can try the SideMenuView component, by simply swiping
        from the right to the left.
      </Text>
    </SideMenuView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },

  bodyText: {
    fontSize: 20,
  },
});

export default AnotherPage;
