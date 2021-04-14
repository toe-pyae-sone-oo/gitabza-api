"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var uni_pahsin_words_1 = require("./uni-pahsin-words");
var rCForAThat = '\u1000-\u1002\u1004\u1005\u1007\u1009\u100A\u100B\u100C\u100F\u1010\u1012\u1014-\u101F\u1020\u1025';
// Zg
var rSp = ' \u00A0\u1680\u2000-\u200D\u202F\u205F\u2060\u3000\uFEFF';
var rZg3b = '\u103B\u107E-\u1084';
var rZgUpC = '\u1000-\u1021\u1023-\u1027\u1029\u102A\u1040-\u1049\u104C-\u104F\u106A\u106B\u1086\u108F\u1090';
var rZgPsLoC = '\u1060-\u1063\u1065-\u1069\u106C\u106D\u1070-\u107C\u1085\u1093\u1096';
var rZgPsSgC = '\u106E\u106F\u1091\u1092\u1097';
var rZgAcAfC = '\u102B-\u1030\u1032-\u1034\u1036-\u103A\u103C\u103D\u105A\u107D\u1087-\u108A\u108E\u1094\u1095';
var rZgAcKsAfC = '\u1064\u108B-\u108E';
var rZgC1For3a = '\u1000-\u1021\u1023\u1025\u1027\u1040\u1044\u106A\u106B\u1086\u108F\u1090';
var rZgOnlyCAndAcAfC = rZgAcKsAfC + "\u1033\u1034\u105A\u106A\u106B\u107D\u1086-\u108A\u108F\u1090\u1094\u1095";
var rZgPsDbG = "[" + rZgUpC + "]([" + rSp + "]*[" + rZgAcAfC + rZgAcKsAfC + "])*[" + rSp + "]*[" + rZgPsLoC + "]";
var rZgCAndOpG = "[" + rZgUpC + "]([" + rSp + "]*[" + rZgAcAfC + rZgAcKsAfC + "])*";
var rZgPsSgAndOpG = "[" + rZgPsSgC + "]([" + rSp + "]*[" + rZgAcAfC + rZgAcKsAfC + "])*";
var rZgPsDbAndOpG = rZgPsDbG + "([" + rSp + "]*[" + rZgAcAfC + rZgAcKsAfC + "])*";
var rZgCAndAThatG = "[" + rCForAThat + "](\u1039\u103A\u102C\u1038|\u1039\u1038|\u1039\u1037|\u1037\u1039|\u1039)";
// Uni
var rUniC = '\u1000-\u102A\u103F\u1040-\u1049\u104E';
var rUniPsUpC = '\u1000-\u102A\u103F\u1040-\u1049';
var rUniPsLoC = '\u1000-\u101C\u101E-\u1022\u1027\u103F';
var rUniC1BfAThat = '\u1000-\u1023\u1025\u1027\u1029\u103F\u1040\u1044\u104E';
var rUniAcAf31G = '[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?\u103A?[\u1032\u1036]?[\u102B\u102C]?\u103A?\u1037?[\u102B\u102C]?\u103A?\u1038?';
// AThat suffix
var rUni312cAThatSuffixG = '[\u103B\u103C]?\u103E?\u1031[\u102B\u102C](\u1037\u103A|\u103A[\u1037\u1038]?)';
var rUniC31CAThatSuffixG = "[\u103B\u103C]?\u103E?\u1031[\u102B\u102C]?[" + rCForAThat + "](\u1037\u103A|\u103A[\u1037\u1038]?)";
var rUniC1C2AThatSuffixG = "[\u103B\u103C]?(\u103D\u103E|[\u103D\u103E])?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?[" + rCForAThat + "](\u1037\u103A|\u103A[\u1037\u1038]?)";
var rUniKsAThatSuffixG = '(\u103A[\u103B\u103C]|[\u103B\u103C]\u103A)[\u102B\u102C][\u1037\u1038]?';
/**
 * Zawgyi-One and standard Myanmar Unicode detection service.
 */
