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
                if (el.fromData.fromModID == childKey) {
                    var val = finCords.indexOf(el);
                    finCords.splice(val, 1);
                    minCount++;

                    el.fromData.audio.disconnect(el.toData.audio);
                }
                if (el.toData.tomyKey == childKey || el.toData.tomyKey.split(' ')[0] + " " + el.toData.tomyKey.split(' ')[1] == childKey) {
                    var _val = finCords.indexOf(el);
                    finCords.splice(_val, 1);
                    minCount++;

                    el.fromData.audio.disconnect(el.toData.audio);

                    //make sure any output cords are removed from cordCombos
                    newCombos[el.fromData.fromModID].splice(newCombos[el.fromData.fromModID].indexOf(childKey), 1);
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
                    patchCords: [].concat(_toConsumableArray(state.patchCords), [{ id: "cord" + _this2.state.cumulativeCordCount, fromData: info, toData: null }]),
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
                var toData = "toData";
                var lastEl = newCords[this.state.currentCordCount - 1];
                var fromMod = lastEl.fromData.fromModID;
                if (fromMod == info.tomyKey) {
                    this.myAlert("You cannot plug a module into itself!");
                    this.handlePatchExit();
                } else if (this.state.cordCombos[fromMod].includes(info.tomyKey)) {
                    this.myAlert("You've already patched this cable!");
                    this.handlePatchExit();
                } else {
                    lastEl[toData] = info;
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
                lastEl.fromData.audio.connect(info.audio);
            }
        }
    }, {
        key: "deleteCord",
        value: function deleteCord(cordID) {
            var newArr = [].concat(_toConsumableArray(this.state.patchCords));
            for (var i = 0; i < newArr.length; i++) {
                if (newArr[i].id == cordID) {
                    newArr[i].fromData.audio.disconnect(newArr[i].toData.audio);
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
            var fromCombo = cordVal.fromData.fromModID;
            var newCombo = Object.assign({}, this.state.cordCombos);
            newCombo[fromCombo].splice(newCombo[fromCombo].indexOf(cordVal.toData.tomyKey), 1);
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
                if (el.toData.tomyKey.includes(" ")) {
                    console.log(el.toData.tomyKey);
                }
                if (el.fromData.fromModID == modID) {
                    var in_el = document.getElementById(modID + "outputInner").getBoundingClientRect();
                    var in_x = in_el.x;
                    var in_y = in_el.y;
                    var in_bottom = in_el.bottom;
                    var in_right = in_el.right;
                    var in_xCenter = (in_right - in_x) / 2 + in_x - largerDim * .04;
                    var in_yCenter = (in_bottom - in_y) / 2 + in_y - largerDim * .04;
                    el.fromData.fromLocation = { x: in_xCenter, y: in_yCenter };
                } else if (el.toData.tomyKey == modID) {
                    var to_el = document.getElementById(modID + "inputInner").getBoundingClientRect();
                    var to_x = to_el.x;
                    var to_y = to_el.y;
                    var to_bottom = to_el.bottom;
                    var to_right = to_el.right;
                    var to_xCenter = (to_right - to_x) / 2 + to_x - largerDim * .04;
                    var to_yCenter = (to_bottom - to_y) / 2 + to_y - largerDim * .04;
                    el.toData.toLocation = { x: to_xCenter, y: to_yCenter };
                } else if (el.toData.tomyKey.includes(" ") && el.toData.tomyKey.split(' ')[0] + " " + el.toData.tomyKey.split(' ')[1] == modID) {
                    var newStr = el.toData.tomyKey.split(' ')[2];
                    console.log("I'M IN HERE: " + newStr);
                    var _to_el = document.getElementById(el.toData.tomyKey + " inputInner").getBoundingClientRect();
                    var _to_x = _to_el.x;
                    var _to_y = _to_el.y;
                    var _to_bottom = _to_el.bottom;
                    var _to_right = _to_el.right;
                    var _to_xCenter = (_to_right - _to_x) / 2 + _to_x - largerDim * .04;
                    var _to_yCenter = (_to_bottom - _to_y) / 2 + _to_y - largerDim * .04;
                    el.toData.toLocation = { x: _to_xCenter, y: _to_yCenter };
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
                if (el['toData']) {
                    cords.push(React.createElement(Cord, { deleteCord: _this3.deleteCord, key: el.id, id: el.id, x1: el.fromData.fromLocation.x, y1: el.fromData.fromLocation.y, x2: el.toData.toLocation.x, y2: el.toData.toLocation.y }));
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
        value: function handleCreatePatch(event) {
            if (!this.props.outputMode) {
                var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
                var el = event.target.getBoundingClientRect();
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
        value: function handleOutput(event) {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = event.target.getBoundingClientRect();
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
                case "Filter":
                    return React.createElement(Filter, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                default:
                    return React.createElement(
                        "div",
                        null,
                        "Hahahahaha theres nothing here!"
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
                        id: "outputOuter", onClick: this.handleCreatePatch },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "outputInner" })
                ),
                this.props.inputOnly == "false" && React.createElement(
                    "div",
                    { className: this.props.outputMode ? "cordOuter show raise interactive" : "cordOuter show",
                        id: "inputOuter", onClick: this.handleOutput },
                    React.createElement("div", { className: "cordInner", id: this.props.myKey + "inputInner" })
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
            val: 220,
            num: 220,
            min: 20,
            max: 700,
            step: 1,
            LFO: false
        };

        _this5.handleFreqChange = _this5.handleFreqChange.bind(_this5);
        _this5.handleWaveChange = _this5.handleWaveChange.bind(_this5);
        _this5.handleLFOClick = _this5.handleLFOClick.bind(_this5);
        _this5.handleNumChange = _this5.handleNumChange.bind(_this5);
        _this5.handleNumFreqChange = _this5.handleNumFreqChange.bind(_this5);
        return _this5;
    }

    _createClass(Oscillator, [{
        key: "handleFreqChange",
        value: function handleFreqChange(event) {
            var freq = event.target.value;
            if (freq > this.state.max) {
                freq = this.state.max;
            } else if (freq < this.state.min) {
                freq = this.state.min;
            }
            this.state.audio.frequency.setValueAtTime(freq, this.props.audioContext.currentTime);
            this.setState({
                num: freq,
                val: freq
            });
        }
    }, {
        key: "handleWaveChange",
        value: function handleWaveChange(wave) {
            this.state.audio.type = wave;
            this.setState({
                wave: wave
            });
        }
    }, {
        key: "handleLFOClick",
        value: function handleLFOClick() {
            if (this.state.LFO) {
                this.setState({
                    max: 700,
                    val: 220,
                    num: 220,
                    min: 20,
                    step: 1,
                    LFO: false
                });
                this.state.audio.frequency.setValueAtTime(220, this.props.audioContext.currentTime);
            } else {
                this.setState({
                    val: 10,
                    num: 10,
                    max: 20,
                    min: 0,
                    step: .1,
                    LFO: true
                });
                this.state.audio.frequency.setValueAtTime(10, this.props.audioContext.currentTime);
            }
        }
    }, {
        key: "handleNumChange",
        value: function handleNumChange(event) {
            if (isNaN(event.target.value)) {
                return;
            }
            this.setState({
                num: event.target.value
            });
        }
    }, {
        key: "handleNumFreqChange",
        value: function handleNumFreqChange() {
            var temp = this.state.num;
            if (temp > this.state.max) {
                temp = this.state.max;
            } else if (temp < this.state.min) {
                temp = this.state.min;
            }
            this.setState({
                val: temp,
                num: temp
            });
            this.state.audio.frequency.setValueAtTime(temp, this.props.audioContext.currentTime);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
            this.state.audio.frequency.setValueAtTime(this.state.val, this.props.audioContext.currentTime);
            this.state.audio.start();
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            return React.createElement(
                "div",
                { className: "oscDiv" },
                React.createElement(Selector, { id: "waveSelector", values: ["sine", "sawtooth", "triangle"], handleClick: this.handleWaveChange }),
                React.createElement(
                    "label",
                    { id: "oscSlider", className: "switch tooltip" },
                    React.createElement("input", { type: "checkbox", onClick: this.handleLFOClick }),
                    React.createElement("span", { className: "slider round" }),
                    React.createElement(
                        "span",
                        { id: "oscLFOTip", className: "tooltiptext" },
                        "LFO Mode"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "tooltip" },
                    React.createElement("input", { type: "range", value: this.state.val, min: this.state.min, max: this.state.max, step: this.state.step, onChange: this.handleFreqChange }),
                    React.createElement(
                        "span",
                        { id: "oscFreqTip", className: "tooltiptext" },
                        "Freq"
                    )
                ),
                React.createElement("input", { id: "freqNumInput", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this6.handleNumFreqChange();
                        }
                    } })
            );
        }
    }]);

    return Oscillator;
}(React.Component);

var Gain = function (_React$Component4) {
    _inherits(Gain, _React$Component4);

    function Gain(props) {
        _classCallCheck(this, Gain);

        var _this7 = _possibleConstructorReturn(this, (Gain.__proto__ || Object.getPrototypeOf(Gain)).call(this, props));

        _this7.state = {
            audio: _this7.props.audioContext.createGain(),
            value: .5,
            num: .5,
            max: 1,
            min: 0
        };

        _this7.handleGainChange = _this7.handleGainChange.bind(_this7);
        _this7.handleNumChange = _this7.handleNumChange.bind(_this7);
        _this7.handleNumGainChange = _this7.handleNumGainChange.bind(_this7);
        _this7.handleOutput = _this7.handleOutput.bind(_this7);
        return _this7;
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
                value: gainVal,
                num: gainVal
            });
        }
    }, {
        key: "handleNumChange",
        value: function handleNumChange(event) {
            if (isNaN(event.target.value)) {
                return;
            }
            this.setState({
                num: event.target.value
            });
        }
    }, {
        key: "handleNumGainChange",
        value: function handleNumGainChange() {
            var temp = this.state.num;
            if (temp > this.state.max) {
                temp = this.state.max;
            } else if (temp < this.state.min) {
                temp = this.state.min;
            }
            this.setState({
                value: temp,
                num: temp
            });
        }
    }, {
        key: "handleOutput",
        value: function handleOutput(event) {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = event.target.getBoundingClientRect();
            var x = el.x;
            var y = el.y;
            var bottom = el.bottom;
            var right = el.right;
            var xCenter = (right - x) / 2 + x - largerDim * .04;
            var yCenter = (bottom - y) / 2 + y - largerDim * .04;

            this.props.handleOutput({ tomyKey: this.props.parent + " param",
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
            var _this8 = this;

            return React.createElement(
                "div",
                { className: "gainDiv" },
                React.createElement("input", { id: "gainRangeInput", type: "range", value: this.state.value, min: "0", max: "1", step: ".05", onChange: this.handleGainChange }),
                React.createElement("input", { id: "gainNumInput", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this8.handleNumGainChange();
                        }
                    } }),
                React.createElement(
                    "div",
                    { className: "cordOuter tooltip", id: "firstParam", onClick: this.handleOutput },
                    React.createElement(
                        "div",
                        { className: "cordInner", id: this.props.parent + " param" + " inputInner" },
                        React.createElement(
                            "span",
                            { id: "gainGainParamTip", className: "tooltiptext" },
                            React.createElement(
                                "span",
                                { className: "paramSpan" },
                                "param: "
                            ),
                            "Gain"
                        )
                    )
                )
            );
        }
    }]);

    return Gain;
}(React.Component);

