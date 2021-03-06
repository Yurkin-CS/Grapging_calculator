//Make error handling

class FunctionOfX{
    constructor(functionStr, orderNumber, color){
        if(!functionOfX){
            console.log(functionOfX)
            this.functionOfX = (x) => {
                return 0;
            }
        }
        else{
            this.functionOfX = (x) => { 
                console.log(functionStr);
                let yStr = turnStringIntoFunctionOfX(functionStr).replaceAll(/x/ig, x);
                
                let y = eval(yStr); 
                return y;
            }
        }

        this.orderNumber = orderNumber;
        this.color = color;
    }

    changeFunctionOfX(functionStr){
        console.log(functionStr)
        if(!functionStr){
            this.functionOfX = (x) => {
                return 0;
            }
            return;
        }


        this.functionOfX = (x) => { 
            let yStr = turnStringIntoFunctionOfX(functionStr).replace(/x/ig, x);
            let y = eval(yStr);
            return y;
        }
    }

    changeOrderNumber(newOrderNumber){
        this.orderNumber = newOrderNumber;
    }

    changeColor(newColor){
        this.color = newColor;
    }
}


//---Variables---//
const graphingCalculator = document.getElementById("graphingCalculator");
const functionsForm = document.getElementById("functionsForm");
const addFunctionButton = functionsForm.querySelector("#addFunctionButton");
let functionForms = functionsForm.querySelectorAll("div");

const scaleInput = document.getElementById("scaleInput");
const graphDisplay = document.getElementById("graphDisplay");
const graphContainer = document.getElementById("graphContainer");
const graphXMarkup = document.getElementById("graphXMarkup");
const markupXPoints = document.getElementById("markupXPoints");
const graphYMarkup = document.getElementById("graphYMarkup");
const markupYPoints = document.getElementById("markupYPoints");

const xAxis = document.createElement("div");
const yAxis = document.createElement("div");

let x;
let y;
let scale = 1; //The bigger the scale the tinier change of x
let step = 0.1 / scale;
let lineThikness = 1;
let unitSizeInPixels = 20; //distance of one unit of coordinates

const originCoords = {x: graphDisplay.offsetWidth / 2, y: graphDisplay.offsetHeight / 2 };
const originOffset = {x: 0, y: 0};
const originMovedBy = {x: 0, y: 0};
const graphContainerDimentions = {width: 520, height: 520};
const markupOffset = {xMarkup: 0, yMarkup: 0};
const colors = ["blue", "red", "green", "purple", "orange"];

const functions = [new FunctionOfX("x^2", 0, colors[0])];

const graphFieldRange = {
    x: {l: -graphDisplay.offsetWidth / (2 * unitSizeInPixels), h: graphDisplay.offsetWidth / (2 * unitSizeInPixels)},
    y: {l: -graphDisplay.offsetHeight / (2 * unitSizeInPixels), h: graphDisplay.offsetHeight / (2 * unitSizeInPixels)},
};
const graphRange = {l: -20, h: 20};

//---------------//


startTheCalculator();


//---Functions---//

function startTheCalculator(){
    //---Initial start set---//

    xAxis.id = "xAxis";
    yAxis.id = "yAxis";

    addFunctionButton.onclick = handleInputAdd;
    scaleInput.onchange = handleScale;

    graphDisplay.onmousedown = handleGraphDisplayDragStart;
    graphDisplay.onmouseup = handleGraphDisplayDragEnd;

    prepareInputs();
    renderMarkup();
    drawGraph(graphRange);
}

function prepareInputs(){
    functionForms = functionsForm.querySelectorAll(".functionInputForm");

    for(let i = 0; i < functionForms.length; i++){
        functionForms[i].querySelector(".functionInput").onchange = (event) => handleFunctionInputChange({event, orderNumber: i});
        functionForms[i].querySelector(".colorIndicator").style.background = colors[i];
        functionForms[i].querySelector(".removeFunctionButton").onclick = (event) => handleInputRemove({event, orderNumber: i});
        functionForms[i].setAttribute("ordernumber", i);
        functionForms[i].placeholder = i;
    }

    for(let i = 0; i < functions.length; i++){
        functions[i].orderNumber = i;
        functions[i].color = colors[i];
    }
}

function handleInputAdd(event){
    event.preventDefault();

    if(functionForms.length > 5){
        return;
    }

    const functionInputForm = document.createElement("div");
    const functionInput = document.createElement("input");
    const colorIndicator = document.createElement("div");
    const removeFunctionButton = document.createElement("button");
    const orderNumber = functionForms.length;
    const color = colors[orderNumber];
    let newFunctionOfX = new FunctionOfX("0", orderNumber, color);
    functions.push(newFunctionOfX);
    
    functionInputForm.classList.add("functionInputForm");
    functionInput.classList.add("functionInput");
    colorIndicator.classList.add("colorIndicator");
    removeFunctionButton.classList.add("removeFunctionButton");
    functionInputForm.setAttribute("ordernumber", orderNumber);
    colorIndicator.style.background = color;
    removeFunctionButton.textContent = "-";

    functionInput.onchange = (event) => handleFunctionInputChange({event, orderNumber});;
    removeFunctionButton.onclick = (event) => handleInputRemove({event, orderNumber});
    functionInputForm.append(functionInput, colorIndicator, removeFunctionButton);
    functionsForm.insertBefore(functionInputForm, addFunctionButton);
    functionForms = functionsForm.querySelectorAll(".functionInputForm")
}

