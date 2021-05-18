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
            audioContext: new AudioContext(),
            audioIn: false
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
        _this.handleResize = _this.handleResize.bind(_this);
        return _this;
    }

    //Passed to SideButtons to control which buttons are added to PlaySpace


    _createClass(App, [{
        key: "handleClick",
        value: function handleClick(childKey, childJSX, inputOnly) {
            if (this.state.outputMode) {
                this.handlePatchExit();
            }
            if (childKey.split(" ")[0] == "AudioInput") {
                this.setState({ audioIn: true });
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

            if (childKey.split(" ")[0] == "AudioInput") {
                this.setState({ audioIn: false });
            }

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
                } else if (info.tomyKey.includes(fromMod)) {
                    this.myAlert("Hahaha thats a new one. Nice try.");
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
        key: "handleResize",
        value: function handleResize() {
            var largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            var newCords = [].concat(_toConsumableArray(this.state.patchCords));
            newCords.forEach(function (el) {
                var fromID = el.fromData.fromModID;
                var in_el = document.getElementById(fromID + "outputInner").getBoundingClientRect();
                var in_xCenter = (in_el.right - in_el.x) / 2 + in_el.x - largerDim * .04;
                var in_yCenter = (in_el.bottom - in_el.y) / 2 + in_el.y - largerDim * .04;
                el.fromData.fromLocation = { x: in_xCenter, y: in_yCenter };

                var toID = el.toData.tomyKey;
                var out_el = document.getElementById(toID + "inputInner").getBoundingClientRect();
                var out_xCenter = (out_el.right - out_el.x) / 2 + out_el.x - largerDim * .04;
                var out_yCenter = (out_el.bottom - out_el.y) / 2 + out_el.y - largerDim * .04;
                el.toData.toLocation = { x: out_xCenter, y: out_yCenter };
            });

            this.setState({
                patchCords: newCords
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
        key: "componentDidMount",
        value: function componentDidMount() {
            window.addEventListener('resize', this.handleResize);
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
                        handleClick: this.handleClick,
                        audioIn: this.state.audioIn
                    })
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
                    return React.createElement(Oscillator, { audioContext: this.props.audioContext, createAudio: this.createAudio, parent: this.props.myKey, handleOutput: this.props.handleOutput });
                case "Gain":
                    return React.createElement(Gain, { audioContext: this.props.audioContext, createAudio: this.createAudio, parent: this.props.myKey, handleOutput: this.props.handleOutput });
                case "Filter":
                    return React.createElement(Filter, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Panner":
                    return React.createElement(Panner, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "ADSR":
                    return React.createElement(ADSR, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Delay":
                    return React.createElement(Delay, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Distortion":
                    return React.createElement(Distortion, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Reverb":
                    return React.createElement(Reverb, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "AudioInput":
                    return React.createElement(AudioInput, { audioContext: this.props.audioContext, createAudio: this.createAudio });
                case "Recorder":
                    return React.createElement(Recorder, { audioContext: this.props.audioContext, createAudio: this.createAudio });
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
            min: 20,
            max: 20001,
            mid: 440,
            LFO: false,
            modulatorGain: _this5.props.audioContext.createGain()
        };

        _this5.setFreq = _this5.setFreq.bind(_this5);
        _this5.handleWaveChange = _this5.handleWaveChange.bind(_this5);
        _this5.handleLFOClick = _this5.handleLFOClick.bind(_this5);
        _this5.handleOutput = _this5.handleOutput.bind(_this5);
        _this5.setModDepth = _this5.setModDepth.bind(_this5);
        return _this5;
    }

    _createClass(Oscillator, [{
        key: "setFreq",
        value: function setFreq(val) {
            this.state.audio.frequency.setValueAtTime(Number(val), this.props.audioContext.currentTime);
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
                    max: 20001,
                    min: 20,
                    mid: 440,
                    LFO: false
                });
                this.state.audio.frequency.setValueAtTime(440, this.props.audioContext.currentTime);
            } else {
                this.setState({
                    max: 21,
                    min: 0,
                    mid: 10,
                    LFO: true
                });
                this.state.audio.frequency.setValueAtTime(10, this.props.audioContext.currentTime);
            }
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
                audio: this.state.modulatorGain });
        }
    }, {
        key: "setModDepth",
        value: function setModDepth(val) {
            this.state.modulatorGain.gain.setValueAtTime(val, this.props.audioContext.currentTime);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
            this.state.audio.frequency.setValueAtTime(this.state.mid, this.props.audioContext.currentTime);
            this.state.modulatorGain.connect(this.state.audio.frequency);
            this.state.audio.start();
        }
    }, {
        key: "render",
        value: function render() {
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
                React.createElement(LogSlider, { labelName: "oscFreq", tooltipText: "Oscillator Frequency", min: this.state.min, max: this.state.max, mid: this.state.mid, onChange: this.setFreq }),
                React.createElement(
                    "div",
                    { className: "cordOuter tooltip", id: "firstParam", onClick: this.handleOutput },
                    React.createElement(
                        "div",
                        { className: "cordInner", id: this.props.parent + " param" + " inputInner" },
                        React.createElement(
                            "span",
                            { id: "oscDetuneParamTip", className: "tooltiptext" },
                            React.createElement(
                                "span",
                                { className: "paramSpan" },
                                "param: "
                            ),
                            "frequency"
                        )
                    )
                ),
                React.createElement(Slider, { labelName: "oscModGain", tooltipText: "Mod Depth", min: 0, max: 300, mid: 150, setAudio: this.setModDepth })
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
            value: .5,
            num: .5,
            max: 1,
            min: 0
        };

        _this6.handleGainChange = _this6.handleGainChange.bind(_this6);
        _this6.handleNumChange = _this6.handleNumChange.bind(_this6);
        _this6.handleNumGainChange = _this6.handleNumGainChange.bind(_this6);
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
            var _this7 = this;

            return React.createElement(
                "div",
                { className: "gainDiv" },
                React.createElement("input", { id: "gainRangeInput", type: "range", value: this.state.value, min: "0", max: "1", step: ".01", onChange: this.handleGainChange }),
                React.createElement("input", { id: "gainNumInput", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this7.handleNumGainChange();
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
                            "gain"
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

        var _this8 = _possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this, props));

        _this8.state = {
            audio: _this8.props.audioContext.createBiquadFilter(),
            type: "lowpass"
        };

        _this8.handleFilterType = _this8.handleFilterType.bind(_this8);
        _this8.setGain = _this8.setGain.bind(_this8);
        _this8.setFreq = _this8.setFreq.bind(_this8);
        _this8.handleDialChange = _this8.handleDialChange.bind(_this8);
        return _this8;
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
        key: "setGain",
        value: function setGain(val) {
            this.state.audio.gain.setValueAtTime(val, this.props.audioContext.currentTime);
        }
    }, {
        key: "setFreq",
        value: function setFreq(val) {
            this.state.audio.frequency.value = val;
        }
    }, {
        key: "handleDialChange",
        value: function handleDialChange(val) {
            this.state.audio.Q.value = val;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            var filterTypes = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
            return React.createElement(
                "div",
                { className: "filterDiv" },
                React.createElement(Selector, { id: "filterSelector", values: filterTypes, handleClick: this.handleFilterType }),
                React.createElement(Dial, { min: 0, max: 1001, name: "Q", onChange: this.handleDialChange }),
                React.createElement(Slider, { labelName: "filterGain", tooltipText: "Filter Gain", min: -40, max: 40, step: .01, setAudio: this.setGain }),
                React.createElement(LogSlider, { labelName: "filterFreq", tooltipText: "Filter Frequency", min: 0, max: 20001, mid: 440, onChange: this.setFreq })
            );
        }
    }]);

    return Filter;
}(React.Component);

var Panner = function (_React$Component6) {
    _inherits(Panner, _React$Component6);

    function Panner(props) {
        _classCallCheck(this, Panner);

        var _this9 = _possibleConstructorReturn(this, (Panner.__proto__ || Object.getPrototypeOf(Panner)).call(this, props));

        _this9.state = {
            audio: _this9.props.audioContext.createStereoPanner(),
            val: 0
        };

        _this9.handlePan = _this9.handlePan.bind(_this9);
        return _this9;
    }

    _createClass(Panner, [{
        key: "handlePan",
        value: function handlePan(val) {
            this.state.audio.pan.value = val;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Slider, { labelName: "panPan", tooltipText: "Pan", min: -1, max: 1, step: .001, setAudio: this.handlePan })
            );
        }
    }]);

    return Panner;
}(React.Component);

var Delay = function (_React$Component7) {
    _inherits(Delay, _React$Component7);

    function Delay(props) {
        _classCallCheck(this, Delay);

        var _this10 = _possibleConstructorReturn(this, (Delay.__proto__ || Object.getPrototypeOf(Delay)).call(this, props));

        _this10.state = {
            audio: _this10.props.audioContext.createDelay(5.0)
        };

        _this10.handleDelayTime = _this10.handleDelayTime.bind(_this10);
        return _this10;
    }

    _createClass(Delay, [{
        key: "handleDelayTime",
        value: function handleDelayTime(val) {
            this.state.audio.delayTime.setValueAtTime(val, this.props.audioContext.currentTime);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Slider, { labelName: "delayDelayTime", tooltipText: "Delay Time (s)", min: 0, max: 5, step: .01, setAudio: this.handleDelayTime })
            );
        }
    }]);

    return Delay;
}(React.Component);

var Distortion = function (_React$Component8) {
    _inherits(Distortion, _React$Component8);

    function Distortion(props) {
        _classCallCheck(this, Distortion);

        var _this11 = _possibleConstructorReturn(this, (Distortion.__proto__ || Object.getPrototypeOf(Distortion)).call(this, props));

        _this11.state = {
            audio: _this11.props.audioContext.createWaveShaper()
        };

        _this11.handleCurve = _this11.handleCurve.bind(_this11);
        _this11.makeCurve = _this11.makeCurve.bind(_this11);
        _this11.handleOversample = _this11.handleOversample.bind(_this11);
        return _this11;
    }

    _createClass(Distortion, [{
        key: "makeCurve",
        value: function makeCurve(num) {
            var temp = num;
            var n_samples = 44100;
            var curve = new Float32Array(n_samples);
            var deg = Math.PI / 180;
            var x = void 0;
            for (var i = 0; i < n_samples; ++i) {
                x = i * 2 / n_samples - 1;
                curve[i] = (3 + temp) * x * 20 * deg / (Math.PI + temp * Math.abs(x));
            }
            return curve;
        }
    }, {
        key: "handleCurve",
        value: function handleCurve(val) {
            this.state.audio.curve = this.makeCurve(val);
        }
    }, {
        key: "handleOversample",
        value: function handleOversample(val) {
            this.state.audio.oversample = val;
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(Slider, { labelName: "distortionCurve", tooltipText: "Distortion Curve", min: 50, max: 800, step: .1, setAudio: this.handleCurve }),
                React.createElement(Selector, { id: "distortionSelector", values: ["none", "2x", "4x"], handleClick: this.handleOversample })
            );
        }
    }]);

    return Distortion;
}(React.Component);

var Reverb = function (_React$Component9) {
    _inherits(Reverb, _React$Component9);

    function Reverb(props) {
        _classCallCheck(this, Reverb);

        var _this12 = _possibleConstructorReturn(this, (Reverb.__proto__ || Object.getPrototypeOf(Reverb)).call(this, props));

        _this12.state = {
            audio: _this12.props.audioContext.createConvolver()
        };

        _this12.updateBuffer = _this12.updateBuffer.bind(_this12);
        _this12.handleSelector = _this12.handleSelector.bind(_this12);
        return _this12;
    }

    _createClass(Reverb, [{
        key: "updateBuffer",
        value: function updateBuffer(path) {
            var _this13 = this;

            fetch(path).then(function (res) {
                return res.arrayBuffer();
            }).then(function (buffer) {
                return _this13.props.audioContext.decodeAudioData(buffer);
            }).then(function (final) {
                return _this13.state.audio.buffer = final;
            });
        }
    }, {
        key: "handleSelector",
        value: function handleSelector(value) {
            switch (value) {
                case "Small":
                    this.updateBuffer("media/short.wav");
                    break;
                case "Medium":
                    this.updateBuffer("media/medium.wav");
                    break;
                case "Big":
                    this.updateBuffer("media/long.wav");
                    break;
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateBuffer("media/short.wav");
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            console.log(this.state.audio.buffer);
            return React.createElement(
                "div",
                { id: "reverbDiv" },
                React.createElement(Selector, { id: "reverbSelector", values: ["Small", "Medium", "Large"], handleClick: this.handleSelector })
            );
        }
    }]);

    return Reverb;
}(React.Component);

var ADSR = function (_React$Component10) {
    _inherits(ADSR, _React$Component10);

    function ADSR(props) {
        _classCallCheck(this, ADSR);

        var _this14 = _possibleConstructorReturn(this, (ADSR.__proto__ || Object.getPrototypeOf(ADSR)).call(this, props));

        _this14.state = {
            audio: _this14.props.audioContext.createGain(),
            rate: 3000,
            interval: null,
            running: false,
            attack: .2,
            decay: .2,
            sustain: .6,
            release: .3
        };
        _this14.handleSlider = _this14.handleSlider.bind(_this14);
        _this14.handleToggle = _this14.handleToggle.bind(_this14);
        _this14.handleAudio = _this14.handleAudio.bind(_this14);
        _this14.handleTextSubmit = _this14.handleTextSubmit.bind(_this14);
        return _this14;
    }

    _createClass(ADSR, [{
        key: "handleSlider",
        value: function handleSlider(val) {
            this.setState({
                rate: 1 / val * 1000
            });

            if (this.state.running) {
                clearInterval(this.state.interval);
                this.setState({
                    interval: setInterval(this.handleAudio, 1 / val * 1000)
                });
            }
        }
    }, {
        key: "handleToggle",
        value: function handleToggle() {
            var current = this.props.audioContext.currentTime;
            if (!this.state.running) {
                this.setState({
                    running: true,
                    interval: setInterval(this.handleAudio, this.state.rate)
                });
            } else {
                this.state.audio.gain.setTargetAtTime(0, current + this.state.release, .5);
                clearInterval(this.state.interval);
                this.setState({
                    running: false
                });
            }
        }
    }, {
        key: "handleAudio",
        value: function handleAudio() {
            var current = this.props.audioContext.currentTime;
            this.state.audio.gain.cancelScheduledValues(current);
            this.state.audio.gain.setTargetAtTime(.90, current + this.state.attack, this.state.attack);
            this.state.audio.gain.setTargetAtTime(this.state.sustain, current + this.state.attack + this.state.decay, this.state.decay);
            this.state.audio.gain.setTargetAtTime(.001, current + this.state.attack + +this.state.decay + this.state.release, this.state.release);
        }
    }, {
        key: "handleTextSubmit",
        value: function handleTextSubmit(name, num) {
            switch (name) {
                case "Attack":
                    this.setState({ attack: num });
                    break;
                case "Decay":
                    this.setState({ decay: num });
                    break;
                case "Sustain":
                    this.setState({ sustain: num });
                    break;
                case "Release":
                    this.setState({ release: num });
                    break;
                default:
                    return;
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.createAudio(this.state.audio);
            this.state.audio.gain.setValueAtTime(0, this.props.audioContext.currentTime);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "ADSRDiv" },
                React.createElement(LogSlider, { labelName: "ADSRSlider", tooltipText: "LFO Rate", min: 0, max: 21, mid: 10, onChange: this.handleSlider }),
                React.createElement(
                    "label",
                    { id: "ADSRCheck", className: "switch tooltip" },
                    React.createElement("input", { type: "checkbox", onClick: this.handleToggle }),
                    React.createElement("span", { className: "slider round" }),
                    React.createElement(
                        "span",
                        { id: "ADSRCheckTip", className: "tooltiptext" },
                        "LFO Mode"
                    )
                ),
                React.createElement(
                    "button",
                    { id: "ADSRButton", onClick: this.handleAudio },
                    "Pulse"
                ),
                React.createElement("br", null),
                React.createElement(TextInput, { labelName: "ADSRAttack", tooltipText: "Attack", min: 0, max: 5, defaultVal: .2, onSubmit: this.handleTextSubmit }),
                React.createElement(TextInput, { labelName: "ADSRDecay", tooltipText: "Decay", min: 0, max: 5, defaultVal: .2, onSubmit: this.handleTextSubmit }),
                React.createElement("br", null),
                React.createElement(TextInput, { labelName: "ADSRSustain", tooltipText: "Sustain", min: 0, max: 1, defaultVal: .5, onSubmit: this.handleTextSubmit }),
                React.createElement(TextInput, { labelName: "ADSRRelease", tooltipText: "Release", min: 0, max: 5, defaultVal: .3, onSubmit: this.handleTextSubmit })
            );
        }
    }]);

    return ADSR;
}(React.Component);

var AudioInput = function (_React$Component11) {
    _inherits(AudioInput, _React$Component11);

    function AudioInput(props) {
        _classCallCheck(this, AudioInput);

        var _this15 = _possibleConstructorReturn(this, (AudioInput.__proto__ || Object.getPrototypeOf(AudioInput)).call(this, props));

        _this15.state = {
            outputGain: _this15.props.audioContext.createGain()
        };

        _this15.setGain = _this15.setGain.bind(_this15);
        return _this15;
    }

    _createClass(AudioInput, [{
        key: "setGain",
        value: function setGain(val) {
            this.state.outputGain.gain.setValueAtTime(val, this.props.audioContext.currentTime);
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this16 = this;

            if (navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                    var audio = _this16.props.audioContext.createMediaStreamSource(stream);
                    audio.connect(_this16.state.outputGain);
                    _this16.state.outputGain.gain.setValueAtTime(.5, _this16.props.audioContext.currentTime);
                    _this16.props.createAudio(_this16.state.outputGain);
                }).catch(function (err) {
                    console.log("When setting up media devices, I caught: \n" + err);
                });
            } else {
                console.log("Media Devices are not supported!");
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(Slider, { labelName: "audioInGain", tooltipText: "Gain", min: 0, max: 1, step: .01, mid: .5, setAudio: this.setGain });
        }
    }]);

    return AudioInput;
}(React.Component);