var Filter = function (_React$Component5) {
    _inherits(Filter, _React$Component5);

    function Filter(props) {
        _classCallCheck(this, Filter);

        var _this9 = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

        _this9.state = {
            audio: _this9.props.audioContext.createBiquadFilter(),
            type: "lowpass",
            gainNum: .5,
            gainVal: .5,
            gainMax: 1,
            gainMin: 0,
            freqNum: 440,
            freqVal: 440,
            freqMax: 3000,
            freqMin: 0

        };

        _this9.handleFilterType = _this9.handleFilterType.bind(_this9);
        _this9.handleGainRangeChange = _this9.handleGainRangeChange.bind(_this9);
        _this9.handleGainNumChange = _this9.handleGainNumChange.bind(_this9);
        _this9.handleGainNumSubmit = _this9.handleGainNumSubmit.bind(_this9);
        _this9.handleFreqRangeChange = _this9.handleFreqRangeChange.bind(_this9);
        _this9.handleFreqNumChange = _this9.handleFreqNumChange.bind(_this9);
        _this9.handleFreqNumSubmit = _this9.handleFreqNumSubmit.bind(_this9);
        return _this9;
    }

    _createClass(Filter, [{
        key: "handleFilterType",
        value: function handleFilterType(val) {
            this.state.audio.type = val;
            this.setState({
                type: val
            });
        }
    }, {
        key: "handleGainRangeChange",
        value: function handleGainRangeChange(event) {
            var gainVal = event.target.value;
            if (gainVal > this.state.gainMax) {
                gainVal = this.state.gainMax;
            } else if (gainVal < this.state.gainMin) {
                gainVal = this.state.gainMin;
            }
            this.state.audio.gain.setValueAtTime(gainVal, this.props.audioContext.currentTime);
            this.setState({
                gainVal: gainVal,
                gainNum: gainVal
            });
        }
    }, {
        key: "handleGainNumChange",
        value: function handleGainNumChange(event) {
            if (isNaN(event.target.value)) {
                return;
            }
            this.setState({
                gainNum: event.target.value
            });
        }
    }, {
        key: "handleGainNumSubmit",
        value: function handleGainNumSubmit() {
            var temp = this.state.gainNum;
            if (temp > this.state.gainMax) {
                temp = this.state.gainMax;
            } else if (temp < this.state.gainMin) {
                temp = this.state.gainMin;
            }
            this.setState({
                gainVal: temp,
                gainNum: temp
            });
        }
    }, {
        key: "handleFreqRangeChange",
        value: function handleFreqRangeChange(event) {
            var freqVal = event.target.value;
            if (freqVal > this.state.freqMax) {
                freqVal = this.state.freqMax;
            } else if (freqVal < this.state.freqMin) {
                freqVal = this.state.freqMin;
            }
            this.state.audio.frequency.setValueAtTime(freqVal, this.props.audioContext.currentTime);
            this.setState({
                freqVal: freqVal,
                freqNum: freqVal
            });
        }
    }, {
        key: "handleFreqNumChange",
        value: function handleFreqNumChange(event) {
            if (isNaN(event.target.value)) {
                return;
            }
            this.setState({
                freqNum: event.target.value
            });
        }
    }, {
        key: "handleFreqNumSubmit",
        value: function handleFreqNumSubmit() {
            var temp = this.state.freqNum;
            if (temp > this.state.freqMax) {
                temp = this.state.freqMax;
            } else if (temp < this.state.freqMin) {
                temp = this.state.freqMin;
            }
            this.setState({
                freqVal: temp,
                freqNum: temp
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            var filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
            return React.createElement(
                "div",
                { className: "filterDiv" },
                React.createElement(Selector, { id: "filterSelector", values: filterTypes, handleClick: this.handleFilterType }),
                React.createElement(
                    "div",
                    { id: "filterGainDiv", className: "tooltip" },
                    React.createElement("input", { id: "filterGainRange", type: "range", value: this.state.gainVal, min: "0", max: "1", step: ".05", onChange: this.handleGainRangeChange }),
                    React.createElement("input", { id: "filterGainNumber", value: this.state.gainNum, type: "text", onChange: this.handleGainNumChange, onKeyPress: function onKeyPress(event) {
                            if (event.key == "Enter") {
                                _this10.handleGainNumSubmit();
                            }
                        } }),
                    React.createElement(
                        "span",
                        { id: "filterGainTip", className: "tooltiptext" },
                        "Filter Gain"
                    )
                ),
                React.createElement(
                    "div",
                    { id: "filterFreqDiv", className: "tooltip" },
                    React.createElement("input", { id: "filterFreqRange", type: "range", value: this.state.freqVal, min: "0", max: "3000", step: "5", onChange: this.handleFreqRangeChange }),
                    React.createElement("input", { id: "filterFreqNumber", value: this.state.freqNum, type: "text", onChange: this.handleFreqNumChange, onKeyPress: function onKeyPress(event) {
                            if (event.key == "Enter") {
                                _this10.handleFreqNumSubmit();
                            }
                        } }),
                    React.createElement(
                        "span",
                        { id: "filterFreqTip", className: "tooltiptext" },
                        "Filter Frequency"
                    )
                )
            );
        }
    }]);

    return Filter;
}(React.Component);

var Output = function (_React$Component6) {
    _inherits(Output, _React$Component6);

    function Output(props) {
        _classCallCheck(this, Output);

        var _this11 = _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).call(this, props));

        _this11.state = {
            gainNode: _this11.props.audioContext.createGain(),
            value: .5
        };
        _this11.handleOutput = _this11.handleOutput.bind(_this11);
        _this11.handleChange = _this11.handleChange.bind(_this11);
        return _this11;
    }

    _createClass(Output, [{
        key: "handleOutput",
        value: function handleOutput(event) {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var el = event.target.getBoundingClientRect();
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
            this.setState({
                value: event.target.value
            });
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
                React.createElement("input", { id: "gainSlider", value: this.state.value, type: "range", min: "0", max: "1", step: ".05", onChange: this.handleChange }),
                React.createElement(
                    "div",
                    { className: "cordOuter",
                        onClick: this.handleOutput },
                    React.createElement("div", { className: "cordInner", id: "Output" + "inputInner" })
                )
            );
        }
    }]);

    return Output;
}(React.Component);

