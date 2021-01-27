
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
            list: [...state.list, <Area key={"area" + this.state.count}/>],
            count: state.count + 1
        }));
    };

    render(){
        return(
            <div id="mainDiv">
                <button id="centerBtn" onClick={this.handleClick}>Add Area</button>
                {this.state.list}
                <Area />
            </div>
        )
    }

    componentDidMount(){
        let test = document.getElementsByName("drag")
        console.log(test.length);
        for(let item of test){
            dragElement(item);
        }
    }

    componentDidUpdate(){
        let test = document.getElementsByName("drag")
        console.log(test.length);
        for(let item of test){
            dragElement(item);
        }
    }
}

class Area extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div name="drag" className="drag dragDiv"></div>
        )
    }
}


function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

ReactDOM.render(<App />, document.getElementById("App"));