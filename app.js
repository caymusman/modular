var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Draggable = require('react-draggable');

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            list: new Map(),
            patchCords: [],
            currentCordCount: 0,
            cumulativeCordCount: 0,
            outputMode: false,
            cordCombos: {},
            alert: false,
            pingText: ""
        };
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);

        _this.addCord = _this.addCord.bind(_this);
        _this.handlePatchExit = _this.handlePatchExit.bind(_this);
        _this.handleOutput = _this.handleOutput.bind(_this);
        _this.deleteCord = _this.deleteCord.bind(_this);
        _this.handleDrag = _this.handleDrag.bind(_this);
        _this.handleComboDelete = _this.handleComboDelete.bind(_this);
        _this.handlePingExit = _this.handlePingExit.bind(_this);
        _this.myAlert = _this.myAlert.bind(_this);
        return _this;
    }

    //Passed to SideButtons to control which buttons are added to PlaySpace


    _createClass(App, [{
        key: "handleClick",
        value: function handleClick(childKey, childJSX) {
            if (this.state.outputMode) {
                this.handlePatchExit();
            }
            var newCombos = Object.assign({}, this.state.cordCombos, _defineProperty({}, childKey, []));
            this.setState(function (state) {
                return {
                    list: new Map([].concat(_toConsumableArray(state.list), [[childKey, { myKey: childKey,
                        filling: childJSX,
                        name: childKey.split(" ")[0] }]])),
                    cordCombos: newCombos
                };
            });
        }
    }, {
        key: "handleClose",


        //Passed to Area to control which modules are removed from PlaySpace
        value: function handleClose(childKey) {
            var newMap = new Map(this.state.list);
            newMap.delete(childKey);

            //need to delete all patchcords attached to it, and disconnect all audio streams.
            var newCords = [].concat(_toConsumableArray(this.state.patchCords));
            var finCords = [].concat(_toConsumableArray(this.state.patchCords));
            var minCount = 0;
            var newCombos = Object.assign({}, this.state.cordCombos);
            newCords.forEach(function (el) {
                if (el.inputData.fromModID == childKey) {
                    var val = finCords.indexOf(el);
                    finCords.splice(val, 1);
                    minCount++;
                }
                if (el.outputData.tomyKey == childKey) {
                    var _val = finCords.indexOf(el);
                    finCords.splice(_val, 1);
                    minCount++;

                    //make sure any output cords are removed from cordCombos
                    newCombos[el.inputData.fromModID].splice(newCombos[el.inputData.fromModID].indexOf(childKey), 1);
                }
            });

            //delete property from cordCombos object    
            delete newCombos[childKey];

            this.setState(function (state) {
                return {
                    list: newMap,
                    patchCords: finCords,
                    currentCordCount: state.currentCordCount - minCount,
                    cordCombos: newCombos
                };
            });
        }

        //click X to not make patch cord after input click

    }, {
        key: "handlePatchExit",
        value: function handlePatchExit() {
            var newCords = [].concat(_toConsumableArray(this.state.patchCords));
            var popped = newCords.pop();
            this.setState(function (state) {
                return {
                    currentCordCount: state.currentCordCount - 1,
                    cumulativeCordCount: state.cumulativeCordCount - 1,
                    outputMode: false,
                    patchCords: newCords
                };
            });
        }

        //add initial patch cord data upon input click

    }, {
        key: "addCord",
        value: function addCord(info) {
            var _this2 = this;

            this.setState(function (state) {
                return {
                    patchCords: [].concat(_toConsumableArray(state.patchCords), [{ id: "cord" + _this2.state.cumulativeCordCount, inputData: info, outputData: null }]),
                    currentCordCount: state.currentCordCount + 1,
                    cumulativeCordCount: state.cumulativeCordCount + 1,
                    outputMode: true
                };
            });
        }

        //add output data to fully formed patch cords

    }, {
        key: "handleOutput",
        value: function handleOutput(info) {
            if (this.state.outputMode) {
                var newCords = [].concat(_toConsumableArray(this.state.patchCords));
                var outData = "outputData";
                var lastEl = newCords[this.state.currentCordCount - 1];
                var fromMod = lastEl.inputData.fromModID;
                if (fromMod == info.tomyKey) {
                    this.myAlert("You cannot plug a module into itself!");
                    this.handlePatchExit();
                } else if (this.state.cordCombos[fromMod].includes(info.tomyKey)) {
                    this.myAlert("You've already patched this cable!");
                    this.handlePatchExit();
                } else {
                    lastEl[outData] = info;
                    var newCombo = Object.assign({}, this.state.cordCombos);
                    newCombo[fromMod].push(info.tomyKey);
                    this.setState(function (state) {
                        return {
                            patchCords: newCords,
                            cordCombos: newCombo
                        };
                    });

                    this.setState({
                        outputMode: false
                    });
                }
            }
        }
    }, {
        key: "deleteCord",
        value: function deleteCord(cordID) {
            var newArr = [].concat(_toConsumableArray(this.state.patchCords));
            this.setState(function (state) {
                return {
                    patchCords: newArr.filter(function (el) {
                        return el.id !== cordID;
                    }),
                    currentCordCount: state.currentCordCount - 1
                };
            });
        }
    }, {
        key: "handleComboDelete",
        value: function handleComboDelete(cordID) {
            var cordVal = this.state.patchCords.find(function (val) {
                return val.id == cordID;
            });
            var fromCombo = cordVal.inputData.fromModID;
            var newCombo = Object.assign({}, this.state.cordCombos);
            newCombo[fromCombo].splice(newCombo[fromCombo].indexOf(cordVal.outputData.tomyKey), 1);
            this.setState({
                cordCombos: newCombo
            });
        }

        //redraw cords when module is dragged

    }, {
        key: "handleDrag",
        value: function handleDrag(modID) {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var newCords = [].concat(_toConsumableArray(this.state.patchCords));
            newCords.forEach(function (el) {
                if (el.inputData.fromModID == modID) {
                    var in_el = document.getElementById(modID + "inputInner").getBoundingClientRect();
                    var in_x = in_el.x;
                    var in_y = in_el.y;
                    var in_bottom = in_el.bottom;
                    var in_right = in_el.right;
                    var in_xCenter = (in_right - in_x) / 2 + in_x - largerDim * .04;
                    var in_yCenter = (in_bottom - in_y) / 2 + in_y - largerDim * .04;
                    el.inputData.fromLocation = { x: in_xCenter, y: in_yCenter };
                } else if (el.outputData.tomyKey == modID) {
                    var out_el = document.getElementById(modID + "outputInner").getBoundingClientRect();
                    var out_x = out_el.x;
                    var out_y = out_el.y;
                    var out_bottom = out_el.bottom;
                    var out_right = out_el.right;
                    var out_xCenter = (out_right - out_x) / 2 + out_x - largerDim * .04;
                    var out_yCenter = (out_bottom - out_y) / 2 + out_y - largerDim * .04;
                    el.outputData.toLocation = { x: out_xCenter, y: out_yCenter };
                }
            });

            this.setState(function (state) {
                return {
                    patchCords: newCords
                };
            });
        }
    }, {
        key: "myAlert",
        value: function myAlert(ping) {
            this.setState({
                alert: true,
                pingText: ping
            });
        }
    }, {
        key: "handlePingExit",
        value: function handlePingExit() {
            this.setState({
                alert: false,
                pingText: ""
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            var dragHandlers = { onStart: this.onStart, onStop: this.onStop };
            var cords = []; //loop through the cords in the state, add line version to this array
            var tempArr = [].concat(_toConsumableArray(this.state.patchCords));
            tempArr.forEach(function (el) {
                if (el['outputData']) {
                    cords.push(React.createElement(Cord, { deleteCord: _this3.deleteCord, key: el.id, id: el.id, x1: el.inputData.fromLocation.x, y1: el.inputData.fromLocation.y, x2: el.outputData.toLocation.x, y2: el.outputData.toLocation.y }));
                }
            });
            return React.createElement(
                "div",
                { id: "mainDiv" },
                React.createElement("div", { id: "logo" }),
                React.createElement("div", { id: "header" }),
                React.createElement(
                    "div",
                    { id: "sidebar" },
                    React.createElement(SideButtons, {
                        id: "sideButtons",
                        handleClick: this.handleClick })
                ),
                React.createElement(
                    "div",
                    { id: "playSpace" },
                    React.createElement(
                        "svg",
                        { id: "patchCords" },
                        cords
                    ),
                    React.createElement(
                        "div",
                        { className: this.state.alert ? "show pingBox" : "hide pingBox" },
                        React.createElement(
                            "div",
                            { id: "pingTextDiv" },
                            React.createElement(
                                "h3",
                                { className: "error" },
                                "Not so fast!"
                            )
                        ),
                        React.createElement(
                            "p",
                            { id: "pingText" },
                            this.state.pingText
                        ),
                        React.createElement("i", {
                            id: "pingExit",
                            onClick: this.handlePingExit,
                            className: "fa fa-times-circle",
                            "aria-hidden": "true" })
                    ),
                    React.createElement("i", {
                        id: "patchExit",
                        onClick: this.handlePatchExit,
                        className: this.state.outputMode ? "show fa fa-times-circle" : "hide fa fa-times-circle",
                        "aria-hidden": "true" }),
                    [].concat(_toConsumableArray(this.state.list)).map(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            key = _ref2[0],
                            _ref2$ = _ref2[1],
                            myKey = _ref2$.myKey,
                            filling = _ref2$.filling,
                            name = _ref2$.name;

                        return React.createElement(
                            Draggable,
                            Object.assign({ onDrag: function onDrag() {
                                    _this3.handleDrag(key);
                                }, key: key, handle: "p" }, dragHandlers, { bounds: "parent" }),
                            React.createElement(
                                "div",
                                { className: "dragDiv" },
                                React.createElement(Area, {
                                    key: myKey,
                                    myKey: myKey,
                                    filling: filling,
                                    name: name,
                                    handleClose: _this3.handleClose,
                                    outputMode: _this3.state.outputMode,
                                    addPatch: _this3.addCord,
                                    handleOutput: _this3.handleOutput
                                })
                            )
                        );
                    })
                )
            );
        }
    }]);

    return App;
}(React.Component);

