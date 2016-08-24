module Evaluate {
    class evaluatedir {
        static $inject: string[] = ["$timeout"];

        restrict: string = "E";
        scope: any = {
            type: "=",
            display: "=",
            enter: "&confirm",
            dcancle: "&cancle"
        };
        templateUrl: string = './src/ts/evaluate/evaluate.tpl.html';

        constructor(private $timeout: ng.ITimeoutService) {

            evaluatedir.prototype["link"] = function(scope: any, ele: angular.IRootElementService) {
                var stars = [false, false, false, false, false];
                var labels = [{ display: "答非所问" }, { display: "理解能力差" }, { display: "一问三不知" }, { display: "不礼貌" }]
                var enterStars = false;//鼠标悬浮样式

                scope.stars = stars;
                scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                scope.end = false;
                scope.displayDescribe = false;
                scope.data = {
                    stars: 0,
                    value: 0,
                    describe: "",
                    label: ""
                }

                scope.$watch("display", function(newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    } else {
                        enterStars = false;
                        scope.displayDescribe = false;
                        scope.labels = RongWebIMWidget.Helper.cloneObject(labels);
                        scope.data = {
                            stars: 0,
                            value: 0,
                            describe: "",
                            label: ""
                        }
                    }

                })


                scope.mousehover = function(data) {
                    !enterStars && (scope.data.stars = data);
                }

                scope.confirm = function(data) {
                    if (data != undefined) {
                        enterStars = true;
                        if (scope.type == 1) {
                            scope.data.stars = data;
                            if (scope.data.stars != 5) {
                                scope.displayDescribe = true;
                            } else {
                                callbackConfirm(scope.data);
                            }
                        } else {
                            scope.data.value = data;
                            if (scope.data.value === false) {
                                scope.displayDescribe = true;
                            } else {
                                callbackConfirm(scope.data);
                            }
                        }
                    } else {
                        callbackConfirm(null);
                    }
                }

                scope.commit = function() {
                    var value: any[] = [];
                    for (var i = 0, len = scope.labels.length; i < len; i++) {
                        if (scope.labels[i].selected) {
                            value.push(scope.labels[i].display);
                        }
                    }
                    scope.data.label = value;
                    callbackConfirm(scope.data);
                }

                scope.cancle = function() {
                    scope.display = false;
                    scope.dcancle();
                }

                function callbackConfirm(data) {
                    scope.end = true;
                    if (data) {
                        $timeout(function() {
                            scope.display = false;
                            scope.end = false;
                            scope.enter({ data: data });
                        }, 800);
                    } else {
                        scope.display = false;
                        scope.end = false;
                        scope.enter({ data: data });
                    }
                }
            }
        }
    }

    angular.module("Evaluate", [])
        .directive("evaluatedir", RongWebIMWidget.DirectiveFactory.GetFactoryFor(evaluatedir));

}