var ZawgyiDetector = /** @class */ (function () {
    function ZawgyiDetector(options) {
        this._options = {
            preferZg: false,
            detectMixType: true
        };
        // Seperator
        this._seperatorRegExp = /^[#*([{'"]?[\s]?(zawgyi|unicode|zg|uni|(\u101A\u1030\u1014\u102D?\u102E\u1000\u102F[\u1010\u1012][\u1039\u103A])|(\u1007\u1031\u102C\u103A\u1002\u103B\u102E)|(\u1031\u1007\u102C\u1039\u1002\u103A\u102D?\u102E))/i;
        this._mixBlockTestRegExp = /[\u1000-\u1097]/g;
        this._spRegExp = new RegExp("[" + rSp + "]");
        // Zg
        this._zgAllAcAfCRegExp = new RegExp("^[" + rZgAcAfC + rZgAcKsAfC + "]");
        this._zg31WCRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*" + rZgCAndOpG);
        this._zg31WPahsinSgRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*" + rZgPsSgAndOpG);
        this._zg31WPahsinDbRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*" + rZgPsDbAndOpG);
        this._zg3bWCRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]*" + rZgCAndOpG);
        this._zg3bWPahsinSgRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]*" + rZgPsSgAndOpG);
        this._zg3bWPahsinDbRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]*" + rZgPsDbAndOpG);
        this._zgPahsinDbRegExp = new RegExp("^" + rZgPsDbAndOpG);
        this._zgPahsinSgRegExp = new RegExp("^" + rZgPsSgAndOpG);
        this._zgCAndOptionalRegExp = new RegExp("^" + rZgCAndOpG);
        this._zg31WCAndAThatRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*[" + rZgC1For3a + "]([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zg31WPahsinSgAndAThatRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*[" + rZgPsSgC + "]([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zg31WPahsinDbAndAThatRegExp = new RegExp("^\u1031+[" + rSp + "]*[" + rZg3b + "]*[" + rSp + "]*" + rZgPsDbG + "([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zg3bWCAndAThatRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]*[" + rZgC1For3a + "]([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zg3bWPahsinSgAndAThatRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]*[" + rZgPsSgC + "]([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zg3bWPahsinDbAndAThatRegExp = new RegExp("^[" + rZg3b + "]+[" + rSp + "]" + rZgPsDbG + "([" + rSp + "]*[" + rZgAcKsAfC + "])*[\u102B\u102C]" + rZgCAndAThatG);
        this._zgCAndAThatRegExp = new RegExp("^" + rZgCAndAThatG);
        this._zgOnlyCAndAcAfCRegExp = new RegExp("[" + rZgOnlyCAndAcAfC + "]");
        this._zgOnlyCAndAcAfCFor31Or3bRegExp = new RegExp("[" + rZgOnlyCAndAcAfC + "\u107E-\u1084]");
        this._zgOnlyAc2bOr2cCbRegExp = new RegExp('[\u102B\u102C]\u1039');
        this._zgOnlyAc2dOr2eCbRegExp = new RegExp('[\u102D\u102E][\u1033\u1034\u103A\u103C\u103D]');
        this._zgOnlyAc2fOr30CbRegExp = new RegExp('[\u102F\u1030\u1033\u1034][\u102D\u102E\u1039\u103C\u103D]');
        this._zgOnlyAc32Or36CbRegExp = new RegExp('[\u1032\u1036][\u102D-\u1030\u1033\u1034\u103A\u103C\u103D]');
        this._zgOnlyAc37CbRegExp = new RegExp('\u1037[\u102D\u102E\u1032\u1036\u1039\u103C\u103D]');
        this._zgOnlyAc39CbRegExp = new RegExp('\u1039[\u102B\u102C\u102F\u1030\u1037\u1038\u103A\u103C\u103D]');
        this._zgOnlyAc3ACbRegExp = new RegExp('\u103A[\u102B-\u102E\u1032-\u1034\u1036\u1039\u103C\u103D]');
        this._zgCNotCompat3aRegExp = new RegExp('[\u1003\u1004\u1006-\u100F\u1011-\u1014\u1018\u101B\u101F-\u1021\u1023-\u1027\u1029\u102A]');
        this._zgHasUniPsLoCRegExp = new RegExp("^[" + rUniPsLoC + "]");
        this._zgCNotCompatWith3dRegExp = new RegExp('[\u1000\u1002\u1005-\u1008\u100B-\u100E\u1010-\u1013\u1018\u101E\u1020\u1021\u1023-\u1027\u1029\u102A]');
        // Uni
        //
        this._uniAllAcAnd60To97RegExp = new RegExp('^[\u102B-\u103E\u105A\u1060-\u1097]');
        this._uniKsAndPsRegExp = new RegExp("^\u1004\u103A\u1039[" + rUniPsUpC + "]\u1039[" + rUniPsLoC + "]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?" + rUniAcAf31G);
        this._uniKsAndCRegExp = new RegExp("^\u1004\u103A\u1039[" + rUniC + "]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?" + rUniAcAf31G);
        this._uniPsRegExp = new RegExp("^[" + rUniPsUpC + "]\u1039[" + rUniPsLoC + "]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?" + rUniAcAf31G);
        this._uniPsLeftEndRegExp = new RegExp("[" + rUniC + "]\u103B?\u103C?[\u103D\u103E]?\u1031?\u102D?\u102F?[\u102B\u102C]?$");
        this._uniCAndOptionalRegExp = new RegExp("^[" + rUniC + "]\u103A?\u103B?\u103C?(\u103D\u103E|[\u103D\u103E])?\u103A?\u1031?" + rUniAcAf31G);
        this._uniOnlyAcAf31RegExp = new RegExp('[\u102B\u102C\u1037\u1038]');
        this._uniOnlyAcAf3bRegExp = new RegExp('[\u102B-\u1038\u103A\u103D\u103E]');
        // Ks AThat (e.g. က်ျား)
        this._uniCKsAThatRegExp = new RegExp("^[" + rUniC + "]" + rUniKsAThatSuffixG);
        // AThat with \u1031 + C2 (ကြောင် | လျှောင် | ငေါင် | ခေတ်)
        this._uniC31CAThatRegExp = new RegExp("^[" + rUniC1BfAThat + "]" + rUniC31CAThatSuffixG);
        this._uniPs31CAThatRegExp = new RegExp("^[" + rUniPsUpC + "]\u1039[" + rUniC1BfAThat + "]" + rUniC31CAThatSuffixG);
        // AThat with \u1031 (e.g. ကျော် | လျှော် | တော် | ခေါ်)
        this._uniC312cAThatRegExp = new RegExp("^[" + rUniC1BfAThat + "]" + rUni312cAThatSuffixG);
        this._uniPs312cAThatRegExp = new RegExp("^[" + rUniPsUpC + "]\u1039[" + rUniC1BfAThat + "]" + rUni312cAThatSuffixG);
        // C1 + C2 + AThat (e.g. ကျင် | ကွင် | ငင်)
        this._uniC1C2AThatRegExp = new RegExp("^[" + rUniC1BfAThat + "]" + rUniC1C2AThatSuffixG);
        this._uniPsC2AThatRegExp = new RegExp("^[" + rUniPsUpC + "]\u1039[" + rUniC1BfAThat + "]" + rUniC1C2AThatSuffixG);
        // Compat with AThat
        this._uniC1CompatWithAThat = new RegExp("[" + rUniC1BfAThat + "][\u103B\u103C]?[\u103D\u103E]?\u1031?[\u102D\u102E]?[\u102F\u1030]?[\u102B\u102C]?$");
        this._uniLastCCompatWithKsAThat = new RegExp("[" + rUniC1BfAThat + "]\u103E?\u1031[\u102B\u102C]$");
        this._uniCAThatCompatRegExp = new RegExp("^[" + rCForAThat + "]\u103A");
        // Probabilities
        this._pZg31Or3b95 = 0.95;
        this._pZg31Or3b85 = 0.85;
        this._pZg31Or3b53 = 0.53;
        this._pZg31Or3b50 = 0.5;
        this._pZgPs95 = 0.95;
        this._pZgPs90 = 0.9;
        this._pUniKs95 = 0.95;
        this._pUniKs85 = 0.85;
        this._pUniKs80 = 0.8;
        this._pUniKs75 = 0.75;
        this._pUniKs60 = 0.6;
        this._pUniPs95 = 0.95;
        this._pUniPs60 = 0.6;
        this._pUniPs50 = 0.5;
        this._pUniPs49 = 0.49;
        this._pUniPs47 = 0.47;
        this._pAThat95 = 0.95;
        this._pAThat75 = 0.75;
        this._pAThat54 = 0.54;
        this._pAThat50 = 0.5;
        this._pUniCMax = 1;
        this._pC95 = 0.95;
        this._pC85 = 0.85;
        this._pC55 = 0.55;
        this._pC54 = 0.54;
        this._pC52 = 0.52;
        this._pC50 = 0.5;
        this._pC20 = 0.2;
        if (options) {
            this._options = __assign(__assign({}, this._options), options);
        }
    }
    /**
     * The main method to detect between Zawgyi-One and standard Myanmar Unicode.
     * @param input Input string to detect.
     * @param options Options for current detection.
     * @returns Returns the result object.
     */
    ZawgyiDetector.prototype.detect = function (input, options) {
        var startTime = +new Date();
        var curOptions = __assign(__assign({}, this._options), options);
        var result = {
            detectedEnc: null,
            duration: 0,
            matches: []
        };
        if (!input.length || !input.trim().length) {
            result.duration = Math.max(+new Date() - startTime, 0);
            result.matches.push({
                detectedEnc: null,
                probability: 0,
                start: 0,
                length: input.length,
                matchedString: input
            });
            return result;
        }
        var curStr = input;
        var curStart = 0;
        var lastStr = '';
        var lastEnc = null;
        while (curStr.length > 0) {
            var r = this.detectInternal(curStr, lastEnc, lastStr, curOptions);
            var sd = r.sd;
            var cd = r.cd;
            if ((sd == null || sd.detectedEnc === null) && lastEnc != null) {
                var lastMatch = result.matches[result.matches.length - 1];
                lastMatch.length += curStr.length;
                lastMatch.matchedString += curStr;
                break;
            }
            if (sd == null || sd.detectedEnc === null || curOptions.detectMixType === false) {
                result.matches.push({
                    detectedEnc: sd ? sd.detectedEnc : null,
                    probability: sd ? sd.probability : 0,
                    start: curStart,
                    length: curStr.length,
                    matchedString: curStr,
                    competitorMatch: cd != null ? cd : undefined
                });
                break;
            }
            if (lastEnc === sd.detectedEnc && result.matches.length > 0) {
                var lastMatch = result.matches[result.matches.length - 1];
                if (lastMatch.probability > 0 && sd.probability > 0) {
                    lastMatch.probability = (lastMatch.probability + sd.probability) / 2;
                }
                lastMatch.length += sd.length;
                lastMatch.matchedString = "" + lastMatch.matchedString + sd.matchedString;
                if (lastMatch.competitorMatch != null && cd != null) {
                    var lastCompetitorMatch = lastMatch.competitorMatch;
                    if (lastCompetitorMatch.probability > 0 && cd.probability > 0) {
                        lastCompetitorMatch.probability = (lastCompetitorMatch.probability + cd.probability) / 2;
                    }
                    lastCompetitorMatch.length += cd.length;
                    lastCompetitorMatch.matchedString = "" + lastCompetitorMatch.matchedString + cd.matchedString;
                }
            }
            else {
                result.matches.push(__assign(__assign({}, sd), { start: curStart, competitorMatch: cd != null ? cd : undefined }));
            }
            lastEnc = sd.detectedEnc;
            lastStr += sd.matchedString;
            curStart += sd.length;
            curStr = curStr.substring(sd.length);
        }
        if (result.matches.length > 1) {
            result.detectedEnc = 'mix';
        }
        else if (result.matches.length === 1 && result.matches[0].detectedEnc === 'zg') {
            result.detectedEnc = 'zg';
        }
        else if (result.matches.length === 1 && result.matches[0].detectedEnc === 'uni') {
            result.detectedEnc = 'uni';
        }
        else {
            result.detectedEnc = null;
        }
        result.duration = Math.max(+new Date() - startTime, 0);
        return result;
    };
    ZawgyiDetector.prototype.detectInternal = function (curStr, lastEnc, lastStr, curOptions) {
        var zd = null;
        var ud = null;
        var zdChecked = false;
        var c = curStr.trim()[0];
        if (c === '\u1031' ||
            c === '\u103B' ||
            c === '\u107E' ||
            c === '\u107F' ||
            c === '\u1080' ||
            c === '\u1081' ||
            c === '\u1082' ||
            c === '\u1083' ||
            c === '\u1084') {
            zd = this.detectZg(curStr, lastEnc, lastStr);
            zdChecked = true;
        }
        if (zd == null || zd.probability < 0.95 || zd.matchedString.length !== curStr.length) {
            ud = this.detectUni(curStr, lastEnc, lastStr);
        }
        if (!zdChecked && (ud == null || ud.probability < 0.95 || ud.matchedString.length !== curStr.length)) {
            zd = this.detectZg(curStr, lastEnc, lastStr);
        }
        var sd = null;
        var cd = null;
        if (ud != null && zd != null) {
            if (zd.detectedEnc != null && ud.detectedEnc != null) {
                if (zd.length === ud.length) {
                    var diff = ud.probability - zd.probability;
                    if (diff === 0) {
                        if (lastEnc === 'uni') {
                            sd = ud;
                        }
                        else if (lastEnc === 'zg') {
                            sd = zd;
                        }
                        else {
                            sd = curOptions.preferZg ? zd : ud;
                        }
                    }
                    else if (diff < 0) {
                        if (lastEnc === 'uni' && ud.probability > 0.5 && -diff < 0.02) {
                            sd = ud;
                        }
                        else {
                            sd = zd;
                        }
                    }
                    else {
                        if (lastEnc === 'zg' &&
                            zd.probability > 0.5 &&
                            (diff < 0.02 || (curOptions.preferZg && diff < 0.021))) {
                            sd = zd;
                        }
                        else {
                            sd = ud;
                        }
                    }
                }
                else if (zd.length > ud.length) {
                    sd = zd;
                }
                else {
                    sd = ud;
                }
            }
            else if (zd.detectedEnc == null && ud.detectedEnc == null) {
                sd = zd.length > ud.length ? zd : ud;
            }
            else {
                sd = zd.detectedEnc != null ? zd : ud;
            }
            cd = sd.detectedEnc === 'uni' ? zd : ud;
        }
        else if (ud != null) {
            sd = ud;
        }
        else if (zd != null) {
            sd = zd;
        }
        return {
            sd: sd,
            cd: cd
        };
    };
    // Zawgyi
    //
    ZawgyiDetector.prototype.detectZg = function (curStr, lastEnc, lastStr) {
        var curMatchedStr = '';
        var accProb = 0;
        var hasGreatProb = false;
        var seperatorStart = -1;
        var startOfNewChunk = true;
        var zgDetected = false;
        var hasUnDeteactableStart = false;
        while (curStr.length > 0) {
            var d = this.detectZg31Start(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            if (d == null) {
                d = this.detectZg3bStart(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }
            if (d == null) {
                d = this.detectZgPahsin(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }
            if (d == null) {
                d = this.detectZgC(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }
            if (d != null) {
                startOfNewChunk = false;
                zgDetected = true;
                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            }
            else {
                d = this.detectOtherChars(curStr, lastEnc, lastStr + curMatchedStr, startOfNewChunk);
                if (d != null && d.start > -1) {
                    seperatorStart = d.start;
                }
                if (d != null && d.probability > 0 && d.probability < 0.1) {
                    hasUnDeteactableStart = true;
                }
            }
            if (d == null) {
                break;
            }
            curMatchedStr += d.matchedString;
            lastEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);
            if (d.probability > 0) {
                accProb = accProb === 0 ? d.probability : (accProb + d.probability) / 2;
            }
            if (seperatorStart > -1) {
                break;
            }
        }
        if (!curMatchedStr.length) {
            return null;
        }
        return {
            detectedEnc: zgDetected || accProb >= 0.5 || hasUnDeteactableStart ? 'zg' : null,
            probability: accProb,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectZg31Start = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 2) {
            return null;
        }
        if (curStr[0] !== '\u1031') {
            return null;
        }
        var curMatchedStr = '';
        var aThatMatched = false;
        var pahsinMatched = false;
        if (curStr.length >= 3) {
            // const m = curStr.match(this._zg31WPahsinDbRegExp);
            var m = this._zg31WPahsinDbRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg31WPahsinDbAndAThatRegExp);
                    var m2 = this._zg31WPahsinDbAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            // const m = curStr.match(this._zg31WPahsinSgRegExp);
            var m = this._zg31WPahsinSgRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg31WPahsinSgAndAThatRegExp);
                    var m2 = this._zg31WPahsinSgAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            // const m = curStr.match(this._zg31WCRegExp);
            var m = this._zg31WCRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg31WCAndAThatRegExp);
                    var m2 = this._zg31WCAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            return null;
        }
        var probability = this.getProbForZg31(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);
        return {
            detectedEnc: 'zg',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectZg3bStart = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 2) {
            return null;
        }
        var c = curStr[0];
        if (c !== '\u103B' &&
            c !== '\u107E' &&
            c !== '\u107F' &&
            c !== '\u1080' &&
            c !== '\u1081' &&
            c !== '\u1082' &&
            c !== '\u1083' &&
            c !== '\u1084') {
            return null;
        }
        var curMatchedStr = '';
        var pahsinMatched = false;
        var aThatMatched = false;
        if (curStr.length >= 3) {
            // const m = curStr.match(this._zg3bWPahsinDbRegExp);
            var m = this._zg3bWPahsinDbRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg3bWPahsinDbAndAThatRegExp);
                    var m2 = this._zg3bWPahsinDbAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            // const m = curStr.match(this._zg3bWPahsinSgRegExp);
            var m = this._zg3bWPahsinSgRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                pahsinMatched = true;
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg3bWPahsinSgAndAThatRegExp);
                    var m2 = this._zg3bWPahsinSgAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            // const m = curStr.match(this._zg3bWCRegExp);
            var m = this._zg3bWCRegExp.exec(curStr);
            if (m != null) {
                curMatchedStr = m[0];
                var lastC = curMatchedStr[curMatchedStr.length - 1];
                if (lastC === '\u102B' || lastC === '\u102C') {
                    // const m2 = curStr.match(this._zg3bWCAndAThatRegExp);
                    var m2 = this._zg3bWCAndAThatRegExp.exec(curStr);
                    if (m2 != null) {
                        curMatchedStr = m2[0];
                        aThatMatched = true;
                    }
                }
            }
        }
        if (!curMatchedStr.length) {
            return null;
        }
        var probability = this.getProbForZg3b(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched);
        return {
            detectedEnc: 'zg',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectZgPahsin = function (curStr, lastEnc, lastStr, hasGreatProb) {
        var m = null;
        if (curStr.length > 1) {
            // m = curStr.match(this._zgPahsinDbRegExp);
            m = this._zgPahsinDbRegExp.exec(curStr);
        }
        if (m == null) {
            // m = curStr.match(this._zgPahsinSgRegExp);
            m = this._zgPahsinSgRegExp.exec(curStr);
        }
        if (m === null) {
            return null;
        }
        var curMatchedStr = m[0];
        var aThatMatched = false;
        if (curStr.trim().length >= curMatchedStr.length + 2 && !curMatchedStr.includes('\u1039')) {
            var testStr = curStr.substring(curMatchedStr.length);
            var d = this.detectZg39AThatSufix(testStr);
            if (d != null) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }
        var probability;
        if (lastEnc === 'zg' ||
            hasGreatProb ||
            !lastStr.length ||
            lastEnc == null ||
            curMatchedStr.length === curStr.trim().length ||
            aThatMatched) {
            probability = this._pZgPs95;
        }
        else {
            probability = this._pZgPs90;
        }
        return {
            detectedEnc: 'zg',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectZgC = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (lastEnc !== 'zg') {
            var isZgStart = false;
            var cp = curStr.codePointAt(0);
            if (cp &&
                ((cp >= 0x1000 && cp <= 0x1021) ||
                    (cp >= 0x1023 && cp <= 0x1027) ||
                    (cp >= 0x1029 && cp <= 0x102a) ||
                    (cp >= 0x1040 && cp <= 0x1049) ||
                    (cp >= 0x104c && cp <= 0x104f) ||
                    (cp >= 0x106a && cp <= 0x106b) ||
                    cp === 0x1086 ||
                    cp === 0x108f ||
                    cp === 0x1090)) {
                isZgStart = true;
            }
            if (!isZgStart) {
                return null;
            }
        }
        // const m = curStr.match(this._zgCAndOptionalRegExp);
        var m = this._zgCAndOptionalRegExp.exec(curStr);
        if (m == null) {
            return null;
        }
        var curMatchedStr = m[0];
        var aThatMatched = false;
        if (curStr.trim().length >= curMatchedStr.length + 2 && !curMatchedStr.includes('\u1039')) {
            var testStr = curStr.substring(curMatchedStr.length);
            var d = this.detectZg39AThatSufix(testStr);
            if (d != null) {
                curMatchedStr += d.matchedString;
                aThatMatched = true;
            }
        }
        var probability;
        var c = curMatchedStr[0];
        if (c === '\u104E' || c === '\u106A' || c === '\u106B' || c === '\u1086' || c === '\u108F' || c === '\u1090') {
            if (lastEnc === 'zg' ||
                lastEnc == null ||
                hasGreatProb ||
                !lastStr.length ||
                curMatchedStr.length === curStr.trim().length) {
                probability = this._pC95;
            }
            else {
                probability = this._pC85;
            }
        }
        else if (curMatchedStr.includes('\u1039')) {
            probability = this.getProbForZgC39AThat(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched);
        }
        else if (curMatchedStr.includes('\u103A')) {
            probability = this.getProbForZgC3A(curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched);
        }
        else if (curMatchedStr.includes(' ') || this._spRegExp.test(curMatchedStr)) {
            probability = this._pC52;
        }
        else if (curMatchedStr.includes('\u103D')) {
            if (!curMatchedStr.includes('\u103C') && this._zgCNotCompatWith3dRegExp.test(c)) {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pC50 : this._pC20;
            }
            else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pC54 : this._pC50;
            }
        }
        else if ((curMatchedStr.length > 1 && this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) ||
            this.containsZgOnlyAcCombine(curMatchedStr)) {
            probability = lastEnc === 'zg' && hasGreatProb ? this._pC95 : this._pC85;
        }
        else {
            if (lastEnc === 'zg' && hasGreatProb) {
                probability = this._pC54;
            }
            else {
                probability = this._pC50;
            }
        }
        return {
            detectedEnc: 'zg',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectZg39AThatSufix = function (curStr) {
        // const m = curStr.match(this._zgCAndAThatRegExp);
        var m = this._zgCAndAThatRegExp.exec(curStr);
        if (m == null) {
            return null;
        }
        var curMatchedStr = m[0];
        if (curStr.trim().length > curMatchedStr.length) {
            var testAcStr = curStr.substring(curMatchedStr.length);
            if (this._zgAllAcAfCRegExp.test(testAcStr)) {
                return null;
            }
        }
        return {
            detectedEnc: 'zg',
            probability: -1,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.getProbForZg31 = function (curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched) {
        var probability;
        if ((!lastStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        }
        else if (!lastStr.length || lastEnc == null) {
            probability = this._pZg31Or3b85;
        }
        else if (curMatchedStr.length > 2 &&
            (this._zgOnlyCAndAcAfCFor31Or3bRegExp.test(curMatchedStr) || this.containsZgOnlyAcCombine(curMatchedStr))) {
            probability = this._pZg31Or3b95;
        }
        else if (pahsinMatched) {
            probability = this._pZg31Or3b95;
        }
        else if (curMatchedStr.length === curStr.trim().length && curMatchedStr.endsWith('\u1039')) {
            probability = this._pZg31Or3b95;
        }
        else if (aThatMatched || curMatchedStr.includes('\u1039')) {
            var c39Index = curMatchedStr.indexOf('\u1039');
            var testStr = c39Index === curMatchedStr.length - 1
                ? curStr.substring(curMatchedStr.length)
                : curMatchedStr.substring(c39Index + 1);
            var cAf39 = testStr.length > 0 ? testStr[0] : '';
            if (cAf39.length && this._zgHasUniPsLoCRegExp.test(cAf39)) {
                probability = this._pZg31Or3b50;
            }
            else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pZg31Or3b53 : this._pZg31Or3b50;
            }
        }
        else if (curMatchedStr.includes(' ') || this._spRegExp.test(curMatchedStr)) {
            probability = this._pC52;
        }
        else {
            probability = this._pZg31Or3b50;
        }
        return probability;
    };
    ZawgyiDetector.prototype.getProbForZg3b = function (curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched, pahsinMatched) {
        var probability;
        if ((!lastStr.length || lastEnc == null) && curMatchedStr.length === curStr.trim().length) {
            probability = this._pZg31Or3b95;
        }
        else if (!lastStr.length || lastEnc == null) {
            probability = this._pZg31Or3b85;
        }
        else if (curMatchedStr.length > 2 &&
            (this._zgOnlyCAndAcAfCFor31Or3bRegExp.test(curMatchedStr) || this.containsZgOnlyAcCombine(curMatchedStr))) {
            probability = this._pZg31Or3b95;
        }
        else if (pahsinMatched) {
            probability = this._pZg31Or3b95;
        }
        else if (curMatchedStr.length === curStr.trim().length && curMatchedStr.endsWith('\u1039')) {
            probability = this._pZg31Or3b95;
        }
        else if (aThatMatched || curMatchedStr.includes('\u1039')) {
            var c39Index = curMatchedStr.indexOf('\u1039');
            var testStr = c39Index === curMatchedStr.length - 1
                ? curStr.substring(curMatchedStr.length)
                : curMatchedStr.substring(c39Index + 1);
            var cAf39 = testStr.length > 0 ? testStr[0] : '';
            if (cAf39.length && this._zgHasUniPsLoCRegExp.test(cAf39)) {
                probability = this._pZg31Or3b50;
            }
            else {
                probability = lastEnc === 'zg' && hasGreatProb ? this._pZg31Or3b53 : this._pZg31Or3b50;
            }
        }
        else if (curMatchedStr.includes(' ') || this._spRegExp.test(curMatchedStr)) {
            probability = this._pC52;
        }
        else {
            probability = this._pZg31Or3b50;
        }
        return probability;
    };
    ZawgyiDetector.prototype.getProbForZgC39AThat = function (curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched) {
        var probability;
        var c39Index = curMatchedStr.indexOf('\u1039');
        var testStr = c39Index === curMatchedStr.length - 1
            ? curStr.substring(curMatchedStr.length)
            : curMatchedStr.substring(c39Index + 1);
        var cAf39 = testStr.length > 0 ? testStr[0] : '';
        if (curMatchedStr === '\u1004\u103A\u1039') {
            if (curMatchedStr.length === curStr.trim().length && (!lastStr.length || lastEnc == null)) {
                probability = this._pC20;
            }
            else {
                probability = this._pC50;
            }
        }
        else if (curMatchedStr.length === curStr.trim().length ||
            (cAf39.length && !this._zgHasUniPsLoCRegExp.test(cAf39)) ||
            this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ? this._pC95 : this._pC85;
        }
        else if (curMatchedStr.includes(' ') || this._spRegExp.test(curMatchedStr)) {
            probability = this._pC52;
        }
        else if (!aThatMatched && (!lastStr.length || lastEnc == null)) {
            probability = this._pC20;
        }
        else if (lastEnc === 'zg' && hasGreatProb) {
            probability = aThatMatched ? this._pC54 : this._pC52;
        }
        else {
            probability = this._pC50;
        }
        return probability;
    };
    ZawgyiDetector.prototype.getProbForZgC3A = function (curStr, lastEnc, lastStr, hasGreatProb, curMatchedStr, aThatMatched) {
        var probability;
        var cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];
        if (this._zgOnlyCAndAcAfCRegExp.test(curMatchedStr)) {
            probability = aThatMatched || lastEnc === 'zg' || hasGreatProb ? this._pC95 : this._pC85;
        }
        else if ((lastEnc == null || !lastStr.length) &&
            curMatchedStr.length === 2 &&
            curMatchedStr.length === curStr.trim().length) {
            probability = this._pC55;
        }
        else if (curMatchedStr.includes(' ') || this._spRegExp.test(curMatchedStr)) {
            probability = this._pC52;
        }
        else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability = this.containsZgOnlyAcCombine(curMatchedStr) ? this._pC50 : this._pC20;
        }
        else if (this.containsZgOnlyAcCombine(curMatchedStr)) {
            probability = hasGreatProb ? this._pC54 : this._pC52;
        }
        else if (lastEnc === 'zg' && hasGreatProb) {
            probability = this._pC52;
        }
        else {
            probability = this._pC50;
        }
        return probability;
    };
    ZawgyiDetector.prototype.containsZgOnlyAcCombine = function (curMatchedStr) {
        if (curMatchedStr.length > 2 &&
            (this._zgOnlyAc2bOr2cCbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc2dOr2eCbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc2fOr30CbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc32Or36CbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc39CbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc37CbRegExp.test(curMatchedStr) ||
                this._zgOnlyAc3ACbRegExp.test(curMatchedStr))) {
            return true;
        }
        return false;
    };
    // Unicode
    //
    ZawgyiDetector.prototype.detectUni = function (curStr, lastEnc, lastStr) {
        var curMatchedStr = '';
        var accProb = 0;
        var hasGreatProb = false;
        var seperatorStart = -1;
        var startOfNewChunk = true;
        var uniDetected = false;
        while (curStr.length > 0) {
            var d = this.detectUniKs(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            if (d == null) {
                d = this.detectUniPahsin(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }
            if (d == null) {
                d = this.detectUniC(curStr, lastEnc, lastStr + curMatchedStr, hasGreatProb);
            }
            if (d == null) {
                d = this.detectUniOnlyCodePoints(curStr);
            }
            if (d != null) {
                startOfNewChunk = false;
                uniDetected = true;
                if (!hasGreatProb && d.probability >= 0.85) {
                    hasGreatProb = true;
                }
            }
            else {
                d = this.detectOtherChars(curStr, lastEnc, lastStr + curMatchedStr, startOfNewChunk);
                if (d != null && d.start > -1) {
                    seperatorStart = d.start;
                }
            }
            if (d == null) {
                break;
            }
            curMatchedStr += d.matchedString;
            lastEnc = d.detectedEnc;
            curStr = curStr.substring(d.matchedString.length);
            if (d.probability > 0) {
                accProb = accProb === 0 ? d.probability : (accProb + d.probability) / 2;
            }
            if (seperatorStart > -1) {
                break;
            }
        }
        if (!curMatchedStr.length) {
            return null;
        }
        return {
            detectedEnc: uniDetected || accProb >= 0.5 ? 'uni' : null,
            probability: accProb,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniKs = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 3) {
            return null;
        }
        var c1 = curStr[0];
        var c2 = curStr[1];
        var c3 = curStr[2];
        if (c1 !== '\u1004' || c2 !== '\u103A' || c3 !== '\u1039') {
            return null;
        }
        if (curStr.length === 3) {
            return {
                detectedEnc: 'uni',
                probability: this._pUniKs60,
                start: -1,
                length: 3,
                matchedString: curStr
            };
        }
        var m = null;
        if (curStr.length >= 6 && curStr[4] === '\u1039') {
            // Kinsi + Pahsin
            // m = curStr.match(this._uniKsAndPsRegExp);
            m = this._uniKsAndPsRegExp.exec(curStr);
        }
        if (m == null) {
            // Kinsi + C
            // m = curStr.match(this._uniKsAndCRegExp);
            m = this._uniKsAndCRegExp.exec(curStr);
        }
        if (m == null) {
            return null;
        }
        var curMatchedStr = m[0];
        var test3aStr = curStr.substring(3);
        var d = this.detectUniAThatWith31(test3aStr, lastEnc, lastStr + "\u1004\u103A\u1039", hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(test3aStr, lastEnc, lastStr + "\u1004\u103A\u1039", hasGreatProb);
        }
        if (d != null) {
            curMatchedStr = "\u1004\u103A\u1039" + d.matchedString;
        }
        var probability;
        if (!lastStr.length || lastEnc == null) {
            probability = d != null ? this._pUniKs80 : this._pUniKs75;
        }
        else {
            probability = lastEnc === 'uni' || d != null || hasGreatProb ? this._pUniKs95 : this._pUniKs85;
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniPahsin = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 3 || curStr[1] !== '\u1039') {
            return null;
        }
        var startsWithSgPs = false;
        if (curStr.startsWith('\u100D\u1039\u100D') ||
            curStr.startsWith('\u100D\u1039\u100E') ||
            curStr.startsWith('\u100F\u1039\u100D') ||
            curStr.startsWith('\u100B\u1039\u100C') ||
            curStr.startsWith('\u100B\u1039\u100B')) {
            startsWithSgPs = true;
        }
        if (!startsWithSgPs && (!lastStr.length || lastEnc !== 'uni' || !this._uniPsLeftEndRegExp.test(lastStr))) {
            return null;
        }
        var d = this.detectUniAThatWith31(curStr, lastEnc, lastStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }
        var curMatchedStr;
        if (d != null) {
            curMatchedStr = d.matchedString;
        }
        else {
            // const m = curStr.match(this._uniPsRegExp);
            var m = this._uniPsRegExp.exec(curStr);
            if (m == null) {
                return null;
            }
            curMatchedStr = m[0];
        }
        var probability;
        if (startsWithSgPs ||
            curMatchedStr.includes('\u100D\u1039\u100D') ||
            curMatchedStr.includes('\u100D\u1039\u100E') ||
            curMatchedStr.includes('\u100F\u1039\u100D') ||
            curMatchedStr.includes('\u100B\u1039\u100C') ||
            curMatchedStr.includes('\u100B\u1039\u100B')) {
            probability = this._pUniPs95;
        }
        else if (this.isInUniPahsin(curStr, lastStr)) {
            probability = this._pUniPs60;
        }
        else if (d != null) {
            if (curMatchedStr.includes('\u1031') &&
                (curMatchedStr.includes('\u102B') || curMatchedStr.includes('\u102C'))) {
                probability = this._pAThat95;
            }
            else {
                probability = this.getProbabilityForPahsin(curMatchedStr, lastEnc, hasGreatProb);
                if (probability < this._pUniPs50) {
                    probability = this._pUniPs50;
                }
            }
        }
        else {
            probability = this.getProbabilityForPahsin(curMatchedStr, lastEnc, hasGreatProb);
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniC = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (lastEnc !== 'uni') {
            var isUniStart = false;
            var cp = curStr.codePointAt(0);
            if (cp &&
                ((cp >= 0x1000 && cp <= 0x102a) ||
                    cp === 0x103f ||
                    (cp >= 0x1040 && cp <= 0x1049) ||
                    (cp >= 0x104c && cp <= 0x104f))) {
                isUniStart = true;
            }
            if (!isUniStart) {
                return null;
            }
        }
        var c = curStr[0];
        if (c === '\u104C' || c === '\u104D' || c === '\u104F') {
            return {
                detectedEnc: 'uni',
                probability: lastEnc === 'uni' && hasGreatProb ? this._pC54 : this._pC50,
                start: -1,
                length: 1,
                matchedString: c
            };
        }
        // const m = curStr.match(this._uniCAndOptionalRegExp);
        var m = this._uniCAndOptionalRegExp.exec(curStr);
        if (m == null) {
            return null;
        }
        var d = this.detectUniAThatWith31(curStr, lastEnc, lastStr, hasGreatProb);
        if (d === null) {
            d = this.detectUniAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }
        if (d === null) {
            d = this.detectUniKsAThat(curStr, lastEnc, lastStr, hasGreatProb);
        }
        if (d != null) {
            return d;
        }
        var curMatchedStr = m[0];
        var probability;
        if (this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pUniCMax;
        }
        else if (curMatchedStr.includes('\u1031') &&
            curMatchedStr.indexOf('\u1031') + 1 < curMatchedStr.length &&
            this._uniOnlyAcAf31RegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u1031') + 1))) {
            probability = this._pUniCMax;
        }
        else if (curMatchedStr.includes('\u103B') &&
            curMatchedStr.indexOf('\u103B') + 1 < curMatchedStr.length &&
            this._uniOnlyAcAf3bRegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u103B') + 1))) {
            probability = this._pUniCMax;
        }
        else if (curMatchedStr.includes('\u103A')) {
            probability =
                !lastStr.length || lastEnc == null || !this._uniC1CompatWithAThat.test(lastStr)
                    ? this._pC20
                    : this._pC50;
        }
        else {
            if (curStr.length > 1) {
                var testStr = curStr.substring(curMatchedStr.length);
                if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                    return null;
                }
            }
            if ((!lastStr.length || lastEnc == null) &&
                curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = this._pC95;
            }
            else if (curMatchedStr.length === curStr.trim().length &&
                (curMatchedStr.includes('\u1031') || curMatchedStr.includes('\u103B'))) {
                probability = hasGreatProb ? this._pC95 : this._pC85;
            }
            else if (curMatchedStr.length === 2 && curMatchedStr.endsWith('\u103A')) {
                if (!lastStr.length || lastEnc !== 'uni' || !this._uniCAThatCompatRegExp.test(curMatchedStr)) {
                    probability = this._pC20;
                }
                else {
                    probability = this._pC50;
                }
            }
            else {
                if (lastEnc === 'uni' && hasGreatProb) {
                    probability = this._pC54;
                }
                else {
                    probability = this._pC50;
                }
            }
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniOnlyCodePoints = function (curStr) {
        var curMatchedStr = '';
        for (var _i = 0, curStr_1 = curStr; _i < curStr_1.length; _i++) {
            var c = curStr_1[_i];
            var cp = c.codePointAt(0);
            if (this.isUniOnlyCodePoint(cp)) {
                curMatchedStr += c;
            }
            else {
                break;
            }
        }
        if (!curMatchedStr.length) {
            return null;
        }
        return {
            detectedEnc: 'uni',
            probability: 1,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniKsAThat = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 3 || !lastStr.length || lastEnc == null) {
            return null;
        }
        var pos3a = -1;
        for (var i = 1; i < 3; i++) {
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }
        if (pos3a < 1) {
            return null;
        }
        // const m = curStr.match(this._uniCKsAThatRegExp);
        var m = this._uniCKsAThatRegExp.exec(curStr);
        if (m == null) {
            return null;
        }
        if (!this._uniLastCCompatWithKsAThat.test(lastStr)) {
            return null;
        }
        var curMatchedStr = m[0];
        if (curStr.trim().length > curMatchedStr.length) {
            var testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                return null;
            }
        }
        var probability;
        var cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];
        if (curMatchedStr[0] === '\u103F' ||
            curMatchedStr.includes('\u103B\u102C') ||
            curMatchedStr.includes('\u103B\u103A') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        }
        else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability =
                hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038')
                    ? this._pAThat75
                    : this._pAThat54;
        }
        else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniAThatWith31 = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 4 || (curStr[1] === '\u1039' && curStr.length < 6)) {
            return null;
        }
        var i3aStart = curStr[1] === '\u1039' ? 3 : 1;
        var max3aLen = curStr[1] === '\u1039' ? 10 : 8;
        var actMax3aLen = curStr.length < max3aLen ? curStr.length : max3aLen;
        var pos3a = -1;
        var pos31 = -1;
        for (var i = i3aStart; i < actMax3aLen; i++) {
            if (curStr[i] === '\u1031') {
                pos31 = i;
            }
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }
        if (pos3a < 2 || pos31 < 1) {
            return null;
        }
        var m = null;
        if (curStr[1] === '\u1039') {
            // m = curStr.match(this._uniPs31CAThatRegExp);
            m = this._uniPs31CAThatRegExp.exec(curStr);
            if (m == null) {
                // m = curStr.match(this._uniPs312cAThatRegExp);
                m = this._uniPs312cAThatRegExp.exec(curStr);
            }
        }
        else {
            // m = curStr.match(this._uniC31CAThatRegExp);
            m = this._uniC31CAThatRegExp.exec(curStr);
            if (m == null) {
                // m = curStr.match(this._uniC312cAThatRegExp);
                m = this._uniC312cAThatRegExp.exec(curStr);
            }
        }
        if (m == null) {
            return null;
        }
        var curMatchedStr = m[0];
        if (curStr.trim().length > curMatchedStr.length) {
            var testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                return null;
            }
        }
        var probability;
        var cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];
        if (curMatchedStr.includes('\u103F') ||
            curMatchedStr.includes('\u102B') ||
            curMatchedStr.includes('\u102C') ||
            curMatchedStr.includes('\u103E') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        }
        else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability =
                hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038')
                    ? this._pAThat75
                    : this._pAThat54;
        }
        else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.detectUniAThat = function (curStr, lastEnc, lastStr, hasGreatProb) {
        if (curStr.length < 3 || (curStr[1] === '\u1039' && curStr.length < 5)) {
            return null;
        }
        var i3aStart = curStr[1] === '\u1039' ? 4 : 2;
        var max3aLen = curStr[1] === '\u1039' ? 11 : 9;
        var actMax3aLen = curStr.length < max3aLen ? curStr.length : max3aLen;
        var pos3a = -1;
        for (var i = i3aStart; i < actMax3aLen; i++) {
            if (curStr[i] === '\u103A') {
                pos3a = i;
                break;
            }
        }
        if (pos3a < 2) {
            return null;
        }
        var m = 
        // curStr[1] === '\u1039' ? curStr.match(this._uniPsC2AThatRegExp) : curStr.match(this._uniC1C2AThatRegExp);
        curStr[1] === '\u1039' ? this._uniPsC2AThatRegExp.exec(curStr) : this._uniC1C2AThatRegExp.exec(curStr);
        if (m == null) {
            return null;
        }
        var curMatchedStr = m[0];
        if (curStr.trim().length > curMatchedStr.length) {
            var testStr = curStr.substring(curMatchedStr.length);
            if (testStr.length > 0 && this._uniAllAcAnd60To97RegExp.test(testStr)) {
                var hasM2 = false;
                if (curMatchedStr.endsWith('\u103A')) {
                    var p1 = curMatchedStr[curMatchedStr.length - 2];
                    var p2 = curStr.substring(curMatchedStr.length);
                    var testStr2 = p1 + p2;
                    // const m2 = testStr2.match(this._uniC1C2AThatRegExp);
                    var m2 = this._uniC1C2AThatRegExp.exec(testStr2);
                    if (m2 != null) {
                        curMatchedStr += m2[0].substring(2);
                        hasM2 = true;
                    }
                }
                if (!hasM2) {
                    return null;
                }
            }
        }
        var probability;
        var cBf3a = curMatchedStr[curMatchedStr.indexOf('\u103A') - 1];
        if (curMatchedStr[0] === '\u104E' ||
            curMatchedStr[0] === '\u103F' ||
            curMatchedStr.includes('\u103E') ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0)) ||
            (curMatchedStr.includes('\u103B') &&
                this._uniOnlyAcAf3bRegExp.test(curMatchedStr.substring(curMatchedStr.indexOf('\u103B') + 1))) ||
            this.isUniOnlyCodePoint(curMatchedStr.codePointAt(0))) {
            probability = this._pAThat95;
        }
        else if (this._zgCNotCompat3aRegExp.test(cBf3a)) {
            probability =
                hasGreatProb || curMatchedStr.endsWith('\u1037') || curMatchedStr.endsWith('\u1038')
                    ? this._pAThat75
                    : this._pAThat54;
        }
        else {
            probability = lastEnc === 'uni' && lastStr.length && hasGreatProb ? this._pAThat54 : this._pAThat50;
        }
        return {
            detectedEnc: 'uni',
            probability: probability,
            start: -1,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    ZawgyiDetector.prototype.isUniOnlyCodePoint = function (cp) {
        if (cp &&
            (cp === 0x1022 ||
                cp === 0x1028 ||
                cp === 0x1035 ||
                cp === 0x103e ||
                cp === 0x103f ||
                (cp >= 0x1050 && cp <= 0x1059) ||
                (cp >= 0x105b && cp <= 0x105f) ||
                (cp >= 0x1098 && cp <= 0x109f) ||
                (cp >= 0xa9e0 && cp <= 0xa9ff) ||
                (cp >= 0xaa60 && cp <= 0xaa7f))) {
            return true;
        }
        return false;
    };
    ZawgyiDetector.prototype.isInUniPahsin = function (curStr, lastStr) {
        var found = false;
        // Exact
        if (lastStr + curStr === '\u1015\u1010\u1039\u1010\u102c') {
            return true;
        }
        if (lastStr + curStr === '\u1015\u1010\u1039\u1010\u102c\u1001\u1036') {
            return true;
        }
        if (lastStr + curStr === '\u1019\u102d\u1010\u1039\u1010\u1030') {
            return true;
        }
        for (var _i = 0, uniPahsinWords_1 = uni_pahsin_words_1.uniPahsinWords; _i < uniPahsinWords_1.length; _i++) {
            var pair = uniPahsinWords_1[_i];
            var leftStr = pair[0];
            var rightStr = pair[1];
            if (curStr.length < rightStr.length) {
                continue;
            }
            if (leftStr.length && lastStr.length < leftStr.length) {
                continue;
            }
            if (!curStr.startsWith(rightStr)) {
                continue;
            }
            if (leftStr.length && !lastStr.endsWith(leftStr)) {
                continue;
            }
            found = true;
        }
        return found;
    };
    ZawgyiDetector.prototype.getProbabilityForPahsin = function (curMatchedStr, lastEnc, hasGreatProb) {
        var c1 = curMatchedStr[0];
        var c2 = curMatchedStr[2];
        var probability = this._pUniPs60;
        if (c1 === '\u1000' && (c2 === '\u1000' || c2 === '\u1001')) {
            // က္က / က္ခ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs49;
        }
        else if (c1 === '\u1002' && (c2 === '\u1002' || c2 === '\u1003')) {
            // ဂ္ဂ / ဂ္ဃ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u1005' && (c2 === '\u1005' || c2 === '\u1006')) {
            // စ္စ / စ္ဆ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs49;
        }
        else if (c1 === '\u1007' && (c2 === '\u1007' || c2 === '\u1008')) {
            // ဇ္ဇ / ဇ္ဈ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u1009' && (c2 === '\u1005' || c2 === '\u1006' || c2 === '\u1007' || c2 === '\u1008')) {
            // ဉ္စ / ဉ္ဆ / ဉ္ဇ / ဉ္ဈ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u100B' && (c2 === '\u100B' || c2 === '\u100C')) {
            // ဋ္ဋ / ဋ္ဌ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u100D' && (c2 === '\u100D' || c2 === '\u100E')) {
            // ဍ္ဍ / ဍ္ဎ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u100F' &&
            (c2 === '\u100B' || c2 === '\u100C' || c2 === '\u100D' || c2 === '\u100E' || c2 === '\u100F')) {
            // ဏ္ဋ / ဏ္ဌ / ဏ္ဍ / ဏ္ဏ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u1010' && (c2 === '\u1010' || c2 === '\u1011')) {
            // တ္တ / တ္ထ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs49;
        }
        else if (c1 === '\u1012' && (c2 === '\u1012' || c2 === '\u1013')) {
            // ဒ္ဒ / ဒ္ဓ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs50;
        }
        else if (c1 === '\u1014' &&
            (c2 === '\u1010' || c2 === '\u1011' || c2 === '\u1012' || c2 === '\u1013' || c2 === '\u1014')) {
            // န္တ / န္ထ / န္ဒ / န္ဓ / န္န
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs50;
        }
        else if (c1 === '\u1015' && (c2 === '\u1015' || c2 === '\u1016')) {
            // ပ္ပ / ပ္ဖ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs49;
        }
        else if (c1 === '\u1017' && (c2 === '\u1017' || c2 === '\u1018')) {
            // ဗ္ဗ / ဗ္ဘ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs50;
        }
        else if (c1 === '\u1019' &&
            (c2 === '\u1015' || c2 === '\u1016' || c2 === '\u1017' || c2 === '\u1018' || c2 === '\u1019')) {
            // မ္ပ / မ္ဗ / မ္ဘ / မ္မ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs49;
        }
        else if (c1 === '\u101C' && c2 === '\u101C') {
            // လ္လ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else if (c1 === '\u1020' && c2 === '\u1020') {
            // ဠ္ဠ
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs60;
        }
        else {
            probability = lastEnc === 'uni' && hasGreatProb ? this._pUniPs95 : this._pUniPs47;
        }
        return probability;
    };
    // Shared
    //
    ZawgyiDetector.prototype.detectOtherChars = function (curStr, lastEnc, lastStr, startOfNewChunk) {
        var curMatchedStr = '';
        var hasPunctuation = false;
        var hasUnDeteactableStart = false;
        var seperatorStart = -1;
        var prevIsNewLine = false;
        for (var i = 0; i < curStr.length; i++) {
            var c = curStr[i];
            if (c === ' ' || c === '\t') {
                curMatchedStr += c;
                continue;
            }
            if (c === '\n' || c === '\r') {
                prevIsNewLine = true;
                curMatchedStr += c;
                continue;
            }
            if (prevIsNewLine &&
                !startOfNewChunk &&
                lastEnc != null &&
                lastStr.length > 0 &&
                (c === '[' ||
                    c === '(' ||
                    c === '{' ||
                    c === '#' ||
                    c === '*' ||
                    c === "'" ||
                    c === '"' ||
                    c === 'z' ||
                    c === 'u' ||
                    c === '\u101A' ||
                    c === '\u1007' ||
                    c === '\u1031' ||
                    c === '\u104A' ||
                    c === '\u104B')) {
                var testStr = curStr.substring(i);
                // const m = testStr.match(this._seperatorRegExp);
                var m = this._seperatorRegExp.exec(testStr);
                if (m != null &&
                    curStr.length > m[0].length &&
                    this._mixBlockTestRegExp.test(curStr.substring(m[0].length))) {
                    seperatorStart = i;
                    break;
                }
            }
            var cp = c.codePointAt(0);
            if (cp == null) {
                curMatchedStr += c;
                continue;
            }
            prevIsNewLine = false;
            if (cp === 0x104a || cp === 0x104b) {
                hasPunctuation = true;
                curMatchedStr += c;
                continue;
            }
            if (lastEnc === null &&
                !lastStr.length &&
                ((cp >= 0x102b && cp <= 0x1030) ||
                    (cp >= 0x1032 && cp <= 0x1034) ||
                    (cp >= 0x1036 && cp <= 0x103a) ||
                    (cp >= 0x103c && cp <= 0x103e) ||
                    cp === 0x105a ||
                    (cp >= 0x1060 && cp <= 0x1069) ||
                    (cp >= 0x106c && cp <= 0x106d) ||
                    (cp >= 0x1070 && cp <= 0x107d) ||
                    cp === 0x1085 ||
                    (cp >= 0x1086 && cp <= 0x108e) ||
                    (cp >= 0x1093 && cp <= 0x1096))) {
                hasUnDeteactableStart = true;
                curMatchedStr += c;
                continue;
            }
            if ((cp >= 0x1000 && cp <= 0x109f) || (cp >= 0xa9e0 && cp <= 0xa9ff) || (cp >= 0xaa60 && cp <= 0xaa7f)) {
                break;
            }
            curMatchedStr += c;
        }
        if (!curMatchedStr.length) {
            return null;
        }
        var probability;
        if (lastStr.length > 0 && lastEnc != null) {
            probability = 1;
        }
        else if (hasUnDeteactableStart) {
            probability = 0.05;
        }
        else if (hasPunctuation) {
            probability = curMatchedStr.length === curStr.length ? 0.5 : 0.25;
        }
        else {
            probability = 0;
        }
        return {
            detectedEnc: null,
            probability: probability,
            start: seperatorStart,
            length: curMatchedStr.length,
            matchedString: curMatchedStr
        };
    };
    return ZawgyiDetector;
}());
exports.ZawgyiDetector = ZawgyiDetector;
