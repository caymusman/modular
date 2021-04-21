var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
            cordCount: 0,
            outputMode: false
        };
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);

        _this.addCord = _this.addCord.bind(_this);
        _this.handlePatchExit = _this.handlePatchExit.bind(_this);
        _this.handleOutput = _this.handleOutput.bind(_this);
        _this.deleteCord = _this.deleteCord.bind(_this);
        return _this;
    }

    //Passed to SideButtons to control which buttons are added to PlaySpace


    _createClass(App, [{
        key: "handleClick",
        value: function handleClick(childKey, childJSX) {
            var _this2 = this;

            this.setState(function (state) {
                return {
                    list: new Map(state.list.set(childKey, React.createElement(Area, {
                        key: childKey,
                        myKey: childKey,
                        filling: childJSX,
                        name: childKey.split(" ")[0],
                        handleClose: _this2.handleClose,
                        outputMode: _this2.state.outputMode,
                        addPatch: _this2.addCord,
                        handleOutput: _this2.handleOutput
                    })))
                };
            });
        }
    }, {
        key: "handleClose",


        //Passed to Area to control which modules are removed from PlaySpace
        value: function handleClose(childKey) {
            var newMap = new Map(this.state.list);
            newMap.delete(childKey);
            this.setState(function (state) {
                return {
                    list: newMap
                };
            });
        }
    }, {
        key: "handlePatchExit",
        value: function handlePatchExit() {
            this.setState({
                outputMode: false
            });
        }
    }, {
        key: "addCord",
        value: function addCord(info) {
            var _this3 = this;

            this.setState(function (state) {
                return {
                    patchCords: [].concat(_toConsumableArray(state.patchCords), [{ id: "cord" + _this3.state.cordCount, inputData: info, outputData: null }]),
                    cordCount: state.cordCount + 1,
                    outputMode: true
                };
            });
        }
    }, {
        key: "handleOutput",
        value: function handleOutput(info) {
            if (this.state.outputMode) {
                var newCords = [].concat(_toConsumableArray(this.state.patchCords));
                var outData = "outputData";
                newCords[this.state.cordCount - 1][outData] = info;
                this.setState(function (state) {
                    return {
                        patchCords: newCords
                    };
                });

                this.setState({
                    outputMode: false
                });
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
                    cordCount: state.cordCount - 1
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            var dragHandlers = { onStart: this.onStart, onStop: this.onStop };
            var cords = []; //loop through the cords in the state, add line version to this array
            var tempArr = [].concat(_toConsumableArray(this.state.patchCords));
            tempArr.forEach(function (el) {
                if (el['outputData']) {
                    cords.push(React.createElement(Cord, { deleteCord: _this4.deleteCord, key: el.id, id: el.id, x1: el.inputData.fromLocation.x, y1: el.inputData.fromLocation.y, x2: el.outputData.toLocation.x, y2: el.outputData.toLocation.y }));
                }
            });
            return React.createElement(
                "div",
                { id: "mainDiv" },
                React.createElement(
                    "svg",
                    { id: "patchCords" },
                    cords
                ),
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
                    [].concat(_toConsumableArray(this.state.list)).map(function (entry) {
                        var key = entry[0];
                        var value = entry[1];
                        return React.createElement(
                            Draggable,
                            Object.assign({ key: key, handle: "p" }, dragHandlers, { bounds: "parent" }),
                            React.createElement(
                                "div",
                                { className: "dragDiv" },
                                value
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

        var _this5 = _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, props));

        _this5.handleClose = _this5.handleClose.bind(_this5);
        _this5.handleCreatePatch = _this5.handleCreatePatch.bind(_this5);
        _this5.handleOutput = _this5.handleOutput.bind(_this5);

        _this5.state = {
            clicked: false
        };
        return _this5;
    }

    _createClass(Area, [{
        key: "handleClose",
        value: function handleClose() {
            this.props.handleClose(this.props.myKey);
        }
        //Close on press of X icon. Pass key up to App and remove from state.list

    }, {
        key: "handleCreatePatch",
        value: function handleCreatePatch() {
            if (!this.state.clicked) {
                var el = document.getElementById(this.props.myKey + "inputInner").getBoundingClientRect();
                var x = el.x;
                var y = el.y;
                var bottom = el.bottom;
                var right = el.right;
                var xCenter = (right - x) / 2 + x;
                var yCenter = (bottom - y) / 2 + y;
                this.props.addPatch({ fromModID: this.props.myKey,
                    fromLocation: { x: xCenter, y: yCenter } });
            }
            this.setState(function (state) {
                return { clicked: !state.clicked };
            });
        }
    }, {
        key: "handleOutput",
        value: function handleOutput() {
            var el = document.getElementById(this.props.myKey + "outputInner").getBoundingClientRect();
            var x = el.x;
            var y = el.y;
            var bottom = el.bottom;
            var right = el.right;
            var xCenter = (right - x) / 2 + x;
            var yCenter = (bottom - y) / 2 + y;

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
                React.createElement("i", { className: "fa fa-times", "aria-hidden": "true", onClick: this.handleClose }),
                React.createElement(
                    "p",
                    { id: "modTitle" },
                    this.props.name
                ),
                React.createElement(
                    "div",
                    { id: "innerModDiv" },
                    this.props.filling
                ),
                React.createElement(
                    "div",
                    { className: "cordOuter", id: "inputOuter", onClick: this.handleCreatePatch },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "inputInner" })
                ),
                React.createElement(
                    "div",
                    { className: "cordOuter", id: "outputOuter", onClick: this.handleOutput },
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

var Cord = function (_React$Component4) {
    _inherits(Cord, _React$Component4);

    function Cord(props) {
        _classCallCheck(this, Cord);

        var _this7 = _possibleConstructorReturn(this, (Cord.__proto__ || Object.getPrototypeOf(Cord)).call(this, props));

        _this7.handleClick = _this7.handleClick.bind(_this7);
        return _this7;
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

var MyButton = function (_React$Component6) {
    _inherits(MyButton, _React$Component6);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this9 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this9.state = {
            count: 0
        };

        _this9.handleClick = _this9.handleClick.bind(_this9);
        return _this9;
    }

    //Return up to App a new module to be added to the play area.


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