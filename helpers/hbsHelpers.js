module.exports = {
    ifEquals(a, b, opts) {
        if (a) {
            a = `${a}`;
        }
        if (b) {
            b = `${b}`;
        }
        if (a === b) {
            return opts.fn(this);
        }
        return opts.inverse(this);
    },
    // Check if values are not equal, return value if true
    ifNotEqual(a, b, opts) {
        if (a) {
            a = `${a}`;
        }
        if (b) {
            b = `${b}`;
        }
        if (a !== b) {
            return opts.fn(this);
        }
        return opts.inverse(this);
    },

    // increment value
    inc(value, options) {
        return parseInt(value) + 1;
    },

    // use multiple comparators
    iff(a, operator, b, opts) {
        let bool = false;
        if (a) {
            a = `${a}`;
        }
        if (b) {
            b = `${b}`;
        }
        switch (operator) {
            case `===`:
                bool = a === b;
                break;
            case `>`:
                bool = a > b;
                break;
            case `<`:
                bool = a < b;
                break;
            default:
                bool = a === b;
        }

        if (bool) {
            return opts.fn(this);
        }
        return opts.inverse(this);
    },

    // add
    add(value1, value2) {
        value1 = parseFloat(value1);
        value2 = parseFloat(value2);

        const result = value1 + value2;
        return result;
    },

    // capitalize all first letters (for names!)
    capitalizeFirstLetters(input) {
        const stringifiedInput = `${input}`;
        const inputArray = stringifiedInput.split(` `);
        if (stringifiedInput.indexOf(` `) >= 0) {
            const capitalizedWords = inputArray.map((word) => word[0].toUpperCase() + word.slice(1)).join(` `);
            return capitalizedWords;
        }
        const capitalizedWord = stringifiedInput.charAt(0).toUpperCase() + stringifiedInput.slice(1);
        return capitalizedWord;
    },

    // capitalize only first letter (paragraphs)
    capitalizeFirstLetter(input) {
        const stringifiedInput = `${input}`;
        const capitalizedInput = stringifiedInput.charAt(0).toUpperCase() + stringifiedInput.slice(1);
        return capitalizedInput;
    },
};
