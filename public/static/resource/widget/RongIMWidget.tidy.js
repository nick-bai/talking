var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        angular.module("RongWebIMWidget.conversation", []);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        angular.module("RongWebIMWidget.conversationlist", []);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    angular.module("RongWebIMWidget", [
        "RongWebIMWidget.conversation",
        "RongWebIMWidget.conversationlist",
        "Evaluate"
    ]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var userAgent = window.navigator.userAgent.toLowerCase();
    var Helper = (function () {
        function Helper() {
        }
        Helper.timeCompare = function (first, second) {
            var pre = first.toString();
            var cur = second.toString();
            return pre.substring(0, pre.lastIndexOf(":")) == cur.substring(0, cur.lastIndexOf(":"));
        };
        Helper.cloneObject = function (obj) {
            if (!obj)
                return null;
            var ret;
            if (Object.prototype.toString.call(obj) == "[object Array]") {
                ret = [];
                var i = obj.length;
                while (i--) {
                    ret[i] = Helper.cloneObject(obj[i]);
                }
                return ret;
            }
            else if (typeof obj === "object") {
                ret = {};
                for (var item in obj) {
                    ret[item] = obj[item];
                }
                return ret;
            }
            else {
                return obj;
            }
        };
        Helper.discernUrlEmailInStr = function (str) {
            var html;
            var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi;
            var EMailArr = [];
            html = str.replace(EMailReg, function (str) {
                EMailArr.push(str);
                return '[email`' + (EMailArr.length - 1) + ']';
            });
            var URLReg = /(((ht|f)tp(s?))\:\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|me|im))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*/gi;
            html = html.replace(URLReg, function (str, $1) {
                if ($1) {
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                }
                else {
                    return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                }
            });
            for (var i = 0, len = EMailArr.length; i < len; i++) {
                html = html.replace('[email`' + i + ']', '<a href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
            }
            return html;
        };
        Helper.checkType = function (obj) {
            var type = Object.prototype.toString.call(obj);
            return type.substring(8, type.length - 1).toLowerCase();
        };
        Helper.browser = {
            version: (userAgent.match(/.+(?:rv|it|ra|chrome|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/.test(userAgent),
            opera: /opera|opr/.test(userAgent),
            msie: /msie|trident/.test(userAgent) && !/opera/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit|like gecko)/.test(userAgent)
        };
        Helper.escapeSymbol = {
            encodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&/g, '&amp;');
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/'/g, '&#039;');
                return str;
            },
            decodeHtmlsymbol: function (str) {
                if (!str)
                    return '';
                str = str.replace(/&amp;/g, '&');
                str = str.replace(/&lt;/g, '<');
                str = str.replace(/&gt;/g, '>');
                str = str.replace(/&quot;/g, '"');
                str = str.replace(/&#039;/g, '\'');
                return str;
            }
        };
        Helper.getFocus = function (obj) {
            obj.focus();
            if (obj.createTextRange) {
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            }
            else if (obj.selectionStart) {
                obj.selectionStart = obj.value.length;
            }
            else if (window.getSelection && obj.lastChild) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                if (Helper.browser.msie) {
                    tempRange.setStart(obj.lastChild, obj.lastChild.length);
                }
                else {
                    tempRange.setStart(obj.firstChild, obj.firstChild.length);
                }
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        };
        Helper.ImageHelper = {
            getThumbnail: function (obj, area, callback) {
                var canvas = document.createElement("canvas"), context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function () {
                    var target_w;
                    var target_h;
                    var imgarea = img.width * img.height;
                    if (imgarea > area) {
                        var scale = Math.sqrt(imgarea / area);
                        scale = Math.ceil(scale * 100) / 100;
                        target_w = img.width / scale;
                        target_h = img.height / scale;
                    }
                    else {
                        target_w = img.width;
                        target_h = img.height;
                    }
                    canvas.width = target_w;
                    canvas.height = target_h;
                    context.drawImage(img, 0, 0, target_w, target_h);
                    try {
                        var _canvas = canvas.toDataURL("image/jpeg", 0.5);
                        _canvas = _canvas.substr(23);
                        callback(obj, _canvas);
                    }
                    catch (e) {
                        callback(obj, null);
                    }
                };
                img.src = Helper.ImageHelper.getFullPath(obj);
            },
            getFullPath: function (file) {
                window.URL = window.URL || window.webkitURL;
                if (window.URL && window.URL.createObjectURL) {
                    return window.URL.createObjectURL(file);
                }
                else {
                    return null;
                }
            }
        };
        Helper.CookieHelper = {
            setCookie: function (name, value, exires) {
                if (exires) {
                    var date = new Date();
                    date.setDate(date.getDate() + exires);
                    document.cookie = name + "=" + encodeURI(value) + ";expires=" + date.toUTCString();
                }
                else {
                    document.cookie = name + "=" + encodeURI(value) + ";";
                }
            },
            getCookie: function (name) {
                var start = document.cookie.indexOf(name + "=");
                if (start != -1) {
                    var end = document.cookie.indexOf(";", start);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return decodeURI(document.cookie.substring(start + name.length + 1, end));
                }
                else {
                    return "";
                }
            },
            removeCookie: function (name) {
                var con = this.getCookie(name);
                if (con) {
                    this.setCookie(name, "con", -1);
                }
            }
        };
        return Helper;
    })();
    RongWebIMWidget.Helper = Helper;
    var NotificationHelper = (function () {
        function NotificationHelper() {
        }
        NotificationHelper.isNotificationSupported = function () {
            return (typeof Notification === "function" || typeof Notification === "object");
        };
        NotificationHelper.requestPermission = function () {
            if (!NotificationHelper.isNotificationSupported()) {
                return;
            }
            Notification.requestPermission(function (status) {
            });
        };
        NotificationHelper.onclick = function (n) { };
        NotificationHelper.showNotification = function (config) {
            if (!NotificationHelper.isNotificationSupported()) {
                console.log('the current browser does not support Notification API');
                return;
            }
            if (Notification.permission !== "granted") {
                console.log('the current page has not been granted for notification');
                return;
            }
            if (!NotificationHelper.desktopNotification) {
                return;
            }
            var title = config.title;
            delete config.title;
            var n = new Notification(title, config);
            n.onshow = function () {
                setTimeout(function () {
                    n.close();
                }, 5000);
            };
            n.onclick = function () {
                window.focus();
                NotificationHelper.onclick && NotificationHelper.onclick(n);
                n.close();
            };
            n.onerror = function () {
            };
            n.onclose = function () {
            };
        };
        NotificationHelper.desktopNotification = true;
        return NotificationHelper;
    })();
    RongWebIMWidget.NotificationHelper = NotificationHelper;
    var DirectiveFactory = (function () {
        function DirectiveFactory() {
        }
        DirectiveFactory.GetFactoryFor = function (classType) {
            var factory = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var newInstance = Object.create(classType.prototype);
                newInstance.constructor.apply(newInstance, args);
                return newInstance;
            };
            factory.$inject = classType.$inject;
            return factory;
        };
        return DirectiveFactory;
    })();
    RongWebIMWidget.DirectiveFactory = DirectiveFactory;
    var errSrc = (function () {
        function errSrc() {
        }
        errSrc.instance = function () {
            return new errSrc();
        };
        errSrc.prototype.link = function (scope, element, attrs) {
            if (!attrs["ngSrc"]) {
                attrs.$set('src', attrs["errSrc"]);
            }
            element.bind('error', function () {
                if (attrs["src"] != attrs["errSrc"]) {
                    attrs.$set('src', attrs["errSrc"]);
                }
            });
        };
        return errSrc;
    })();
    var contenteditableDire = (function () {
        function contenteditableDire() {
            this.restrict = 'A';
            this.require = '?ngModel';
        }
        contenteditableDire.prototype.link = function (scope, element, attrs, ngModel) {
            function replacemy(e) {
                return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
            }
            var domElement = element[0];
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newVal) {
                if (document.activeElement === domElement) {
                    return;
                }
                if (newVal === '' || newVal === attrs["placeholder"]) {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                    ngModel.$setViewValue("");
                }
            });
            element.bind('focus', function () {
                if (domElement.innerHTML == attrs["placeholder"]) {
                    domElement.innerHTML = '';
                }
                domElement.style.color = '';
            });
            element.bind('blur', function () {
                if (domElement.innerHTML === '') {
                    domElement.innerHTML = attrs["placeholder"];
                    domElement.style.color = "#a9a9a9";
                }
            });
            if (!ngModel)
                return;
            element.bind("paste", function (e) {
                var that = this;
                var content;
                e.preventDefault();
                if (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)) {
                    // originalEvent jQuery中的
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    content = replacemy(content || '');
                    content && document.execCommand('insertText', false, content);
                }
                else if (window['clipboardData']) {
                    content = window['clipboardData'].getData('Text');
                    content = replacemy(content || '');
                    if (document['selection']) {
                        content && document['selection'].createRange().pasteHTML(content);
                    }
                    else if (document.getSelection) {
                        document.getSelection().getRangeAt(0).insertNode(document.createTextNode(content));
                    }
                }
                console.log(that.innerHTML);
                ngModel.$setViewValue(that.innerHTML);
            });
            ngModel.$render = function () {
                element.html(ngModel.$viewValue || '');
            };
            element.bind("keyup paste", read);
            element.bind("input", read);
            function read() {
                var html = element.html();
                var html = Helper.escapeSymbol.decodeHtmlsymbol(html);
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        };
        return contenteditableDire;
    })();
    var ctrlEnterKeys = (function () {
        function ctrlEnterKeys() {
            this.restrict = "A";
            this.require = '?ngModel';
            this.scope = {
                fun: "&",
                ctrlenter: "=",
                content: "="
            };
        }
        ctrlEnterKeys.prototype.link = function (scope, element, attrs, ngModel) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function (e) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                }
                else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                    else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                    }
                }
            });
        };
        return ctrlEnterKeys;
    })();
    angular.module("RongWebIMWidget")
        .directive('errSrc', errSrc.instance)
        .directive("contenteditableDire", DirectiveFactory.GetFactoryFor(contenteditableDire))
        .directive("ctrlEnterKeys", DirectiveFactory.GetFactoryFor(ctrlEnterKeys))
        .filter('trustHtml', ["$sce", function ($sce) {
            return function (str) {
                var trustAsHtml = $sce.trustAsHtml(str);
                return trustAsHtml;
            };
        }]).filter("historyTime", ["$filter", function ($filter) {
            return function (time) {
                var today = new Date();
                if (time.toDateString() === today.toDateString()) {
                    return $filter("date")(time, "HH:mm");
                }
                else if (time.toDateString() === new Date(today.setTime(today.getTime() - 1)).toDateString()) {
                    return "昨天" + $filter("date")(time, "HH:mm");
                }
                else {
                    return $filter("date")(time, "yyyy-MM-dd HH:mm");
                }
            };
        }]);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var UploadImageDomain = "http://7xogjk.com1.z0.glb.clouddn.com/";
        var ConversationController = (function () {
            function ConversationController($scope, conversationServer, WebIMWidget, conversationListServer, widgetConfig, providerdata, RongIMSDKServer) {
                this.$scope = $scope;
                this.conversationServer = conversationServer;
                this.WebIMWidget = WebIMWidget;
                this.conversationListServer = conversationListServer;
                this.widgetConfig = widgetConfig;
                this.providerdata = providerdata;
                this.RongIMSDKServer = RongIMSDKServer;
                var _this = this;
                conversationServer.changeConversation = function (obj) {
                    _this.changeConversation(obj);
                };
                conversationServer.handleMessage = function (msg) {
                    _this.handleMessage(msg);
                };
                conversationServer._handleConnectSuccess = function () {
                    updateUploadToken();
                };
                function updateUploadToken() {
                    RongIMSDKServer.getFileToken().then(function (token) {
                        conversationServer._uploadToken = token;
                        uploadFileRefresh();
                    });
                }
                $scope.evaluate = {
                    type: 1,
                    showevaluate: false,
                    valid: false,
                    onConfirm: function (data) {
                        //发评价
                        if (data) {
                            if ($scope.evaluate.type == RongWebIMWidget.EnumCustomerStatus.person) {
                                RongIMSDKServer.evaluateHumanCustomService(conversationServer.current.targetId, data.stars, data.describe).then(function () {
                                }, function () {
                                });
                            }
                            else {
                                RongIMSDKServer.evaluateRebotCustomService(conversationServer.current.targetId, data.value, data.describe).then(function () {
                                }, function () {
                                });
                            }
                        }
                        _this.conversationServer._customService.connected = false;
                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                            onSuccess: function () {
                            },
                            onError: function () {
                            }
                        });
                        _this.closeState();
                    },
                    onCancle: function () {
                        $scope.evaluate.showSelf = false;
                    }
                };
                $scope._inputPanelState = RongWebIMWidget.EnumInputPanelType.person;
                $scope.$watch("showemoji", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (!$scope.emojiList || $scope.emojiList.length == 0) {
                        $scope.emojiList = RongIMLib.RongIMEmoji.emojis.slice(0, 70);
                    }
                });
                document.addEventListener("click", function (e) {
                    if ($scope.showemoji && e.target.className.indexOf("iconfont-smile") == -1) {
                        $scope.$apply(function () {
                            $scope.showemoji = false;
                        });
                    }
                });
                $scope.$watch("showSelf", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("_inputPanelState", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if (newVal == RongWebIMWidget.EnumInputPanelType.person && conversationServer._uploadToken) {
                        uploadFileRefresh();
                    }
                    else {
                        qiniuuploader && qiniuuploader.destroy();
                    }
                });
                $scope.$watch("conversation.messageContent", function (newVal, oldVal) {
                    if (newVal === oldVal)
                        return;
                    if ($scope.conversation) {
                        RongIMLib.RongIMClient.getInstance().saveTextMessageDraft(+$scope.conversation.targetType, $scope.conversation.targetId, newVal);
                    }
                });
                $scope.getHistory = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    var arr = conversationServer._cacheHistory[key];
                    arr.splice(0, arr.length);
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.getMoreMessage = function () {
                    var key = $scope.conversation.targetType + "_" + $scope.conversation.targetId;
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._cacheHistory[key].shift();
                    conversationServer._getHistoryMessages(+$scope.conversation.targetType, $scope.conversation.targetId, 20).then(function (data) {
                        if (data.has) {
                            conversationServer._cacheHistory[key].unshift(new RongWebIMWidget.GetMoreMessagePanel());
                        }
                    });
                };
                $scope.switchPerson = function () {
                    RongIMLib.RongIMClient.getInstance().switchToHumanMode(conversationServer.current.targetId, {
                        onSuccess: function () {
                        },
                        onError: function () {
                        }
                    });
                };
                $scope.send = function () {
                    if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                        alert("请先选择一个会话目标。");
                        return;
                    }
                    if ($scope.conversation.messageContent == "") {
                        return;
                    }
                    var con = RongIMLib.RongIMEmoji.symbolToEmoji($scope.conversation.messageContent);
                    var msg = RongIMLib.TextMessage.obtain(con);
                    var userinfo = new RongIMLib.UserInfo(providerdata.currentUserInfo.userId, providerdata.currentUserInfo.name, providerdata.currentUserInfo.portraitUri);
                    msg.user = userinfo;
                    try {
                        RongIMLib.RongIMClient.getInstance().sendMessage(+$scope.conversation.targetType, $scope.conversation.targetId, msg, {
                            onSuccess: function (retMessage) {
                                conversationListServer.updateConversations().then(function () {
                                });
                            },
                            onError: function (error) {
                            }
                        });
                    }
                    catch (e) {
                    }
                    var content = _this.packDisplaySendMessage(msg, RongWebIMWidget.MessageType.TextMessage);
                    var cmsg = RongWebIMWidget.Message.convert(content);
                    conversationServer._addHistoryMessages(cmsg);
                    $scope.scrollBar();
                    $scope.conversation.messageContent = "";
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                };
                var qiniuuploader;
                function uploadFileRefresh() {
                    qiniuuploader && qiniuuploader.destroy();
                    qiniuuploader = Qiniu.uploader({
                        runtimes: 'html5,html4',
                        browse_button: 'upload-file',
                        container: 'funcPanel',
                        drop_element: 'inputMsg',
                        max_file_size: '100mb',
                        dragdrop: true,
                        chunk_size: '4mb',
                        unique_names: true,
                        uptoken: conversationServer._uploadToken,
                        domain: UploadImageDomain,
                        get_new_uptoken: false,
                        filters: {
                            mime_types: [{ title: "Image files", extensions: "jpg,gif,png,jpeg,bmp" }],
                            prevent_duplicates: false
                        },
                        multi_selection: false,
                        auto_start: true,
                        init: {
                            'FilesAdded': function (up, files) {
                            },
                            'BeforeUpload': function (up, file) {
                            },
                            'UploadProgress': function (up, file) {
                            },
                            'UploadComplete': function () {
                            },
                            'FileUploaded': function (up, file, info) {
                                if (!$scope.conversation.targetId || !$scope.conversation.targetType) {
                                    alert("请先选择一个会话目标。");
                                    return;
                                }
                                info = info.replace(/'/g, "\"");
                                info = JSON.parse(info);
                                RongIMLib.RongIMClient.getInstance()
                                    .getFileUrl(RongIMLib.FileType.IMAGE, file.target_name, {
                                    onSuccess: function (url) {
                                        RongWebIMWidget.Helper.ImageHelper.getThumbnail(file.getNative(), 60000, function (obj, data) {
                                            var im = RongIMLib.ImageMessage.obtain(data, url.downloadUrl);
                                            var content = _this.packDisplaySendMessage(im, RongWebIMWidget.MessageType.ImageMessage);
                                            RongIMLib.RongIMClient.getInstance()
                                                .sendMessage($scope.conversation.targetType, $scope.conversation.targetId, im, {
                                                onSuccess: function () {
                                                    conversationListServer.updateConversations().then(function () {
                                                    });
                                                },
                                                onError: function () {
                                                }
                                            });
                                            conversationServer._addHistoryMessages(RongWebIMWidget.Message.convert(content));
                                            $scope.$apply(function () {
                                                $scope.scrollBar();
                                            });
                                            updateUploadToken();
                                        });
                                    },
                                    onError: function () {
                                    }
                                });
                            },
                            'Error': function (up, err, errTip) {
                                console.log(err);
                                updateUploadToken();
                            }
                        }
                    });
                }
                $scope.close = function () {
                    if (WebIMWidget.onCloseBefore && typeof WebIMWidget.onCloseBefore === "function") {
                        var isClose = WebIMWidget.onCloseBefore({
                            close: function (data) {
                                if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                                    if ($scope.evaluate.valid) {
                                        $scope.evaluate.showSelf = true;
                                    }
                                    else {
                                        RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                            onSuccess: function () {
                                            },
                                            onError: function () {
                                            }
                                        });
                                        conversationServer._customService.connected = false;
                                        _this.closeState();
                                    }
                                }
                                else {
                                    _this.closeState();
                                }
                            }
                        });
                    }
                    else {
                        if (conversationServer.current.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                            if ($scope.evaluate.valid) {
                                $scope.evaluate.showSelf = true;
                            }
                            else {
                                RongIMLib.RongIMClient.getInstance().stopCustomeService(conversationServer.current.targetId, {
                                    onSuccess: function () {
                                    },
                                    onError: function () {
                                    }
                                });
                                conversationServer._customService.connected = false;
                                _this.closeState();
                            }
                        }
                        else {
                            _this.closeState();
                        }
                    }
                };
                $scope.minimize = function () {
                    WebIMWidget.display = false;
                };
            }
            ConversationController.prototype.closeState = function () {
                var _this = this;
                if (this.WebIMWidget.onClose && typeof this.WebIMWidget.onClose === "function") {
                    setTimeout(function () { _this.WebIMWidget.onClose(_this.$scope.conversation); }, 1);
                }
                if (this.widgetConfig.displayConversationList) {
                    this.$scope.showSelf = false;
                }
                else {
                    this.WebIMWidget.display = false;
                }
                this.$scope.messageList = [];
                this.$scope.conversation = null;
                this.conversationServer.current = null;
                _this.$scope.evaluate.showSelf = false;
            };
            ConversationController.prototype.changeConversation = function (obj) {
                var _this = this;
                if (_this.widgetConfig.displayConversationList) {
                    _this.$scope.showSelf = true;
                }
                else {
                    _this.$scope.showSelf = true;
                    _this.WebIMWidget.display = true;
                }
                if (!obj || !obj.targetId) {
                    _this.$scope.conversation = {};
                    _this.$scope.messageList = [];
                    _this.conversationServer.current = null;
                    setTimeout(function () {
                        _this.$scope.$apply();
                    });
                    return;
                }
                var key = obj.targetType + "_" + obj.targetId;
                if (obj.targetType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE
                    && (!_this.conversationServer.current || _this.conversationServer.current.targetId != obj.targetId) && !_this.conversationServer._customService.connected) {
                    _this.conversationServer._customService.connected = false;
                    _this.RongIMSDKServer.startCustomService(obj.targetId);
                }
                _this.conversationServer.current = obj;
                _this.$scope.conversation = obj;
                _this.$scope.conversation.messageContent = RongIMLib.RongIMClient.getInstance().getTextMessageDraft(obj.targetType, obj.targetId) || "";
                _this.$scope.messageList = _this.conversationServer._cacheHistory[key] = _this.conversationServer._cacheHistory[key] || [];
                if (_this.$scope.messageList.length == 0 && _this.conversationServer.current.targetType !== RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE) {
                    _this.conversationServer._getHistoryMessages(obj.targetType, obj.targetId, 3)
                        .then(function (data) {
                        if (_this.$scope.messageList.length > 0) {
                            _this.$scope.messageList.unshift(new RongWebIMWidget.TimePanl(_this.$scope.messageList[0].sentTime));
                            if (data.has) {
                                _this.$scope.messageList.unshift(new RongWebIMWidget.GetMoreMessagePanel());
                            }
                            setTimeout(function () {
                                _this.$scope.$apply();
                            });
                            _this.$scope.scrollBar();
                        }
                    });
                }
                else {
                    setTimeout(function () {
                        _this.$scope.$apply();
                    });
                    _this.$scope.scrollBar();
                }
            };
            ConversationController.prototype.handleMessage = function (msg) {
                var _this = this;
                if (_this.$scope.conversation
                    && msg.targetId == _this.$scope.conversation.targetId
                    && msg.conversationType == _this.$scope.conversation.targetType) {
                    _this.$scope.$apply();
                    var systemMsg = null;
                    switch (msg.messageType) {
                        case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                            _this.conversationServer._customService.type = msg.content.data.serviceType;
                            _this.conversationServer._customService.connected = true;
                            _this.conversationServer._customService.companyName = msg.content.data.companyName;
                            _this.conversationServer._customService.robotName = msg.content.data.robotName;
                            _this.conversationServer._customService.robotIcon = msg.content.data.robotIcon;
                            _this.conversationServer._customService.robotWelcome = msg.content.data.robotWelcome;
                            _this.conversationServer._customService.humanWelcome = msg.content.data.humanWelcome;
                            _this.conversationServer._customService.noOneOnlineTip = msg.content.data.noOneOnlineTip;
                            if (msg.content.data.serviceType == "1") {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                            }
                            else if (msg.content.data.serviceType == "3") {
                                msg.content.data.robotWelcome
                                    && (systemMsg = this.packReceiveMessage(RongIMLib.TextMessage.obtain(msg.content.data.robotWelcome), RongWebIMWidget.MessageType.TextMessage));
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                            }
                            else {
                                _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                            }
                            //会话一分钟评价有效，显示评价
                            _this.$scope.evaluate.valid = false;
                            _this.$scope.evaluate.showSelf = false;
                            setTimeout(function () {
                                _this.$scope.evaluate.valid = true;
                            }, 60 * 1000);
                            _this.providerdata._productInfo && _this.RongIMSDKServer.sendProductInfo(_this.conversationServer.current.targetId, _this.providerdata._productInfo);
                            break;
                        case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                            switch (msg.content.data.status) {
                                case 1:
                                    _this.conversationServer._customService.human.name = msg.content.data.name || "客服人员";
                                    _this.conversationServer._customService.human.headimgurl = msg.content.data.headimgurl;
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    break;
                                case 2:
                                    if (_this.conversationServer._customService.type == "2") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    }
                                    else if (_this.conversationServer._customService.type == "1" || _this.conversationServer._customService.type == "3") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                    }
                                    break;
                                case 3:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                    systemMsg = this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("你被拉黑了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
                                    break;
                                case 4:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    systemMsg = _this.packReceiveMessage(RongIMLib.InformationNotificationMessage.obtain("已经是人工了"), RongWebIMWidget.MessageType.InformationNotificationMessage);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case RongWebIMWidget.MessageType.TerminateMessage:
                            //关闭客服
                            _this.conversationServer._customService.connected = false;
                            if (msg.content.code == 0) {
                                _this.$scope.evaluate.valid = true;
                                _this.$scope.close();
                            }
                            else {
                                if (_this.conversationServer._customService.type == "1") {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                }
                                else {
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                }
                            }
                            break;
                        case RongWebIMWidget.MessageType.SuspendMessage:
                            if (msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.conversationServer._customService.connected = false;
                                _this.closeState();
                            }
                            break;
                        case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                            switch (Number(msg.content.serviceStatus)) {
                                case 1:
                                    if (_this.conversationServer._customService.type == "1") {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robot);
                                    }
                                    else {
                                        _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.robotSwitchPerson);
                                    }
                                    break;
                                case 2:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.person);
                                    break;
                                case 3:
                                    _this.changeCustomerState(RongWebIMWidget.EnumInputPanelType.notService);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    if (systemMsg) {
                        var wmsg = RongWebIMWidget.Message.convert(systemMsg);
                        _this.conversationServer.addCustomServiceInfo(wmsg);
                        _this.conversationServer._addHistoryMessages(wmsg);
                    }
                    _this.conversationServer.addCustomServiceInfo(msg);
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 200);
                }
                if (msg.messageType === RongWebIMWidget.MessageType.ImageMessage) {
                    setTimeout(function () {
                        _this.$scope.$apply();
                        _this.$scope.scrollBar();
                    }, 800);
                }
            };
            ConversationController.prototype.changeCustomerState = function (type) {
                this.$scope._inputPanelState = type;
                if (type == RongWebIMWidget.EnumInputPanelType.person) {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.person;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.person;
                    this.conversationServer.current.title = this.conversationServer._customService.human.name || "客服人员";
                }
                else {
                    this.$scope.evaluate.type = RongWebIMWidget.EnumCustomerStatus.robot;
                    this.conversationServer._customService.currentType = RongWebIMWidget.EnumCustomerStatus.robot;
                    this.conversationServer.current.title = this.conversationServer._customService.robotName;
                }
            };
            ConversationController.prototype.packDisplaySendMessage = function (msg, messageType) {
                var ret = new RongIMLib.Message();
                var userinfo = new RongIMLib.UserInfo(this.providerdata.currentUserInfo.userId, this.providerdata.currentUserInfo.name || "我", this.providerdata.currentUserInfo.portraitUri);
                msg.user = userinfo;
                ret.content = msg;
                ret.conversationType = this.$scope.conversation.targetType;
                ret.targetId = this.$scope.conversation.targetId;
                ret.senderUserId = this.providerdata.currentUserInfo.userId;
                ret.messageDirection = RongIMLib.MessageDirection.SEND;
                ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
                ret.messageType = messageType;
                return ret;
            };
            ConversationController.prototype.packReceiveMessage = function (msg, messageType) {
                var ret = new RongIMLib.Message();
                var userinfo = null;
                msg.userInfo = userinfo;
                ret.content = msg;
                ret.conversationType = this.$scope.conversation.targetType;
                ret.targetId = this.$scope.conversation.targetId;
                ret.senderUserId = this.$scope.conversation.targetId;
                ret.messageDirection = RongIMLib.MessageDirection.RECEIVE;
                ret.sentTime = (new Date()).getTime() - (RongIMLib.RongIMClient.getInstance().getDeltaTime() || 0);
                ret.messageType = messageType;
                return ret;
            };
            ConversationController.$inject = ["$scope",
                "ConversationServer",
                "WebIMWidget",
                "ConversationListServer",
                "WidgetConfig",
                "ProviderData",
                "RongIMSDKServer"];
            return ConversationController;
        })();
        angular.module("RongWebIMWidget.conversation")
            .controller("conversationController", ConversationController);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var rongConversation = (function () {
            function rongConversation(conversationServer) {
                this.conversationServer = conversationServer;
                this.restrict = "E";
                this.templateUrl = "./src/ts/conversation/conversation.tpl.html";
                this.controller = "conversationController";
            }
            rongConversation.prototype.link = function (scope, ele) {
                if (window["jQuery"] && window["jQuery"].nicescroll) {
                    $("#Messages").niceScroll({
                        'cursorcolor': "#0099ff",
                        'cursoropacitymax': 1,
                        'touchbehavior': true,
                        'cursorwidth': "8px",
                        'cursorborder': "0",
                        'cursorborderradius': "5px"
                    });
                }
                scope.scrollBar = function () {
                    setTimeout(function () {
                        var ele = document.getElementById("Messages");
                        if (!ele)
                            return;
                        ele.scrollTop = ele.scrollHeight;
                    }, 200);
                };
            };
            rongConversation.$inject = ["ConversationServer"];
            return rongConversation;
        })();
        var emoji = (function () {
            function emoji() {
                this.restrict = "E";
                this.scope = {
                    item: "=",
                    content: "="
                };
                this.template = '<div style="display:inline-block"></div>';
            }
            emoji.prototype.link = function (scope, ele, attr) {
                ele.find("div").append(scope.item);
                ele.on("click", function () {
                    scope.content.messageContent = scope.content.messageContent || "";
                    scope.content.messageContent = scope.content.messageContent.replace(/\n$/, "");
                    scope.content.messageContent = scope.content.messageContent + scope.item.children[0].getAttribute("name");
                    scope.$parent.$apply();
                    var obj = document.getElementById("inputMsg");
                    RongWebIMWidget.Helper.getFocus(obj);
                });
            };
            return emoji;
        })();
        var textmessage = (function () {
            function textmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text"><pre class="rongcloud-Message-entry" ng-bind-html="msg.content|trustHtml"><br></pre></div>' +
                    '</div>';
            }
            textmessage.prototype.link = function (scope, ele, attr) {
            };
            return textmessage;
        })();
        var includinglinkmessage = (function () {
            function includinglinkmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-text">' +
                    '<pre class="rongcloud-Message-entry" style="">' +
                    '维护中 由于我们的服务商出现故障，融云官网及相关服务也受到影响，给各位用户带来的不便，还请谅解。  您可以通过 <a href="#">【官方微博】</a>了解</pre>' +
                    '</div>' +
                    '</div>';
            }
            return includinglinkmessage;
        })();
        var imagemessage = (function () {
            function imagemessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-img">' +
                    '<span id="{{\'rebox_\'+$id}}"  class="rongcloud-Message-entry" style="">' +
                    // '<p>发给您一张示意图</p>' +
                    // '<img ng-src="{{msg.content}}" alt="">' +
                    '<a href="{{msg.imageUri}}" target="_black"><img ng-src="{{msg.content}}"  data-image="{{msg.imageUri}}" alt=""/></a>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            imagemessage.prototype.link = function (scope, ele, attr) {
                var img = new Image();
                img.src = scope.msg.imageUri;
                setTimeout(function () {
                    if (window["jQuery"] && window["jQuery"].rebox) {
                        $('#rebox_' + scope.$id).rebox({ selector: 'a', zIndex: 999999, theme: "rongcloud-rebox" }).bind("rebox:open", function () {
                            //jQuery rebox 点击空白关闭
                            var rebox = document.getElementsByClassName("rongcloud-rebox")[0];
                            rebox.onclick = function (e) {
                                if (e.target.tagName.toLowerCase() != "img") {
                                    var rebox_close = document.getElementsByClassName("rongcloud-rebox-close")[0];
                                    rebox_close.click();
                                    rebox = null;
                                    rebox_close = null;
                                }
                            };
                        });
                    }
                });
                img.onload = function () {
                    scope.$apply(function () {
                        scope.msg.content = scope.msg.imageUri;
                    });
                };
                scope.showBigImage = function () {
                };
            };
            return imagemessage;
        })();
        var voicemessage = (function () {
            function voicemessage($timeout) {
                this.$timeout = $timeout;
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-audio">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<span class="rongcloud-audioBox rongcloud-clearfix " ng-click="play()" ng-class="{\'rongcloud-animate\':isplaying}" ><i></i><i></i><i></i></span>' +
                    '<div style="display: inline-block;" ><span class="rongcloud-audioTimer">{{msg.duration}}”</span><span class="rongcloud-audioState" ng-show="msg.isUnReade"></span></div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
                voicemessage.prototype["link"] = function (scope, ele, attr) {
                    scope.msg.duration = parseInt(scope.msg.duration || scope.msg.content.length / 1024);
                    RongIMLib.RongIMVoice.preLoaded(scope.msg.content);
                    scope.play = function () {
                        RongIMLib.RongIMVoice.stop(scope.msg.content);
                        if (!scope.isplaying) {
                            scope.msg.isUnReade = false;
                            RongIMLib.RongIMVoice.play(scope.msg.content, scope.msg.duration);
                            scope.isplaying = true;
                            if (scope.timeoutid) {
                                $timeout.cancel(scope.timeoutid);
                            }
                            scope.timeoutid = $timeout(function () {
                                scope.isplaying = false;
                            }, scope.msg.duration * 1000);
                        }
                        else {
                            scope.isplaying = false;
                            $timeout.cancel(scope.timeoutid);
                        }
                    };
                };
            }
            voicemessage.$inject = ["$timeout"];
            return voicemessage;
        })();
        var locationmessage = (function () {
            function locationmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-map">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-mapBox">' +
                    '<img ng-src="{{msg.content}}" alt="">' +
                    '<span>{{msg.poi}}</span>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return locationmessage;
        })();
        var richcontentmessage = (function () {
            function richcontentmessage() {
                this.restrict = "E";
                this.scope = { msg: "=" };
                this.template = '<div class="">' +
                    '<div class="rongcloud-Message-image-text">' +
                    '<span class="rongcloud-Message-entry" style="">' +
                    '<div class="rongcloud-image-textBox">' +
                    '<h4>{{msg.title}}</h4>' +
                    '<div class="rongcloud-cont rongcloud-clearfix">' +
                    '<img ng-src="{{msg.imageUri}}" alt="">' +
                    '<div>{{msg.content}}</div>' +
                    '</div>' +
                    '</div>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            return richcontentmessage;
        })();
        angular.module("RongWebIMWidget.conversation")
            .directive("rongConversation", factory(rongConversation))
            .directive("emoji", factory(emoji))
            .directive("textmessage", factory(textmessage))
            .directive("includinglinkmessage", factory(includinglinkmessage))
            .directive("imagemessage", factory(imagemessage))
            .directive("voicemessage", factory(voicemessage))
            .directive("locationmessage", factory(locationmessage))
            .directive("richcontentmessage", factory(richcontentmessage));
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../../typings/tsd.d.ts"/>
/// <reference path="../../lib/RongIMLib.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversation;
    (function (conversation_1) {
        var CustomerService = (function () {
            function CustomerService() {
                this.human = {};
            }
            return CustomerService;
        })();
        var conversationServer = (function () {
            function conversationServer($q, providerdata) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.current = new RongWebIMWidget.Conversation;
                this._cacheHistory = {};
                this._customService = new CustomerService();
            }
            conversationServer.prototype.unshiftHistoryMessages = function (id, type, item) {
                var key = type + "_" + id;
                var arr = this._cacheHistory[key] = this._cacheHistory[key] || [];
                if (arr[0] && arr[0].sentTime && arr[0].panelType != RongWebIMWidget.PanelType.Time && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[0].sentTime, item.sentTime)) {
                        arr.unshift(new RongWebIMWidget.TimePanl(arr[0].sentTime));
                    }
                }
                arr.unshift(item);
            };
            conversationServer.prototype._getHistoryMessages = function (targetType, targetId, number, reset) {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getHistoryMessages(targetType, targetId, reset ? 0 : null, number, {
                    onSuccess: function (data, has) {
                        var msglen = data.length;
                        while (msglen--) {
                            var msg = RongWebIMWidget.Message.convert(data[msglen]);
                            switch (msg.messageType) {
                                case RongWebIMWidget.MessageType.TextMessage:
                                case RongWebIMWidget.MessageType.ImageMessage:
                                case RongWebIMWidget.MessageType.VoiceMessage:
                                case RongWebIMWidget.MessageType.RichContentMessage:
                                case RongWebIMWidget.MessageType.LocationMessage:
                                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                                    _this.unshiftHistoryMessages(targetId, targetType, msg);
                                    _this.addCustomServiceInfo(msg);
                                    if (msg.content && _this.providerdata.getUserInfo) {
                                        (function (msg) {
                                            _this.providerdata.getUserInfo(msg.senderUserId, {
                                                onSuccess: function (obj) {
                                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(obj.userId, obj.name, obj.portraitUri);
                                                }
                                            });
                                        })(msg);
                                    }
                                    break;
                                case RongWebIMWidget.MessageType.UnknownMessage:
                                    break;
                                default:
                                    break;
                            }
                        }
                        defer.resolve({ data: data, has: has });
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                });
                return defer.promise;
            };
            conversationServer.prototype._addHistoryMessages = function (item) {
                var key = item.conversationType + "_" + item.targetId;
                var arr = this._cacheHistory[key];
                if (arr.length == 0) {
                    arr.push(new RongWebIMWidget.GetHistoryPanel());
                }
                if (arr[arr.length - 1]
                    && arr[arr.length - 1].panelType != RongWebIMWidget.PanelType.Time
                    && arr[arr.length - 1].sentTime
                    && item.sentTime) {
                    if (!RongWebIMWidget.Helper.timeCompare(arr[arr.length - 1].sentTime, item.sentTime)) {
                        arr.push(new RongWebIMWidget.TimePanl(item.sentTime));
                    }
                }
                arr.push(item);
            };
            conversationServer.prototype.updateUploadToken = function () {
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        _this._uploadToken = data.token;
                    }, onError: function () {
                    }
                });
            };
            conversationServer.prototype.addCustomServiceInfo = function (msg) {
                if (!msg.content || (msg.content.userInfo && msg.content.userInfo.name)) {
                    return;
                }
                if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE) {
                    if (this._customService.currentType == 1) {
                        msg.content.userInfo = {
                            name: this._customService.human.name || "客服人员",
                            portraitUri: this._customService.human.headimgurl || this._customService.robotIcon
                        };
                    }
                    else {
                        msg.content.userInfo = {
                            name: this._customService.robotName,
                            portraitUri: this._customService.robotIcon
                        };
                    }
                }
                else if (msg.conversationType == RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && msg.content && msg.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                    msg.content.userInfo = {
                        name: "我",
                        portraitUri: this.providerdata.currentUserInfo.portraitUri
                    };
                }
                return msg;
            };
            conversationServer.$inject = ["$q", "ProviderData"];
            return conversationServer;
        })();
        angular.module("RongWebIMWidget.conversation")
            .service("ConversationServer", conversationServer);
    })(conversation = RongWebIMWidget.conversation || (RongWebIMWidget.conversation = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var conversationListController = (function () {
            function conversationListController($scope, conversationListServer, WebIMWidget) {
                this.$scope = $scope;
                this.conversationListServer = conversationListServer;
                this.WebIMWidget = WebIMWidget;
                $scope.minbtn = function () {
                    WebIMWidget.display = false;
                };
                $scope.conversationListServer = conversationListServer;
            }
            conversationListController.$inject = [
                "$scope",
                "ConversationListServer",
                "WebIMWidget"
            ];
            return conversationListController;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .controller("conversationListController", conversationListController);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../lib/window.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var factory = RongWebIMWidget.DirectiveFactory.GetFactoryFor;
        var rongConversationList = (function () {
            function rongConversationList() {
                this.restrict = "E";
                this.templateUrl = "./src/ts/conversationlist/conversationList.tpl.html";
                this.controller = "conversationListController";
            }
            rongConversationList.prototype.link = function (scope, ele) {
                if (window["jQuery"] && window["jQuery"].nicescroll) {
                    $(ele).find(".rongcloud-content").niceScroll({
                        'cursorcolor': "#0099ff",
                        'cursoropacitymax': 1,
                        'touchbehavior': false,
                        'cursorwidth': "8px",
                        'cursorborder': "0",
                        'cursorborderradius': "5px"
                    });
                }
            };
            return rongConversationList;
        })();
        var conversationItem = (function () {
            function conversationItem(conversationServer, conversationListServer, RongIMSDKServer) {
                this.conversationServer = conversationServer;
                this.conversationListServer = conversationListServer;
                this.RongIMSDKServer = RongIMSDKServer;
                this.restrict = "E";
                this.scope = { item: "=" };
                this.template = '<div class="rongcloud-chatList">' +
                    '<div class="rongcloud-chat_item " ng-class="{\'rongcloud-online\':item.onLine}">' +
                    '<div class="rongcloud-ext">' +
                    '<p class="rongcloud-attr clearfix">' +
                    '<span class="rongcloud-badge" ng-show="item.unreadMessageCount>0">{{item.unreadMessageCount>99?"99+":item.unreadMessageCount}}</span>' +
                    '<i class="rongcloud-sprite rongcloud-no-remind" ng-click="remove($event)"></i>' +
                    '</p>' +
                    '</div>' +
                    '<div class="rongcloud-photo">' +
                    '<img class="rongcloud-img" ng-src="{{item.portraitUri}}" err-src="http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png" alt="">' +
                    '<i ng-show="!!$parent.data.getOnlineStatus&&item.targetType==1" class="rongcloud-Presence rongcloud-Presence--stacked rongcloud-Presence--mainBox"></i>' +
                    '</div>' +
                    '<div class="rongcloud-info">' +
                    '<h3 class="rongcloud-nickname">' +
                    '<span class="rongcloud-nickname_text" title="{{item.title}}">{{item.title}}</span>' +
                    '</h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                conversationItem.prototype["link"] = function (scope, ele, attr) {
                    ele.on("click", function () {
                        conversationServer
                            .changeConversation(new RongWebIMWidget.Conversation(scope.item.targetType, scope.item.targetId, scope.item.title));
                        if (scope.item.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(scope.item.targetType, scope.item.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(scope.item.targetId, Number(scope.item.targetType));
                            conversationListServer.updateConversations();
                        }
                    });
                    scope.remove = function (e) {
                        e.stopPropagation();
                        RongIMSDKServer.removeConversation(scope.item.targetType, scope.item.targetId).then(function () {
                            if (conversationServer.current.targetType == scope.item.targetType
                                && conversationServer.current.targetId == scope.item.targetId) {
                            }
                            conversationListServer.updateConversations();
                        }, function (error) {
                        });
                    };
                };
            }
            conversationItem.$inject = ["ConversationServer",
                "ConversationListServer",
                "RongIMSDKServer"];
            return conversationItem;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .directive("rongConversationList", factory(rongConversationList))
            .directive("conversationItem", factory(conversationItem));
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var conversationlist;
    (function (conversationlist) {
        var ConversationListServer = (function () {
            function ConversationListServer($q, providerdata, widgetConfig, RongIMSDKServer, conversationServer) {
                this.$q = $q;
                this.providerdata = providerdata;
                this.widgetConfig = widgetConfig;
                this.RongIMSDKServer = RongIMSDKServer;
                this.conversationServer = conversationServer;
                this._conversationList = [];
                this._onlineStatus = [];
                this.hiddenConversations = [];
                this._hiddenConversationObject = {};
            }
            ConversationListServer.prototype.setHiddenConversations = function (list) {
                if (angular.isArray(list)) {
                    for (var i = 0, length = list.length; i < length; i++) {
                        this._hiddenConversationObject[list[i].type + "_" + list[i].id] = true;
                    }
                }
            };
            ConversationListServer.prototype.updateConversations = function () {
                var defer = this.$q.defer();
                var _this = this;
                RongIMLib.RongIMClient.getInstance().getConversationList({
                    onSuccess: function (data) {
                        var totalUnreadCount = 0;
                        _this._conversationList.splice(0, _this._conversationList.length);
                        for (var i = 0, len = data.length; i < len; i++) {
                            var con = RongWebIMWidget.Conversation.onvert(data[i]);
                            if (_this._hiddenConversationObject[con.targetType + "_" + con.targetId]) {
                                continue;
                            }
                            switch (con.targetType) {
                                case RongIMLib.ConversationType.PRIVATE:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getUserInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.GROUP:
                                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getGroupInfo) == "function") {
                                        (function (a, b) {
                                            _this.providerdata.getGroupInfo(a.targetId, {
                                                onSuccess: function (data) {
                                                    a.title = data.name;
                                                    a.portraitUri = data.portraitUri;
                                                    b.conversationTitle = data.name;
                                                    b.portraitUri = data.portraitUri;
                                                }
                                            });
                                        }(con, data[i]));
                                    }
                                    break;
                                case RongIMLib.ConversationType.CHATROOM:
                                    con.title = "聊天室：" + con.targetId;
                                    break;
                            }
                            totalUnreadCount += Number(con.unreadMessageCount) || 0;
                            _this._conversationList.push(con);
                        }
                        _this._onlineStatus.forEach(function (item) {
                            var conv = _this._getConversation(RongWebIMWidget.EnumConversationType.PRIVATE, item.id);
                            conv && (conv.onLine = item.status);
                        });
                        if (_this.widgetConfig.displayConversationList) {
                            _this.providerdata.totalUnreadCount = totalUnreadCount;
                            defer.resolve();
                        }
                        else {
                            var cu = _this.conversationServer.current;
                            cu && cu.targetId && _this.RongIMSDKServer.getConversation(cu.targetType, cu.targetId).then(function (conv) {
                                if (conv && conv.unreadMessageCount) {
                                    _this.providerdata.totalUnreadCount = conv.unreadMessageCount || 0;
                                    defer.resolve();
                                }
                                else {
                                    _this.providerdata.totalUnreadCount = 0;
                                    defer.resolve();
                                }
                            });
                        }
                    },
                    onError: function (error) {
                        defer.reject(error);
                    }
                }, null);
                return defer.promise;
            };
            ConversationListServer.prototype._getConversation = function (type, id) {
                for (var i = 0, len = this._conversationList.length; i < len; i++) {
                    if (this._conversationList[i].targetType == type && this._conversationList[i].targetId == id) {
                        return this._conversationList[i];
                    }
                }
                return null;
            };
            ConversationListServer.prototype.startRefreshOnlineStatus = function () {
                var _this = this;
                if (_this.widgetConfig.displayConversationList && _this.providerdata.getOnlineStatus) {
                    _this._getOnlineStatus();
                    _this.__intervale && clearInterval(this.__intervale);
                    _this.__intervale = setInterval(function () {
                        _this._getOnlineStatus();
                    }, 30 * 1000);
                }
            };
            ConversationListServer.prototype._getOnlineStatus = function () {
                var _this = this;
                var arr = _this._conversationList.map(function (item) { return item.targetId; });
                _this.providerdata.getOnlineStatus(arr, {
                    onSuccess: function (data) {
                        _this._onlineStatus = data;
                        _this.updateConversations();
                    }
                });
            };
            ConversationListServer.prototype.stopRefreshOnlineStatus = function () {
                clearInterval(this.__intervale);
                this.__intervale = null;
            };
            ConversationListServer.$inject = ["$q",
                "ProviderData",
                "WidgetConfig",
                "RongIMSDKServer",
                "ConversationServer"];
            return ConversationListServer;
        })();
        angular.module("RongWebIMWidget.conversationlist")
            .service("ConversationListServer", ConversationListServer);
    })(conversationlist = RongWebIMWidget.conversationlist || (RongWebIMWidget.conversationlist = {}));
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProductInfo = (function () {
        function ProductInfo() {
        }
        return ProductInfo;
    })();
    var eleConversationListWidth = 195, eleminbtnHeight = 50, eleminbtnWidth = 195, spacing = 3;
    var WebIMWidget = (function () {
        function WebIMWidget($q, conversationServer, conversationListServer, providerdata, widgetConfig, RongIMSDKServer, $log) {
            this.$q = $q;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.providerdata = providerdata;
            this.widgetConfig = widgetConfig;
            this.RongIMSDKServer = RongIMSDKServer;
            this.$log = $log;
            this.display = false;
            this.connected = false;
            this.EnumConversationType = RongWebIMWidget.EnumConversationType;
            this.EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
        }
        WebIMWidget.prototype.init = function (config) {
            var _this = this;
            config.reminder && (_this.widgetConfig.reminder = config.reminder);
            if (!window.RongIMLib || !window.RongIMLib.RongIMClient) {
                _this.widgetConfig._config = config;
                return;
            }
            var defaultStyle = _this.widgetConfig.style;
            angular.extend(_this.widgetConfig, config);
            angular.extend(defaultStyle, config.style);
            if (config.desktopNotification) {
                RongWebIMWidget.NotificationHelper.requestPermission();
            }
            var eleplaysound = document.getElementById("rongcloud-playsound");
            if (eleplaysound && typeof _this.widgetConfig.voiceUrl === "string") {
                eleplaysound["src"] = _this.widgetConfig.voiceUrl;
                _this.widgetConfig.voiceNotification = true;
            }
            else {
                _this.widgetConfig.voiceNotification = false;
            }
            var eleconversation = document.getElementById("rong-conversation");
            var eleconversationlist = document.getElementById("rong-conversation-list");
            var eleminbtn = document.getElementById("rong-widget-minbtn");
            if (_this.widgetConfig.__isKefu) {
                eleminbtn = document.getElementById("rong-widget-minbtn-kefu");
            }
            if (defaultStyle) {
                eleconversation.style["height"] = defaultStyle.height + "px";
                eleconversation.style["width"] = defaultStyle.width + "px";
                eleconversationlist.style["height"] = defaultStyle.height + "px";
                if (defaultStyle.positionFixed) {
                    eleconversationlist.style['position'] = "fixed";
                    eleminbtn.style['position'] = "fixed";
                    eleconversation.style['position'] = "fixed";
                }
                else {
                    eleconversationlist.style['position'] = "absolute";
                    eleminbtn.style['position'] = "absolute";
                    eleconversation.style['position'] = "absolute";
                }
                if (_this.widgetConfig.displayConversationList) {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "inline-block";
                    if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.left) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + "px";
                            eleminbtn.style["left"] = defaultStyle.left + "px";
                            eleconversation.style["left"] = defaultStyle.left + eleConversationListWidth + spacing + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width + spacing + "px";
                            eleconversation.style["right"] = defaultStyle.right + "px";
                        }
                    }
                    else if (_this.widgetConfig.conversationListPosition == RongWebIMWidget.EnumConversationListPosition.right) {
                        if (!isNaN(defaultStyle.left)) {
                            eleconversationlist.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width + spacing + "px";
                            eleconversation.style["left"] = defaultStyle.left + "px";
                        }
                        if (!isNaN(defaultStyle.right)) {
                            eleconversationlist.style["right"] = defaultStyle.right + "px";
                            eleminbtn.style["right"] = defaultStyle.right + "px";
                            eleconversation.style["right"] = defaultStyle.right + eleConversationListWidth + spacing + "px";
                        }
                    }
                    else {
                        throw new Error("config conversationListPosition value is invalid");
                    }
                    if (!isNaN(defaultStyle["top"])) {
                        eleconversationlist.style["top"] = defaultStyle.top + "px";
                        eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                        eleconversation.style["top"] = defaultStyle.top + "px";
                    }
                    if (!isNaN(defaultStyle["bottom"])) {
                        eleconversationlist.style["bottom"] = defaultStyle.bottom + "px";
                        eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                        eleconversation.style["bottom"] = defaultStyle.bottom + "px";
                    }
                }
                else {
                    eleminbtn.style["display"] = "inline-block";
                    eleconversationlist.style["display"] = "none";
                    eleconversation.style["left"] = defaultStyle["left"] + "px";
                    eleconversation.style["right"] = defaultStyle["right"] + "px";
                    eleconversation.style["top"] = defaultStyle["top"] + "px";
                    eleconversation.style["bottom"] = defaultStyle["bottom"] + "px";
                    eleminbtn.style["top"] = defaultStyle.top + defaultStyle.height - eleminbtnHeight + "px";
                    eleminbtn.style["bottom"] = defaultStyle.bottom + "px";
                    eleminbtn.style["left"] = defaultStyle.left + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                    eleminbtn.style["right"] = defaultStyle.right + defaultStyle.width / 2 - eleminbtnWidth / 2 + "px";
                }
            }
            if (_this.widgetConfig.displayMinButton == false) {
                eleminbtn.style["display"] = "none";
            }
            _this.conversationListServer.setHiddenConversations(_this.widgetConfig.hiddenConversations);
            _this.RongIMSDKServer.init(_this.widgetConfig.appkey);
            _this.RongIMSDKServer.registerMessage();
            _this.RongIMSDKServer.connect(_this.widgetConfig.token).then(function (userId) {
                _this.conversationListServer.updateConversations();
                _this.conversationListServer.startRefreshOnlineStatus();
                _this.conversationServer._handleConnectSuccess && _this.conversationServer._handleConnectSuccess();
                if (RongWebIMWidget.Helper.checkType(_this.widgetConfig.onSuccess) == "function") {
                    _this.widgetConfig.onSuccess(userId);
                }
                if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function") {
                    _this.providerdata.getUserInfo(userId, {
                        onSuccess: function (data) {
                            _this.providerdata.currentUserInfo =
                                new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                        }
                    });
                }
                //_this.conversationServer._onConnectSuccess();
            }, function (err) {
                if (err.tokenError) {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: 0, info: "token 无效" });
                    }
                }
                else {
                    if (_this.widgetConfig.onError && typeof _this.widgetConfig.onError == "function") {
                        _this.widgetConfig.onError({ code: err.errorCode });
                    }
                }
            });
            _this.RongIMSDKServer.setConnectionStatusListener({
                onChanged: function (status) {
                    _this.providerdata.connectionState = false;
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            _this.$log.debug('链接成功');
                            _this.providerdata.connectionState = true;
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            _this.$log.debug('正在链接');
                            break;
                        //其他设备登陆
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            _this.$log.debug('其他设备登录');
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            _this.$log.debug("网络不可用");
                            break;
                        default:
                            _this.$log.debug(status);
                    }
                }
            });
            _this.RongIMSDKServer.setOnReceiveMessageListener({
                onReceived: function (data) {
                    _this.$log.debug(data);
                    var msg = RongWebIMWidget.Message.convert(data);
                    if (RongWebIMWidget.Helper.checkType(_this.providerdata.getUserInfo) == "function" && msg.content) {
                        _this.providerdata.getUserInfo(msg.senderUserId, {
                            onSuccess: function (data) {
                                if (data) {
                                    msg.content.userInfo = new RongWebIMWidget.UserInfo(data.userId, data.name, data.portraitUri);
                                }
                            }
                        });
                    }
                    switch (data.messageType) {
                        case RongWebIMWidget.MessageType.VoiceMessage:
                            msg.content.isUnReade = true;
                        case RongWebIMWidget.MessageType.TextMessage:
                        case RongWebIMWidget.MessageType.LocationMessage:
                        case RongWebIMWidget.MessageType.ImageMessage:
                        case RongWebIMWidget.MessageType.RichContentMessage:
                            _this.addMessageAndOperation(msg);
                            var voiceBase = _this.providerdata.voiceSound == true
                                && eleplaysound
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.voiceNotification;
                            var currentConvversationBase = _this.conversationServer.current
                                && _this.conversationServer.current.targetType == msg.conversationType
                                && _this.conversationServer.current.targetId == msg.targetId;
                            var notificationBase = (document.hidden || !_this.display)
                                && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                                && _this.widgetConfig.desktopNotification;
                            if ((_this.widgetConfig.displayConversationList && voiceBase) || (!_this.widgetConfig.displayConversationList && voiceBase && currentConvversationBase)) {
                                eleplaysound["play"]();
                            }
                            if ((notificationBase && _this.widgetConfig.displayConversationList) || (!_this.widgetConfig.displayConversationList && notificationBase && currentConvversationBase)) {
                                RongWebIMWidget.NotificationHelper.showNotification({
                                    title: msg.content.userInfo.name,
                                    icon: "",
                                    body: RongWebIMWidget.Message.messageToNotification(data), data: { targetId: msg.targetId, targetType: msg.conversationType }
                                });
                            }
                            break;
                        case RongWebIMWidget.MessageType.ContactNotificationMessage:
                            //好友通知自行处理
                            break;
                        case RongWebIMWidget.MessageType.InformationNotificationMessage:
                            _this.addMessageAndOperation(msg);
                            break;
                        case RongWebIMWidget.MessageType.UnknownMessage:
                            //未知消息自行处理
                            break;
                        case RongWebIMWidget.MessageType.ReadReceiptMessage:
                            if (data.messageDirection == RongWebIMWidget.MessageDirection.SEND) {
                                _this.RongIMSDKServer.clearUnreadCount(data.conversationType, data.targetId);
                            }
                            break;
                        default:
                            //未捕获的消息类型
                            break;
                    }
                    if (_this.onReceivedMessage) {
                        _this.onReceivedMessage(data);
                    }
                    _this.conversationServer.handleMessage(msg);
                    if (!document.hidden && _this.display
                        && _this.conversationServer.current
                        && _this.conversationServer.current.targetType == msg.conversationType
                        && _this.conversationServer.current.targetId == msg.targetId
                        && data.messageDirection == RongWebIMWidget.MessageDirection.RECEIVE
                        && data.messageType != RongWebIMWidget.MessageType.ReadReceiptMessage) {
                        _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                        _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                    }
                    _this.conversationListServer.updateConversations().then(function () { });
                }
            });
            window.onfocus = function () {
                if (_this.conversationServer.current && _this.conversationServer.current.targetId && _this.display) {
                    _this.RongIMSDKServer.getConversation(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            _this.RongIMSDKServer.clearUnreadCount(_this.conversationServer.current.targetType, _this.conversationServer.current.targetId);
                            _this.RongIMSDKServer.sendReadReceiptMessage(_this.conversationServer.current.targetId, _this.conversationServer.current.targetType);
                            _this.conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            };
        };
        WebIMWidget.prototype.addMessageAndOperation = function (msg) {
            if (msg.conversationType === RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE && !this.conversationServer._customService.connected) {
                //客服没有连接直接返回不追加显示消息
                return;
            }
            var key = msg.conversationType + "_" + msg.targetId;
            var hislist = this.conversationServer._cacheHistory[key] = this.conversationServer._cacheHistory[key] || [];
            if (hislist.length == 0) {
                hislist.push(new RongWebIMWidget.GetHistoryPanel());
                hislist.push(new RongWebIMWidget.TimePanl(msg.sentTime));
            }
            this.conversationServer._addHistoryMessages(msg);
        };
        WebIMWidget.prototype.setConversation = function (targetType, targetId, title) {
            this.conversationServer.changeConversation(new RongWebIMWidget.Conversation(targetType, targetId, title));
        };
        WebIMWidget.prototype.setUserInfoProvider = function (fun) {
            this.providerdata.getUserInfo = fun;
        };
        WebIMWidget.prototype.setGroupInfoProvider = function (fun) {
            this.providerdata.getGroupInfo = fun;
        };
        WebIMWidget.prototype.setOnlineStatusProvider = function (fun) {
            this.providerdata.getOnlineStatus = fun;
        };
        WebIMWidget.prototype.setProductInfo = function (obj) {
            if (this.conversationServer._customService.connected) {
                this.RongIMSDKServer.sendProductInfo(this.conversationServer.current.targetId, obj);
            }
            else {
                this.providerdata._productInfo = obj;
            }
        };
        WebIMWidget.prototype.show = function () {
            this.display = true;
        };
        WebIMWidget.prototype.hidden = function () {
            this.display = false;
        };
        WebIMWidget.prototype.getCurrentConversation = function () {
            return this.conversationServer.current;
        };
        WebIMWidget.$inject = ["$q",
            "ConversationServer",
            "ConversationListServer",
            "ProviderData",
            "WidgetConfig",
            "RongIMSDKServer",
            "$log"];
        return WebIMWidget;
    })();
    RongWebIMWidget.WebIMWidget = WebIMWidget;
    angular.module("RongWebIMWidget")
        .service("WebIMWidget", WebIMWidget);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var Position;
    (function (Position) {
        Position[Position["left"] = 1] = "left";
        Position[Position["right"] = 2] = "right";
    })(Position || (Position = {}));
    var RongCustomerService = (function () {
        function RongCustomerService(WebIMWidget) {
            this.WebIMWidget = WebIMWidget;
            this.defaultconfig = {
                __isCustomerService: true
            };
            this.Position = Position;
        }
        RongCustomerService.prototype.init = function (config) {
            var _this = this;
            angular.extend(this.defaultconfig, config);
            var style = {
                right: 20
            };
            if (config.position) {
                if (config.position == Position.left) {
                    style = {
                        left: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
                else {
                    style = {
                        right: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                }
            }
            if (config.style) {
                config.style.width && (style.width = config.style.width);
                config.style.height && (style.height = config.style.height);
            }
            this.defaultconfig.style = style;
            _this.WebIMWidget.init(this.defaultconfig);
            _this.WebIMWidget.onShow = function () {
                _this.WebIMWidget.setConversation(RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE, config.customerServiceId, "客服");
            };
        };
        RongCustomerService.prototype.show = function () {
            this.WebIMWidget.show();
        };
        RongCustomerService.prototype.setProductInfo = function (obj) {
            this.WebIMWidget.setProductInfo(obj);
        };
        RongCustomerService.prototype.hidden = function () {
            this.WebIMWidget.hidden();
        };
        RongCustomerService.$inject = ["WebIMWidget"];
        return RongCustomerService;
    })();
    RongWebIMWidget.RongCustomerService = RongCustomerService;
    angular.module("RongWebIMWidget")
        .service("RongCustomerService", RongCustomerService);
})(RongWebIMWidget || (RongWebIMWidget = {}));
var Evaluate;
(function (Evaluate) {
    var evaluatedir = (function () {
        function evaluatedir($timeout) {
            this.$timeout = $timeout;
            this.restrict = "E";
            this.scope = {
                type: "=",
                display: "=",
                enter: "&confirm",
                dcancle: "&cancle"
            };
            this.templateUrl = './src/ts/evaluate/evaluate.tpl.html';
            evaluatedir.prototype["link"] = function (scope, ele) {
                var stars = [false, false, false, false, false];
                var labels = [{ display: "答非所问" }, { display: "理解能力差" }, { display: "一问三不知" }, { display: "不礼貌" }];
                var enterStars = false; //鼠标悬浮样式
                scope.stars = stars;
                scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                scope.end = false;
                scope.displayDescribe = false;
                scope.data = {
                    stars: 0,
                    value: 0,
                    describe: "",
                    label: ""
                };
                scope.$watch("display", function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    else {
                        enterStars = false;
                        scope.displayDescribe = false;
                        scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                        scope.data = {
                            stars: 0,
                            value: 0,
                            describe: "",
                            label: ""
                        };
                    }
                });
                scope.mousehover = function (data) {
                    !enterStars && (scope.data.stars = data);
                };
                scope.confirm = function (data) {
                    if (data != undefined) {
                        enterStars = true;
                        if (scope.type == 1) {
                            scope.data.stars = data;
                            if (scope.data.stars != 5) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                        else {
                            scope.data.value = data;
                            if (scope.data.value === false) {
                                scope.displayDescribe = true;
                            }
                            else {
                                callbackConfirm(scope.data);
                            }
                        }
                    }
                    else {
                        callbackConfirm(null);
                    }
                };
                scope.commit = function () {
                    var value = [];
                    for (var i = 0, len = scope.labels.length; i < len; i++) {
                        if (scope.labels[i].selected) {
                            value.push(scope.labels[i].display);
                        }
                    }
                    scope.data.label = value;
                    callbackConfirm(scope.data);
                };
                scope.cancle = function () {
                    scope.display = false;
                    scope.dcancle();
                };
                function callbackConfirm(data) {
                    scope.end = true;
                    if (data) {
                        $timeout(function () {
                            scope.display = false;
                            scope.end = false;
                            scope.enter({ data: data });
                        }, 800);
                    }
                    else {
                        scope.display = false;
                        scope.end = false;
                        scope.enter({ data: data });
                    }
                }
            };
        }
        evaluatedir.$inject = ["$timeout"];
        return evaluatedir;
    })();
    angular.module("Evaluate", [])
        .directive("evaluatedir", RongWebIMWidget.DirectiveFactory.GetFactoryFor(evaluatedir));
})(Evaluate || (Evaluate = {}));
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../lib/window.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    runApp.$inject = ["$http", "WebIMWidget", "WidgetConfig", "RongCustomerService"];
    function runApp($http, WebIMWidget, WidgetConfig, RongCustomerService) {
        var protocol = location.protocol === "https:" ? "https:" : "http:";
        $script.get(protocol + "//cdn.ronghub.com/RongIMLib-2.2.0.min.js", function () {
            $script.get(protocol + "//cdn.ronghub.com/RongEmoji-2.2.0.min.js", function () {
                RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.init();
            });
            $script.get(protocol + "//cdn.ronghub.com/RongIMVoice-2.2.0.min.js", function () {
                RongIMLib.RongIMVoice && RongIMLib.RongIMVoice.init();
            });
            if (WidgetConfig._config) {
                if (WidgetConfig._config.__isKefu) {
                    RongCustomerService.init(WidgetConfig._config);
                }
                else {
                    WebIMWidget.init(WidgetConfig._config);
                }
            }
        });
        $script.get(protocol + "//cdn.bootcss.com/plupload/2.1.8/plupload.full.min.js", function () { });
    }
    var rongWidget = (function () {
        function rongWidget() {
            this.restrict = "E";
            this.templateUrl = "./src/ts/main.tpl.html";
            this.controller = "rongWidgetController";
        }
        return rongWidget;
    })();
    var rongWidgetController = (function () {
        function rongWidgetController($scope, $interval, WebIMWidget, WidgetConfig, providerdata, conversationServer, conversationListServer, RongIMSDKServer) {
            this.$scope = $scope;
            this.$interval = $interval;
            this.WebIMWidget = WebIMWidget;
            this.WidgetConfig = WidgetConfig;
            this.providerdata = providerdata;
            this.conversationServer = conversationServer;
            this.conversationListServer = conversationListServer;
            this.RongIMSDKServer = RongIMSDKServer;
            $scope.main = WebIMWidget;
            $scope.config = WidgetConfig;
            $scope.data = providerdata;
            var voicecookie = RongWebIMWidget.Helper.CookieHelper.getCookie("rongcloud.voiceSound");
            providerdata.voiceSound = voicecookie ? (voicecookie == "true") : true;
            $scope.$watch("data.voiceSound", function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                RongWebIMWidget.Helper.CookieHelper.setCookie("rongcloud.voiceSound", newVal);
            });
            var interval = null;
            $scope.$watch("data.totalUnreadCount", function (newVal, oldVal) {
                if (newVal > 0) {
                    interval && $interval.cancel(interval);
                    interval = $interval(function () {
                        $scope.twinkle = !$scope.twinkle;
                    }, 1000);
                }
                else {
                    $interval.cancel(interval);
                }
            });
            $scope.$watch("main.display", function () {
                if (conversationServer.current && conversationServer.current.targetId && WebIMWidget.display) {
                    RongIMSDKServer.getConversation(conversationServer.current.targetType, conversationServer.current.targetId).then(function (conv) {
                        if (conv && conv.unreadMessageCount > 0) {
                            RongIMSDKServer.clearUnreadCount(conversationServer.current.targetType, conversationServer.current.targetId);
                            RongIMSDKServer.sendReadReceiptMessage(conversationServer.current.targetId, conversationServer.current.targetType);
                            conversationListServer.updateConversations().then(function () { });
                        }
                    });
                }
            });
            WebIMWidget.show = function () {
                WebIMWidget.display = true;
                WebIMWidget.fullScreen = false;
                WebIMWidget.onShow && WebIMWidget.onShow();
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            WebIMWidget.hidden = function () {
                WebIMWidget.display = false;
                setTimeout(function () {
                    $scope.$apply();
                });
            };
            $scope.showbtn = function () {
                WebIMWidget.display = true;
                WebIMWidget.onShow && WebIMWidget.onShow();
            };
        }
        rongWidgetController.$inject = ["$scope",
            "$interval",
            "WebIMWidget",
            "WidgetConfig",
            "ProviderData",
            "ConversationServer",
            "ConversationListServer",
            "RongIMSDKServer"
        ];
        return rongWidgetController;
    })();
    angular.module("RongWebIMWidget").run(runApp)
        .directive("rongWidget", RongWebIMWidget.DirectiveFactory.GetFactoryFor(rongWidget))
        .controller("rongWidgetController", rongWidgetController);
    ;
})(RongWebIMWidget || (RongWebIMWidget = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/tsd.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    (function (EnumConversationListPosition) {
        EnumConversationListPosition[EnumConversationListPosition["left"] = 0] = "left";
        EnumConversationListPosition[EnumConversationListPosition["right"] = 1] = "right";
    })(RongWebIMWidget.EnumConversationListPosition || (RongWebIMWidget.EnumConversationListPosition = {}));
    var EnumConversationListPosition = RongWebIMWidget.EnumConversationListPosition;
    (function (EnumConversationType) {
        EnumConversationType[EnumConversationType["PRIVATE"] = 1] = "PRIVATE";
        EnumConversationType[EnumConversationType["DISCUSSION"] = 2] = "DISCUSSION";
        EnumConversationType[EnumConversationType["GROUP"] = 3] = "GROUP";
        EnumConversationType[EnumConversationType["CHATROOM"] = 4] = "CHATROOM";
        EnumConversationType[EnumConversationType["CUSTOMER_SERVICE"] = 5] = "CUSTOMER_SERVICE";
        EnumConversationType[EnumConversationType["SYSTEM"] = 6] = "SYSTEM";
        EnumConversationType[EnumConversationType["APP_PUBLIC_SERVICE"] = 7] = "APP_PUBLIC_SERVICE";
        EnumConversationType[EnumConversationType["PUBLIC_SERVICE"] = 8] = "PUBLIC_SERVICE";
    })(RongWebIMWidget.EnumConversationType || (RongWebIMWidget.EnumConversationType = {}));
    var EnumConversationType = RongWebIMWidget.EnumConversationType;
    (function (MessageDirection) {
        MessageDirection[MessageDirection["SEND"] = 1] = "SEND";
        MessageDirection[MessageDirection["RECEIVE"] = 2] = "RECEIVE";
    })(RongWebIMWidget.MessageDirection || (RongWebIMWidget.MessageDirection = {}));
    var MessageDirection = RongWebIMWidget.MessageDirection;
    (function (ReceivedStatus) {
        ReceivedStatus[ReceivedStatus["READ"] = 1] = "READ";
        ReceivedStatus[ReceivedStatus["LISTENED"] = 2] = "LISTENED";
        ReceivedStatus[ReceivedStatus["DOWNLOADED"] = 4] = "DOWNLOADED";
    })(RongWebIMWidget.ReceivedStatus || (RongWebIMWidget.ReceivedStatus = {}));
    var ReceivedStatus = RongWebIMWidget.ReceivedStatus;
    (function (SentStatus) {
        /**
         * 发送中。
         */
        SentStatus[SentStatus["SENDING"] = 10] = "SENDING";
        /**
         * 发送失败。
         */
        SentStatus[SentStatus["FAILED"] = 20] = "FAILED";
        /**
         * 已发送。
         */
        SentStatus[SentStatus["SENT"] = 30] = "SENT";
        /**
         * 对方已接收。
         */
        SentStatus[SentStatus["RECEIVED"] = 40] = "RECEIVED";
        /**
         * 对方已读。
         */
        SentStatus[SentStatus["READ"] = 50] = "READ";
        /**
         * 对方已销毁。
         */
        SentStatus[SentStatus["DESTROYED"] = 60] = "DESTROYED";
    })(RongWebIMWidget.SentStatus || (RongWebIMWidget.SentStatus = {}));
    var SentStatus = RongWebIMWidget.SentStatus;
    var AnimationType;
    (function (AnimationType) {
        AnimationType[AnimationType["left"] = 1] = "left";
        AnimationType[AnimationType["right"] = 2] = "right";
        AnimationType[AnimationType["top"] = 3] = "top";
        AnimationType[AnimationType["bottom"] = 4] = "bottom";
    })(AnimationType || (AnimationType = {}));
    (function (EnumInputPanelType) {
        EnumInputPanelType[EnumInputPanelType["person"] = 0] = "person";
        EnumInputPanelType[EnumInputPanelType["robot"] = 1] = "robot";
        EnumInputPanelType[EnumInputPanelType["robotSwitchPerson"] = 2] = "robotSwitchPerson";
        EnumInputPanelType[EnumInputPanelType["notService"] = 4] = "notService";
    })(RongWebIMWidget.EnumInputPanelType || (RongWebIMWidget.EnumInputPanelType = {}));
    var EnumInputPanelType = RongWebIMWidget.EnumInputPanelType;
    (function (EnumCustomerStatus) {
        EnumCustomerStatus[EnumCustomerStatus["person"] = 1] = "person";
        EnumCustomerStatus[EnumCustomerStatus["robot"] = 2] = "robot";
    })(RongWebIMWidget.EnumCustomerStatus || (RongWebIMWidget.EnumCustomerStatus = {}));
    var EnumCustomerStatus = RongWebIMWidget.EnumCustomerStatus;
    RongWebIMWidget.MessageType = {
        DiscussionNotificationMessage: "DiscussionNotificationMessage ",
        TextMessage: "TextMessage",
        ImageMessage: "ImageMessage",
        VoiceMessage: "VoiceMessage",
        RichContentMessage: "RichContentMessage",
        HandshakeMessage: "HandshakeMessage",
        UnknownMessage: "UnknownMessage",
        SuspendMessage: "SuspendMessage",
        LocationMessage: "LocationMessage",
        InformationNotificationMessage: "InformationNotificationMessage",
        ContactNotificationMessage: "ContactNotificationMessage",
        ProfileNotificationMessage: "ProfileNotificationMessage",
        CommandNotificationMessage: "CommandNotificationMessage",
        HandShakeResponseMessage: "HandShakeResponseMessage",
        ChangeModeResponseMessage: "ChangeModeResponseMessage",
        TerminateMessage: "TerminateMessage",
        CustomerStatusUpdateMessage: "CustomerStatusUpdateMessage",
        ReadReceiptMessage: "ReadReceiptMessage"
    };
    (function (PanelType) {
        PanelType[PanelType["Message"] = 1] = "Message";
        PanelType[PanelType["InformationNotification"] = 2] = "InformationNotification";
        PanelType[PanelType["System"] = 103] = "System";
        PanelType[PanelType["Time"] = 104] = "Time";
        PanelType[PanelType["getHistory"] = 105] = "getHistory";
        PanelType[PanelType["getMore"] = 106] = "getMore";
        PanelType[PanelType["Other"] = 0] = "Other";
    })(RongWebIMWidget.PanelType || (RongWebIMWidget.PanelType = {}));
    var PanelType = RongWebIMWidget.PanelType;
    var ChatPanel = (function () {
        function ChatPanel(type) {
            this.panelType = type;
        }
        return ChatPanel;
    })();
    RongWebIMWidget.ChatPanel = ChatPanel;
    var TimePanl = (function (_super) {
        __extends(TimePanl, _super);
        function TimePanl(date) {
            _super.call(this, PanelType.Time);
            this.sentTime = date;
        }
        return TimePanl;
    })(ChatPanel);
    RongWebIMWidget.TimePanl = TimePanl;
    var GetHistoryPanel = (function (_super) {
        __extends(GetHistoryPanel, _super);
        function GetHistoryPanel() {
            _super.call(this, PanelType.getHistory);
        }
        return GetHistoryPanel;
    })(ChatPanel);
    RongWebIMWidget.GetHistoryPanel = GetHistoryPanel;
    var GetMoreMessagePanel = (function (_super) {
        __extends(GetMoreMessagePanel, _super);
        function GetMoreMessagePanel() {
            _super.call(this, PanelType.getMore);
        }
        return GetMoreMessagePanel;
    })(ChatPanel);
    RongWebIMWidget.GetMoreMessagePanel = GetMoreMessagePanel;
    var TimePanel = (function (_super) {
        __extends(TimePanel, _super);
        function TimePanel(time) {
            _super.call(this, PanelType.Time);
            this.sentTime = time;
        }
        return TimePanel;
    })(ChatPanel);
    RongWebIMWidget.TimePanel = TimePanel;
    var Message = (function (_super) {
        __extends(Message, _super);
        function Message(content, conversationType, extra, objectName, messageDirection, messageId, receivedStatus, receivedTime, senderUserId, sentStatus, sentTime, targetId, messageType) {
            _super.call(this, PanelType.Message);
        }
        Message.convert = function (SDKmsg) {
            var msg = new Message();
            msg.conversationType = SDKmsg.conversationType;
            msg.extra = SDKmsg.extra;
            msg.objectName = SDKmsg.objectName;
            msg.messageDirection = SDKmsg.messageDirection;
            msg.messageId = SDKmsg.messageId;
            msg.receivedStatus = SDKmsg.receivedStatus;
            msg.receivedTime = new Date(SDKmsg.receivedTime);
            msg.senderUserId = SDKmsg.senderUserId;
            msg.sentStatus = SDKmsg.sendStatusMessage;
            msg.sentTime = new Date(SDKmsg.sentTime);
            msg.targetId = SDKmsg.targetId;
            msg.messageType = SDKmsg.messageType;
            switch (msg.messageType) {
                case RongWebIMWidget.MessageType.TextMessage:
                    var texmsg = new TextMessage();
                    var content = SDKmsg.content.content;
                    content = RongWebIMWidget.Helper.escapeSymbol.encodeHtmlsymbol(content);
                    content = RongWebIMWidget.Helper.discernUrlEmailInStr(content);
                    if (RongIMLib.RongIMEmoji && RongIMLib.RongIMEmoji.emojiToHTML) {
                        content = RongIMLib.RongIMEmoji.emojiToHTML(content);
                    }
                    texmsg.content = content;
                    texmsg.extra = SDKmsg.content.extra;
                    msg.content = texmsg;
                    break;
                case RongWebIMWidget.MessageType.ImageMessage:
                    var image = new ImageMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    image.content = content;
                    image.imageUri = SDKmsg.content.imageUri;
                    image.extra = SDKmsg.content.extra;
                    msg.content = image;
                    break;
                case RongWebIMWidget.MessageType.VoiceMessage:
                    var voice = new VoiceMessage();
                    voice.content = SDKmsg.content.content;
                    voice.duration = SDKmsg.content.duration;
                    voice.extra = SDKmsg.content.extra;
                    msg.content = voice;
                    break;
                case RongWebIMWidget.MessageType.RichContentMessage:
                    var rich = new RichContentMessage();
                    rich.content = SDKmsg.content.content;
                    rich.title = SDKmsg.content.title;
                    rich.imageUri = SDKmsg.content.imageUri;
                    rich.extra = SDKmsg.content.extra;
                    msg.content = rich;
                    break;
                case RongWebIMWidget.MessageType.LocationMessage:
                    var location = new LocationMessage();
                    var content = SDKmsg.content.content || "";
                    if (content.indexOf("base64,") == -1) {
                        content = "data:image/png;base64," + content;
                    }
                    location.content = content;
                    location.latiude = SDKmsg.content.latiude;
                    location.longitude = SDKmsg.content.longitude;
                    location.poi = SDKmsg.content.poi;
                    location.extra = SDKmsg.content.extra;
                    msg.content = location;
                    break;
                case RongWebIMWidget.MessageType.InformationNotificationMessage:
                    var info = new InformationNotificationMessage();
                    msg.panelType = 2; //灰条消息
                    info.content = SDKmsg.content.message;
                    msg.content = info;
                    break;
                case RongWebIMWidget.MessageType.DiscussionNotificationMessage:
                    var discussion = new DiscussionNotificationMessage();
                    discussion.extension = SDKmsg.content.extension;
                    discussion.operation = SDKmsg.content.operation;
                    discussion.type = SDKmsg.content.type;
                    discussion.isHasReceived = SDKmsg.content.isHasReceived;
                    msg.content = discussion;
                case RongWebIMWidget.MessageType.HandShakeResponseMessage:
                    var handshak = new HandShakeResponseMessage();
                    handshak.status = SDKmsg.content.status;
                    handshak.msg = SDKmsg.content.msg;
                    handshak.data = SDKmsg.content.data;
                    msg.content = handshak;
                    break;
                case RongWebIMWidget.MessageType.ChangeModeResponseMessage:
                    var change = new ChangeModeResponseMessage();
                    change.code = SDKmsg.content.code;
                    change.data = SDKmsg.content.data;
                    change.status = SDKmsg.content.status;
                    msg.content = change;
                    break;
                case RongWebIMWidget.MessageType.CustomerStatusUpdateMessage:
                    var up = new CustomerStatusUpdateMessage();
                    up.serviceStatus = SDKmsg.content.serviceStatus;
                    msg.content = up;
                    break;
                case RongWebIMWidget.MessageType.TerminateMessage:
                    var ter = new TerminateMessage();
                    ter.code = SDKmsg.content.code;
                    msg.content = ter;
                    break;
                default:
                    break;
            }
            if (msg.content) {
                msg.content.userInfo = SDKmsg.content.user;
            }
            return msg;
        };
        Message.messageToNotification = function (msg) {
            if (!msg)
                return null;
            var msgtype = msg.messageType, msgContent;
            if (msgtype == RongWebIMWidget.MessageType.ImageMessage) {
                msgContent = "[图片]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.LocationMessage) {
                msgContent = "[位置]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.VoiceMessage) {
                msgContent = "[语音]";
            }
            else if (msgtype == RongWebIMWidget.MessageType.ContactNotificationMessage || msgtype == RongWebIMWidget.MessageType.CommandNotificationMessage) {
                msgContent = "[通知消息]";
            }
            else if (msg.objectName == "RC:GrpNtf") {
                var data = msg.content.message.content.data.data;
                switch (msg.content.message.content.operation) {
                    case "Add":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 加入了群组") : "加入群组";
                        break;
                    case "Quit":
                        msgContent = data.operatorNickname + " 退出了群组";
                        break;
                    case "Kicked":
                        msgContent = data.targetUserDisplayNames ? (data.targetUserDisplayNames.join("、") + " 被剔出群组") : "移除群组";
                        break;
                    case "Rename":
                        msgContent = data.operatorNickname + " 修改了群名称";
                        break;
                    case "Create":
                        msgContent = data.operatorNickname + " 创建了群组";
                        break;
                    case "Dismiss":
                        msgContent = data.operatorNickname + " 解散了群组 " + data.targetGroupName;
                        break;
                    default:
                        break;
                }
            }
            else {
                msgContent = msg.content ? msg.content.content : "";
                msgContent = RongIMLib.RongIMEmoji.emojiToSymbol(msgContent);
                msgContent = msgContent.replace(/\n/g, " ");
                msgContent = msgContent.replace(/([\w]{49,50})/g, "$1 ");
            }
            return msgContent;
        };
        return Message;
    })(ChatPanel);
    RongWebIMWidget.Message = Message;
    var UserInfo = (function () {
        function UserInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return UserInfo;
    })();
    RongWebIMWidget.UserInfo = UserInfo;
    var GroupInfo = (function () {
        function GroupInfo(userId, name, portraitUri) {
            this.userId = userId;
            this.name = name;
            this.portraitUri = portraitUri;
        }
        return GroupInfo;
    })();
    RongWebIMWidget.GroupInfo = GroupInfo;
    var TextMessage = (function () {
        function TextMessage(msg) {
            msg = msg || {};
            this.content = msg.content;
            this.userInfo = msg.userInfo;
        }
        return TextMessage;
    })();
    RongWebIMWidget.TextMessage = TextMessage;
    var HandShakeResponseMessage = (function () {
        function HandShakeResponseMessage() {
        }
        return HandShakeResponseMessage;
    })();
    RongWebIMWidget.HandShakeResponseMessage = HandShakeResponseMessage;
    var ChangeModeResponseMessage = (function () {
        function ChangeModeResponseMessage() {
        }
        return ChangeModeResponseMessage;
    })();
    RongWebIMWidget.ChangeModeResponseMessage = ChangeModeResponseMessage;
    var TerminateMessage = (function () {
        function TerminateMessage() {
        }
        return TerminateMessage;
    })();
    RongWebIMWidget.TerminateMessage = TerminateMessage;
    var CustomerStatusUpdateMessage = (function () {
        function CustomerStatusUpdateMessage() {
        }
        return CustomerStatusUpdateMessage;
    })();
    RongWebIMWidget.CustomerStatusUpdateMessage = CustomerStatusUpdateMessage;
    var InformationNotificationMessage = (function () {
        function InformationNotificationMessage() {
        }
        return InformationNotificationMessage;
    })();
    RongWebIMWidget.InformationNotificationMessage = InformationNotificationMessage;
    var ImageMessage = (function () {
        function ImageMessage() {
        }
        return ImageMessage;
    })();
    RongWebIMWidget.ImageMessage = ImageMessage;
    var VoiceMessage = (function () {
        function VoiceMessage() {
        }
        return VoiceMessage;
    })();
    RongWebIMWidget.VoiceMessage = VoiceMessage;
    var LocationMessage = (function () {
        function LocationMessage() {
        }
        return LocationMessage;
    })();
    RongWebIMWidget.LocationMessage = LocationMessage;
    var RichContentMessage = (function () {
        function RichContentMessage() {
        }
        return RichContentMessage;
    })();
    RongWebIMWidget.RichContentMessage = RichContentMessage;
    var DiscussionNotificationMessage = (function () {
        function DiscussionNotificationMessage() {
        }
        return DiscussionNotificationMessage;
    })();
    RongWebIMWidget.DiscussionNotificationMessage = DiscussionNotificationMessage;
    var Conversation = (function () {
        function Conversation(targetType, targetId, title) {
            this.targetType = targetType;
            this.targetId = targetId;
            this.title = title || "";
        }
        Conversation.onvert = function (item) {
            var conver = new Conversation();
            conver.targetId = item.targetId;
            conver.targetType = item.conversationType;
            conver.title = item.conversationTitle;
            conver.portraitUri = item.senderPortraitUri;
            conver.unreadMessageCount = item.unreadMessageCount;
            return conver;
        };
        return Conversation;
    })();
    RongWebIMWidget.Conversation = Conversation;
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../lib/RongIMLib.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var RongIMSDKServer = (function () {
        function RongIMSDKServer($q) {
            var _this = this;
            this.$q = $q;
            this.connect = function (token) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.connect(token, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onTokenIncorrect: function () {
                        defer.reject({ tokenError: true });
                    },
                    onError: function (errorCode) {
                        defer.reject({ errorCode: errorCode });
                        var info = '';
                        switch (errorCode) {
                            case RongIMLib.ErrorCode.TIMEOUT:
                                info = '连接超时';
                                break;
                            case RongIMLib.ErrorCode.UNKNOWN:
                                info = '未知错误';
                                break;
                            case RongIMLib.ConnectionState.UNACCEPTABLE_PROTOCOL_VERSION:
                                info = '不可接受的协议版本';
                                break;
                            case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                                info = 'appkey不正确';
                                break;
                            case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                                info = '服务器不可用';
                                break;
                            case RongIMLib.ConnectionState.NOT_AUTHORIZED:
                                info = '未认证';
                                break;
                            case RongIMLib.ConnectionState.REDIRECT:
                                info = '重新获取导航';
                                break;
                            case RongIMLib.ConnectionState.APP_BLOCK_OR_DELETE:
                                info = '应用已被封禁或已被删除';
                                break;
                            case RongIMLib.ConnectionState.BLOCK:
                                info = '用户被封禁';
                                break;
                        }
                        console.log("失败:" + info + errorCode);
                    }
                });
                return defer.promise;
            };
            this.getConversation = function (type, targetId) {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getConversation(Number(type), targetId, {
                    onSuccess: function (data) {
                        defer.resolve(data);
                    },
                    onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
            this.getFileToken = function () {
                var defer = _this.$q.defer();
                RongIMLib.RongIMClient.getInstance().getFileToken(RongIMLib.FileType.IMAGE, {
                    onSuccess: function (data) {
                        if (data) {
                            defer.resolve(data.token);
                        }
                        else {
                            defer.reject();
                        }
                    }, onError: function () {
                        defer.reject();
                    }
                });
                return defer.promise;
            };
        }
        RongIMSDKServer.prototype.init = function (appkey) {
            RongIMLib.RongIMClient.init(appkey);
        };
        RongIMSDKServer.prototype.setOnReceiveMessageListener = function (option) {
            RongIMLib.RongIMClient.setOnReceiveMessageListener(option);
        };
        RongIMSDKServer.prototype.setConnectionStatusListener = function (option) {
            RongIMLib.RongIMClient.setConnectionStatusListener(option);
        };
        RongIMSDKServer.prototype.startCustomService = function (targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().startCustomService(targetId, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.sendReadReceiptMessage = function (targetId, type) {
            var that = this;
            RongIMLib.RongIMClient.getInstance()
                .getConversation(Number(type), targetId, {
                onSuccess: function (data) {
                    if (data) {
                        var read = RongIMLib.ReadReceiptMessage
                            .obtain(data.latestMessage.messageUId, data.latestMessage.sentTime, "1");
                        that.sendMessage(type, targetId, read);
                    }
                },
                onError: function () {
                }
            });
        };
        RongIMSDKServer.prototype.sendMessage = function (conver, targetId, content) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().sendMessage(+conver, targetId, content, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (errorCode, message) {
                    defer.reject({ errorCode: errorCode, message: message });
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default:
                            info = "";
                            break;
                    }
                    console.log('发送失败:' + info);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateHumanCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateHumanCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.evaluateRebotCustomService = function (targetId, value, describe) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance().evaluateRebotCustomService(targetId, value, describe, {
                onSuccess: function () {
                    defer.resolve();
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.reconnect = function (callback) {
            RongIMLib.RongIMClient.reconnect(callback);
        };
        RongIMSDKServer.prototype.disconnect = function () {
            RongIMLib.RongIMClient.getInstance().disconnect();
        };
        RongIMSDKServer.prototype.logout = function () {
            if (RongIMLib && RongIMLib.RongIMClient) {
                RongIMLib.RongIMClient.getInstance().logout();
            }
        };
        RongIMSDKServer.prototype.clearUnreadCount = function (type, targetid) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .clearUnreadCount(type, targetid, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getTotalUnreadCount = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getTotalUnreadCount({
                onSuccess: function (num) {
                    defer.resolve(num);
                },
                onError: function () {
                    defer.reject();
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getConversationList = function () {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getConversationList({
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            }, null);
            return defer.promise;
        };
        RongIMSDKServer.prototype.removeConversation = function (type, targetId) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .removeConversation(type, targetId, {
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getHistoryMessages = function (type, targetId, num) {
            var defer = this.$q.defer();
            RongIMLib.RongIMClient.getInstance()
                .getHistoryMessages(type, targetId, null, num, {
                onSuccess: function (data, has) {
                    defer.resolve({
                        data: data,
                        has: has
                    });
                },
                onError: function (error) {
                    defer.reject(error);
                }
            });
            return defer.promise;
        };
        RongIMSDKServer.prototype.getDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .getTextMessageDraft(type, targetId) || "";
        };
        RongIMSDKServer.prototype.setDraft = function (type, targetId, value) {
            return RongIMLib.RongIMClient.getInstance()
                .saveTextMessageDraft(type, targetId, value);
        };
        RongIMSDKServer.prototype.clearDraft = function (type, targetId) {
            return RongIMLib.RongIMClient.getInstance()
                .clearTextMessageDraft(type, targetId);
        };
        RongIMSDKServer.prototype.sendProductInfo = function (targetId, msgContent) {
            var msg = new RongIMLib.RongIMClient.RegisterMessage["ProductMessage"](msgContent);
            this.sendMessage(RongIMLib.ConversationType.CUSTOMER_SERVICE, targetId, msg);
        };
        RongIMSDKServer.prototype.registerMessage = function () {
            var messageName = "ProductMessage"; // 消息名称。
            var objectName = "cs:product"; // 消息内置名称，请按照此格式命名。
            var mesasgeTag = new RongIMLib.MessageTag(true, true); // 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
            var propertys = ["title", "url", "content", "imageUrl", "extra"]; // 消息类中的属性名。
            RongIMLib.RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, propertys);
        };
        RongIMSDKServer.$inject = ["$q"];
        return RongIMSDKServer;
    })();
    RongWebIMWidget.RongIMSDKServer = RongIMSDKServer;
    angular.module("RongWebIMWidget")
        .service("RongIMSDKServer", RongIMSDKServer);
})(RongWebIMWidget || (RongWebIMWidget = {}));
/// <reference path="../../typings/tsd.d.ts"/>
var RongWebIMWidget;
(function (RongWebIMWidget) {
    var ProviderData = (function () {
        function ProviderData() {
            this._cacheUserInfo = [];
            this._cacheGroupInfo = [];
            this.totalUnreadCount = 0;
            this.connectionState = false;
            this.voiceSound = false;
            this.currentUserInfo = {};
        }
        ProviderData.prototype._getCacheUserInfo = function (id) {
            for (var i = 0, len = this._cacheUserInfo.length; i < len; i++) {
                if (this._cacheUserInfo[i].userId == id) {
                    return this._cacheUserInfo[i];
                }
            }
            return null;
        };
        ProviderData.prototype._addUserInfo = function (user) {
            var olduser = this._getCacheUserInfo(user.userId);
            if (olduser) {
                angular.extend(olduser, user);
            }
            else {
                this._cacheUserInfo.push(user);
            }
        };
        return ProviderData;
    })();
    RongWebIMWidget.ProviderData = ProviderData;
    var ElementStyle = (function () {
        function ElementStyle() {
        }
        return ElementStyle;
    })();
    var WidgetConfig = (function () {
        function WidgetConfig() {
            this.displayConversationList = false;
            this.conversationListPosition = RongWebIMWidget.EnumConversationListPosition.left;
            this.displayMinButton = true;
            this.desktopNotification = false;
            this.reminder = "";
            this.voiceNotification = false;
            this.style = {
                positionFixed: false,
                width: 450,
                height: 470,
                bottom: 0,
                right: 0
            };
            this.refershOnlineStateIntercycle = 1000 * 20;
            this.hiddenConversations = [];
            this.__isKefu = false;
        }
        return WidgetConfig;
    })();
    RongWebIMWidget.WidgetConfig = WidgetConfig;
    angular.module("RongWebIMWidget")
        .service("ProviderData", ProviderData)
        .service("WidgetConfig", WidgetConfig);
})(RongWebIMWidget || (RongWebIMWidget = {}));

angular.module('RongWebIMWidget').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('./src/ts/conversation/conversation.tpl.html',
    "<div id=rong-conversation class=\"rongcloud-kefuChatBox rongcloud-both rongcloud-am-fade-and-slide-top\" ng-show=showSelf ng-class=\"{'rongcloud-fullScreen':resoures.fullScreen}\"><evaluatedir type=evaluate.type display=evaluate.showSelf confirm=evaluate.onConfirm(data) cancle=evaluate.onCancle()></evaluatedir><div class=rongcloud-kefuChat><div id=header class=\"rongcloud-rong-header rongcloud-blueBg rongcloud-online\"><div class=\"rongcloud-infoBar rongcloud-pull-left\"><div class=rongcloud-infoBarTit><span class=rongcloud-kefuName ng-bind=conversation.title></span></div></div><div class=\"rongcloud-toolBar rongcloud-headBtn rongcloud-pull-right\"><div ng-show=!config.displayConversationList&&config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><a href=javascript:; class=\"rongcloud-kefuChatBoxHide rongcloud-sprite\" style=margin-right:6px ng-show=!config.displayConversationList ng-click=minimize() title=隐藏></a> <a href=javascript:; class=\"rongcloud-kefuChatBoxClose rongcloud-sprite\" ng-click=close() title=结束对话></a></div></div><div class=rongcloud-outlineBox ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div id=Messages><div class=rongcloud-emptyBox>暂时没有新消息</div><div class=rongcloud-MessagesInner><div ng-repeat=\"item in messageList\" ng-switch=item.panelType><div class=rongcloud-Messages-date ng-switch-when=104><b>{{item.sentTime|historyTime}}</b></div><div class=rongcloud-Messages-history ng-switch-when=105><b ng-click=getHistory()>查看历史消息</b></div><div class=rongcloud-Messages-history ng-switch-when=106><b ng-click=getMoreMessage()>获取更多消息</b></div><div class=rongcloud-sys-tips ng-switch-when=2><span ng-bind-html=item.content.content|trustHtml></span></div><div class=rongcloud-Message ng-switch-when=1><div class=rongcloud-Messages-unreadLine></div><div><div class=rongcloud-Message-header><img class=\"rongcloud-img rongcloud-u-isActionable rongcloud-Message-avatar rongcloud-avatar\" ng-src={{item.content.userInfo.portraitUri||item.content.userInfo.icon}} err-src=http://7xo1cb.com1.z0.glb.clouddn.com/rongcloudkefu2.png errsrcserasdfasdfasdfa alt=\"\"><div class=\"rongcloud-Message-author rongcloud-clearfix\"><a class=\"rongcloud-author rongcloud-u-isActionable\">{{item.content.userInfo.name}}</a></div></div></div><div class=rongcloud-Message-body ng-switch=item.messageType><textmessage ng-switch-when=TextMessage msg=item.content></textmessage><imagemessage ng-switch-when=ImageMessage msg=item.content></imagemessage><voicemessage ng-switch-when=VoiceMessage msg=item.content></voicemessage><locationmessage ng-switch-when=LocationMessage msg=item.content></locationmessage><richcontentmessage ng-switch-when=RichContentMessage msg=item.content></richcontentmessage></div></div></div></div></div><div id=footer class=rongcloud-rong-footer style=\"display: block\"><div class=rongcloud-footer-con><div class=rongcloud-text-layout><div id=funcPanel class=\"rongcloud-funcPanel rongcloud-robotMode\"><div class=rongcloud-mode1 ng-show=\"_inputPanelState==0\"><div class=rongcloud-MessageForm-tool id=expressionWrap><i class=\"rongcloud-sprite rongcloud-iconfont-smile\" ng-click=\"showemoji=!showemoji\"></i><div class=rongcloud-expressionWrap ng-show=showemoji><i class=rongcloud-arrow></i><emoji ng-repeat=\"item in emojiList\" item=item content=conversation></emoji></div></div><div class=rongcloud-MessageForm-tool><i class=\"rongcloud-sprite rongcloud-iconfont-upload\" id=upload-file style=\"position: relative; z-index: 1\"></i></div></div><div class=rongcloud-mode2 ng-show=\"_inputPanelState==2\"><a ng-click=switchPerson() id=chatSwitch class=rongcloud-chatSwitch>转人工服务</a></div></div><pre id=inputMsg class=\"rongcloud-text rongcloud-grey\" contenteditable contenteditable-dire ng-focus=\"showemoji=fase\" style=\"background-color: rgba(0,0,0,0);color:black\" ctrl-enter-keys fun=send() ctrlenter=false placeholder=请输入文字... ondrop=\"return false\" ng-model=conversation.messageContent></pre></div><div class=rongcloud-powBox><button type=button style=\"background-color: #0099ff\" class=\"rongcloud-rong-btn rongcloud-rong-send-btn\" id=rong-sendBtn ng-click=send()>发送</button></div></div></div></div></div>"
  );


  $templateCache.put('./src/ts/conversationlist/conversationList.tpl.html',
    "<div id=rong-conversation-list class=\"rongcloud-kefuListBox rongcloud-both\"><div class=rongcloud-kefuList><div class=\"rongcloud-rong-header rongcloud-blueBg\"><div class=\"rongcloud-toolBar rongcloud-headBtn\"><div ng-show=config.voiceNotification class=rongcloud-voice ng-class=\"{'rongcloud-voice-mute':!data.voiceSound,'rongcloud-voice-sound':data.voiceSound}\" ng-click=\"data.voiceSound=!data.voiceSound\"></div><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent>最近联系人</span><div class=\"rongcloud-sprite rongcloud-arrow-down\" style=\"cursor: pointer\" ng-click=minbtn()></div></div></div><div class=rongcloud-content><div class=rongcloud-netStatus ng-hide=data.connectionState><div class=rongcloud-sprite></div><span>连接断开,请刷新重连</span></div><div><conversation-item ng-repeat=\"item in conversationListServer._conversationList\" item=item></conversation-item></div></div></div></div>"
  );


  $templateCache.put('./src/ts/evaluate/evaluate.tpl.html',
    "<div class=rongcloud-layermbox ng-show=display><div class=rongcloud-laymshade></div><div class=rongcloud-layermmain><div class=rongcloud-section><div class=rongcloud-layermchild ng-show=!end><div class=rongcloud-layermcont><div class=rongcloud-type1 ng-show=\"type==1\"><h4>&nbsp;评价客服</h4><div class=rongcloud-layerPanel1><div class=rongcloud-star><span ng-repeat=\"item in stars track by $index\"><span ng-class=\"{'rongcloud-star-on':$index<data.stars,'rongcloud-star-off':$index>=data.stars}\" ng-click=confirm($index+1) ng-mouseenter=mousehover($index+1) ng-mouseleave=mousehover(0)></span></span></div></div></div><div class=rongcloud-type2 ng-show=\"type==2\"><h4>&nbsp;&nbsp;机器人是否解决了您的问题 ？</h4><div class=rongcloud-layerPanel1><a class=\"rongcloud-rong-btn rongcloud-btnY\" ng-class=\"{'rongcloud-cur':data.value===true}\" href=javascript:void(0); ng-click=confirm(true)>是</a> <a class=\"rongcloud-rong-btn rongcloud-btnN\" ng-class=\"{'rongcloud-cur':data.value===false}\" href=javascript:void(0); ng-click=confirm(false)>否</a></div></div><div class=rongcloud-layerPanel2 ng-show=displayDescribe><p>是否有以下情况 ？</p><div class=rongcloud-labels><span ng-repeat=\"item in labels\"><a class=rongcloud-rong-btn ng-class=\"{'rongcloud-cur':item.selected}\" ng-click=\"item.selected=!item.selected\" href=\"\">{{item.display}}</a></span></div><div class=rongcloud-suggestBox><textarea name=\"\" placeholder=欢迎给我们的服务提建议~ ng-model=data.describe></textarea></div><div class=rongcloud-subBox><a class=rongcloud-rong-btn href=\"\" ng-click=commit()>提交评价</a></div></div></div><div class=rongcloud-layermbtn><span ng-click=confirm()>跳过</span><span ng-click=cancle()>取消</span></div></div><div class=\"rongcloud-layermchild rongcloud-feedback\" ng-show=end><div class=rongcloud-layermcont>感谢您的反馈 ^ - ^ ！</div></div></div></div></div>"
  );


  $templateCache.put('./src/ts/main.tpl.html',
    "<div id=rong-widget-box class=rongcloud-container><div ng-show=main.display><rong-conversation></rong-conversation><rong-conversation-list></rong-conversation-list></div><div id=rong-widget-minbtn class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people\"></div><span class=rongcloud-recent ng-show=\"!data.totalUnreadCount||data.totalUnreadCount==0\">{{config.reminder||\"最近联系人\"}}</span> <span class=rongcloud-recent ng-show=\"data.totalUnreadCount>0\"><span ng-show=twinkle>(有未读消息)</span></span></a></div><div id=rong-widget-minbtn-kefu class=\"rongcloud-kefuBtnBox rongcloud-blueBg\" ng-show=!main.display&&config.displayMinButton ng-click=showbtn()><a class=rongcloud-kefuBtn href=\"javascript: void(0);\"><div class=\"rongcloud-sprite rongcloud-people rongcloud-sprite-kefu\"></div><span class=rongcloud-recent>{{config.reminder||\"联系客服\"}}</span></a></div><audio id=rongcloud-playsound style=\"width: 0px;height: 0px;display: none\" src=\"\" controls></audio></div>"
  );

}]);

/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */
(function(e,t){typeof module!="undefined"&&module.exports?module.exports=t():typeof define=="function"&&define.amd?define(t):this[e]=t()})("$script",function(){function p(e,t){for(var n=0,i=e.length;n<i;++n)if(!t(e[n]))return r;return 1}function d(e,t){p(e,function(e){return!t(e)})}function v(e,t,n){function g(e){return e.call?e():u[e]}function y(){if(!--h){u[o]=1,s&&s();for(var e in f)p(e.split("|"),g)&&!d(f[e],g)&&(f[e]=[])}}e=e[i]?e:[e];var r=t&&t.call,s=r?t:n,o=r?e.join(""):t,h=e.length;return setTimeout(function(){d(e,function t(e,n){if(e===null)return y();!n&&!/^https?:\/\//.test(e)&&c&&(e=e.indexOf(".js")===-1?c+e+".js":c+e);if(l[e])return o&&(a[o]=1),l[e]==2?y():setTimeout(function(){t(e,!0)},0);l[e]=1,o&&(a[o]=1),m(e,y)})},0),v}function m(n,r){var i=e.createElement("script"),u;i.onload=i.onerror=i[o]=function(){if(i[s]&&!/^c|loade/.test(i[s])||u)return;i.onload=i[o]=null,u=1,l[n]=2,r()},i.async=1,i.src=h?n+(n.indexOf("?")===-1?"?":"&")+h:n,t.insertBefore(i,t.lastChild)}var e=document,t=e.getElementsByTagName("head")[0],n="string",r=!1,i="push",s="readyState",o="onreadystatechange",u={},a={},f={},l={},c,h;return v.get=m,v.order=function(e,t,n){(function r(i){i=e.shift(),e.length?v(i,r):v(i,t,n)})()},v.path=function(e){c=e},v.urlArgs=function(e){h=e},v.ready=function(e,t,n){e=e[i]?e:[e];var r=[];return!d(e,function(e){u[e]||r[i](e)})&&p(e,function(e){return u[e]})?t():!function(e){f[e]=f[e]||[],f[e][i](t),n&&n(r)}(e.join("|")),v},v.done=function(e){v([null],e)},v})

/*global plupload ,mOxie*/
/*global ActiveXObject */
/*exported Qiniu */
/*exported QiniuJsSDK */

function QiniuJsSDK() {
  var qiniuUploadUrl;
  if (window.location.protocol === 'https:') {
    qiniuUploadUrl = 'https://up.qbox.me';
  } else {
    qiniuUploadUrl = 'http://upload.qiniu.com';
  }

  this.detectIEVersion = function() {
    var v = 4,
      div = document.createElement('div'),
      all = div.getElementsByTagName('i');
    while (
      div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->',
      all[0]
    ) {
      v++;
    }
    return v > 4 ? v : false;
  };

  this.isImage = function(url) {
    var res, suffix = "";
    var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"];
    var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/;

    if (!url || !suffixMatch.test(url)) {
      return false;
    }
    res = suffixMatch.exec(url);
    suffix = res[1].toLowerCase();
    for (var i = 0, l = imageSuffixes.length; i < l; i++) {
      if (suffix === imageSuffixes[i]) {
        return true;
      }
    }
    return false;
  };

  this.getFileExtension = function(filename) {
    var tempArr = filename.split(".");
    var ext;
    if (tempArr.length === 1 || (tempArr[0] === "" && tempArr.length === 2)) {
      ext = "";
    } else {
      ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case
    }
    return ext;
  };

  this.utf8_encode = function(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: this.utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
      return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '',
      start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n);
      var enc = null;

      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(
          (c1 >> 6) | 192, (c1 & 63) | 128
        );
      } else if (c1 & 0xF800 ^ 0xD800 > 0) {
        enc = String.fromCharCode(
          (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      } else { // surrogate pairs
        if (c1 & 0xFC00 ^ 0xD800 > 0) {
          throw new RangeError('Unmatched trail surrogate at ' + n);
        }
        var c2 = string.charCodeAt(++n);
        if (c2 & 0xFC00 ^ 0xDC00 > 0) {
          throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
        }
        c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
        enc = String.fromCharCode(
          (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (
            c1 & 63) | 128
        );
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }

    if (end > start) {
      utftext += string.slice(start, stringl);
    }

    return utftext;
  };

  this.base64_encode = function(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: this.utf8_encode
    // *     example 1: this.base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = '',
      tmp_arr = [];

    if (!data) {
      return data;
    }

    data = this.utf8_encode(data + '');

    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = o1 << 16 | o2 << 8 | o3;

      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(
        h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
      case 1:
        enc = enc.slice(0, -2) + '==';
        break;
      case 2:
        enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
  };

  this.URLSafeBase64Encode = function(v) {
    v = this.base64_encode(v);
    return v.replace(/\//g, '_').replace(/\+/g, '-');
  };

  this.createAjax = function(argument) {
    var xmlhttp = {};
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  };

  this.parseJSON = function(data) {
    // Attempt to parse using the native JSON parser first
    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(data);
    }

    if (data === null) {
      return data;
    }
    if (typeof data === "string") {

      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = this.trim(data);

      if (data) {
        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if (/^[\],:{}\s]*$/.test(data.replace(
            /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@").replace(
            /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
            "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {

          return (function() {
            return data;
          })();
        }
      }
    }
  };

  this.trim = function(text) {
    return text === null ? "" : text.replace(/^\s+|\s+$/g, '');
  };

  //Todo ie7 handler / this.parseJSON bug;

  var that = this;

  this.uploader = function(op) {
    if (!op.domain) {
      throw 'uptoken_url or domain is required!';
    }

    if (!op.browse_button) {
      throw 'browse_button is required!';
    }

    var option = {};

    var _Error_Handler = op.init && op.init.Error;
    var _FileUploaded_Handler = op.init && op.init.FileUploaded;

    op.init.Error = function() {};
    op.init.FileUploaded = function() {};

    that.uptoken_url = op.uptoken_url;
    that.token = '';
    that.key_handler = typeof op.init.Key === 'function' ? op.init.Key : '';
    this.domain = op.domain;
    var ctx = '';
    var speedCalInfo = {
      isResumeUpload: false,
      resumeFilesize: 0,
      startTime: '',
      currentTime: ''
    };

    var reset_chunk_size = function() {
      var ie = that.detectIEVersion();
      var BLOCK_BITS, MAX_CHUNK_SIZE, chunk_size;
      var isSpecialSafari = (mOxie.Env.browser === "Safari" && mOxie.Env.version <=
          5 && mOxie.Env.os === "Windows" && mOxie.Env.osVersion === "7") ||
        (mOxie.Env.browser === "Safari" && mOxie.Env.os === "iOS" && mOxie.Env
          .osVersion === "7");
      if (ie && ie <= 9 && op.chunk_size && op.runtimes.indexOf('flash') >=
        0) {
        //  link: http://www.plupload.com/docs/Frequently-Asked-Questions#when-to-use-chunking-and-when-not
        //  when plupload chunk_size setting is't null ,it cause bug in ie8/9  which runs  flash runtimes (not support html5) .
        op.chunk_size = 0;

      } else if (isSpecialSafari) {
        // win7 safari / iOS7 safari have bug when in chunk upload mode
        // reset chunk_size to 0
        // disable chunk in special version safari
        op.chunk_size = 0;
      } else {
        BLOCK_BITS = 20;
        MAX_CHUNK_SIZE = 4 << BLOCK_BITS; //4M

        chunk_size = plupload.parseSize(op.chunk_size);
        if (chunk_size > MAX_CHUNK_SIZE) {
          op.chunk_size = MAX_CHUNK_SIZE;
        }
        // qiniu service  max_chunk_size is 4m
        // reset chunk_size to max_chunk_size(4m) when chunk_size > 4m
      }
    };
    reset_chunk_size();

    var getUpToken = function() {
      if (!op.uptoken) {
        var ajax = that.createAjax();
        ajax.open('GET', that.uptoken_url, true);
        // ajax.setRequestHeader("If-Modified-Since", "0");
        ajax.onreadystatechange = function() {
          if (ajax.readyState === 4 && ajax.status === 200) {
            var res = that.parseJSON(ajax.responseText);
            that.token = res.uptoken;
          }
        };
        ajax.send();
      } else {
        that.token = op.uptoken;
      }
    };

    var getFileKey = function(up, file, func) {
      var key = '',
        unique_names = false;
      if (!op.save_key) {
        unique_names = up.getOption && up.getOption('unique_names');
        unique_names = unique_names || (up.settings && up.settings.unique_names);
        if (unique_names) {
          var ext = that.getFileExtension(file.name);
          key = ext ? file.id + '.' + ext : file.id;
        } else if (typeof func === 'function') {
          key = func(up, file);
        } else {
          key = file.name;
        }
      }
      return key;
    };

    plupload.extend(option, op, {
      url: qiniuUploadUrl,
      multipart_params: {
        token: ''
      }
    });

    var uploader = new plupload.Uploader(option);

    uploader.bind('Init', function(up, params) {
      getUpToken();
    });
    uploader.init();

    uploader.bind('FilesAdded', function(up, files) {
      var auto_start = up.getOption && up.getOption('auto_start');
      auto_start = auto_start || (up.settings && up.settings.auto_start);
      if (auto_start) {
        plupload.each(files, function(i, file) {
          up.start();
        });
      }
      up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('BeforeUpload', function(up, file) {
      file.speed = file.speed || 0; // add a key named speed for file obj
      ctx = '';

      if (op.get_new_uptoken) {
        getUpToken();
      }

      var directUpload = function(up, file, func) {
        speedCalInfo.startTime = new Date().getTime();
        var multipart_params_obj;
        if (op.save_key) {
          multipart_params_obj = {
            'token': that.token
          };
        } else {
          multipart_params_obj = {
            'key': getFileKey(up, file, func),
            'token': that.token
          };
        }

        var x_vars = op.x_vars;
        if (x_vars !== undefined && typeof x_vars === 'object') {
          for (var x_key in x_vars) {
            if (x_vars.hasOwnProperty(x_key)) {
              if (typeof x_vars[x_key] === 'function') {
                multipart_params_obj['x:' + x_key] = x_vars[x_key](up,
                  file);
              } else if (typeof x_vars[x_key] !== 'object') {
                multipart_params_obj['x:' + x_key] = x_vars[x_key];
              }
            }
          }
        }


        up.setOption({
          'url': qiniuUploadUrl,
          'multipart': true,
          'chunk_size': undefined,
          'multipart_params': multipart_params_obj
        });
      };


      var chunk_size = up.getOption && up.getOption('chunk_size');
      chunk_size = chunk_size || (up.settings && up.settings.chunk_size);
      if (uploader.runtime === 'html5' && chunk_size) {
        if (file.size < chunk_size) {
          directUpload(up, file, that.key_handler);
        } else {
          var localFileInfo = localStorage.getItem(file.name);
          var blockSize = chunk_size;
          if (localFileInfo) {
            localFileInfo = JSON.parse(localFileInfo);
            var now = (new Date()).getTime();
            var before = localFileInfo.time || 0;
            var aDay = 24 * 60 * 60 * 1000; //  milliseconds
            if (now - before < aDay) {
              if (localFileInfo.percent !== 100) {
                if (file.size === localFileInfo.total) {
                  // 通过文件名和文件大小匹配，找到对应的 localstorage 信息，恢复进度
                  file.percent = localFileInfo.percent;
                  file.loaded = localFileInfo.offset;
                  ctx = localFileInfo.ctx;

                  //  计算速度时，会用到
                  speedCalInfo.isResumeUpload = true;
                  speedCalInfo.resumeFilesize = localFileInfo.offset;
                  if (localFileInfo.offset + blockSize > file.size) {
                    blockSize = file.size - localFileInfo.offset;
                  }
                } else {
                  localStorage.removeItem(file.name);
                }

              } else {
                // 进度100%时，删除对应的localStorage，避免 499 bug
                localStorage.removeItem(file.name);
              }
            } else {
              localStorage.removeItem(file.name);
            }
          }
          speedCalInfo.startTime = new Date().getTime();
          up.setOption({
            'url': qiniuUploadUrl + '/mkblk/' + blockSize,
            'multipart': false,
            'chunk_size': chunk_size,
            'required_features': "chunks",
            'headers': {
              'Authorization': 'UpToken ' + that.token
            },
            'multipart_params': {}
          });
        }
      } else {
        directUpload(up, file, that.key_handler);
      }
    });

    uploader.bind('UploadProgress', function(up, file) {
      // 计算速度

      speedCalInfo.currentTime = new Date().getTime();
      var timeUsed = speedCalInfo.currentTime - speedCalInfo.startTime; // ms
      var fileUploaded = file.loaded || 0;
      if (speedCalInfo.isResumeUpload) {
        fileUploaded = file.loaded - speedCalInfo.resumeFilesize;
      }
      file.speed = (fileUploaded / timeUsed * 1000).toFixed(0) || 0; // unit: byte/s
    });

    uploader.bind('ChunkUploaded', function(up, file, info) {
      var res = that.parseJSON(info.response);

      ctx = ctx ? ctx + ',' + res.ctx : res.ctx;
      var leftSize = info.total - info.offset;
      var chunk_size = up.getOption && up.getOption('chunk_size');
      chunk_size = chunk_size || (up.settings && up.settings.chunk_size);
      if (leftSize < chunk_size) {
        up.setOption({
          'url': qiniuUploadUrl + '/mkblk/' + leftSize
        });
      }
      localStorage.setItem(file.name, JSON.stringify({
        ctx: ctx,
        percent: file.percent,
        total: info.total,
        offset: info.offset,
        time: (new Date()).getTime()
      }));
    });

    uploader.bind('Error', (function(_Error_Handler) {
      return function(up, err) {
        var errTip = '';
        var file = err.file;
        if (file) {
          switch (err.code) {
            case plupload.FAILED:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.FILE_SIZE_ERROR:
              var max_file_size = up.getOption && up.getOption(
                'max_file_size');
              max_file_size = max_file_size || (up.settings && up.settings
                .max_file_size);
              errTip = '浏览器最大可上传' + max_file_size + '。更大文件请使用命令行工具。';
              break;
            case plupload.FILE_EXTENSION_ERROR:
              errTip = '文件验证失败。请稍后重试。';
              break;
            case plupload.HTTP_ERROR:
              if (err.response === '') {
                // Fix parseJSON error ,when http error is like net::ERR_ADDRESS_UNREACHABLE
                errTip = err.message || '未知网络错误。';
                break;
              }
              var errorObj = that.parseJSON(err.response);
              var errorText = errorObj.error;
              switch (err.status) {
                case 400:
                  errTip = "请求报文格式错误。";
                  break;
                case 401:
                  errTip = "客户端认证授权失败。请重试或提交反馈。";
                  break;
                case 405:
                  errTip = "客户端请求错误。请重试或提交反馈。";
                  break;
                case 579:
                  errTip = "资源上传成功，但回调失败。";
                  break;
                case 599:
                  errTip = "网络连接异常。请重试或提交反馈。";
                  break;
                case 614:
                  errTip = "文件已存在。";
                  try {
                    errorObj = that.parseJSON(errorObj.error);
                    errorText = errorObj.error || 'file exists';
                  } catch (e) {
                    errorText = errorObj.error || 'file exists';
                  }
                  break;
                case 631:
                  errTip = "指定空间不存在。";
                  break;
                case 701:
                  errTip = "上传数据块校验出错。请重试或提交反馈。";
                  break;
                default:
                  errTip = "未知错误。";
                  break;
              }
              errTip = errTip + '(' + err.status + '：' + errorText +
                ')';
              break;
            case plupload.SECURITY_ERROR:
              errTip = '安全配置错误。请联系网站管理员。';
              break;
            case plupload.GENERIC_ERROR:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.IO_ERROR:
              errTip = '上传失败。请稍后再试。';
              break;
            case plupload.INIT_ERROR:
              errTip = '网站配置错误。请联系网站管理员。';
              uploader.destroy();
              break;
            default:
              errTip = err.message + err.details;
              break;
          }
          if (_Error_Handler) {
            _Error_Handler(up, err, errTip);
          }
        }
        up.refresh(); // Reposition Flash/Silverlight
      };
    })(_Error_Handler));

    uploader.bind('FileUploaded', (function(_FileUploaded_Handler) {
      return function(up, file, info) {

        var last_step = function(up, file, info) {
          if (op.downtoken_url) {
            var ajax_downtoken = that.createAjax();
            ajax_downtoken.open('POST', op.downtoken_url, true);
            ajax_downtoken.setRequestHeader('Content-type',
              'application/x-www-form-urlencoded');
            ajax_downtoken.onreadystatechange = function() {
              if (ajax_downtoken.readyState === 4) {
                if (ajax_downtoken.status === 200) {
                  var res_downtoken;
                  try {
                    res_downtoken = that.parseJSON(ajax_downtoken
                      .responseText);
                  } catch (e) {
                    throw ('invalid json format');
                  }
                  var info_extended = {};
                  plupload.extend(info_extended, that.parseJSON(
                    info), res_downtoken);
                  if (_FileUploaded_Handler) {
                    _FileUploaded_Handler(up, file, JSON.stringify(
                      info_extended));
                  }
                } else {
                  uploader.trigger('Error', {
                    status: ajax_downtoken.status,
                    response: ajax_downtoken.responseText,
                    file: file,
                    code: plupload.HTTP_ERROR
                  });
                }
              }
            };
            ajax_downtoken.send('key=' + that.parseJSON(info).key +
              '&domain=' + op.domain);
          } else if (_FileUploaded_Handler) {
            _FileUploaded_Handler(up, file, info);
          }
        };
        info.response=info.response.replace(/'/g,"\"");
        var res = that.parseJSON(info.response);
        ctx = ctx ? ctx : res.ctx;
        if (ctx) {
          var key = '';
          if (!op.save_key) {
            key = getFileKey(up, file, that.key_handler);
            key = key ? '/key/' + that.URLSafeBase64Encode(key) : '';
          }

          var fname = '/fname/' + that.URLSafeBase64Encode(file.name);

          var x_vars = op.x_vars,
            x_val = '',
            x_vars_url = '';
          if (x_vars !== undefined && typeof x_vars === 'object') {
            for (var x_key in x_vars) {
              if (x_vars.hasOwnProperty(x_key)) {
                if (typeof x_vars[x_key] === 'function') {
                  x_val = that.URLSafeBase64Encode(x_vars[x_key](up,
                    file));
                } else if (typeof x_vars[x_key] !== 'object') {
                  x_val = that.URLSafeBase64Encode(x_vars[x_key]);
                }
                x_vars_url += '/x:' + x_key + '/' + x_val;
              }
            }
          }

          var url = qiniuUploadUrl + '/mkfile/' + file.size + key +
            fname + x_vars_url;
          var ajax = that.createAjax();
          ajax.open('POST', url, true);
          ajax.setRequestHeader('Content-Type',
            'text/plain;charset=UTF-8');
          ajax.setRequestHeader('Authorization', 'UpToken ' + that.token);
          ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
              localStorage.removeItem(file.name);
              if (ajax.status === 200) {
                var info = ajax.responseText;
                last_step(up, file, info);
              } else {
                uploader.trigger('Error', {
                  status: ajax.status,
                  response: ajax.responseText,
                  file: file,
                  code: -200
                });
              }
            }
          };
          ajax.send(ctx);
        } else {
          last_step(up, file, info.response);
        }

      };
    })(_FileUploaded_Handler));

    return uploader;
  };

  this.getUrl = function(key) {
    if (!key) {
      return false;
    }
    key = encodeURI(key);
    var domain = this.domain;
    if (domain.slice(domain.length - 1) !== '/') {
      domain = domain + '/';
    }
    return domain + key;
  };

  this.imageView2 = function(op, key) {
    var mode = op.mode || '',
      w = op.w || '',
      h = op.h || '',
      q = op.q || '',
      format = op.format || '';
    if (!mode) {
      return false;
    }
    if (!w && !h) {
      return false;
    }

    var imageUrl = 'imageView2/' + mode;
    imageUrl += w ? '/w/' + w : '';
    imageUrl += h ? '/h/' + h : '';
    imageUrl += q ? '/q/' + q : '';
    imageUrl += format ? '/format/' + format : '';
    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;
  };


  this.imageMogr2 = function(op, key) {
    var auto_orient = op['auto-orient'] || '',
      thumbnail = op.thumbnail || '',
      strip = op.strip || '',
      gravity = op.gravity || '',
      crop = op.crop || '',
      quality = op.quality || '',
      rotate = op.rotate || '',
      format = op.format || '',
      blur = op.blur || '';
    //Todo check option

    var imageUrl = 'imageMogr2';

    imageUrl += auto_orient ? '/auto-orient' : '';
    imageUrl += thumbnail ? '/thumbnail/' + thumbnail : '';
    imageUrl += strip ? '/strip' : '';
    imageUrl += gravity ? '/gravity/' + gravity : '';
    imageUrl += quality ? '/quality/' + quality : '';
    imageUrl += crop ? '/crop/' + crop : '';
    imageUrl += rotate ? '/rotate/' + rotate : '';
    imageUrl += format ? '/format/' + format : '';
    imageUrl += blur ? '/blur/' + blur : '';

    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;
  };

  this.watermark = function(op, key) {

    var mode = op.mode;
    if (!mode) {
      return false;
    }

    var imageUrl = 'watermark/' + mode;

    if (mode === 1) {
      var image = op.image || '';
      if (!image) {
        return false;
      }
      imageUrl += image ? '/image/' + this.URLSafeBase64Encode(image) : '';
    } else if (mode === 2) {
      var text = op.text ? op.text : '',
        font = op.font ? op.font : '',
        fontsize = op.fontsize ? op.fontsize : '',
        fill = op.fill ? op.fill : '';
      if (!text) {
        return false;
      }
      imageUrl += text ? '/text/' + this.URLSafeBase64Encode(text) : '';
      imageUrl += font ? '/font/' + this.URLSafeBase64Encode(font) : '';
      imageUrl += fontsize ? '/fontsize/' + fontsize : '';
      imageUrl += fill ? '/fill/' + this.URLSafeBase64Encode(fill) : '';
    } else {
      // Todo mode3
      return false;
    }

    var dissolve = op.dissolve || '',
      gravity = op.gravity || '',
      dx = op.dx || '',
      dy = op.dy || '';

    imageUrl += dissolve ? '/dissolve/' + dissolve : '';
    imageUrl += gravity ? '/gravity/' + gravity : '';
    imageUrl += dx ? '/dx/' + dx : '';
    imageUrl += dy ? '/dy/' + dy : '';

    if (key) {
      imageUrl = this.getUrl(key) + '?' + imageUrl;
    }
    return imageUrl;

  };

  this.imageInfo = function(key) {
    if (!key) {
      return false;
    }
    var url = this.getUrl(key) + '?imageInfo';
    var xhr = this.createAjax();
    var info;
    var that = this;
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        info = that.parseJSON(xhr.responseText);
      }
    };
    xhr.send();
    return info;
  };


  this.exif = function(key) {
    if (!key) {
      return false;
    }
    var url = this.getUrl(key) + '?exif';
    var xhr = this.createAjax();
    var info;
    var that = this;
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        info = that.parseJSON(xhr.responseText);
      }
    };
    xhr.send();
    return info;
  };

  this.get = function(type, key) {
    if (!key || !type) {
      return false;
    }
    if (type === 'exif') {
      return this.exif(key);
    } else if (type === 'imageInfo') {
      return this.imageInfo(key);
    }
    return false;
  };


  this.pipeline = function(arr, key) {

    var isArray = Object.prototype.toString.call(arr) === '[object Array]';
    var option, errOp, imageUrl = '';
    if (isArray) {
      for (var i = 0, len = arr.length; i < len; i++) {
        option = arr[i];
        if (!option.fop) {
          return false;
        }
        switch (option.fop) {
          case 'watermark':
            imageUrl += this.watermark(option) + '|';
            break;
          case 'imageView2':
            imageUrl += this.imageView2(option) + '|';
            break;
          case 'imageMogr2':
            imageUrl += this.imageMogr2(option) + '|';
            break;
          default:
            errOp = true;
            break;
        }
        if (errOp) {
          return false;
        }
      }
      if (key) {
        imageUrl = this.getUrl(key) + '?' + imageUrl;
        var length = imageUrl.length;
        if (imageUrl.slice(length - 1) === '|') {
          imageUrl = imageUrl.slice(0, length - 1);
        }
      }
      return imageUrl;
    }
    return false;
  };

}

var Qiniu = new QiniuJsSDK();
