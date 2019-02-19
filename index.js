import { Navigation } from "react-native-navigation";

/**
 * Shows a drawer component
 *
 * @param name
 */
Navigation.showDrawer = name => {
  Navigation.showOverlay(name);
};

/**
 * Dismiss the drawer component
 *
 * @param componentId
 */
Navigation.dismissDrawer = componentId => {
  Navigation.dismissOverlay(componentId);

  /*
   * To run animation with dismiss overlay, we are
   * waiting for a solution to this issue:
   *
   * https://github.com/wix/react-native-navigation/issues/3030
   */

  // Navigation.mergeOptions(componentId, {
  //   passProps: {
  //     dismiss: true
  //   }
  // });
};

export RNNDrawer from "./RNNDrawer";
