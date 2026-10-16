
"use strict";

const display = document.getElementById("display");
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const decimalButton = document.getElementById("decimal");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const equalsButton = document.getElementById("equals");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let finishedCalculation = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    finishedCalculation = false;
    updateDisplay();
}

function enterNumber(number) {
    if (currentInput === "Error") {
        clearCalculator();
    }

    if (waitingForSecondNumber || finishedCalculation) {
        currentInput = number;
        waitingForSecondNumber = false;
        finishedCalculation = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

function enterDecimal() {
    if (currentInput === "Error") {
        clearCalculator();
    }

    if (waitingForSecondNumber || finishedCalculation) {
        currentInput = "0.";
        waitingForSecondNumber = false;
        finishedCalculation = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function calculate(a, b, operation) {
    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return b === 0 ? null : a / b;
        default:
            return null;
    }
}

function formatResult(result) {
    if (result === null || !Number.isFinite(result)) {
        currentInput = "Error";
    } else {
        currentInput = String(
            Number.parseFloat(result.toPrecision(12))
        );
    }
}

function chooseOperator(nextOperator) {
    if (currentInput === "Error") {
        clearCalculator();
        return;
    }

    const inputValue = Number(currentInput);

    if (operator !== null && !waitingForSecondNumber) {
        const result = calculate(
            firstNumber,
            inputValue,
            operator
        );

        formatResult(result);

        if (currentInput === "Error") {
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
            finishedCalculation = true;
            updateDisplay();
            return;
        }

        firstNumber = Number(currentInput);
    } else {
        firstNumber = inputValue;
    }

    operator = nextOperator;
    waitingForSecondNumber = true;
    finishedCalculation = false;
    updateDisplay();
}

function calculateResult() {
    if (
        currentInput === "Error" ||
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber
    ) {
        return;
    }

    const secondNumber = Number(currentInput);
    const result = calculate(firstNumber, secondNumber, operator);

    formatResult(result);

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    finishedCalculation = true;

    updateDisplay();
}

function backspace() {
    if (currentInput === "Error" || finishedCalculation) {
        clearCalculator();
        return;
    }

    if (waitingForSecondNumber) {
        return;
    }

    if (
        currentInput.length <= 1 ||
        (currentInput.length === 2 && currentInput.startsWith("-"))
    ) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

numberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        enterNumber(button.dataset.number);
    });
});

operatorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        chooseOperator(button.dataset.operator);
    });
});

decimalButton.addEventListener("click", enterDecimal);
clearButton.addEventListener("click", clearCalculator);
backspaceButton.addEventListener("click", backspace);
equalsButton.addEventListener("click", calculateResult);

document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        enterNumber(key);
    } else if (key === ".") {
        event.preventDefault();
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        event.preventDefault();
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        event.preventDefault();
        backspace();
    } else if (key === "Escape" || key === "Delete") {
        event.preventDefault();
        clearCalculator();
    }
});

updateDisplay();
