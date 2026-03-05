


/* ── 1. DOM SELECTION ───────────────────────────────────────
   Grab every element we need and store them in constants.
   We use const because these references never change.        */

const inputA        = document.getElementById("numA");           // First number input
const inputB        = document.getElementById("numB");           // Second number input
const operatorBadge = document.getElementById("operatorBadge"); // Symbol shown between inputs
const resultValue   = document.getElementById("resultValue");   // Big result number
const resultEquation= document.getElementById("resultEquation");// "12 + 4 = 16" line
const resultBox     = document.getElementById("resultBox");     // Container around result
const errorMsg      = document.getElementById("errorMsg");      // Red error text
const btnReset      = document.getElementById("btnReset");      // Reset / Clear button

// All four operation buttons stored as an array (NodeList → Array)
const opButtons = document.querySelectorAll(".op-btn");


/* ── 2. STATE VARIABLE ──────────────────────────────────────
   A variable that remembers which operation the user picked.
   Data type: string (starts as empty string — no op chosen)  */

let currentOperation = "";   // e.g. "add", "subtract", "multiply", "divide"


/* ── 3. MATH FUNCTIONS ──────────────────────────────────────
   Each function takes two numbers and returns a result.
   Keeping them separate makes the code easy to read/test.    */

// Addition: returns the sum of a and b
function add(a, b) {
  return a + b;              // Data type: number
}

// Subtraction: returns the difference
function subtract(a, b) {
  return a - b;
}

// Multiplication: returns the product
function multiply(a, b) {
  return a * b;
}

// Division: returns the quotient, but we check for ÷ 0 first
function divide(a, b) {
  // CONDITIONAL: cannot divide by zero
  if (b === 0) {
    return null;             // null signals "this is an error"
  }
  return a / b;
}


/* ── 4. HELPER: Get operator symbol for display ─────────────
   Converts the operation string into a readable symbol.      */

function getSymbol(operation) {
  // CONDITIONAL: match operation name to its math symbol
  if      (operation === "add")      return "+";
  else if (operation === "subtract") return "−";
  else if (operation === "multiply") return "×";
  else if (operation === "divide")   return "÷";
  else                               return "?";
}


/* ── 5. SHOW RESULT (DOM Manipulation) ──────────────────────
   Updates text content AND color — clearly showing DOM
   manipulation on click.

   Parameters:
     result   (number) – the calculated answer
     a, b     (number) – the two operands
     operation (string) – which operation was used           */

function showResult(result, a, b, operation) {
  // Build the equation string, e.g. "12 + 4 = 16"
  const symbol   = getSymbol(operation);                      // string
  const equation = `${a} ${symbol} ${b} = ${result}`;        // template literal

  /* ── DOM Manipulation: change text ── */
  resultValue.textContent    = result;        // Display the number
  resultEquation.textContent = equation;      // Display full equation
  errorMsg.textContent       = "";            // Clear any old error

  /* ── DOM Manipulation: change color (add CSS classes) ── */
  resultValue.classList.remove("success-color", "error-color");
  resultValue.classList.add("success-color");         // Green color via CSS

  resultBox.classList.remove("error-state");
  resultBox.classList.add("success");                 // Green border via CSS

  // Re-trigger the pop animation so it replays on each calculation
  resultValue.classList.remove("pop");
  // Force browser to re-paint before re-adding (trick to restart animation)
  void resultValue.offsetWidth;
  resultValue.classList.add("pop");
}


/* ── 6. SHOW ERROR (DOM Manipulation) ───────────────────────
   Updates the UI to display an error message in red.        */

function showError(message) {
  /* ── DOM Manipulation: change text ── */
  errorMsg.textContent       = "⚠ " + message;  // Show error text
  resultValue.textContent    = "—";              // Reset result display
  resultEquation.textContent = "";

  /* ── DOM Manipulation: change color ── */
  resultValue.classList.remove("success-color", "pop");
  resultValue.classList.add("error-color");          // Red color via CSS

  resultBox.classList.remove("success");
  resultBox.classList.add("error-state");            // Red border via CSS
}


/* ── 7. CALCULATE (main logic function) ─────────────────────
   Called when any operation button is clicked.
   Reads inputs, validates them, and runs the right function. */

