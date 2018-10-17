// This file contains function utile of core logic, not to a specific place,
// to create new objects, arrays, and actions in the core of the JavaScript
// language, like cloning an object, creating updated array from two existing
// arrays, and other actions. Only core functions need to be places here.

// This function gets the current entombment of the application.
export const getEnvironment = () => {

    // Return default value if value does not exist.
    return process.env.NODE_ENV || 'development';
};

// This function detect if the browser that the user currently user is Google Chrome or not.
export const isChromeBrowser = () => {

    // Will hold the final result.
    let result = false;

    // Please note,
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // but needs to check if window.opr is not undefined
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    let isChromium = window.chrome;
    let winNav = window.navigator;
    let vendorName = winNav.vendor;
    let isOpera = typeof window.opr !== 'undefined';
    let isIEOrEdge = winNav.userAgent.indexOf('Edge') > -1;
    let isIOSChrome = winNav.userAgent.match('CriOS');

    // Check if on IOS.
    if (isIOSChrome) {

        // Is Google Chrome on IOS.

    } else if (

        // Check if Chrome on other platforms.
        isChromium !== null &&
        typeof isChromium !== 'undefined' &&
        vendorName === 'Google Inc.' &&
        isOpera === false &&
        isIEOrEdge === false
    ) {

        // Is Google Chrome.
        result = true;
    }

    // Return the result.
    return result;
};

// This function return on development mode the enhancer to enable redux dev tools.
// Please note that we do use the redux dev tool only in Chrome browser.
export const getEnhancers = (compose) => {

    // Return calculated result. Check if the environment is development
    // and the current browser is Google Chrome. Only then active the dev tools.
    return getEnvironment() === 'development' && isChromeBrowser() ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
};

// This function perform deep clone on object (Without methods prototypes).
export const updateObject = (updateObjectData) => {

    // Validate existence of the updateObjectData parameters. If not exists, return null instance.
    if (!updateObjectData || !updateObjectData.oldObject || !updateObjectData.updatedProperties) {

        // Return null instance.
        return null;
    }

    // Return new calculated object.
    return {
        ...updateObjectData.oldObject,
        ...updateObjectData.updatedProperties
    };
};

// This function perform deep clone on object (With methods prototypes).
const cloneObject = (cloneObjectData) => {

    // Check existence of the cloneObjectData parameters. If not exists, return null.
    if (!cloneObjectData || !cloneObjectData.originalObject || !cloneObjectData.newObject) {

        // Return null instance.
        return null;
    }

    // Return deep cloned object.
    return Object.assign(Object.create(Object.getPrototypeOf(cloneObjectData.originalObject)), cloneObjectData.newObject);
};

// This function perform deep clone on object with an update operation of new properties (With methods prototypes).
export const cloneAndUpdateObject = (cloneAndUpdateObjectData) => {

    // Validate existence of the cloneAndUpdateObjectData parameters. If not exists, return null instance.
    if (!cloneAndUpdateObjectData || !cloneAndUpdateObjectData.oldObject || !cloneAndUpdateObjectData.updatedProperties) {

        // Return null instance.
        return null;
    }

    // Return calculated original object that updated with new properties.
    return cloneObject({
        originalObject: cloneAndUpdateObjectData.oldObject,
        newObject: { ...cloneAndUpdateObjectData.oldObject, ...cloneAndUpdateObjectData.updatedProperties }
    });
};

// This function make a deep clone copy of an array of objects.
export const copyObjectsArray = (array) => {

    // Validate existence of the array parameter. If not exists, return null instance.
    if (!array || array.length <= 0) {

        // Return null instance.
        return null;
    }

    // Return new object array.
    return array.map(object => cloneObject({
        originalObject: object,
        newObject: object
    }));
};

// This function takes map of elements and convert them to freeze objects (Enum-like object).
export const createEnum = (mapItems) => {

    // Check existence of the mapItems parameter. If not exists, return null instance.
    if (!mapItems || mapItems.length <= 0) {

        // Return null instance.
        return null;
    }

    // This new object will hold the freeze array object.
    const symbolMap = {};

    // Assign each object.
    mapItems.forEach((value, key) => {
        symbolMap[key] = value;
    });

    // Freeze the object and return it.
    return Object.freeze(symbolMap);
};

// This function return the current function name that executing at the moment of calling.
// It is used to get the error message with details about the function that the error happens on.
export const getFunctionName = () => {

    // Raise new Error just to get the stack of the caller function.
    const stack = new Error().stack;

    // Check that the stack is exists. If not, don't continue.
    if (!stack) {

        // Stop any further actions.
        return '';
    }

    // Get the caller name trimmed, it would generate something like
    // this: "at searchModalToggleStartSaga$ (http://localhost:3000/static/js/bundle.js:78588:106)".
    let caller = stack.split('\n')[2].trim();

    // We want to get rid of what in the round brackets. We will
    // left with: "at searchModalToggleStartSaga$".
    caller = caller.replace(/ *\([^)]*\) */g, '');

    // Now we want to remove the '$' sign. We will be left with: "at searchModalToggleStartSaga".
    caller = caller.replace(/[^\w\s]/gi, '');

    // Finally, we will remove the "at " key. The result will be only the caller function name ("searchModalToggleStartSaga").
    caller = caller.replace('at ', '');

    // Return the calculated result.
    return caller;
};