//patchcords with delete capability


var Cord = function (_React$Component7) {
    _inherits(Cord, _React$Component7);

    function Cord(props) {
        _classCallCheck(this, Cord);

        var _this12 = _possibleConstructorReturn(this, (Cord.__proto__ || Object.getPrototypeOf(Cord)).call(this, props));

        _this12.handleClick = _this12.handleClick.bind(_this12);
        return _this12;
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


var SideButtons = function (_React$Component8) {
    _inherits(SideButtons, _React$Component8);

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
                React.createElement(MyButton, { name: "Filter", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "PeePee", handleClick: this.props.handleClick, inputOnly: "false" })
            );
        }
    }]);

    return SideButtons;
}(React.Component);

//buttons in side area that create modules for the playspace


var MyButton = function (_React$Component9) {
    _inherits(MyButton, _React$Component9);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this14 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this14.state = {
            count: 0
        };

        _this14.handleClick = _this14.handleClick.bind(_this14);
        return _this14;
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

var Selector = function (_React$Component10) {
    _inherits(Selector, _React$Component10);

    function Selector(props) {
        _classCallCheck(this, Selector);

        var _this15 = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));

        _this15.state = {
            val: _this15.props.values[0]
        };

        _this15.handleClick = _this15.handleClick.bind(_this15);
        return _this15;
    }

    _createClass(Selector, [{
        key: "handleClick",
        value: function handleClick(event) {
            this.setState({
                val: event.target.innerHTML
            });
            this.props.handleClick(event.target.innerHTML);
        }
    }, {
        key: "render",
        value: function render() {
            var _this16 = this;

            return React.createElement(
                "div",
                { id: this.props.id, className: "selectorDiv" },
                React.createElement(
                    "span",
                    null,
                    this.state.val
                ),
                this.props.values.map(function (el) {
                    return React.createElement(
                        "div",
                        { key: el, className: "selectorVal", onClick: _this16.handleClick },
                        el
                    );
                })
            );
        }
    }]);

    return Selector;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("App"));