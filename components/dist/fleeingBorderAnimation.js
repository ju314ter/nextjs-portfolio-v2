"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_use_measure_1 = require("react-use-measure");
var styled_components_1 = require("styled-components");
var react_spring_1 = require("react-spring");
var AnimationWrapper = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: relative;\n    overflow: hidden;\n    padding: 10px;\n"], ["\n    position: relative;\n    overflow: hidden;\n    padding: 10px;\n"])));
var BottomBorder = styled_components_1["default"](react_spring_1.animated.div)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: block;\n    content: '';\n    background: white;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    height: 2px;\n    width: 2px;\n    transform-origin: left;\n"], ["\n    display: block;\n    content: '';\n    background: white;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    height: 2px;\n    width: 2px;\n    transform-origin: left;\n"])));
var FleeingBorderAnimation = function (props) {
    var _a = react_use_measure_1["default"](), wrapperRef = _a[0], wrapperBounds = _a[1];
    var _intervalRefScale = react_1.useRef(null);
    var _b = react_1.useState(false), startCounter = _b[0], setStartCounter = _b[1];
    var _c = react_1.useState(0), counter = _c[0], setCounter = _c[1];
    var _d = react_1.useState(false), translation = _d[0], translate = _d[1];
    var bottomBorderAnimationStyle = react_spring_1.useSpring({
        transform: "scaleX(" + (counter / 4 + Math.pow(counter, 1.3)) + ")",
        onRest: function (e) {
            setTimeout(function () { setCounter(0); }, 500);
        }
    });
    var translateAnimationStyle = react_spring_1.useSpring({ transform: translation ? 'translateX(150%)' : 'translateX(0%)', onResolve: function () { translate(false); } });
    react_1.useEffect(function () {
        if (startCounter) {
            var innerCounter_1 = 0;
            _intervalRefScale.current = setInterval(function () {
                if (innerCounter_1 < 100)
                    requestAnimationFrame(function () { return setCounter(function (counter) { return counter + 1; }); }) && innerCounter_1++;
            }, 16);
        }
        else {
            var innerCounter = 0;
            clearInterval(_intervalRefScale.current);
        }
        return function () { return clearInterval(_intervalRefScale.current); };
    }, [startCounter]);
    return (react_1["default"].createElement(AnimationWrapper, __assign({ ref: wrapperRef }, props, { onMouseEnter: function () { return setStartCounter(true); }, onMouseLeave: function () { setStartCounter(false); translate(true); } }),
        props.children,
        react_1["default"].createElement(react_spring_1.animated.div, { style: translateAnimationStyle },
            react_1["default"].createElement(BottomBorder, { style: bottomBorderAnimationStyle }))));
};
exports["default"] = FleeingBorderAnimation;
var templateObject_1, templateObject_2;
