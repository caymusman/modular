let Draggable = require('react-draggable');

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: new Map(),
            patchCords: [],
            currentCordCount: 0,
            cumulativeCordCount: 0,
            outputMode: false,
            cordCombos: {}
        }
        this.handleClick=this.handleClick.bind(this);
        this.handleClose=this.handleClose.bind(this);

        this.addCord=this.addCord.bind(this);
        this.handlePatchExit=this.handlePatchExit.bind(this);
        this.handleOutput=this.handleOutput.bind(this);
        this.deleteCord=this.deleteCord.bind(this);
        this.handleDrag=this.handleDrag.bind(this);
        this.handleComboDelete=this.handleComboDelete.bind(this);
    }

    //Passed to SideButtons to control which buttons are added to PlaySpace
    handleClick(childKey, childJSX){
        if(this.state.outputMode){
            this.handlePatchExit();
        }
        let newCombos = {...this.state.cordCombos, [childKey]: []};
        this.setState((state) => ({
            list: new Map([...state.list, [childKey, {myKey: childKey,
                                                    filling: childJSX,
                                                    name:childKey.split(" ")[0]}]]),
            cordCombos: newCombos
        }));
    };

    //Passed to Area to control which modules are removed from PlaySpace
    handleClose(childKey){
        let newMap = new Map(this.state.list);
        newMap.delete(childKey);

        //need to delete all patchcords attached to it, and disconnect all audio streams.
        let newCords = [...this.state.patchCords];
        let finCords = [...this.state.patchCords];
        let minCount = 0;
        let newCombos = {...this.state.cordCombos};
        newCords.forEach(el => {
            if(el.inputData.fromModID == childKey){
                let val = finCords.indexOf(el);
                finCords.splice(val, 1);
                minCount++;
                }
            if(el.outputData.tomyKey == childKey){
                let val = finCords.indexOf(el);
                finCords.splice(val, 1);
                minCount++;

                newCombos[el.inputData.fromModID].splice(newCombos[el.inputData.fromModID].indexOf(childKey), 1);
            }
            })

        //delete property from cordCombos object    
        delete newCombos[childKey];


        this.setState(state => ({
            list: newMap,
            patchCords: finCords,
            currentCordCount: state.currentCordCount - minCount,
            cordCombos: newCombos
        }))
    }

    //click X to not make patch cord after input click
    handlePatchExit(){
        let newCords = [...this.state.patchCords];
        let popped = newCords.pop();
        this.setState(state => ({
            currentCordCount: state.currentCordCount - 1,
            cumulativeCordCount: state.cumulativeCordCount - 1,
            outputMode: false,
            patchCords: newCords
        }))
    }

    //add initial patch cord data upon input click
    addCord(info){
        this.setState((state) => ({
            patchCords: [...state.patchCords, {id: "cord" + this.state.cumulativeCordCount, inputData: info, outputData: null}],
            currentCordCount: state.currentCordCount + 1,
            cumulativeCordCount: state.cumulativeCordCount + 1,
            outputMode: true
        }))
    }

    //add output data to fully formed patch cords
    handleOutput(info){
        if(this.state.outputMode){
            let newCords = [...this.state.patchCords];
            let outData = "outputData";
            let lastEl = newCords[this.state.currentCordCount-1];
            let fromMod = lastEl.inputData.fromModID;
            console.log(fromMod);
            console.log(this.state.cordCombos[fromMod]);
            if(fromMod == info.tomyKey){
                alert("You can't plug a module into itself!");
                this.handlePatchExit();
            }else if(this.state.cordCombos[fromMod].includes(info.tomyKey)){
                alert("You've already patched this cord!");
                this.handlePatchExit();
            }else{
                lastEl[outData]=info;
                let newCombo = {...this.state.cordCombos};
                newCombo[fromMod].push(info.tomyKey);
                this.setState((state) => ({
                    patchCords: newCords,
                    cordCombos: newCombo
             }));

             this.setState({
                    outputMode: false
             })
            }
        }
    }

    
    deleteCord(cordID){
        let newArr = [...this.state.patchCords];
        this.setState(state => ({
            patchCords: newArr.filter(el => {
                return el.id !== cordID;
            }),
            currentCordCount: state.currentCordCount - 1,
        }))
    }

    handleComboDelete(cordID){
        const cordVal = this.state.patchCords.find(val => val.id == cordID);
        let fromCombo = cordVal.inputData.fromModID;
        let newCombo = {...this.state.cordCombos};
        newCombo[fromCombo].splice(newCombo[fromCombo].indexOf(cordVal.outputData.tomyKey), 1);
        this.setState({
            cordCombos: newCombo
        })
    }

    //redraw cords when module is dragged
    handleDrag(modID){
        let largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
        let newCords = [...this.state.patchCords];
        newCords.forEach(el => {
            if(el.inputData.fromModID == modID){ 
                let in_el = document.getElementById(modID + "inputInner").getBoundingClientRect();
                let in_x = in_el.x;
                let in_y = in_el.y;
                let in_bottom = in_el.bottom;
                let in_right = in_el.right;
                let in_xCenter = ((in_right - in_x) / 2 + in_x) - (largerDim * .04);
                let in_yCenter = ((in_bottom - in_y) / 2 + in_y) - (largerDim * .04);
                el.inputData.fromLocation = {x: in_xCenter, y: in_yCenter}
            }else if(el.outputData.tomyKey == modID){
                let out_el = document.getElementById(modID + "outputInner").getBoundingClientRect();
                let out_x = out_el.x;
                let out_y = out_el.y;
                let out_bottom = out_el.bottom;
                let out_right = out_el.right;
                let out_xCenter = ((out_right - out_x) / 2 + out_x) - (largerDim * .04);
                let out_yCenter = ((out_bottom - out_y) / 2 + out_y) - (largerDim * .04);
                el.outputData.toLocation = {x: out_xCenter, y: out_yCenter}
            }
        });

        this.setState(state => ({
            patchCords: newCords
        }))
    }


    render(){
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        let cords = []; //loop through the cords in the state, add line version to this array
        let tempArr = [...this.state.patchCords];
        tempArr.forEach(el => {
            if(el['outputData']){
                cords.push(<Cord deleteCord={this.deleteCord} key={el.id} id={el.id} x1={el.inputData.fromLocation.x} y1={el.inputData.fromLocation.y} x2={el.outputData.toLocation.x} y2={el.outputData.toLocation.y}></Cord>)
            }
        })
        return(
            <div id="mainDiv">
                <div id="logo"></div>
                <div id="header"></div>
                <div id="sidebar">
                    <SideButtons 
                                id="sideButtons" 
                                handleClick={this.handleClick}/> 
                </div>
                <div id="playSpace">
                    <svg id="patchCords">{cords}</svg>

                    <i 
                        id="patchExit" 
                        onClick={this.handlePatchExit}
                        className={this.state.outputMode ? "show fa fa-times-circle" : "hide fa fa-times-circle"} 
                        aria-hidden="true"></i>

                {[...this.state.list].map(([key, {myKey, filling, name}]) => {
                        return <Draggable onDrag={() => {this.handleDrag(key)}} key={key} handle="p" {...dragHandlers} bounds="parent">
                                    <div className="dragDiv">
                                        <Area 
                                                        key={myKey} 
                                                        myKey={myKey}
                                                        filling={filling} 
                                                        name={name}
                                                        handleClose={this.handleClose}
                                                        outputMode={this.state.outputMode}
                                                        addPatch={this.addCord} 
                                                        handleOutput={this.handleOutput}
                                                        />
                                    </div></Draggable>
                    })}
                </div>
            </div>
        )
    }
}


