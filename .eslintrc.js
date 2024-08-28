module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "amd": true,
        "es6": true,
        "mocha": true,
        "phantomjs": true
    },
    "globals": {
        "sinon": true,
        "expect": true,
        "module": true
    },
    "rules": {
        "block-spacing": [
            "error",
            "always"
        ],
        "curly": [
            "error"
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "eqeqeq": [
            "error",
            "allow-null"
        ],
        "func-call-spacing": [
            "error",
            "never"
        ],
        "indent": [
            "error",
            4
        ],
        "key-spacing": [
            "error",
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "no-console": [
            "error",
            {
                "allow": [
                    "log",
                    "warn",
                    "error"
                ]
            }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "space-before-blocks": [
            "error",
            "always"
        ],
        "space-before-function-paren": [
            "error",
            "never"
        ],
        "space-in-parens": [
            "error",
            "never"
        ]
    }
};