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
            pingText: "",
            audioContext: new AudioContext()
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
        value: function handleClick(childKey, childJSX, inputOnly) {
            if (this.state.outputMode) {
                this.handlePatchExit();
            }
            var newCombos = Object.assign({}, this.state.cordCombos, _defineProperty({}, childKey, []));
            this.setState(function (state) {
                return {
                    list: new Map([].concat(_toConsumableArray(state.list), [[childKey, { myKey: childKey,
                        filling: childJSX,
                        name: childKey.split(" ")[0],
                        inputOnly: inputOnly }]])),
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

                    el.inputData.audio.disconnect(el.outputData.audio);
                }
                if (el.outputData.tomyKey == childKey) {
                    var _val = finCords.indexOf(el);
                    finCords.splice(_val, 1);
                    minCount++;

                    el.inputData.audio.disconnect(el.outputData.audio);

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
                //handle Audio
                lastEl.inputData.audio.connect(info.audio);
            }
        }
    }, {
        key: "deleteCord",
        value: function deleteCord(cordID) {
            var newArr = [].concat(_toConsumableArray(this.state.patchCords));
            for (var i = 0; i < newArr.length; i++) {
                if (newArr[i].id == cordID) {
                    newArr[i].inputData.audio.disconnect(newArr[i].outputData.audio);
                    break;
                }
            }
            this.setState(function (state) {
                return {
                    patchCords: newArr.filter(function (el) {
                        return el.id !== cordID;
                    }),
                    currentCordCount: state.currentCordCount - 1
                };
            });
            this.handleComboDelete(cordID);
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
                            name = _ref2$.name,
                            inputOnly = _ref2$.inputOnly;

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
                                    handleOutput: _this3.handleOutput,
                                    inputOnly: inputOnly,
                                    audioContext: _this3.state.audioContext
                                })
                            )
                        );
                    }),
                    React.createElement(Output, { handleOutput: this.handleOutput,
                        audioContext: this.state.audioContext
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

        _this4.state = {
            audio: {}
        };

        _this4.handleClose = _this4.handleClose.bind(_this4);
        _this4.handleCreatePatch = _this4.handleCreatePatch.bind(_this4);
        _this4.handleOutput = _this4.handleOutput.bind(_this4);
        _this4.createAudio = _this4.createAudio.bind(_this4);
        _this4.renderFilling = _this4.renderFilling.bind(_this4);
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
                    fromLocation: { x: xCenter, y: yCenter },
                    audio: this.state.audio });
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
                toLocation: { x: xCenter, y: yCenter },
                audio: this.state.audio });
        }
    }, {
        key: "createAudio",
        value: function createAudio(childAudio) {
            this.setState({
                audio: childAudio
            });
        }
    }, {
        key: "renderFilling",
        value: function renderFilling() {
            switch (this.props.filling) {
                case "Oscillator":
                    return React.createElement(Oscillator, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Gain":
                    return React.createElement(Gain, { audioContext: this.props.audioContext, createAudio: this.createAudio, parent: this.props.myKey, handleOutput: this.props.handleOutput });
                default:
                    return React.createElement(
                        "div",
                        null,
                        "Nothing"
                    );
            }
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
                    this.renderFilling()
                ),
                React.createElement(
                    "div",
                    { className: this.props.outputMode ? "cordOuter hide" : "cordOuter show interactive",
                        id: "inputOuter", onClick: this.handleCreatePatch },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "inputInner" })
                ),
                this.props.inputOnly == "false" && React.createElement(
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

//Oscillator Module


var Oscillator = function (_React$Component3) {
    _inherits(Oscillator, _React$Component3);

    function Oscillator(props) {
        _classCallCheck(this, Oscillator);

        var _this5 = _possibleConstructorReturn(this, (Oscillator.__proto__ || Object.getPrototypeOf(Oscillator)).call(this, props));

        _this5.state = {
            audio: _this5.props.audioContext.createOscillator(),
            wave: "sine",
            value: 220
        };

        _this5.handleFreqChange = _this5.handleFreqChange.bind(_this5);
        _this5.handleWaveChange = _this5.handleWaveChange.bind(_this5);
        return _this5;
    }

    _createClass(Oscillator, [{
        key: "handleFreqChange",
        value: function handleFreqChange(event) {
            var freq = event.target.value;
            if (freq > 700) {
                freq = 700;
            } else if (freq < 50) {
                freq = 50;
            }
            this.state.audio.frequency.setValueAtTime(freq, this.props.audioContext.currentTime);
            this.setState({
                value: freq
            });
        }
    }, {
        key: "handleWaveChange",
        value: function handleWaveChange(event) {
            this.state.audio.type = event.target.value;
            this.setState({
                wave: event.target.value
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
            this.state.audio.frequency.setValueAtTime(this.state.value, this.props.audioContext.currentTime);
            this.state.audio.start();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "oscDiv" },
                React.createElement(
                    "select",
                    { value: this.state.wave, onChange: this.handleWaveChange },
                    React.createElement(
                        "option",
                        { value: "sine" },
                        "Sine"
                    ),
                    React.createElement(
                        "option",
                        { value: "sawtooth" },
                        "Sawtooth"
                    ),
                    React.createElement(
                        "option",
                        { value: "triangle" },
                        "Triangle"
                    )
                ),
                React.createElement(
                    "label",
                    { "class": "switch" },
                    React.createElement("input", { type: "checkbox" }),
                    React.createElement("span", { "class": "slider round" })
                ),
                React.createElement("input", { type: "range", value: this.state.value, min: "50", max: "700", step: "1", onChange: this.handleFreqChange }),
                React.createElement("input", { type: "number", value: this.state.value, min: "50", max: "700", onChange: this.handleFreqChange })
            );
        }
    }]);

    return Oscillator;
}(React.Component);

var Gain = function (_React$Component4) {
    _inherits(Gain, _React$Component4);

    function Gain(props) {
        _classCallCheck(this, Gain);

        var _this6 = _possibleConstructorReturn(this, (Gain.__proto__ || Object.getPrototypeOf(Gain)).call(this, props));

        _this6.state = {
            audio: _this6.props.audioContext.createGain(),
            value: .5
        };

        _this6.handleGainChange = _this6.handleGainChange.bind(_this6);
        _this6.handleOutput = _this6.handleOutput.bind(_this6);
        return _this6;
    }

    _createClass(Gain, [{
        key: "handleGainChange",
        value: function handleGainChange(event) {
            var gainVal = event.target.value;
            if (gainVal > 1) {
                gainVal = 1;
            } else if (gainVal < 0) {
                gainVal = 0;
            }
            this.state.audio.gain.setValueAtTime(gainVal, this.props.audioContext.currentTime);
            this.setState({
                value: gainVal
            });
        }
    }, {
        key: "handleOutput",
        value: function handleOutput() {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = document.getElementById(this.props.parent + "param" + "outputInner").getBoundingClientRect();
            var x = el.x;
            var y = el.y;
            var bottom = el.bottom;
            var right = el.right;
            var xCenter = (right - x) / 2 + x - largerDim * .04;
            var yCenter = (bottom - y) / 2 + y - largerDim * .04;

            this.props.handleOutput({ tomyKey: this.props.parent + "param",
                toLocation: { x: xCenter, y: yCenter },
                audio: this.state.audio.gain });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
            this.state.audio.gain.setValueAtTime(.5, this.props.audioContext.currentTime);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "gainDiv" },
                React.createElement("input", { type: "range", value: this.state.value, min: "0", max: "1", step: ".05", onChange: this.handleGainChange }),
                React.createElement("input", { type: "number", value: this.state.value, min: "0", max: "1", onChange: this.handleGainChange }),
                React.createElement(
                    "div",
                    { className: "cordOuter", id: "firstParam", onClick: this.handleOutput },
                    React.createElement("div", { className: "cordInner", id: this.props.parent + "param" + "outputInner" })
                )
            );
        }
    }]);

    return Gain;
}(React.Component);