var Output = function (_React$Component12) {
    _inherits(Output, _React$Component12);

    function Output(props) {
        _classCallCheck(this, Output);

        var _this17 = _possibleConstructorReturn(this, (Output.__proto__ || Object.getPrototypeOf(Output)).call(this, props));

        _this17.state = {
            gainNode: _this17.props.audioContext.createGain(),
            value: .5
        };
        _this17.handleOutput = _this17.handleOutput.bind(_this17);
        _this17.handleChange = _this17.handleChange.bind(_this17);
        return _this17;
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

var Recorder = function (_React$Component13) {
    _inherits(Recorder, _React$Component13);

    function Recorder(props) {
        _classCallCheck(this, Recorder);

        var _this18 = _possibleConstructorReturn(this, (Recorder.__proto__ || Object.getPrototypeOf(Recorder)).call(this, props));

        _this18.state = {
            audio: _this18.props.audioContext.createGain(),
            destination: _this18.props.audioContext.createMediaStreamDestination(),
            mediaRecorder: null,
            playing: false,
            finished: false,
            href: null
        };

        _this18.handlePlay = _this18.handlePlay.bind(_this18);
        _this18.handleFinish = _this18.handleFinish.bind(_this18);
        return _this18;
    }

    _createClass(Recorder, [{
        key: "handlePlay",
        value: function handlePlay() {
            var _this19 = this;

            if (this.state.playing) {
                this.state.audio.gain.setTargetAtTime(0, this.props.audioContext.currentTime + .02, .02);
                setTimeout(function () {
                    _this19.state.mediaRecorder.stop();
                    _this19.setState({
                        playing: false
                    });
                }, 100);
            } else {
                this.state.audio.gain.setTargetAtTime(1, this.props.audioContext.currentTime + .04, .04);
                this.state.mediaRecorder.start();
                this.setState({
                    playing: true,
                    finished: false
                });
            }
            console.log(this.chunks);
        }
    }, {
        key: "handleFinish",
        value: function handleFinish() {
            var _this20 = this;

            this.state.audio.gain.setTargetAtTime(0, this.props.audioContext.currentTime + .02, .02);
            setTimeout(function () {
                _this20.state.mediaRecorder.stop();
            }, 100);
            if (!this.state.finished) {
                setTimeout(function () {
                    var blob = new Blob(_this20.chunks, { "type": "audio/weba" });
                    _this20.setState({
                        href: URL.createObjectURL(blob),
                        playing: false,
                        finished: true
                    });
                }, 510);
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this21 = this;

            this.state.audio.connect(this.state.destination);
            this.state.audio.gain.setValueAtTime(0, this.props.audioContext.currentTime);
            var mr = new MediaRecorder(this.state.destination.stream);
            mr.mimeType = 'audio/weba';
            mr.audioChannels = 2;
            this.chunks = [];
            mr.ondataavailable = function (event) {
                _this21.chunks.push(event.data);
            };
            this.setState({
                mediaRecorder: mr
            });
            this.props.createAudio(this.state.audio);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "RecorderDiv" },
                React.createElement(
                    "button",
                    { id: "recorderPlay", onClick: this.handlePlay },
                    this.state.playing ? "Pause" : "Record"
                ),
                React.createElement(
                    "button",
                    { id: "recorderFinish", onClick: this.handleFinish },
                    "Finish"
                ),
                React.createElement(
                    "a",
                    { href: this.state.href, download: "recordedAudio.weba" },
                    " Download Here"
                )
            );
        }
    }]);

    return Recorder;
}(React.Component);

//patchcords with delete capability


var Cord = function (_React$Component14) {
    _inherits(Cord, _React$Component14);

    function Cord(props) {
        _classCallCheck(this, Cord);

        var _this22 = _possibleConstructorReturn(this, (Cord.__proto__ || Object.getPrototypeOf(Cord)).call(this, props));

        _this22.handleClick = _this22.handleClick.bind(_this22);
        return _this22;
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


var SideButtons = function (_React$Component15) {
    _inherits(SideButtons, _React$Component15);

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
                React.createElement(MyButton, { name: "Panner", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "ADSR", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "Delay", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "Distortion", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "Reverb", handleClick: this.props.handleClick, inputOnly: "false" }),
                React.createElement(MyButton, { name: "AudioInput", handleClick: this.props.handleClick, inputOnly: "true", audioIn: this.props.audioIn }),
                React.createElement(MyButton, { name: "Recorder", handleClick: this.props.handleClick, inputOnly: "false" })
            );
        }
    }]);

    return SideButtons;
}(React.Component);

