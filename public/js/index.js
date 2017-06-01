/**
 * Created by NewNet on 2017/5/24.
 */
$(function () {
    var $login = $('.login');
    var $register = $('.register');
    var $userMes = $('.userMes');
    //切换到注册面板
    $login.find('a').click(function(){
        $register.show();
        $login.hide();
    });

    //切换到登录面板
    $register.find('a').click(function(){
        $login.show();
        $register.hide();
    });

    //注册
    $register.find('button').click(function(){
        //通过ajax提交请求
        $.ajax({
            type:"post",
            url :"/api/user/register",
            dataType:'json',
            data :{
                username:$register.find("[name='username']").val(),
                password:$register.find("[name='password']").val(),
                repassword:$register.find("[name='repassword']").val()
            },
            success: function(res){
                $register.find('.register-tips').html(res.message);
                if(res.code == 0){
                    //注册成功
                    setTimeout(function(){
                        $login.show();
                        $register.hide();
                    },1000)
                }
            }
        })
    })

    //登录
    $login.find('button').click(function(){
        //通过ajax提交请求
        $.ajax({
            type:"post",
            url :"/api/user/login",
            dataType:'json',
            data :{
                username:$login.find("[name='username']").val(),
                password:$login.find("[name='password']").val()
            },
            success: function(res){
                $login.find('.register-tips').html(res.message);
                if(res.code==0){

                    setTimeout(function () {
                        window.location.reload();
                        //$userMes.show();
                        //$login.hide();
                        //
                        ////登录用户信息
                        //$userMes.find('.userName').html(res.userInfo.username);
                        //$userMes.find('.userTips').html('欢迎光临我的播客');
                    },1000)
                }
            }
        })
    })

    //前台退出
    $('#loginout').click(function () {
        $.ajax({
            type:"get",
            url :"/api/user/logout",
            success : function (res) {
                if(res.code == 0){
                    window.location.reload();
                }
            }
        })
    });
    //后台退出
    $('#adminLogout').click(function () {
        $.ajax({
            type:"get",
            url :"/api/user/logout",
            success : function (res) {
                if(res.code == 0){
                    window.location.href="/";
                }
            }
        })
    });
})