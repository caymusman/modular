var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            list: [],
            count: 0
        };
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "handleClick",
        value: function handleClick() {
            var _this2 = this;

            this.setState(function (state) {
                return {
                    list: [].concat(_toConsumableArray(state.list), [React.createElement(Area, { key: "area" + _this2.state.count, filling: React.createElement(Filling, null) })]),
                    count: state.count + 1
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "mainDiv" },
                React.createElement(
                    "button",
                    { id: "centerBtn", onClick: this.handleClick },
                    "Add Area"
                ),
                this.state.list
            );
        }
    }]);

    return App;
}(React.Component);

var Area = function (_React$Component2) {
    _inherits(Area, _React$Component2);

    function Area(props) {
        _classCallCheck(this, Area);

        var _this3 = _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).call(this, props));

        _this3.state = {
            top: '2%',
            left: '2%'
        };
        _this3.handleDrag = _this3.handleDrag.bind(_this3);
        return _this3;
    }

    _createClass(Area, [{
        key: "handleDrag",
        value: function handleDrag(e) {
            var pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            e.preventDefault();
            e.persist();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            this.setState({
                top: this.offsetTop - pos2 + "px",
                left: this.offsetLeft - pos1 + "px"
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                {
                    draggable: "true",
                    name: "drag",
                    className: "drag dragDiv",
                    onDrag: this.handleDrag,
                    style: ({ left: this.state.left }, { top: this.state.top })
                },
                this.props.filling
            );
        }
    }]);

    return Area;
}(React.Component);

var Filling = function (_React$Component3) {
    _inherits(Filling, _React$Component3);

    function Filling(props) {
        _classCallCheck(this, Filling);

        var _this4 = _possibleConstructorReturn(this, (Filling.__proto__ || Object.getPrototypeOf(Filling)).call(this, props));

        _this4.handleMove = _this4.handleMove.bind(_this4);
        return _this4;
    }

    _createClass(Filling, [{
        key: "handleMove",
        value: function handleMove(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Moved");
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "fillingDiv" },
                React.createElement("input", { type: "range", min: "-1", max: "1", step: ".1", onClickCapture: this.handleMove })
            );
        }
    }]);

    return Filling;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("App"));