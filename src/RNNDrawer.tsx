/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */

/* NPM - Node Package Manage */
import * as React from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  PanResponderInstance,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import { Navigation, Layout } from 'react-native-navigation';
/* Utils - Project Utilities */
import { listen, dispatch } from './events';

const MaxWidthOnLandscapeMode = 300;

declare interface RNNDrawerOptions {
  /**
   * Id of parent component of the drawer.
   * This field is necessary in order to be able
   * to push screens inside the drawer
   */
  parentComponentId: string;

  /**
   * Direction to open the collage,
   * one of: ["left", "right", "top", "bottom"]
   * If not provided, drawer  might have
   * a weird effect when closing
   */
  direction: DirectionType;

  /**
   * Time in milliseconds to execute the drawer opening animation
   */
  animationOpenTime?: number;

  /**
   * Time in milliseconds to execute the drawer closing animation
   */
  animationCloseTime?: number;

  /**
   * Whether the drawer be dismissed when a click is registered outside
   */
  dismissWhenTouchOutside?: boolean;

  /**
   * Opacity of the screen outside the drawer
   */
  fadeOpacity?: number;

  /**
   * Width of drawer in relation to the screen (0 to 1)
   */
  drawerScreenWidth?: number;

  /**
   * Height of drawer in relation to the screen (0 to 1)
   */
  drawerScreenHeight?: number;

  disableDragging?: boolean;

  disableSwiping?: boolean;
}

export enum DirectionType {
  left = 'left',
  right = 'right',
  bottom = 'bottom',
  top = 'top',
}

interface Point {
    moveX: number;
    moveY: number;
}

interface IState {
  sideMenuOpenValue: Animated.Value;
  sideMenuOverlayOpacity: Animated.Value;
  sideMenuSwipingStarted: boolean;
  sideMenuIsDismissing: boolean;
  screenHeight: number;
}

interface IProps {
  /** react-native-navigation */
  componentId: string;
  /** Props */
  animationOpenTime: number;
  animationCloseTime: number;
  direction: DirectionType;
  dismissWhenTouchOutside: boolean;
  fadeOpacity: number;
  drawerScreenWidth: number | string;
  drawerScreenHeight: number | string;
  animateDrawerExpanding?: boolean;
  disableDragging?: boolean;
  disableSwiping?: boolean;
  style: any;
}

interface HOCProps {
  Component: React.ComponentType;
}

interface StylesInterface {
  sideMenuContainerStyle: ViewStyle;
  sideMenuOverlayStyle: ImageStyle;
}

