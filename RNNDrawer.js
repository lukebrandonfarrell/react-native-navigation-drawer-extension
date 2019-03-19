/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */

/* NPM - Node Package Manage */
import React from "react";
import {
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { Navigation } from "react-native-navigation";

const RNNDrawer = Component => {
  class WrappedDrawer extends React.Component {
    /**
     * [ Built-in React method. ]
     *
     * Setup the component. Executes when the component is created
     *
     * @param {object} props
     */
    constructor(props) {
      super(props);

      this.screenWidth = Dimensions.get("window").width;
      this.screenHeight = Dimensions.get("window").height;
      this.drawerWidth = this.screenWidth * props.drawerScreenWidth;
      this.drawerHeight = this.screenHeight * props.drawerScreenHeight;

      const initialValues = {
        left: -this.drawerWidth,
        right: this.screenWidth,
        top: -this.drawerHeight,
        bottom: this.screenHeight
      };

      /** Component State */
      this.state = {
        sideMenuOpenValue: new Animated.Value(initialValues[props.direction]),
        sideMenuOverlayOpacity: new Animated.Value(0)
      };

      /** Component Bindings */
      this.touchedOutside = this.touchedOutside.bind(this);
      this.dismissDrawerWithAnimation = this.dismissDrawerWithAnimation.bind(
        this
      );
      Navigation.events().bindComponent(this);
    }

    /**
     * [ Built-in React method. ]
     *
     * Executed when the components props are updated.
     */
    componentDidUpdate(prevProps) {
      /** Props */
      const { dismiss } = this.props;
      const { dismiss: prevDismiss } = prevProps;

      if (dismiss !== prevDismiss) {
        this.dismissDrawerWithAnimation();
      }
    }

    /**
     * [ react-native-navigation method. ]
     *
     * Executed when the component is navigated to view.
     */
    componentDidAppear() {
      const { direction, fadeOpacity } = this.props;
      const openValues = {
        left: 0,
        right: this.screenWidth - this.drawerWidth,
        top: 0,
        bottom: this.screenHeight - this.drawerHeight
      };

      // Animate side menu open
      Animated.timing(this.state.sideMenuOpenValue, {
        toValue: openValues[direction],
        duration: this.props.animationOpenTime
      }).start();

      // Animate outside side menu opacity
      Animated.timing(this.state.sideMenuOverlayOpacity, {
        toValue: fadeOpacity,
        duration: this.props.animationOpenTime
      }).start();
    }

    /**
     * [ Built-in React method. ]
     *
     * Allows us to render JSX to the screen
     */
    render() {
      /** Styles */
      const { sideMenuOverlayStyle, sideMenuContainerStyle } = styles;
      /** Props */
      const { direction, style } = this.props;
      /** State */
      const { sideMenuOpenValue, sideMenuOverlayOpacity } = this.state;
      /** Variables */
      const animatedValue =
        direction === "left" || direction === "right"
          ? { marginLeft: sideMenuOpenValue }
          : { marginTop: sideMenuOpenValue };

      return (
        <View style={sideMenuContainerStyle}>
          <TouchableWithoutFeedback onPress={this.touchedOutside}>
            <Animated.View
              style={[
                sideMenuOverlayStyle,
                { opacity: sideMenuOverlayOpacity }
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              { backgroundColor: "#FFF" },
              style,
              {
                height: this.drawerHeight,
                width: this.drawerWidth,
                ...animatedValue
              }
            ]}
          >
            <Component {...this.props} dismissDrawerWithAnimation={this.dismissDrawerWithAnimation} />
          </Animated.View>
        </View>
      );
    }

    /**
     * Touched outside drawer
     */
    touchedOutside() {
      const { dismissWhenTouchOutside } = this.props;

      if (dismissWhenTouchOutside) {
        this.dismissDrawerWithAnimation();
      }
    }

    /**
     * Dismisses drawer with animation
     */
    dismissDrawerWithAnimation() {
      const { direction } = this.props;
      const closeValues = {
        left: -this.drawerWidth,
        right: this.screenWidth,
        top: -this.drawerHeight,
        bottom: this.screenHeight
      };

      // Animate side menu close
      Animated.timing(this.state.sideMenuOpenValue, {
        toValue: closeValues[direction],
        duration: this.props.animationCloseTime
      }).start(() => {
        Navigation.dismissOverlay(this.props.componentId);
      });

      // Animate outside side menu opacity
      Animated.timing(this.state.sideMenuOverlayOpacity, {
        toValue: 0,
        duration: this.props.animationCloseTime
      }).start();
    }
  }

  WrappedDrawer.defaultProps = {
    animationOpenTime: 300,
    animationCloseTime: 300,
    direction: "left",
    dismissWhenTouchOutside: true,
    fadeOpacity: 0.6,
    drawerScreenWidth: 0.8,
    drawerScreenHeight: 1
  };

  WrappedDrawer.propTypes = {
    /** react-native-navigation */
    componentId: PropTypes.string.isRequired,
    /** Props */
    animationOpenTime: PropTypes.number.isRequired,
    animationCloseTime: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(["left", "right", "bottom", "top"]),
    dismissWhenTouchOutside: PropTypes.bool,
    fadeOpacity: PropTypes.number,
    drawerScreenWidth: PropTypes.number,
    drawerScreenHeight: PropTypes.number,
    style: PropTypes.any
  };

  return WrappedDrawer;
};

export default RNNDrawer;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create({
  sideMenuContainerStyle: {
    flex: 1,
    flexDirection: "row"
  },
  sideMenuOverlayStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#000"
  }
});