//Create a draggable module with filling that changes based on which button you press to create module.
class Area extends React.Component{
    constructor(props){
        super(props);

        this.handleClose=this.handleClose.bind(this);
        this.handleCreatePatch=this.handleCreatePatch.bind(this);
        this.handleOutput=this.handleOutput.bind(this);
    }

    //Close on press of X icon. Pass key up to App and remove from state.list
    handleClose(){
        this.props.handleClose(this.props.myKey);
    }

    //handle first click in input area
    handleCreatePatch(){
        if(!this.props.outputMode){
            let largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
            let el = document.getElementById(this.props.myKey + "inputInner").getBoundingClientRect();
            let x = el.x;
            let y = el.y;
            let bottom = el.bottom;
            let right = el.right;
            let xCenter = ((right - x) / 2 + x) - (largerDim * .04);
            let yCenter = ((bottom - y) / 2 + y) - (largerDim * .04);
            this.props.addPatch({fromModID: this.props.myKey,
                             fromLocation: {x: xCenter, y: yCenter}});
            }
    }

    //handle patchcord click in output area
    handleOutput(){
        let largerDim = window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth;
        let el = document.getElementById(this.props.myKey + "outputInner").getBoundingClientRect();
        let x = el.x;
        let y = el.y;
        let bottom = el.bottom;
        let right = el.right;
        let xCenter = ((right - x) / 2 + x) - (largerDim * .04);
        let yCenter = ((bottom - y) / 2 + y) - (largerDim * .04);
        
        this.props.handleOutput({tomyKey: this.props.myKey,
                                 toLocation: {x: xCenter, y: yCenter}});
        }


