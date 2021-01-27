
class App extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            list: [],
            count: 0
        }
        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(){
        this.setState((state) => ({
            list: [...state.list, <Area key={"area" + this.state.count} filling={<Filling />}/>],
            count: state.count + 1
        }));
    };

    render(){
        return(
            <div id="mainDiv">
                <button id="centerBtn" onClick={this.handleClick}>Add Area</button>
                {this.state.list}
            </div>
        )
    }
}

class Area extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            top: '2%',
            left: '2%'
        }
        this.handleDrag=this.handleDrag.bind(this);
    }

    handleDrag(e) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        e.preventDefault();
        e.persist();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        this.setState({
            top: (this.offsetTop - pos2) + "px",
            left:(this.offsetLeft - pos1) + "px"
        });
    }

    render(){
        return(
            <div 
                draggable="true"
                name="drag" 
                className="drag dragDiv"
                onDrag={this.handleDrag}
                style={{left: this.state.left}, {top: this.state.top}}
                >
                {this.props.filling}
            </div>
        )
    }
}

class Filling extends React.Component{
    constructor(props){
        super(props);

        this.handleMove=this.handleMove.bind(this);
    }

    handleMove(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("Moved");
    }

    render(){
        return(
            <div id="fillingDiv">
                <input type="range" min='-1' max='1' step='.1' onClickCapture={this.handleMove}/>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("App"));

