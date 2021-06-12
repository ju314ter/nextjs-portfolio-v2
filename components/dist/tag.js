"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spring_1 = require("react-spring");
var RemoveCircle_1 = require("@material-ui/icons/RemoveCircle");
var AddCircle_1 = require("@material-ui/icons/AddCircle");
var react_use_measure_1 = require("react-use-measure");
var GridTag = function (_a) {
    var isSelected = _a.isSelected, tag = _a.tag, onTagClick = _a.onTagClick, index = _a.index, color = _a.color;
    var _b = react_use_measure_1["default"](), textRef = _b[0], textBounds = _b[1];
    var _c = react_1.useState(false), isHovered = _c[0], setHovered = _c[1];
    var colorRef = react_1.useRef(color);
    var textStyleRemove = react_spring_1.useSpring({ maxWidth: isSelected ? 500 : 0, opacity: isSelected ? 1 : 0 });
    var textStyleAdd = react_spring_1.useSpring({ maxWidth: isHovered ? 500 : 0, opacity: isHovered ? 1 : 0 });
    var bgStyle = react_spring_1.useSpring({ width: isSelected || isHovered ? textBounds.width + 10 : 0, background: colorRef.current });
    react_1.useEffect(function () {
        colorRef.current = color;
    }, []);
    return (react_1["default"].createElement("div", { className: 'Filter-tag-wrapper', onClick: onTagClick, onMouseEnter: function () { setHovered(true); }, onMouseLeave: function () { setHovered(false); } },
        react_1["default"].createElement("span", { className: 'Filter-tag-content', style: tag == 'Randomize' ? { fontWeight: 'bold' } : null, ref: textRef }, tag),
        tag !== 'Randomize' && isHovered && !isSelected ? (react_1["default"].createElement(react_spring_1.animated.span, { style: textStyleAdd, className: 'Filter-tag-button-remove' },
            react_1["default"].createElement(AddCircle_1["default"], null))) : null,
        tag !== 'Randomize' && isSelected ? (react_1["default"].createElement(react_spring_1.animated.span, { style: textStyleRemove, className: 'Filter-tag-button-remove' },
            react_1["default"].createElement(RemoveCircle_1["default"], null))) : null,
        react_1["default"].createElement(react_spring_1.animated.span, { className: 'Filter-tag-background', style: bgStyle })));
};
exports["default"] = GridTag;
