var RongIMLib;
(function (RongIMLib) {
    var RongIMVoice = (function () {
        function RongIMVoice() {
        }
        RongIMVoice.init = function () {
            if (this.isIE) {
                var div = document.createElement("div");
                div.setAttribute("id", "flashContent");
                document.body.appendChild(div);
                var script = document.createElement("script");
                script.src = "/lib/swfobject.js";
                var header = document.getElementsByTagName("head")[0];
                header.appendChild(script);
                setTimeout(function () {
                    var swfVersionStr = "11.4.0";
                    var flashvars = {};
                    var params = {};
                    params.quality = "high";
                    params.bgcolor = "#ffffff";
                    params.allowscriptaccess = "sameDomain";
                    params.allowfullscreen = "true";
                    var attributes = {};
                    attributes.id = "player";
                    attributes.name = "player";
                    attributes.align = "middle";
                    swfobject.embedSWF("/lib/player.swf", "flashContent", "1", "1", swfVersionStr, null, flashvars, params, attributes);
                }, 120);
            }
            else {
                var list = ["/lib/pcmdata.min.js", "/lib/libamr-min.js"];
                for (var i = 0, len = list.length; i < len; i++) {
                    var script = document.createElement("script");
                    script.src = list[i];
                    document.head.appendChild(script);
                }
            }
        };
        RongIMVoice.play = function (data, duration) {
            var me = this;
            if (me.isIE) {
                me.thisMovie().doAction("init", data);
            }
            else {
                me.palyVoice(data);
                me.onCompleted(duration);
            }
        };
        RongIMVoice.stop = function () {
            var me = this;
            if (me.isIE) {
                me.thisMovie().doAction("stop");
            }
            else {
                if (me.element) {
                  me.element.stop();
                }
            }
        };
        RongIMVoice.onprogress = function () {
        };
        RongIMVoice.thisMovie = function () {
            return eval("window['player']");
        };
        RongIMVoice.onCompleted = function (duration) {
            var me = this;
            var count = 0;
            var timer = setInterval(function () {
                count++;
                me.onprogress();
                if (count >= duration) {
                    clearInterval(timer);
                }
            }, 1000);
            if (me.isIE) {
                me.thisMovie().doAction("play");
            }
        };
        RongIMVoice.base64ToBlob = function (base64Data, type) {
            var mimeType;
            if (type) {
                mimeType = { type: type };
            }
            base64Data = base64Data.replace(/^(.*)[,]/, '');
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);
            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);
                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, mimeType);
        };
        RongIMVoice.palyVoice = function (base64Data) {
            var reader = new FileReader(), blob = this.base64ToBlob(base64Data, "audio/amr"), me = this;
            reader.onload = function () {
                var samples = new AMR({
                    benchmark: true
                }).decode(reader.result);
                me.element = AMR.util.play(samples);
            };
            reader.readAsBinaryString(blob);
        };
        RongIMVoice.isIE = /IE/.test(navigator.userAgent);
        return RongIMVoice;
    })();
    RongIMLib.RongIMVoice = RongIMVoice;
})(RongIMLib || (RongIMLib = {}));
//# sourceMappingURL=voice.js.map
