/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */

/* NPM - Node Package Manage */
import React, { Component } from "react";
import {
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { Navigation } from "react-native-navigation";

const screenWidth = Dimensions.get("window").width;
const drawerWidth = screenWidth * 0.8;

class RNNDrawer extends Component {
  /**
   * [ Built-in React method. ]
   *
   * Setup the component. Executes when the component is created
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    /** Component State */
    this.state = {
      sideMenuOpenValue: new Animated.Value(-drawerWidth),
      sideMenuOverlayOpacity: new Animated.Value(0)
    };

    /** Component Bindings */
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
    const { selectedCategory } = this.props;

    if (selectedCategory !== prevProps.selectedCategory) {
      this.dismissDrawerWithAnimation();
    }
  }

  /**
   * [ react-native-navigation method. ]
   *
   * Executed when the component is navigated to view.
   */
  componentDidAppear() {
    // Animate side menu open
    Animated.timing(this.state.sideMenuOpenValue, {
      toValue: 0,
      duration: this.props.animationOpenTime
    }).start();

    // Animate outside side menu opacity
    Animated.timing(this.state.sideMenuOverlayOpacity, {
      toValue: 0.7,
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
    const {
      sideMenuStyle,
      sideMenuOverlayStyle,
      sideMenuContainerStyle
    } = styles;
    /** State */
    const { sideMenuOpenValue, sideMenuOverlayOpacity } = this.state;

    return (
      <View style={sideMenuContainerStyle}>
        <TouchableWithoutFeedback onPress={this.dismissDrawerWithAnimation}>
          <Animated.View
            style={[sideMenuOverlayStyle, { opacity: sideMenuOverlayOpacity }]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[sideMenuStyle, { marginLeft: sideMenuOpenValue }]}
        >
          <ScrollView contentInset={{ top: 30, bottom: 20 }}>
            {this.props.children}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  /**
   * Dismisses drawer with animation
   */
  dismissDrawerWithAnimation() {
    // Animate side menu close
    Animated.timing(this.state.sideMenuOpenValue, {
      toValue: -drawerWidth,
      duration: this.props.animationCloseTime
    }).start(() => {
      Navigation.dismissDrawer(this.props.componentId);
    });

    // Animate outside side menu opacity
    Animated.timing(this.state.sideMenuOverlayOpacity, {
      toValue: 0,
      duration: this.props.animationCloseTime
    }).start();
  }
}

RNNDrawer.defaultProps = {
  animationOpenTime: 300,
  animationCloseTime: 300
};

RNNDrawer.propTypes = {
  /** react-native-navigation */
  componentId: PropTypes.string.isRequired,
  /** Props */
  animationOpenTime: PropTypes.number.isRequired,
  animationCloseTime: PropTypes.number.isRequired
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
  },
  sideMenuStyle: {
    width: drawerWidth,
    height: "100%",
    paddingLeft: 25,
    backgroundColor: "#FFF"
  }
});
