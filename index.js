import { Navigation } from "react-native-navigation";
import { state } from 'react-beep';

/**
 * Shows a drawer component
 *
 * @param options
 */
Navigation.showDrawer = options => {
  Navigation.showOverlay(options);

  state.open = true;
};

/**
 * Dismiss the drawer component
 *
 * @param componentId
 */
Navigation.dismissDrawer = componentId => {
  Navigation.dismissOverlay(componentId);

  state.open = false;
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
export SideMenuView from "./SideMenuView";