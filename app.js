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
            list: new Map()
        };
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
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
                        handleClose: _this2.handleClose
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
        key: "render",
        value: function render() {
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
                    [].concat(_toConsumableArray(this.state.list)).map(function (entry) {
                        var key = entry[0];
                        var value = entry[1];
                        return React.createElement(
                            "div",
                            { id: "returnSpace", key: key },
                            value
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

        var _this3 = _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, props));

        _this3.handleClose = _this3.handleClose.bind(_this3);
        return _this3;
    }

    _createClass(Area, [{
        key: "handleClose",
        value: function handleClose() {
            this.props.handleClose(this.props.myKey);
        }
        //Close on press of X icon. Pass key up to App and remove from state.list


    }, {
        key: "render",
        value: function render() {
            var dragHandlers = { onStart: this.onStart, onStop: this.onStop };
            return React.createElement(
                Draggable,
                Object.assign({ handle: "p" }, dragHandlers, { bounds: "parent" }),
                React.createElement(
                    "div",
                    {
                        className: "moduleDiv"
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
                    )
                )
            );
        }
    }]);

    return Area;
}(React.Component);

var SideButtons = function (_React$Component3) {
    _inherits(SideButtons, _React$Component3);

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
                React.createElement(MyButton, { name: "Poopoop", handleClick: this.props.handleClick })
            );
        }
    }]);

    return SideButtons;
}(React.Component);

var MyButton = function (_React$Component4) {
    _inherits(MyButton, _React$Component4);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this5 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this5.state = {
            count: 0
        };

        _this5.handleClick = _this5.handleClick.bind(_this5);
        return _this5;
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

//Filling belongs to SideButtons to render the inner part of each Area


var Filling = function (_React$Component5) {
    _inherits(Filling, _React$Component5);

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

ReactDOM.render(React.createElement(App, null), document.getElementById("App"));