export function initMath() {
  const calcInput = document.getElementById('calcInput');
  const calcBtn = document.getElementById('calcBtn');
  const calcResult = document.getElementById('calcResult');
  
  if (!calcInput || !calcBtn || !calcResult) return;
  
  calcBtn.addEventListener('click', calculate);
  calcInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
  });
}

function calculate() {
  const calcInput = document.getElementById('calcInput');
  const calcResult = document.getElementById('calcResult');
  
  const expression = calcInput.value.trim();
  if (!expression) return;
  
  try {
    const result = evaluateMath(expression);
    calcResult.textContent = `= ${result}`;
    calcResult.style.color = 'var(--accent)';
  } catch (error) {
    calcResult.textContent = 'Error: Invalid expression';
    calcResult.style.color = '#e57373';
  }
}

function evaluateMath(expr) {
  expr = expr.replace(/\s/g, '');
  
  const mathFunctions = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'sqrt': Math.sqrt,
    'abs': Math.abs,
    'log': Math.log10,
    'ln': Math.log,
    'pi': Math.PI,
    'e': Math.E
  };
  
  for (const [name, func] of Object.entries(mathFunctions)) {
    if (typeof func === 'number') {
      expr = expr.replace(new RegExp(name, 'g'), func);
    } else {
      const regex = new RegExp(`${name}\\(([^)]+)\\)`, 'g');
      expr = expr.replace(regex, (match, arg) => {
        const value = evaluateMath(arg);
        return func(value);
      });
    }
  }
  
  expr = expr.replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, (match, base, _, exp) => {
    return Math.pow(parseFloat(base), parseFloat(exp));
  });
  
  const result = Function(`'use strict'; return (${expr})`)();
  
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }
  
  return Math.round(result * 1000000) / 1000000;
}

export function clearCalculator() {
  const calcInput = document.getElementById('calcInput');
  const calcResult = document.getElementById('calcResult');
  
  if (calcInput) calcInput.value = '';
  if (calcResult) calcResult.textContent = '';
}

window.initMath = initMath;
window.clearCalculator = clearCalculator;
