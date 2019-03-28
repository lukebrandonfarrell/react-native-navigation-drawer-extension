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
import { on, emit } from 'jetemit';

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

      /** Props */
      const { direction } = props;

      /** Component Variables */
      this.screenWidth = Dimensions.get("window").width;
      this.screenHeight = Dimensions.get("window").height;
      this.drawerWidth = this.screenWidth * props.drawerScreenWidth;
      this.drawerHeight = this.screenHeight * props.drawerScreenHeight;

      this.drawerOpenedValues = {
        left: 0,
        right: this.screenWidth - this.drawerWidth,
        top: 0,
        bottom: this.screenHeight - this.drawerHeight
      };

      const initialValues = {
        left: -this.drawerWidth,
        right: this.screenWidth,
        top: -this.drawerHeight,
        bottom: this.screenHeight
      };

      /** Component State */
      this.state = {
        sideMenuOpenValue: new Animated.Value(initialValues[props.direction]),
        sideMenuOverlayOpacity: new Animated.Value(0),
        sideMenuSwippingStarted: false,
        sideMenuIsDismissing: false,
      };

      /** Component Bindings */
      this.touchedOutside = this.touchedOutside.bind(this);
      this.dismissDrawerWithAnimation = this.dismissDrawerWithAnimation.bind(
          this
      );
      this.registerListeners = this.registerListeners.bind(this);
      this.removeListeners = this.removeListeners.bind(this);
      Navigation.events().bindComponent(this);
    }


    /**
     * [ Built-in React method. ]
     *
     * Executed when the component is mounted to the screen
     */
    componentDidMount() {
      /** Props */
      const { direction, fadeOpacity } = this.props;

      // Animate side menu open
      this.animatedDrawer = Animated.timing(this.state.sideMenuOpenValue, {
        toValue: this.drawerOpenedValues[direction],
        duration: this.props.animationOpenTime
      });

      // Animate outside side menu opacity
      this.animatedOpacity = Animated.timing(this.state.sideMenuOverlayOpacity, {
        toValue: fadeOpacity,
        duration: this.props.animationOpenTime
      });
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
      this.registerListeners();

      // If there has been no swipping, and this componnet appears, then just start the open animations
      if(!this.state.sideMenuSwippingStarted){
        this.animatedDrawer.start();
        this.animatedOpacity.start();
      }
    }

    /**
     * [ react-native-navigation method. ]
     *
     * Executed when the component is navigated away from view.
     */
    componentDidDisappear() {
      this.removeListeners();

      emit('DRAWER_CLOSED');
    }

    /**
     * Registers all the listenrs for this component
     */
    registerListeners(){
      /** Props */
      const { direction, fadeOpacity } = this.props;

      // Executes when the side of the screen interaction starts
      this.unsubscribeSwipeStart = on('SWIPE_START', () => {
        this.setState({
          sideMenuSwippingStarted: true
        });
      });

      // Executes when the side of the screen is interacted with
      this.unsubscribeSwipeMove = on('SWIPE_MOVE', ({ value, direction: swipeDirection }) => {
        if(swipeDirection === "left"){
          // Calculates the position of the drawer from the left side of the screen
          const alignedMovementValue = value - this.drawerWidth;
          // Calculates the percetage 0 - 100 of which the drawer is open
          const openedPercentage = Math.abs(((Math.abs(alignedMovementValue) / this.drawerWidth) * 100) - 100);
          // Calculates the opacity to set of the screen based on the percentage the drawer is open
          const normalizedOpacity = Math.min(openedPercentage / 100, fadeOpacity);

          // Does allow the drawer to go further than the maximum width
          if(this.drawerOpenedValues[direction] > alignedMovementValue) {
            // Sets the animation values, we use this so we can resume animation from any point
            this.state.sideMenuOpenValue.setValue(alignedMovementValue);
            this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
          }
        } else if(swipeDirection === "right"){
          // Works out the distance from right of screen to the finger position
          const normalizedValue = this.screenWidth - value;
          // Calculates the position of the drawer from the left side of the screen
          const alignedMovementValue = this.screenWidth - normalizedValue;
          // Calculates the percetage 0 - 100 of which the drawer is open
          console.log({normalizedValue, alignedMovementValue});
          const openedPercentage = Math.abs(((Math.abs(normalizedValue) / this.drawerWidth) * 100));
          // Calculates the opacity to set of the screen based on the percentage the drawer is open
          const normalizedOpacity = Math.min(openedPercentage / 100, fadeOpacity);

          // Does allow the drawer to go further than the maximum width
          if(this.drawerOpenedValues[direction] < alignedMovementValue) {
            // Sets the animation values, we use this so we can resume animation from any point
            this.state.sideMenuOpenValue.setValue(alignedMovementValue);
            this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
          }
        }
      });

      // Executes when the side of the screen interaction ends
      this.unsubscribeSwipeEnd = on('SWIPE_END', (swipeDirection) => {
        const reverseDirection = {
          right: "left",
          left: "right"
        };

        if(swipeDirection === reverseDirection[direction]) {
          this.animatedDrawer.start();
          this.animatedOpacity.start();
        } else {
          if(!this.state.sideMenuIsDismissing) {
            this.setState({
              sideMenuIsDismissing: true
            }, () => {
              this.dismissDrawerWithAnimation();
            });
          }
        }
      });

      // Executes when the drawer needs to be dismissed
      this.unsubscribeDismissDrawer = on('DISMISS_DRAWER', () => {
        if(!this.state.sideMenuIsDismissing) {
          this.dismissDrawerWithAnimation();
        }
      });
    }

    /**
     * Removes all the listenrs from this component
     */
    removeListeners(){
      this.unsubscribeSwipeStart();
      this.unsubscribeSwipeMove();
      this.unsubscribeSwipeEnd();
      this.unsubscribeDismissDrawer();
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
              <Component {...this.props} />
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
      const { sideMenuIsDismissing } = this.state;
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
        this.setState({ sideMenuIsDismissing: false });
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
