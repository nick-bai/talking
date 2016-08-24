var demo = angular.module("demo", ["RongWebIMWidget"]);

demo.config(function($logProvider){
  // $logProvider.debugEnabled(false);
})

demo.controller("main", ["$scope","WebIMWidget", "$http", function($scope,WebIMWidget,
  $http) {

  $scope.show = function() {
    WebIMWidget.show();
  }

  $scope.hidden = function() {
    WebIMWidget.hidden();
  }

  $scope.server = WebIMWidget;
  $scope.targetType=1;

  $scope.setconversation=function(){
    WebIMWidget.setConversation(Number($scope.targetType), $scope.targetId, "自定义:"+$scope.targetId);
  }

    WebIMWidget.init({
      appkey: "3argexb6r934e",
      token: "CIbKk/z1AOjB/ForzWFDWpUnU/cREmEFuMhOJuGv5bPlXUSQuAsZcSIX81T5zgZyU5xfoVDjRmdg2Mh5WIasRw==",
      style:{
        width:600,
        positionFixed:true,
        bottom:20,
      },
      displayConversationList:true,
      conversationListPosition:WebIMWidget.EnumConversationListPosition.right,
      hiddenConversations:[{type:WebIMWidget.EnumConversationType.PRIVATE,id:'bb'}],
      onSuccess:function(id){
        console.log(id);
      },
      onError:function(error){
        console.log("error:"+error);
      }
    });

    WebIMWidget.show();

    WebIMWidget.setUserInfoProvider(function(targetId,obj){
        $http({
          url:"/userinfo.json"
        }).success(function(rep){
          var user;
          rep.userlist.forEach(function(item){
            if(item.id==targetId){
              user=item;
            }
          })

          if(user){
            obj.onSuccess({id:user.id,name:user.name,portraitUri:user.portraitUri});
          }else{
            obj.onSuccess({id:targetId,name:"陌："+targetId});
          }
        })
    });

    WebIMWidget.setOnlineStatusProvider(function(arr,obj){
        $http({
          url:"/online.json"
        }).success(function(rep){
          obj.onSuccess(rep.data);
        })
    })


    WebIMWidget.onClose=function(){
      console.log("已关闭");
    }

    WebIMWidget.show();


}]);