function handleInputRemove({event, orderNumber}){
    event.preventDefault();
    for(let i = 0; i < functionForms.length; i++){
        if(functionForms[i].getAttribute("ordernumber") == orderNumber){
            functionForms[i].remove();
        }
    }
//
    for(let i = 0; i < functions.length; i++){
        if(functions[i].orderNumber == orderNumber){
            functions.splice(i, 1);
        }
    }
    prepareInputs();
    drawGraph(graphRange);
    //console.log("removing", functionForms, functions);
}

function functionOfX(x, functionOfX = "x*2"){
    //turn func to x
    let replacedFunc = functionOfX.replace("x", x);

    return eval(replacedFunc);
    //return 1/x; //x**2/*x^3*///x**2 //1/x ? 1/x : null;//x**2 ? x**2 : null;
}


function handleFunctionInputChange({ event, orderNumber }){
    let stringFunc = event.target.value;

    for(let i = 0; i < functions.length; i++){
        if(functions[i].orderNumber == orderNumber){
            functions[i].changeFunctionOfX(stringFunc);
        }
    }

    drawGraph(graphRange);
}

function turnStringIntoFunctionOfX(stringFunc){
    let func = stringFunc;
    func = func.replaceAll("x", "(x)"); //Parenthesis are used to avoid a problem -x^n (Syntax error)
    func = func.replaceAll("^", "**");
    func = func.replaceAll("sin", "Math.sin");
    func = func.replaceAll("cos", "Math.cos");
    func = func.replaceAll("tan", "Math.tan");
    func = func.replaceAll("lg", "Math.log10");
    func = func.replaceAll("ln", "Math.log");
    func = func.replaceAll("e", "Math.E");

    return func;
}

function handleGraphDisplayDragStart(event){
    //show coord of clicked point
    const dragStartCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    graphDisplay.onmousemove = (event) =>  handleOriginOffsetChange({event, dragStartCoords});
}

function handleGraphDisplayDragEnd(event){
    graphDisplay.onmousemove = null;
}

function handleOriginOffsetChange({ event, dragStartCoords}){
    if(event.target.classList[0] == "graphPoint"){ //When druring drag mouse on graph
        return;
    }

    const dragEndCoords = { x: event.clientX - event.target.offsetLeft, y:event.clientY - event.target.offsetTop /*offetLeft/Top are relatevely to parent (#graphingCalculator)*/};
    const movedBy = {x: dragEndCoords.x - dragStartCoords.x, y: dragEndCoords.y - dragStartCoords.y };
    originMovedBy.x = movedBy.x /// scale;
    originMovedBy.y = movedBy.y /// scale;

    //need to set new start point after each time event fires cause it always take coords of dragging start
    originOffset.x += (originMovedBy.x); //You can inverse the drag
    originOffset.y += (-originMovedBy.y);  //You can inverse the drag
    originMovedBy.x = 0;
    originMovedBy.y = 0;

    dragStartCoords.x = dragEndCoords.x; //Setting coords so that i't a new refference point
    dragStartCoords.y = dragEndCoords.y; //Setting coords so that i't a new refference point

    graphContainer.style.marginLeft = `${originOffset.x}px`;    
    graphContainer.style.marginTop = `${-1 *originOffset.y}px`;
    
    positionTheMarkup(movedBy);

    if(graphContainerDimentions.width / 2 - Math.abs(originOffset.x) < 250 && graphContainerDimentions.width < 5000){  //5000 is the field dimentions limit
        graphRange.l *= 1.8; //Increase field size when reaching the edge
        graphRange.h *= 1.8; //Increase field size when reaching the edge
        drawGraph(graphRange);
    }

    if(graphContainerDimentions.height / 2 - Math.abs(originOffset.y) < 250 && graphContainerDimentions.height < 5000){ //5000 is the field dimentions limit
        graphRange.l *= 1.8; // Increase field size when reaching the edge
        graphRange.h *= 1.8; // Increase field size when reaching the edge
        drawGraph(graphRange);
    }

    //change background position too
    //markupXPoints.style.marginLeft = `${originOffset.x * scale}px`;
    //markupYPoints.style.marginTop = `${-1 * originOffset.y * scale}px`;
    //drawGraph(functionOfX, graphRange);
}


