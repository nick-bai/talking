module RongWebIMWidget {

    enum Position {
        left = 1, right = 2
    }

    export class RongCustomerService {

        static $inject: string[] = ["WebIMWidget"];

        defaultconfig: any = {
            __isCustomerService: true
        }

        Position: any = Position

        constructor(private WebIMWidget: RongWebIMWidget.WebIMWidget) {

        }

        init(config) {
            var _this = this;
            angular.extend(this.defaultconfig, config)
            var style = <any>{
                right: 20
            }
            if (config.position) {
                if (config.position == Position.left) {
                    style = {
                        left: 20,
                        bottom: 0,
                        width: 325,
                        positionFixed: true
                    };
                } else {
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
            _this.WebIMWidget.onShow = function() {
                _this.WebIMWidget.setConversation(RongWebIMWidget.EnumConversationType.CUSTOMER_SERVICE, config.customerServiceId, "客服");
            }
        }

        show() {
            this.WebIMWidget.show();
        }
        setProductInfo(obj: any) {
            this.WebIMWidget.setProductInfo(obj);
        }

        hidden() {
            this.WebIMWidget.hidden();
        }
    }

    angular.module("RongWebIMWidget")
        .service("RongCustomerService", RongCustomerService);

}