interface DrawerDirectionValuesInterface {
  [key: string]: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface DrawerReverseDirectionInterface {
  [key: string]: string;
  left: string;
  right: string;
}

interface SwipeMoveInterface {
  value: Point;
  direction: string;
}

class RNNDrawer {
  /**
   * Generates the drawer component to
   * be used with react-native-navigation
   *
   * @param component
   */
  static create(Component: React.ComponentType): any {
    class WrappedDrawer extends React.Component<IProps, IState> {
      private readonly screenWidth: number;
      private readonly screenHeight: number;
      private readonly drawerWidth: number;
      private readonly drawerHeight: number;
      private readonly drawerOpenedValues: DrawerDirectionValuesInterface;
      private readonly initialValues: DrawerDirectionValuesInterface;
      private panResponder: PanResponderInstance;
      private animatedDrawer!: Animated.CompositeAnimation;
      private animatedOpacity!: Animated.CompositeAnimation;
      private unsubscribeSwipeStart!: () => void;
      private unsubscribeSwipeMove!: () => void;
      private unsubscribeSwipeEnd!: () => void;
      private unsubscribeDismissDrawer!: () => void;
      private panningStartedPoint: Point = { moveX: 0 , moveY: 0 };
      private startedFromSideMenu: boolean = false;

      static defaultProps = {
        animationOpenTime: 300,
        animationCloseTime: 300,
        direction: 'left',
        dismissWhenTouchOutside: true,
        fadeOpacity: 0.6,
        drawerScreenWidth: '80%',
        drawerScreenHeight: '100%',
        animateDrawerExpanding: true,
        disableDragging: false,
        disableSwiping: false
      };

      /**
       * [ Built-in React method. ]
       *
       * Setup the component. Executes when the component is created
       *
       * @param {object} props
       */
      constructor(props: IProps) {
        super(props);

        this.screenWidth = Dimensions.get('window').width;
        this.screenHeight = Dimensions.get('window').height;

        this.panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => false,
          onStartShouldSetPanResponderCapture: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => false,
          onMoveShouldSetPanResponder: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => {
            const { dx, dy } = _gestureState;

            if (this.props.direction === DirectionType.left || this.props.direction === DirectionType.right)
              return Math.abs(dx) > 5;
            else
              return Math.abs(dy) > 5;
          },
          onMoveShouldSetPanResponderCapture: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => false,
          onPanResponderGrant: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => {
            const { moveX, moveY } = _gestureState;

            dispatch('SWIPE_START', {moveX, moveY});
          },
          onPanResponderRelease: (
            _evt: GestureResponderEvent,
            gestureState: PanResponderGestureState,
          ) => {
            const { vx } = gestureState;

            // Emit this event when the gesture ends
            dispatch('SWIPE_END', vx > 0 ? 'right' : 'left');
          },
          onPanResponderTerminationRequest: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => false,
          onShouldBlockNativeResponder: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => false,
          onPanResponderMove: (
            _evt: GestureResponderEvent,
            _gestureState: PanResponderGestureState,
          ) => {
            const { moveX, moveY } = _gestureState;
            const direction = this.props.direction || 'left';

            dispatch('SWIPE_MOVE', { value: { moveX, moveY }, direction });
          },
        });

        /*
         * We need to convert the pushed drawer width
         * to a number as it can either be a string ('20%')
         * or number (400).
         */
        const _resolveDrawerSize = (
          value: number | string,
          max: number,
        ): number => {
          /*
           * If the type is a string '%' then it should be a percentage relative
           * to our max size.
           */
          if (typeof value === 'string') {
            const valueAsNumber = parseFloat(value as string) || 100;
            const size = max * (valueAsNumber / 100);

            return size;
          }

          return value;
        };

        /** Component Variables */
        this.drawerWidth = this.isLandscape()
          ? MaxWidthOnLandscapeMode
          : _resolveDrawerSize(props.drawerScreenWidth, this.screenWidth);
        this.drawerHeight = _resolveDrawerSize(
          props.drawerScreenHeight,
          this.screenHeight,
        );

        this.drawerOpenedValues = {
          left: 0,
          right: this.screenWidth - this.drawerWidth,
          top: this.drawerHeight - this.screenHeight,
          bottom: this.screenHeight - this.drawerHeight,
        };

        this.initialValues = {
          left: -this.drawerWidth,
          right: this.screenWidth,
          top: -this.screenHeight,
          bottom: this.screenHeight,
        };

        /** Component State */
        this.state = {
          sideMenuOpenValue: new Animated.Value(this.initialValues[props.direction]),
          sideMenuOverlayOpacity: new Animated.Value(0),
          sideMenuSwipingStarted: false,
          sideMenuIsDismissing: false,
          screenHeight: this.screenHeight,
        };

        /** Component Bindings */
        this.touchedOutside = this.touchedOutside.bind(this);
        this.dismissDrawerWithAnimation = this.dismissDrawerWithAnimation.bind(
          this,
        );
        this.registerListeners = this.registerListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.isLandscape = this.isLandscape.bind(this);
        Navigation.events().bindComponent(this);
      }

      /**
       * Check if device is in landscape mode
       */
      isLandscape() {
        const dim = Dimensions.get('window');

        return dim.height <= dim.width;
      }

      /**
       * [ Built-in React method. ]
       *
       * Executed when the component is mounted to the screen
       */
      componentDidMount() {
        /** Props */
        const { direction, fadeOpacity, animateDrawerExpanding } = this.props;

        if (typeof animateDrawerExpanding !== 'undefined' && !animateDrawerExpanding)
            this.startedFromSideMenu = true;

        // Animate side menu open
        this.animatedDrawer = Animated.timing(this.state.sideMenuOpenValue, {
          toValue: this.drawerOpenedValues[direction],
          duration: this.props.animationOpenTime,
          useNativeDriver: true,
        });

        // Animate outside side menu opacity
        this.animatedOpacity = Animated.timing(
          this.state.sideMenuOverlayOpacity,
          {
            toValue: fadeOpacity,
            duration: this.props.animationOpenTime,
            useNativeDriver: true,
          },
        );
      }

