function hbsHelpers(hbs) {
    return hbs.create({
        helpers: {
            // This was missing
            ifEquals(a, b, opts) {
                if (a.toString() === b.toString()) {
                    return opts.fn(this);
                }
                return opts.inverse(this);
            },
            ifNotEqual(a, b, opts) {
                if (a) {
                    a.toString();
                }
                if (b) {
                    b.toString();
                }
                if (a !== b) {
                    return opts.fn(this);
                }
                return opts.inverse(this);
            },
            iff(a, operator, b, opts) {
                let bool = false;
                if (a) {
                    a.toString();
                }
                if (b) {
                    b.toString();
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

            inc(value, options) {
                return parseInt(value) + 1;
            },

            // More helpers...
        },
    });
}

module.exports = hbsHelpers;