//buttons in side area that create modules for the playspace


var MyButton = function (_React$Component16) {
    _inherits(MyButton, _React$Component16);

    function MyButton(props) {
        _classCallCheck(this, MyButton);

        var _this24 = _possibleConstructorReturn(this, (MyButton.__proto__ || Object.getPrototypeOf(MyButton)).call(this, props));

        _this24.state = {
            count: 0
        };

        _this24.handleClick = _this24.handleClick.bind(_this24);
        return _this24;
    }

    _createClass(MyButton, [{
        key: "handleClick",
        value: function handleClick() {
            if (this.props.audioIn) {
                return;
            }
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

var Selector = function (_React$Component17) {
    _inherits(Selector, _React$Component17);

    function Selector(props) {
        _classCallCheck(this, Selector);

        var _this25 = _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).call(this, props));

        _this25.state = {
            val: _this25.props.values[0]
        };

        _this25.handleClick = _this25.handleClick.bind(_this25);
        return _this25;
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
            var _this26 = this;

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
                        { key: el, className: "selectorVal", onClick: _this26.handleClick },
                        el
                    );
                })
            );
        }
    }]);

    return Selector;
}(React.Component);

var Dial = function (_React$Component18) {
    _inherits(Dial, _React$Component18);

    function Dial(props) {
        _classCallCheck(this, Dial);

        var _this27 = _possibleConstructorReturn(this, (Dial.__proto__ || Object.getPrototypeOf(Dial)).call(this, props));

        _this27.state = {
            value: 0,
            num: 0,
            rotPercent: 0
        };

        _this27.handleChange = _this27.handleChange.bind(_this27);
        _this27.handleNumChange = _this27.handleNumChange.bind(_this27);
        _this27.handleNumSubmit = _this27.handleNumSubmit.bind(_this27);
        return _this27;
    }

    _createClass(Dial, [{
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({
                value: event.target.value,
                num: Number((Math.pow(this.props.max, event.target.value) - 1).toFixed(2)),
                rotPercent: event.target.value * 180
            });
            this.props.onChange(Math.pow(this.props.max, event.target.value) - 1);
        }
    }, {
        key: "handleNumChange",
        value: function handleNumChange(event) {
            if (isNaN(event.target.value) && event.target.value != "0.") {
                return;
            }
            this.setState({
                num: event.target.value
            });
        }
    }, {
        key: "handleNumSubmit",
        value: function handleNumSubmit() {
            var temp = this.state.num;
            if (temp > this.props.max - 1) {
                temp = this.props.max - 1;
            } else if (temp < this.props.min) {
                temp = this.props.min;
            }
            this.setState({
                val: Math.log(temp) / Math.log(this.props.max),
                num: Number(Number(temp).toFixed(2)),
                rotPercent: Math.log(temp) / Math.log(this.props.max) * 180
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this28 = this;

            var rotStyle = {
                background: "conic-gradient(from " + (this.state.rotPercent / Number.POSITIVE_INFINITY - 90) + "deg, #fff, #555)",
                transform: "rotate(" + this.state.rotPercent + "deg)"
            };

            return React.createElement(
                "div",
                { className: "dialWhole" },
                React.createElement(
                    "div",
                    { id: "dialKnob", className: "tooltip" },
                    React.createElement(
                        "span",
                        { id: this.props.name + "dialtip", className: "tooltiptext" },
                        this.props.name
                    ),
                    React.createElement("input", { className: "dialRange", value: this.state.value, type: "range", min: "0", max: "1", step: ".001", onChange: this.handleChange }),
                    React.createElement("div", { id: "dialEmpty", style: rotStyle })
                ),
                React.createElement("input", { id: "dialNumInput", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this28.handleNumSubmit();
                        }
                    } })
            );
        }
    }]);

    return Dial;
}(React.Component);