//Create a draggable module with filling that changes based on which button you press to create module.


var Area = function (_React$Component2) {
    _inherits(Area, _React$Component2);

    function Area(props) {
        _classCallCheck(this, Area);

        var _this4 = _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, props));

        _this4.handleClose = _this4.handleClose.bind(_this4);
        _this4.handleCreatePatch = _this4.handleCreatePatch.bind(_this4);
        _this4.handleOutput = _this4.handleOutput.bind(_this4);
        return _this4;
    }

    //Close on press of X icon. Pass key up to App and remove from state.list


    _createClass(Area, [{
        key: "handleClose",
        value: function handleClose() {
            this.props.handleClose(this.props.myKey);
        }

        //handle first click in input area

    }, {
        key: "handleCreatePatch",
        value: function handleCreatePatch() {
            if (!this.props.outputMode) {
                var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
                var el = document.getElementById(this.props.myKey + "inputInner").getBoundingClientRect();
                var x = el.x;
                var y = el.y;
                var bottom = el.bottom;
                var right = el.right;
                var xCenter = (right - x) / 2 + x - largerDim * .04;
                var yCenter = (bottom - y) / 2 + y - largerDim * .04;
                this.props.addPatch({ fromModID: this.props.myKey,
                    fromLocation: { x: xCenter, y: yCenter } });
            }
        }

        //handle patchcord click in output area

    }, {
        key: "handleOutput",
        value: function handleOutput() {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = document.getElementById(this.props.myKey + "outputInner").getBoundingClientRect();
            var x = el.x;
            var y = el.y;
            var bottom = el.bottom;
            var right = el.right;
            var xCenter = (right - x) / 2 + x - largerDim * .04;
            var yCenter = (bottom - y) / 2 + y - largerDim * .04;

            this.props.handleOutput({ tomyKey: this.props.myKey,
                toLocation: { x: xCenter, y: yCenter } });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "moduleDiv"
                },
                React.createElement(
                    "p",
                    { id: "modTitle" },
                    React.createElement("i", { className: "fa fa-times", "aria-hidden": "true", onClick: this.handleClose }),
                    this.props.name
                ),
                React.createElement(
                    "div",
                    { id: "innerModDiv" },
                    this.props.filling
                ),
                React.createElement(
                    "div",
                    { className: this.props.outputMode ? "cordOuter hide" : "cordOuter show interactive",
                        id: "inputOuter", onClick: this.handleCreatePatch },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "inputInner" })
                ),
                React.createElement(
                    "div",
                    { className: this.props.outputMode ? "cordOuter show raise interactive" : "cordOuter show",
                        id: "outputOuter", onClick: this.handleOutput },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "outputInner" })
                )
            );
        }
    }]);

    return Area;
}(React.Component);