      /**
       * [ react-native-navigation method. ]
       *
       * Executed when the component is navigated to view.
       */
      componentDidAppear() {
        this.registerListeners();

        // If there has been no Swiping, and this component appears, then just start the open animations
        if (!this.state.sideMenuSwipingStarted && this.props.animateDrawerExpanding) {
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

        dispatch('DRAWER_CLOSED');
      }

      onOrientationChange = ({window}: any) => {
        const screenHeight = window.height;

        this.setState({ screenHeight });

        // Apply correct position if opened from right
        if (this.props.direction === 'right') {
          // Calculates the position of the drawer from the left side of the screen
          const alignedMovementValue = window.width - this.drawerWidth;

          this.state.sideMenuOpenValue.setValue(alignedMovementValue);
        }
      }

      /**
       * Registers all the listenrs for this component
       */
      registerListeners() {
        /** Props */
        const { direction, fadeOpacity } = this.props;

        // Adapt the drawer's size on orientation change
        Dimensions.addEventListener('change', this.onOrientationChange);

        // Executes when the side of the screen interaction starts
        this.unsubscribeSwipeStart = listen('SWIPE_START', (value: Point) => {
          this.panningStartedPoint.moveX = value.moveX;
          this.panningStartedPoint.moveY = value.moveY;

          this.setState({
            sideMenuSwipingStarted: true,
          });
        });

        // Executes when the side of the screen is interacted with
        this.unsubscribeSwipeMove = listen(
          'SWIPE_MOVE',
          ({ value, direction: swipeDirection }: SwipeMoveInterface) => {
            // Cover special case when we are swiping from the edge of the screen
            if (this.startedFromSideMenu) {
              if (direction === "left" && value.moveX < this.drawerWidth) {
                this.state.sideMenuOpenValue.setValue(value.moveX - this.drawerWidth);
                const normalizedOpacity = Math.min(
                    (value.moveX / this.drawerWidth) * fadeOpacity,
                    fadeOpacity,
                );
                this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
              }
              if (direction === "right" && (this.screenWidth - value.moveX) < this.drawerWidth) {
                this.state.sideMenuOpenValue.setValue(value.moveX);
                const normalizedOpacity = Math.min(
                    ((this.screenWidth - value.moveX) / this.drawerWidth) * fadeOpacity,
                    fadeOpacity,
                );
                this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
              }

              return;
            }

            if (this.props.disableDragging)
              return;
            // Calculates the translateX / translateY value
            let alignedMovementValue = 0;
            // To swap the direction if needed
            let directionModifier = 1;
            // Whether we use the height of the drawer or the width
            let drawerDimension = this.drawerWidth;

            if (swipeDirection === 'left') {
              alignedMovementValue = value.moveX - this.panningStartedPoint.moveX;
            } else if (swipeDirection === 'right') {
              alignedMovementValue = this.panningStartedPoint.moveX - value.moveX;
              directionModifier = -1;
            } else if (swipeDirection === 'bottom') {
              alignedMovementValue = this.panningStartedPoint.moveY - value.moveY;
              directionModifier = -1;
              drawerDimension = this.drawerHeight;
            } else if (swipeDirection === 'top') {
              alignedMovementValue = value.moveY - this.panningStartedPoint.moveY;
              drawerDimension = this.drawerHeight;
            }

            // Calculates the percentage 0 - 1 of which the drawer is open
            const openedPercentage = Math.abs(drawerDimension + alignedMovementValue) / drawerDimension;
            // Calculates the opacity to set of the screen based on the percentage the drawer is open
            const normalizedOpacity = Math.min(
                openedPercentage * fadeOpacity,
                fadeOpacity,
            );

            // Does not allow the drawer to go further than the maximum width / height
            if (0 > alignedMovementValue) {
              // Sets the animation values, we use this so we can resume animation from any point
              this.state.sideMenuOpenValue.setValue(this.drawerOpenedValues[direction] + alignedMovementValue * directionModifier);
              this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
            }
          },
        );

        // Executes when the side of the screen interaction ends
        this.unsubscribeSwipeEnd = listen(
          'SWIPE_END',
          (swipeDirection: string) => {
            if (this.props.disableSwiping && !this.startedFromSideMenu)
              return;

            const reverseDirection: DrawerReverseDirectionInterface = {
              right: 'left',
              left: 'right',
              top: 'bottom',
              bottom: 'top'
            };
            // In case the drawer started by dragging the edge of the screen reset the flag
            this.startedFromSideMenu = false;

            if (swipeDirection === reverseDirection[direction]) {
              this.animatedDrawer.start();
              this.animatedOpacity.start();
            } else {
              if (!this.state.sideMenuIsDismissing) {
                this.setState(
                  {
                    sideMenuIsDismissing: true,
                  },
                  () => {
                    this.dismissDrawerWithAnimation();
                  },
                );
              }
            }
          },
        );

        // Executes when the drawer needs to be dismissed
        this.unsubscribeDismissDrawer = listen('DISMISS_DRAWER', () => {
          if (!this.state.sideMenuIsDismissing) {
            this.dismissDrawerWithAnimation();
          }
        });
      }

      /**
       * Removes all the listenrs from this component
       */
      removeListeners() {
        Dimensions.removeEventListener('change', this.onOrientationChange);
        if (this.unsubscribeSwipeStart) this.unsubscribeSwipeStart();
        if (this.unsubscribeSwipeMove) this.unsubscribeSwipeMove();
        if (this.unsubscribeSwipeEnd) this.unsubscribeSwipeEnd();
        if (this.unsubscribeDismissDrawer) this.unsubscribeDismissDrawer();
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
          direction === DirectionType.left || direction === DirectionType.right
            ? { translateX: sideMenuOpenValue }
            : { translateY: sideMenuOpenValue };

        return (
          <View
            style={sideMenuContainerStyle}
            {...this.panResponder.panHandlers}
          >
            <TouchableWithoutFeedback onPress={this.touchedOutside}>
              <Animated.View
                style={[
                  sideMenuOverlayStyle,
                  { opacity: sideMenuOverlayOpacity },
                ]}
              />
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                { backgroundColor: '#FFF' },
                style,
                {
                  height: this.state.screenHeight,
                  width: this.drawerWidth,
                  transform:[
                    animatedValue
                  ]
                },
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
        const closeValues: DrawerDirectionValuesInterface = {
          left: -this.drawerWidth,
          right: this.screenWidth,
          top: -this.screenHeight,
          bottom: this.screenHeight,
        };

        // Animate side menu close
        Animated.timing(this.state.sideMenuOpenValue, {
          toValue: closeValues[direction],
          duration: this.props.animationCloseTime,
          useNativeDriver: true,
        }).start(() => {
          Navigation.dismissOverlay(this.props.componentId);
          this.setState({ sideMenuIsDismissing: false });
        });

        // Animate outside side menu opacity
        Animated.timing(this.state.sideMenuOverlayOpacity, {
          toValue: 0,
          duration: this.props.animationCloseTime,
          useNativeDriver: true,
        }).start();
      }
    }

    return WrappedDrawer;
  }

  /**
   * Shows a drawer component
   *
   * @param layout
   */
  static showDrawer(layout: Layout<RNNDrawerOptions>) {
    // By default for this library, we make the 'componentBackgroundColor' transparent
    const componentBackgroundColor =
      layout?.component?.options?.layout?.componentBackgroundColor ??
      'transparent';
    const options = {
      ...layout?.component?.options,
      layout: {
        componentBackgroundColor: componentBackgroundColor,
      },
    };

    // Mutate options to add 'transparent' by default
    // @ts-ignore
    layout.component.options = { ...options };

    Navigation.showOverlay(layout);
  }

  /**
   * Dismiss the drawer component
   */
  static dismissDrawer() {
    dispatch('DISMISS_DRAWER', true);
  }
}

export default RNNDrawer;

/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
const styles = StyleSheet.create<StylesInterface>({
  sideMenuContainerStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuOverlayStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});