var Slider = function (_React$Component19) {
    _inherits(Slider, _React$Component19);

    function Slider(props) {
        _classCallCheck(this, Slider);

        var _this29 = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

        _this29.state = {
            num: (_this29.props.max + _this29.props.min) / 2,
            val: (_this29.props.max + _this29.props.min) / 2
        };

        _this29.handleRangeChange = _this29.handleRangeChange.bind(_this29);
        _this29.handleNumChange = _this29.handleNumChange.bind(_this29);
        _this29.handleNumSubmit = _this29.handleNumSubmit.bind(_this29);
        return _this29;
    }

    _createClass(Slider, [{
        key: "handleRangeChange",
        value: function handleRangeChange(event) {
            var val = event.target.value;
            if (val > this.props.max) {
                val = this.props.max;
            } else if (val < this.props.min) {
                val = this.props.min;
            }
            this.props.setAudio(val);
            this.setState({
                val: val,
                num: val
            });
        }
    }, {
        key: "handleNumChange",
        value: function handleNumChange(event) {
            if (isNaN(event.target.value) && event.target.value != "-") {
                return;
            }
            this.setState({
                num: event.target.value
            });
        }
    }, {
        key: "handleNumSubmit",
        value: function handleNumSubmit() {
            var temp = this.state.num;
            if (temp > this.props.max) {
                temp = this.props.max;
            } else if (temp < this.props.min) {
                temp = this.props.min;
            }
            this.setState({
                val: temp,
                num: temp
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this30 = this;

            return React.createElement(
                "div",
                { id: this.props.labelName + "Div", className: "tooltip" },
                React.createElement("input", { id: this.props.labelName + "Range", type: "range", value: this.state.val, min: this.props.min, max: this.props.max, step: this.props.step, onChange: this.handleRangeChange }),
                React.createElement("input", { id: this.props.labelName + "Number", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this30.handleNumSubmit();
                        }
                    } }),
                React.createElement(
                    "span",
                    { id: this.props.labelName + "Span", className: "tooltiptext" },
                    this.props.tooltipText
                )
            );
        }
    }]);

    return Slider;
}(React.Component);