    render(){
        return(
                <div className="moduleDiv"
                    >

                    <p id="modTitle">
                        <i className="fa fa-times" aria-hidden="true" onClick={this.handleClose}></i>{
                        this.props.name}
                    </p>

                    {/*eventually will be unique module fillings*/}
                    <div id="innerModDiv">
                        {this.props.filling}
                    </div>

                    {/*input patch cords area*/}
                    <div className={this.props.outputMode ? "cordOuter hide" : "cordOuter show interactive"} 
                         id="inputOuter" onClick={this.handleCreatePatch}>
                            <div className="cordInner" id={this.props.myKey + "inputInner"}>
                            </div>
                    </div>
                    {/*output patch cords area*/}
                    <div className={this.props.outputMode ? "cordOuter show raise interactive" : "cordOuter show"} 
                         id="outputOuter" onClick={this.handleOutput}>
                            <div className="cordInner" id={this.props.myKey + "outputInner"}>
                            </div>
                    </div>       
                </div>
        )
    }
}

//Filling belongs to SideButtons to render the inner part of each Area
class Filling extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div id="fillingDiv">
                <input type="range" min='-1' max='1' step='.1'/>
                <button>On</button>
            </div>
        )
    }
}

//patchcords with delete capability
class Cord extends React.Component{
    constructor(props){
        super(props);

        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(){
        this.props.deleteCord(this.props.id);
    }

    render(){
        return(
            <line 
                x1={this.props.x1} 
                y1={this.props.y1} 
                x2={this.props.x2} 
                y2={this.props.y2}
                onClick={this.handleClick}></line>
        )
    }
}

//sidebar with buttons for creation
class SideButtons extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id={this.props.id}>
                <MyButton name="TestButton" handleClick={this.props.handleClick}/>
                <MyButton name="AnotherTest" handleClick={this.props.handleClick}/>
                <MyButton name="Poopoop" handleClick={this.props.handleClick}/>
                <MyButton name="PeePee" handleClick={this.props.handleClick}/>
            </div>
        )
        
    }
}

//buttons in side area that create modules for the playspace
class MyButton extends React.Component{
    constructor(props){
        super(props);

        this.state={
            count: 0
        }

        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(){
        this.props.handleClick(this.props.name + " " + this.state.count, <Filling name={this.props.name}/>)
        this.setState((state) => ({
            count: state.count + 1
        }))
    }


    render(){
        return(
            <button className="addBtn" onClick={this.handleClick}>{this.props.name}</button>
        )
    }
}


ReactDOM.render(<App />, document.getElementById("App"));