//Filling belongs to SideButtons to render the inner part of each Area


var Filling = function (_React$Component3) {
    _inherits(Filling, _React$Component3);

    function Filling(props) {
        _classCallCheck(this, Filling);

        return _possibleConstructorReturn(this, (Filling.__proto__ || Object.getPrototypeOf(Filling)).call(this, props));
    }

    _createClass(Filling, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "fillingDiv" },
                React.createElement("input", { type: "range", min: "-1", max: "1", step: ".1" }),
                React.createElement(
                    "button",
                    null,
                    "On"
                )
            );
        }
    }]);

    return Filling;
}(React.Component);

//patchcords with delete capability


var Cord = function (_React$Component4) {
    _inherits(Cord, _React$Component4);

    function Cord(props) {
        _classCallCheck(this, Cord);

        var _this6 = _possibleConstructorReturn(this, (Cord.__proto__ || Object.getPrototypeOf(Cord)).call(this, props));

        _this6.handleClick = _this6.handleClick.bind(_this6);
        return _this6;
    }

    _createClass(Cord, [{
        key: "handleClick",
        value: function handleClick() {
            this.props.deleteCord(this.props.id);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement("line", {
                x1: this.props.x1,
                y1: this.props.y1,
                x2: this.props.x2,
                y2: this.props.y2,
                onClick: this.handleClick });
        }
    }]);

    return Cord;
}(React.Component);