var LogSlider = function (_React$Component20) {
    _inherits(LogSlider, _React$Component20);

    function LogSlider(props) {
        _classCallCheck(this, LogSlider);

        var _this31 = _possibleConstructorReturn(this, (LogSlider.__proto__ || Object.getPrototypeOf(LogSlider)).call(this, props));

        _this31.state = {
            val: Number(Math.log(_this31.props.mid) / Math.log(_this31.props.max)),
            num: _this31.props.mid
        };

        _this31.handleChange = _this31.handleChange.bind(_this31);
        _this31.handleNumChange = _this31.handleNumChange.bind(_this31);
        _this31.handleNumFreqChange = _this31.handleNumFreqChange.bind(_this31);
        return _this31;
    }

    _createClass(LogSlider, [{
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({
                val: event.target.value,
                num: Number((Math.pow(this.props.max, event.target.value) - 1).toFixed(2))
            });
            this.props.onChange(Number((Math.pow(this.props.max, event.target.value) - 1).toFixed(2)));
        }
    }, {
        key: "handleNumChange",
        value: function handleNumChange(event) {
            if (isNaN(event.target.value) && event.target.value != "0.") {
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
            if (temp > this.props.max - 1) {
                temp = this.props.max - 1;
            } else if (temp < this.props.min) {
                temp = this.props.min;
            }
            this.setState({
                val: Math.log(Number(temp) + 1) / Math.log(this.props.max - 1),
                num: Number(Number(temp).toFixed(2))
            });
            this.props.onChange(Number(Number(temp).toFixed(2)));
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            if (prevProps.mid !== this.props.mid) {
                this.setState({
                    val: Number(Math.log(this.props.mid) / Math.log(this.props.max)),
                    num: this.props.mid
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this32 = this;

            return React.createElement(
                "div",
                { id: this.props.labelName + "logSliderWhole", className: "tooltip" },
                React.createElement("input", { className: this.props.labelName + "freqNumRange", value: this.state.val, type: "range", min: Number(Math.log(this.props.min + 1) / Math.log(this.props.max)), max: 1, step: "any", onChange: this.handleChange }),
                React.createElement("input", { id: this.props.labelName + "freqNumInput", value: this.state.num, type: "text", onChange: this.handleNumChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this32.handleNumFreqChange();
                        }
                    } }),
                React.createElement(
                    "span",
                    { id: this.props.labelName + "logSliderFreqTip", className: "tooltiptext" },
                    this.props.tooltipText
                )
            );
        }
    }]);

    return LogSlider;
}(React.Component);

var TextInput = function (_React$Component21) {
    _inherits(TextInput, _React$Component21);

    function TextInput(props) {
        _classCallCheck(this, TextInput);

        var _this33 = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, props));

        _this33.state = {
            val: _this33.props.defaultVal
        };

        _this33.handleChange = _this33.handleChange.bind(_this33);
        _this33.handleNumSubmit = _this33.handleNumSubmit.bind(_this33);
        return _this33;
    }

    _createClass(TextInput, [{
        key: "handleChange",
        value: function handleChange(event) {
            if (isNaN(event.target.value) && event.target.value != "0.") {
                return;
            }
            this.setState({
                val: event.target.value
            });
        }
    }, {
        key: "handleNumSubmit",
        value: function handleNumSubmit() {
            var temp = this.state.val;
            if (temp > this.props.max) {
                temp = this.props.max;
                this.setState({ val: this.props.max });
            } else if (temp < this.props.min) {
                temp = this.props.min;
                this.setState({ val: this.props.min });
            }
            this.props.onSubmit(this.props.tooltipText, Number(temp));
        }
    }, {
        key: "render",
        value: function render() {
            var _this34 = this;

            return React.createElement(
                "label",
                { id: this.props.labelName + "inputLabel", className: "tooltip" },
                React.createElement("input", { value: this.state.val, type: "text", onChange: this.handleChange, onKeyPress: function onKeyPress(event) {
                        if (event.key == "Enter") {
                            _this34.handleNumSubmit();
                        }
                    } }),
                React.createElement(
                    "span",
                    { id: this.props.labelName + "Tip", className: "tooltiptext" },
                    this.props.tooltipText
                )
            );
        }
    }]);

    return TextInput;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("App"));