let Draggable = require('react-draggable');

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: new Map(),
            patchCords: [],
            cordCount: 0,
            outputMode: false
        }
        this.handleClick=this.handleClick.bind(this);
        this.handleClose=this.handleClose.bind(this);

        this.addCord=this.addCord.bind(this);
        this.handlePatchExit=this.handlePatchExit.bind(this);
        this.handleOutput=this.handleOutput.bind(this);
        this.deleteCord=this.deleteCord.bind(this);
    }

    //Passed to SideButtons to control which buttons are added to PlaySpace
    handleClick(childKey, childJSX){
        this.setState((state) => ({
            list: new Map(state.list.set(childKey, <Area 
                                                        key={childKey} 
                                                        myKey={childKey}
                                                        filling={childJSX} 
                                                        name={childKey.split(" ")[0]}
                                                        handleClose={this.handleClose}
                                                        outputMode={this.state.outputMode} 
                                                        addPatch={this.addCord} 
                                                        handleOutput={this.handleOutput}
                                                        />)) ,
        }));
    };

    //Passed to Area to control which modules are removed from PlaySpace
    handleClose(childKey){
        let newMap = new Map(this.state.list);
        newMap.delete(childKey);
        this.setState((state) => ({
            list: newMap
        }))
    }

    handlePatchExit(){
        this.setState({
            outputMode: false
        })
    }

    addCord(info){
        this.setState((state) => ({
            patchCords: [...state.patchCords, {id: "cord" + this.state.cordCount, inputData: info, outputData: null}],
            cordCount: state.cordCount + 1,
            outputMode: true
        }))
    }

    handleOutput(info){
        if(this.state.outputMode){
            let newCords = [...this.state.patchCords];
            let outData = "outputData";
            newCords[this.state.cordCount - 1][outData]=info;
            this.setState((state) => ({
                patchCords: newCords
            }));

            this.setState({
                outputMode: false
            })
        }
    }

    deleteCord(cordID){
        let newArr = [...this.state.patchCords];
        this.setState(state => ({
            patchCords: newArr.filter(el => {
                return el.id !== cordID;
            }),
            cordCount: state.cordCount - 1
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
                <svg id="patchCords">{cords}</svg>
                <div id="logo"></div>
                <div id="header"></div>
                <div id="sidebar">
                    <SideButtons 
                                id="sideButtons" 
                                handleClick={this.handleClick}/> 
                </div>
                <div id="playSpace">
                {[...this.state.list].map((entry) => {
                        let key = entry[0];
                        let value = entry[1];
                        return <Draggable key={key} handle="p" {...dragHandlers} bounds="parent"><div className="dragDiv">{value}</div></Draggable>
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

        this.state={
            clicked: false
        }
    }

    handleClose(){
        this.props.handleClose(this.props.myKey);
    }
    //Close on press of X icon. Pass key up to App and remove from state.list

    handleCreatePatch(){
        if(!this.state.clicked){
            let el = document.getElementById(this.props.myKey + "inputInner").getBoundingClientRect();
            let x = el.x;
            let y = el.y;
            let bottom = el.bottom;
            let right = el.right;
            let xCenter = (right - x) / 2 + x;
            let yCenter = (bottom - y) / 2 + y;
            this.props.addPatch({fromModID: this.props.myKey,
                             fromLocation: {x: xCenter, y: yCenter}});
            }
        this.setState((state) => ({clicked: !state.clicked}));
    }

    handleOutput(){
        let el = document.getElementById(this.props.myKey + "outputInner").getBoundingClientRect();
        let x = el.x;
        let y = el.y;
        let bottom = el.bottom;
        let right = el.right;
        let xCenter = (right - x) / 2 + x;
        let yCenter = (bottom - y) / 2 + y;
        
        this.props.handleOutput({tomyKey: this.props.myKey,
                                 toLocation: {x: xCenter, y: yCenter}});
        }


    render(){
        
        return(
                <div className="moduleDiv"
                    >
                    <i className="fa fa-times" aria-hidden="true" onClick={this.handleClose}></i>
                    <p id="modTitle">{this.props.name}</p>
                    <div id="innerModDiv">
                        {this.props.filling}
                    </div>
                    <div className="cordOuter" id="inputOuter" onClick={this.handleCreatePatch}>
                        <div className="cordInner" id={this.props.myKey + "inputInner"}>
                        </div>
                    </div>
                    <div className="cordOuter" id="outputOuter" onClick={this.handleOutput}>
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

class MyButton extends React.Component{
    constructor(props){
        super(props);

        this.state={
            count: 0
        }

        this.handleClick=this.handleClick.bind(this);
    }

    //Return up to App a new module to be added to the play area.
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

