"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var react_use_measure_1 = require("react-use-measure");
var react_spring_1 = require("react-spring");
var realisations_json_1 = require("../data/realisations.json");
var lodash_shuffle_1 = require("lodash.shuffle");
var project_1 = require("./project");
var tag_1 = require("./tag");
var colorArray = ['rgb(206,143,143)', 'rgb(143,195,206)', 'rgb(143, 206, 176)', 'rgb(157, 143, 206)', 'rgb(143, 206, 200)', 'rgb(206, 164, 143)', 'rgb(204, 206, 143)', 'rgb(206, 143, 181)'];
var isReal = function (number) {
    return isFinite(number) && !isNaN(number);
};
var GridProject = function (props) {
    var minColWidth = 320;
    var _a = react_use_measure_1["default"](), refGrid = _a[0], boundsGrid = _a[1];
    var _b = react_1.useState(280), projectHeight = _b[0], setProjectHeight = _b[1];
    var _c = react_1.useState(2), columns = _c[0], setColumns = _c[1];
    var formattedData = realisations_json_1["default"].realisations;
    var _d = react_1.useState(formattedData), items = _d[0], set = _d[1];
    var tagsArray = ["Randomize"];
    realisations_json_1["default"].realisations.forEach(function (real) {
        real.tags && real.tags.forEach(function (tag) {
            tagsArray.push(tag);
        });
    });
    tagsArray = tagsArray.filter(function (tag, i) { return tagsArray.indexOf(tag) === i; });
    var _e = react_1.useState(['']), selectedTags = _e[0], setSelectedTags = _e[1];
    var _f = react_1.useMemo(function () {
        var heights = new Array(columns).fill(0); // Each column gets a height starting with zero
        var gridItems = items.map(function (child, i) {
            var column = heights.indexOf(Math.min.apply(Math, heights)); // Basic masonry-grid placing, puts tile into the smallest column using Math.min
            var left = (boundsGrid.width / columns) * column; // x = container width / number of columns * column index,
            var top = (heights[column] += projectHeight + 25) - projectHeight + 25; // y = it's just the height of the current column
            // if(!isReal(columns)) console.log('columns is not real folks !' , columns)
            // console.log(columns)
            return __assign(__assign({}, child), { left: left, top: top, width: boundsGrid.width / columns, height: projectHeight + 25 });
        });
        props.getHeight(heights);
        return [heights, gridItems];
    }, [columns, items, boundsGrid.width, projectHeight]), heights = _f[0], gridItems = _f[1];
    var transitions = react_spring_1.useTransition(gridItems, {
        keys: function (item) { return item.projectName; },
        from: function (_a) {
            var left = _a.left, top = _a.top, width = _a.width, height = _a.height;
            return ({ left: left, top: top, width: width, height: height, opacity: 0 });
        },
        enter: function (_a) {
            var left = _a.left, top = _a.top, width = _a.width, height = _a.height;
            return ({ left: left, top: top, width: width, height: height, opacity: 1 });
        },
        update: function (_a) {
            var left = _a.left, top = _a.top, width = _a.width, height = _a.height;
            return ({ left: left, top: top, width: width, height: height });
        },
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25
    });
    react_1.useEffect(function () {
        set(lodash_shuffle_1["default"](formattedData));
    }, []);
    react_1.useEffect(function () {
        boundsGrid.width !== 0 ? setColumns(Math.floor(boundsGrid.width / minColWidth)) : null;
    }, [boundsGrid, projectHeight]);
    var toggle = function (tag) {
        switch (tag) {
            case 'Randomize':
                set(lodash_shuffle_1["default"](formattedData));
                setSelectedTags(['']);
                break;
            default:
                if (selectedTags.includes(tag)) {
                    selectedTags.splice(selectedTags.indexOf(tag), 1);
                    if (selectedTags.length === 1) {
                        set(formattedData);
                    }
                    else {
                        set(function (prevState) { return (__spreadArrays(prevState.filter(function (real) { return !real.tags.includes(tag) || selectedTags.some(function (selectedTag) { return real.tags.includes(selectedTag); }); }))); });
                    }
                    setSelectedTags(__spreadArrays(selectedTags));
                }
                else {
                    selectedTags.length === 1 ?
                        set(formattedData.filter(function (real) { return real.tags.includes(tag); }))
                        :
                            set(function (prevState) { return (formattedData
                                .filter(function (real) { return real.tags.includes(tag) && !selectedTags.some(function (selectedTag) { return real.tags.includes(selectedTag); }); })
                                .concat(prevState)); });
                    setSelectedTags(function (prevState) { return (__spreadArrays(prevState, [tag])); });
                }
                break;
        }
    };
    var handleProject = function (project) {
        // properties.selectedProject(project)
        console.log(project);
    };
    return (react_1["default"].createElement("div", { className: 'ProjectGridWrapper' },
        react_1["default"].createElement("div", { className: 'Filter-wrapper' },
            react_1["default"].createElement("div", { className: 'Filter' },
                react_1["default"].createElement("div", { className: 'Filter-title-wrapper' },
                    react_1["default"].createElement("span", { className: 'Filter-title-content' }, "Filter by tags")),
                react_1["default"].createElement("div", { className: 'Filter-tags' }, tagsArray && tagsArray.map(function (tag, i) {
                    return react_1["default"].createElement(tag_1["default"], { key: tag + '-' + i, color: colorArray[Math.floor(Math.random() * colorArray.length)], index: i, isSelected: selectedTags.includes(tag), tag: tag, onTagClick: function () { return (toggle(tag)); } });
                })))),
        react_1["default"].createElement("div", { className: 'ProjectsWrapper', ref: refGrid }, !isFinite(Math.max.apply(Math, heights)) ? null : (transitions(function (props, item) {
            return (react_1["default"].createElement(react_spring_1.animated.div, { key: item, className: "animated-item-wrapper", style: __assign({}, props) },
                react_1["default"].createElement(project_1["default"], { project: item, projectHeight: projectHeight, color: colorArray[Math.floor(Math.random() * colorArray.length)], onClick: function () { handleProject(item); } })));
        })))));
};
exports["default"] = GridProject;
