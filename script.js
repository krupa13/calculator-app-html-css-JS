//* Access the DOM elements of the calculator
const inputBox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');

//* define expression and result variable
let expression = '';
let result = '';

//* Define event handler for button click
function buttonClick(event) {
    //* Get values from the clicked button
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;
    // console.log(target, action, value);

    //* Switch to control the calculator
    switch(action) {
        case 'number':
            addValue(value);
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
        //* Add the result to the expression as a starting point if expression is empty
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division': 
            if(expression === '' && result !== '') {
                startFromResult(value);
            } 
            //* If the expression isn't empty & the last character in the expression isn't an operator
            //*  then add that operator to the expression
            else if(expression !== '' && !lastCharOperator()) {
                addValue(value);
            }
            break;
        case 'submit':
            submit();
            break;
        case 'negate':
            negate();
            break;
        case 'mod':
            percentage();
            break;
        case 'decimal':
            decimal(value);
            break;
    }

    //* Update the Display
    updateDisplay(expression, result);
}

inputBox.addEventListener('click', buttonClick);

function addValue(value) {
    if(value === '.') {
        //* Find the index of the last operator in the expression
        const lastOperatorIndex = expression.search(/[+\-*/]/);
        //* Find the index of the last decimal in the expression
        const lastDecimalIndex = expression.lastIndexOf('.');
        //* Find the index of the last number in the expression
        const lastNumberIndex = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
        );
        //* Check if this is the first decimal in the current number or if the expression is empty
        if(
            (lastDecimalIndex < lastOperatorIndex || 
                lastDecimalIndex < lastNumberIndex ||
                lastDecimalIndex === -1
            ) && (
                expression === '' || expression.slice(lastNumberIndex + 1).indexOf('-') === -1
            )
        ) {
            expression += value;
        }
    } else {
        expression += value;
    }
}

function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
}

function clear() {
    expression = '';
    result = '';
}

function backspace() {
    expression = expression.slice(0, -1);
}

function lastCharOperator() {
    //* If the last value is not a number then we're returing true, or else false
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
    expression += result + value;
}

function submit() {
    result = evaluateExpression();
    expression = '';
}

function evaluateExpression() {
    const evalResult = eval(expression);
    //* check if the evalResult isNAN or infinite. If it is, return a space character '  '
    return isNaN(evalResult) || !isFinite(evalResult) 
    ? ' '
    : evalResult < 1
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(2));
}

function negate() {
    //* Negate the result if expression is empty and result is present
    if(expression === '' && result !== '') {
        result = -result;
    }
    //* Toggle the sign of the expression if its not already negative and its not empty
    else if(!expression.startsWith('-') && expression !== '') {
        expression = '-' + expression;
    }
    //* Remove the negative sign  from the expression if its already exists
    else if(expression.startsWith('-')) {
        expression = expression.slice(1);
    }
}

function percentage() {
    //* Evaluate the expression, else it will take the percentage of only the first number
    if(expression !== '') {
        result = evaluateExpression();
        expression = '';

        if(!isNaN(result) && isFinite(result)) {
            result /= 100;
        } else {
            result = '';
        }
    } else if(result !== '') {
        //* If the expression is empty but the result exists, divide by 100       
        result = parseFloat(result) / 100;
    }
}

function decimal(value) {
    if(!expression.endsWith('.') && !isNaN(expression.slice(-1))) {
        addValue(value);
    }
}