//sidebar with buttons for creation


var SideButtons = function (_React$Component5) {
    _inherits(SideButtons, _React$Component5);

    function SideButtons(props) {
        _classCallCheck(this, SideButtons);

        return _possibleConstructorReturn(this, (SideButtons.__proto__ || Object.getPrototypeOf(SideButtons)).call(this, props));
    }

    _createClass(SideButtons, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: this.props.id },
                React.createElement(MyButton, { name: "TestButton", handleClick: this.props.handleClick }),
                React.createElement(MyButton, { name: "AnotherTest", handleClick: this.props.handleClick }),
                React.createElement(MyButton, { name: "Poopoop", handleClick: this.props.handleClick }),
                React.createElement(MyButton, { name: "PeePee", handleClick: this.props.handleClick })
            );
        }
    }]);

    return SideButtons;
}(React.Component);

//buttons in side area that create modules for the playspace


var MyButton = function (_React$Component6) {
    _inherits(MyButton, _React$Component6);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this8 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this8.state = {
            count: 0
        };

        _this8.handleClick = _this8.handleClick.bind(_this8);
        return _this8;
    }

    _createClass(MyButton, [{
        key: "handleClick",
        value: function handleClick() {
            this.props.handleClick(this.props.name + " " + this.state.count, React.createElement(Filling, { name: this.props.name }));
            this.setState(function (state) {
                return {
                    count: state.count + 1
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "button",
                { className: "addBtn", onClick: this.handleClick },
                this.props.name
            );
        }
    }]);

    return MyButton;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("App"));