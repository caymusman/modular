let Draggable = require('react-draggable');

class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: new Map(),
        }
        this.handleClick=this.handleClick.bind(this);
        this.handleClose=this.handleClose.bind(this);
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

    render(){
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        return(
            <div id="mainDiv">
                <svg id="patchCords"></svg>
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
    }

    handleClose(){
        this.props.handleClose(this.props.myKey);
    }
    //Close on press of X icon. Pass key up to App and remove from state.list


    render(){
        
        return(
                <div className="moduleDiv"
                    >
                    <i className="fa fa-times" aria-hidden="true" onClick={this.handleClose}></i>
                    <p id="modTitle">{this.props.name}</p>
                    <div id="innerModDiv">
                        {this.props.filling}
                    </div>
                        
                </div>
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
                <InputCord />
                <OutputCord />
            </div>
        )
    }
}

class InputCord extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="cordOuter" id="inputOuter">
                <div className="cordInner" id="inputInner">
                </div>
            </div>
        )
    }
}

class OutputCord extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="cordOuter" id="outputOuter">
                <div className="cordInner" id="outputInner">
                </div>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById("App"));

