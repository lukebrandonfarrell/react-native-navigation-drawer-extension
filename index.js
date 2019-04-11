import { Navigation } from "react-native-navigation";
import { emit } from "jetemit";

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
Navigation.dismissDrawer = () => {
  emit('DISMISS_DRAWER', true);
};

export { default as RNNDrawer } from "./RNNDrawer";
export { default as SideMenuView } from "./SideMenuView";