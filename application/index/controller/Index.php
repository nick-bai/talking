<?php
namespace app\index\controller;

use rongyun\ServerAPI;
use think\Controller;

class Index extends Controller
{
    public function _initialize()
    {
        if( empty( cookie('uid') ) ){
            $this->redirect( url('login/index') );
        }
    }

    //聊天主方法
    public function index()
    {
        $appKey = config('APP_KEY');
        $appSecret = config('APP_SECRET');

        $rongYun = new ServerAPI( $appKey, $appSecret );

        $tx = "http://www.tk.com/static/images/1.jpg";
        if( 2 == cookie('uid') ){
            $tx = "http://www.tk.com/static/images/2.jpg";
        }
        $token = $rongYun->getToken( cookie('uid'), cookie('uname'), $tx );

        $token = json_decode( $token, true )['token'];
        $this->assign([
            'token' => $token
        ]);
        return $this->fetch();
    }

    //所有的用户信息
    public function userInfo()
    {
        $return['userlist'] = [
            ['id' => 1, 'name' => '张三', 'portraitUri' => 'http://www.tk.com/static/images/1.jpg'],
            ['id' => 2, 'name' => '李四', 'portraitUri' => 'http://www.tk.com/static/images/2.jpg']
        ];
        return json( $return );
    }

    //登录用户信息
    public function onLine()
    {
        $return['data'] = [
            ['id' => '1', 'status' => true],
            ['id' => '2', 'status' => true]
        ];
        return json( $return );
    }


}