var Output = function (_React$Component5) {
    _inherits(Output, _React$Component5);

    function Output(props) {
        _classCallCheck(this, Output);

        var _this7 = _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).call(this, props));

        _this7.state = {
            gainNode: _this7.props.audioContext.createGain()
        };
        _this7.handleOutput = _this7.handleOutput.bind(_this7);
        _this7.handleChange = _this7.handleChange.bind(_this7);
        return _this7;
    }

    _createClass(Output, [{
        key: "handleOutput",
        value: function handleOutput() {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = document.getElementById("OutputoutputInner").getBoundingClientRect();
            var x = el.x;
            var y = el.y;
            var bottom = el.bottom;
            var right = el.right;
            var xCenter = (right - x) / 2 + x - largerDim * .04;
            var yCenter = (bottom - y) / 2 + y - largerDim * .04;

            this.props.handleOutput({ tomyKey: "Output",
                toLocation: { x: xCenter, y: yCenter },
                audio: this.state.gainNode });
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            this.state.gainNode.gain.setValueAtTime(event.target.value, this.props.audioContext.currentTime);
        }
    }, {
        key: "render",
        value: function render() {
            this.state.gainNode.connect(this.props.audioContext.destination);
            return React.createElement(
                "div",
                { id: "outputDiv" },
                React.createElement(
                    "p",
                    null,
                    "Output"
                ),
                React.createElement("input", { id: "gainSlider", type: "range", min: "0", max: "1", step: ".05", onChange: this.handleChange }),
                React.createElement(
                    "div",
                    { className: "cordOuter",
                        onClick: this.handleOutput },
                    React.createElement("div", { className: "cordInner", id: "Output" + "outputInner" })
                )
            );
        }
    }]);

    return Output;
}(React.Component);

//patchcords with delete capability


var Cord = function (_React$Component6) {
    _inherits(Cord, _React$Component6);

    function Cord(props) {
        _classCallCheck(this, Cord);

        var _this8 = _possibleConstructorReturn(this, (Cord.__proto__ || Object.getPrototypeOf(Cord)).call(this, props));

        _this8.handleClick = _this8.handleClick.bind(_this8);
        return _this8;
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


var SideButtons = function (_React$Component7) {
    _inherits(SideButtons, _React$Component7);

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
                React.createElement(MyButton, { name: "Oscillator", handleClick: this.props.handleClick, inputOnly: "true" }),
                React.createElement(MyButton, { name: "Gain", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "Poopoop", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "PeePee", handleClick: this.props.handleClick, inputOnly: "false" })
            );
        }
    }]);

    return SideButtons;
}(React.Component);

//buttons in side area that create modules for the playspace


var MyButton = function (_React$Component8) {
    _inherits(MyButton, _React$Component8);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this10 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this10.state = {
            count: 0
        };

        _this10.handleClick = _this10.handleClick.bind(_this10);
        return _this10;
    }

    _createClass(MyButton, [{
        key: "handleClick",
        value: function handleClick() {
            this.props.handleClick(this.props.name + " " + this.state.count, this.props.name, this.props.inputOnly);
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