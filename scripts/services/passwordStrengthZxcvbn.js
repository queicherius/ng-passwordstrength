// This algorithm depends on https://github.com/lowe/zxcvbn (MIT) and loads 700kb of dictionaries but is more accurate
application.factory('passwordStrength', function () {

    (function () {
        var a;
        a = function () {
            var a, b;
            b = document.createElement("script");
            b.src = "//dl.dropbox.com/u/209/zxcvbn/zxcvbn.js";
            b.type = "text/javascript";
            b.async = !0;
            a = document.getElementsByTagName("script")[0];
            return a.parentNode.insertBefore(b, a)
        };
        null != window.attachEvent ? window.attachEvent("onload", a) : window.addEventListener("load", a, !1)
    }).call(this);

    return {

        calculate: function (password) {

            var strength;

            if (password === undefined) {
                return undefined;
            }

            password = password.replace(/\s+/g, "");

            if (password == '') {
                return undefined;
            }

            strength = zxcvbn(password);
            strength = (strength.score + 1) * 20;

            return strength;

        }

    };

});