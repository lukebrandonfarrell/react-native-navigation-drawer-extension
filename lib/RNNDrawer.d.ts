/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */
import * as React from 'react';
import { Layout } from 'react-native-navigation';
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
}
export declare enum DirectionType {
    left = "left",
    right = "right",
    bottom = "bottom",
    top = "top"
}
declare class RNNDrawer {
    /**
     * Generates the drawer component to
     * be used with react-native-navigation
     *
     * @param component
     */
    static create(Component: React.ComponentType): any;
    /**
     * Shows a drawer component
     *
     * @param layout
     */
    static showDrawer(layout: Layout<RNNDrawerOptions>): void;
    /**
     * Dismiss the drawer component
     */
    static dismissDrawer(): void;
}
export default RNNDrawer;
