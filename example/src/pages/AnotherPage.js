import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SideMenuView } from 'react-native-navigation-drawer-extension';

const AnotherPage = (props) => {
  console.log(props);
  return (
    <SideMenuView
      style={styles.mainContainer}
      drawerName={'CustomDrawer'}
      direction={'right'}
      passProps={{
        parentComponentId: props.componentId,
      }}
    >
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
