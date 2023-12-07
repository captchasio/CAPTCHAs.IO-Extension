var Config = {
    default: {
        isPluginEnabled: true,
        apiKey: null,
        valute: "USD",
        email: null,
        autoSubmitForms: false,
        submitFormsDelay: 0,
        enabledForNormal: true,
        enabledForRecaptchaV2: true,
        enabledForInvisibleRecaptchaV2: true,
        enabledForRecaptchaV3: true,
        enabledForHCaptcha: true,
        enabledForGeetest: true,
        enabledForGeetest_v4: true,
        enabledForKeycaptcha: true,
        enabledForArkoselabs: true,
        enabledForLemin: true,
        enabledForYandex: true,
        enabledForCapyPuzzle: true,
        enabledForAmazonWaf: true,
        enabledForTurnstile: true,
        autoSolveNormal: false,
        autoSolveRecaptchaV2: false,
        autoSolveInvisibleRecaptchaV2: false,
        autoSolveRecaptchaV3: false,
        recaptchaV3MinScore: 0.5,
        autoSolveHCaptcha: false,
        autoSolveGeetest: false,
        autoSolveKeycaptcha: false,
        autoSolveArkoselabs: false,
        autoSolveGeetest_v4: false,
        autoSolveLemin: false,
        autoSolveYandex: false,
        autoSolveCapyPuzzle: false,
        autoSolveAmazonWaf: false,
        autoSolveTurnstile: false,
        repeatOnErrorTimes: 0,
        repeatOnErrorDelay: 0,
        buttonPosition: 'inner',
        useProxy: false,
        proxytype: "HTTP",
        proxy: "",
        blackListDomain: "example.com\ncaptchas.io",
        normalSources: [],
        autoSubmitRules: [{
            url_pattern: "captchas.io",
            code: "" +
                '{"type":"source","value":"document"}' + "\n" +
                '{"type":"method","value":"querySelector","args":["button[type=submit]"]}' + "\n" +
                '{"type":"method","value":"click"}',
        }],
    },

    get: async function (key) {
        let config = await this.getAll();
        return config[key];
    },

    getAll: function () {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get('config', function (result) {
                resolve(Config.joinObjects(Config.default, result.config));
            });
        });
    },

    set: function (newData) {
        return new Promise(function (resolve, reject) {
            Config.getAll()
                .then(data => {
                    chrome.storage.local.set({
                        config: Config.joinObjects(data, newData)
                    }, function (config) {
                        resolve(config);
                    });
                });
        });
    },

    joinObjects: function (obj1, obj2) {
        let res = {};
        for (let key in obj1) res[key] = obj1[key];
        for (let key in obj2) res[key] = obj2[key];
        return res;
    },

    mapParams: function (params, method) {
        let map = Config.getParamsMap(method);

        for (let k in map) {
            let newName = k;
            let oldName = map[k];

            if (params[newName] !== undefined) {
                params[oldName] = params[newName];
                delete params[newName];
            }
        }

        if (params.proxy !== undefined) {
            params.proxytype = params.proxy.type;
            params.proxy = params.proxy.uri;
        }

        return params;
    },

    getParamsMap: function (method) {
        let commonMap = {
            base64: "body",
            caseSensitive: "regsense",
            minLen: "min_len",
            maxLen: "max_len",
            hintText: "textinstructions",
            hintImg: "imginstructions",
            url: "pageurl",
            score: "min_score",
            text: "textcaptcha",
            rows: "recaptcharows",
            cols: "recaptchacols",
            previousId: "previousID",
            canSkip: "can_no_answer",
            apiServer: "api_server",
            softId: "soft_id",
            captchaId: "captcha_id",
            divId: "div_id",
            callback: "pingback",
        };

        let methodMap = {
            userrecaptcha: {
                sitekey: "googlekey",
            },
            funcaptcha: {
                sitekey: "publickey",
            },
            capy: {
                sitekey: "captchakey",
            },
        };

        if (methodMap[method] !== undefined) {
            for (let key in methodMap[method]) {
                commonMap[key] = methodMap[method][key];
            }
        }

        return commonMap;
    }
};
