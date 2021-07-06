exports.regexTestISODate = function (input) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(input)) return false;
    const d = new Date(input);
    return d.toISOString() === input;
}
exports.regexTestEmailAddress = function (input) {
    return /^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u.test(input)
}

exports.regexTestPostalcode = function (input) {
    return /^[0-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(input)
}

exports.regexTestPhonenumber = function (input) {
    input = input.replace(' ', '');
    return /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i.test(input)
}