function handleScale(event){
    if(parseInt(event.target.value) > 0){
        scale = parseInt(event.target.value);
    }
    else if(parseInt(event.target.value) < 0){
        scale = parseFloat(1 / (-1 * parseInt(event.target.value)));
    }
    
    unitSizeInPixels = 20 * scale;
    step = step / scale > 0.1 ?  parseFloat((0.1 / scale).toFixed(2)) : 0.1;//.toFixed(1)); //> 0.01 ? 1/scale : 0.01;

    renderMarkup();
    drawGraph(graphRange);
}


function drawGraph(graphRange){
    graphContainer.textContent = ""; 
    updateGraphContainerDimentions();
    updateOriginCoordinates();

    graphContainer.appendChild(xAxis);
    graphContainer.appendChild(yAxis);

    for(let i = graphRange.l; i <= graphRange.h; i += step){
        for(let j = 0; j < functions.length; j++){
            const newPoint = document.createElement("div");
            newPoint.classList.add("graphPoint");
            x = i;
            y = -1 * functions[j].functionOfX(x); //functionOfX(x);

            if(!y || y === -Infinity || y === Infinity) continue; 
            x *= unitSizeInPixels;
            y *= unitSizeInPixels; 
    
            x += originCoords.x;
            y += originCoords.y;
    
            newPoint.style.cssText = `left: ${x}px; top: ${y}px; background: ${functions[j].color}`;
            graphContainer.appendChild(newPoint);
    
            //rotation and tangents
            if(i < graphRange.h){
                let followPoint = functions[j].functionOfX(i + step) * unitSizeInPixels; //functionOfX(i + step) * unitSizeInPixels;
                let xDist = step * unitSizeInPixels;
                let yDist = followPoint - functions[j].functionOfX(i) * unitSizeInPixels; //functionOfX(i) * unitSizeInPixels;
                let length = 0;
                let rotationAngle = Math.atan(yDist / xDist);
        
                rotationAngle *= -1;
    
                length = Math.hypot(yDist, xDist);
                newPoint.style.width = `${length + 1}px`;
                newPoint.style.height = `${lineThikness}px`;
                newPoint.style.transform = `rotate(${rotationAngle * 57.296}deg)`;
            }
        }
    }

    xAxis.style.top =  `${originCoords.x}px`;
    yAxis.style.left = `${originCoords.y}px`;
}

function renderMarkup(){
    markupXPoints.textContent = "";
    markupYPoints.textContent = "";
    for(let i = graphFieldRange.x.l, j = -400; i <= graphFieldRange.x.h, j <= 400; i += step, j++ ){
        let newMarkXPoint = document.createElement("span");
        newMarkXPoint.className = "markXPoint";
        newMarkXPoint.textContent = (j / scale).toFixed(1);           
        newMarkXPoint.style.width = `${/*unitSizeInPixels*/ 20}px`;

        markupXPoints.appendChild(newMarkXPoint);
        markupXPoints.style.marginLeft = `${originOffset.x}px`;
    }

    for(let i = graphFieldRange.y.h, j = 400; i >= graphFieldRange.y.l, j >= -400; i -= step, j-- ){
        let newMarkYPoint = document.createElement("span");
        newMarkYPoint.className = "markYPoint";
        newMarkYPoint.textContent = (j / scale).toFixed(1);        
        newMarkYPoint.style.height = `${/*unitSizeInPixels*/ 20}px`;

        markupYPoints.appendChild(newMarkYPoint);
    }
}

function positionTheMarkup(movedBy){
    markupOffset.xMarkup += movedBy.x;
    markupOffset.yMarkup += movedBy.y;
    markupXPoints.style.marginLeft = `${markupOffset.xMarkup}px`;
    markupYPoints.style.marginTop = `${markupOffset.yMarkup}px`;
}

function centerCurrentPoint(timesDifferenceFromPrevious){
    let generalOffset = ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) - ((Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale) / (timesDifferenceFromPrevious);
    originOffset.x -= generalOffset;
    originOffset.y += generalOffset;
}

function updateOriginCoordinates(){    
    originCoords.x = graphContainer.offsetWidth / 2;
    originCoords.y = graphContainer.offsetHeight / 2;
}

function updateGraphContainerDimentions(){
    graphContainerDimentions.width = (Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale;
    graphContainerDimentions.height = (Math.abs(graphRange.l) + Math.abs(graphRange.h)) * unitSizeInPixels * scale;

    graphContainerDimentions.width = graphContainerDimentions.width > 520 ? graphContainerDimentions.width : 520;
    graphContainerDimentions.height = graphContainerDimentions.height > 520 ? graphContainerDimentions.height : 520;

    graphContainerDimentions.width = graphContainerDimentions.width < 12800 ? graphContainerDimentions.width : 12800;
    graphContainerDimentions.height = graphContainerDimentions.height < 12800 ? graphContainerDimentions.height : 12800;

    graphContainer.style.width = `${graphContainerDimentions.width}px`;
    graphContainer.style.height = `${graphContainerDimentions.height}px`;

}

//-------------//