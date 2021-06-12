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
var router_1 = require("next/router");
var github_svg_1 = require("../public/socialicons/github.svg");
var DynamicFeed_1 = require("@material-ui/icons/DynamicFeed");
var react_use_measure_1 = require("react-use-measure");
var styled_components_1 = require("styled-components");
var ProjectDetail = styled_components_1["default"].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\ntop: ", "px;\nleft: ", "px;\nwidth: 300px;\nheight: ", "px;\ndisplay: ", ";\nbackground: whitesmoke no-repeat center;\nbackgroundSize: contain;\nposition: fixed;\nmargin-top: 0;\nborder-radius: 8px;\ntransition: all 1 ease-in-out;\nwill-change: width height top left opacity;\nz-index: 500;\nborder-left-width: 4px;\nborder-bottom-width: 4px;\nborder-right-width: 1px;\nborder-top-width: 1px;\n\n&:hover {\n    transition: all 1s ease-in-out;\n    opacity: 1;\n    top: 5vh;\n    left: 5vw;\n    width: 90vw;\n    height: 90vh;\n    border-radius:8px;\n    }\n"], ["\ntop: ", "px;\nleft: ", "px;\nwidth: 300px;\nheight: ", "px;\ndisplay: ", ";\nbackground: whitesmoke no-repeat center;\nbackgroundSize: contain;\nposition: fixed;\nmargin-top: 0;\nborder-radius: 8px;\ntransition: all 1 ease-in-out;\nwill-change: width height top left opacity;\nz-index: 500;\nborder-left-width: 4px;\nborder-bottom-width: 4px;\nborder-right-width: 1px;\nborder-top-width: 1px;\n\n&:hover {\n    transition: all 1s ease-in-out;\n    opacity: 1;\n    top: 5vh;\n    left: 5vw;\n    width: 90vw;\n    height: 90vh;\n    border-radius:8px;\n    }\n"])), function (props) { return props.projectPos.top; }, function (props) { return props.projectPos.left; }, function (props) { return props.projectHeight; }, function (props) { return props.isClicked ? "block" : "none"; });
var Project = function (_a) {
    var onClick = _a.onClick, color = _a.color, project = _a.project, projectHeight = _a.projectHeight;
    if (!project) {
        return null;
    }
    var router = router_1.useRouter();
    var _b = react_1.useState(false), isHovered = _b[0], setHovered = _b[1];
    var _c = react_1.useState(false), isClicked = _c[0], setClicked = _c[1];
    var _d = react_1.useState('white'), colorRef = _d[0], setColorRef = _d[1];
    var _e = react_use_measure_1["default"](), projectRef = _e[0], projectPos = _e[1];
    var projectRefDetail = react_1.useRef(null);
    var handleClick = function (e) {
        setClicked(!isClicked);
        projectRefDetail.current.classList.toggle('active');
    };
    react_1.useEffect(function () {
        setColorRef(color);
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: 'Project', ref: projectRef, style: { background: "url(" + project.illustrationPath[0] + ") no-repeat center", backgroundSize: !!project.portrait ? 'contain' : 'cover', height: projectHeight }, onClick: handleClick, onMouseEnter: function () { setHovered(true); }, onMouseLeave: function () { setHovered(false); } },
            !!project.repoPath && !!project.directUrl && (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement("div", { className: 'Project-left-action', onClick: function (e) { router.push(project.repoPath) && e.stopPropagation(); } },
                    react_1["default"].createElement(github_svg_1["default"], { style: { fill: colorRef, width: '60%', height: '100%' } })),
                react_1["default"].createElement("div", { className: 'Project-right-action', onClick: function (e) { router.push(project.directUrl) && e.stopPropagation(); } },
                    react_1["default"].createElement(DynamicFeed_1["default"], { style: { fill: colorRef, width: '60%', height: '100%' } })))),
            !!project.repoPath && !project.directUrl && react_1["default"].createElement("div", { className: 'Project-left-action unique', onClick: function () { router.push(project.repoPath); } },
                react_1["default"].createElement(github_svg_1["default"], { style: { fill: colorRef, width: '60%', height: '100%' } })),
            !!project.directUrl && !project.repoPath && react_1["default"].createElement("div", { className: 'Project-right-action unique', onClick: function () { router.push(project.directUrl); } },
                react_1["default"].createElement(DynamicFeed_1["default"], { style: { fill: colorRef, width: '60%', height: '100%' } }))),
        react_1["default"].createElement(ProjectDetail, __assign({}, { projectPos: projectPos, projectHeight: projectHeight, project: project, isClicked: isClicked }, { ref: projectRefDetail, onClick: handleClick }),
            react_1["default"].createElement("div", { style: { width: '100%', height: '100%', borderRadius: 8, border: '2px solid black', background: "url(" + project.illustrationPath[0] + ") no-repeat center", backgroundSize: 'auto 100%' } }))));
};
exports["default"] = Project;
var templateObject_1;
