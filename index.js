import RNNDrawer from "./RNNDrawer";
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
};

export * from "react-native-navigation";
export { RNNDrawer, Navigation };
