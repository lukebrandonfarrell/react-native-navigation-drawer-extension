import { Navigation } from "react-native-navigation";

/**
 * Shows a drawer component
 *
 * @param options
 */
Navigation.showDrawer = options => {
  Navigation.showOverlay(options);
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