function calculate(operation) {
  /* ── DOM Manipulation: highlight the active button ── */
  // Remove "active" class from all buttons first
  opButtons.forEach(function(btn) {
    btn.classList.remove("active");
  });

  // Add "active" class to the button that was clicked
  const clickedBtn = document.querySelector(`[data-op="${operation}"]`);
  if (clickedBtn) {
    clickedBtn.classList.add("active");   // Changes button to gold color
  }

  /* ── DOM Manipulation: update operator badge ── */
  operatorBadge.textContent = getSymbol(operation);  // Show +, −, ×, or ÷

  // Remember which operation the user picked (state update)
  currentOperation = operation;          // Data type: string

  /* ── Read and convert input values ── */
  const rawA = inputA.value;             // Data type: string (from input)
  const rawB = inputB.value;             // Data type: string (from input)

  // Convert strings → numbers using parseFloat (handles decimals)
  const numA = parseFloat(rawA);         // Data type: number
  const numB = parseFloat(rawB);         // Data type: number

  /* ── INPUT VALIDATION (Conditionals) ── */

  // Check if either input is empty or not a valid number (NaN = Not a Number)
  if (rawA === "" || rawB === "") {
    showError("Please enter both numbers before calculating.");
    return;  // Stop the function here
  }

  if (isNaN(numA) || isNaN(numB)) {
    showError("Invalid input. Please enter valid numbers only.");
    return;
  }

  /* ── Run the correct math function ── */
  let result;   // Data type: number (will be set below)

  if (operation === "add") {
    result = add(numA, numB);

  } else if (operation === "subtract") {
    result = subtract(numA, numB);

  } else if (operation === "multiply") {
    result = multiply(numA, numB);

  } else if (operation === "divide") {
    // divide() returns null if b is zero
    if (numB === 0) {
      showError("Cannot divide by zero. Please enter a non-zero number for B.");
      return;
    }
    result = divide(numA, numB);
  }

  /* ── Round to avoid floating-point weirdness (e.g. 0.1+0.2) ── */
  // Data type: number
  const roundedResult = Math.round(result * 1e10) / 1e10;

  // Everything is valid — show the result!
  showResult(roundedResult, numA, numB, operation);
}


/* ── 8. RESET FUNCTION ──────────────────────────────────────
   Clears all inputs and resets the UI to its starting state. */

function resetAll() {
  /* ── DOM Manipulation: clear text ── */
  inputA.value               = "";     // Clear input A
  inputB.value               = "";     // Clear input B
  resultValue.textContent    = "—";   // Reset result text
  resultEquation.textContent = "";    // Clear equation text
  errorMsg.textContent       = "";    // Clear error text
  operatorBadge.textContent  = "?";  // Reset badge

  /* ── DOM Manipulation: reset colors ── */
  resultValue.classList.remove("success-color", "error-color", "pop");
  resultBox.classList.remove("success", "error-state");

  // Remove "active" highlight from all buttons
  opButtons.forEach(function(btn) {
    btn.classList.remove("active");
  });

  // Reset state variable
  currentOperation = "";    // Data type: string (empty again)

  // Put cursor back in first input for convenience
  inputA.focus();
}


/* ── 9. EVENT LISTENERS ─────────────────────────────────────
   Connect user actions (clicks) to our functions.
   .addEventListener(event, callback) is the core pattern.   */

// Loop through every operation button and add a click listener
opButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    // Read the data-op attribute to know which operation this button is for
    const operation = button.getAttribute("data-op");   // Data type: string
    calculate(operation);   // Call our main calculate function
  });
});

// Reset button click → call resetAll()
btnReset.addEventListener("click", function() {
  resetAll();
});

// Allow pressing ENTER in input fields to re-run last operation
inputA.addEventListener("keydown", function(event) {
  // CONDITIONAL: only react if Enter key was pressed
  if (event.key === "Enter" && currentOperation !== "") {
    calculate(currentOperation);
  }
});

inputB.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && currentOperation !== "") {
    calculate(currentOperation);
  }
});


/* ── 10. INITIALISATION ─────────────────────────────────────
   Run once when the page loads to set the initial UI state.  */

(function init() {
  inputA.focus();    // Auto-focus the first input on page load
})();

/* ============================================================
   END OF SCRIPT
   ============================================================ */
