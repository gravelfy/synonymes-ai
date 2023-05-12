"use strict";
(() => {
var exports = {};
exports.id = 565;
exports.ids = [565];
exports.modules = {

/***/ 722:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ generate)
});

;// CONCATENATED MODULE: external "openai"
const external_openai_namespaceObject = require("openai");
;// CONCATENATED MODULE: ./pages/api/generate.js

const configuration = new external_openai_namespaceObject.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new external_openai_namespaceObject.OpenAIApi(configuration);
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
/* harmony default export */ async function generate(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md"
            }
        });
        return;
    }
    const query = req.body.query || "";
    if (query.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Veuillez entrer une expression valide."
            }
        });
        return;
    }
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: generatePrompt(query),
            max_tokens: 300,
            temperature: 0
        });
        // Remove the last dot '.' from the result if OpenAI added it
        const result = completion.data.choices[0].text.split(".").join("");
        const elementsArray = uniq(result.split(", "));
        res.status(200).json({
            result: result,
            elements: elementsArray,
            query: query
        });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: "An error occurred during your request."
                }
            });
        }
    }
}
function generatePrompt(requete) {
    return `Suggérer des synonymes pour le mot suivant. Les synonymes doivent être séparés par une virgule et un espace.
Mot: Travailler
Synonymes: œuvrer, s'activer, s'employer, opérer, fonctionner, s'efforcer, s'appliquer, s'exercer, s'occuper, s'atteller, s'adonner, s'astreindre, se consacrer
Mot: ${requete}
Synonymes:`;
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(722));
module.exports = __webpack_exports__;

})();