<?php
namespace app\index\controller;

use think\Controller;

class Login extends Controller
{
    public function index()
    {
        return $this->fetch();
    }

    public function doLogin()
    {
        $param = input('param.');

        if( '张三' == $param['uname'] ){
            cookie('uid', 1);
            cookie('uname', '张三');
        }else if( '李四' == $param['uname'] ){

            cookie('uid', 2);
            cookie('uname', '李四');
        }

        $this->redirect( url('index/index') );
    }
}
