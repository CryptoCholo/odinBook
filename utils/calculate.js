function computeValue(op, a, b) {
    if (op === "sum" || op === "add" || op === "addition") {
        let res = a + b;
        return {operation_type: op, result: res}
    } else if (op === "difference" || op === "subtract" || op === "subtraction") {
        let res = a === b ? 0 : a  >  b ? a - b : b - a;
        return {operation_type: op, result: res}
    } else if (op === "product" || op === "multiply" || op === "multiplication") {
        let res = a * b;
        return {operation_type: op, result: res}
    }
}

module.exports = { computeValue }