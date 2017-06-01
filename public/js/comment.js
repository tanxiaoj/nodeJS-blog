/**
 * Created by NewNet on 2017/5/31.
 */
var perpage = 4 ;
var page = 1;
var pages = 0;
var comments = [];
//提交评论
$('#btn').click(function () {
    if($('#content').val()==""){
        $('.alert a').html('输入内容不能为空');
        $('.alert').show(100);
        setTimeout(function () {
            $('.alert').hide(100);
        },1000)
        return ;
    }
    $.ajax({
        type:"post",
        url:"/api/comment/post",
        data:{
            contentid:$('#commentId').val(),
            content:$('#content').val()
        },
        success: function (data) {
            $('#content').val("");
            comments = data.data.comments;
            renderComment();
        }
    })
})

$.ajax({
    url:"/api/comment",
    data:{
        contentid:$('#commentId').val()
    },
    success: function (data) {
        comments = data.data ;
        renderComment();
    }
})

$('.pagination').delegate('a','click', function () {
    console.log($(this).parent())
    if($(this).parent().hasClass('Previous')){

        page -- ;
    }else{
        page ++ ;
    }
    renderComment()
})

function renderComment(){
    console.log(comments);
    var $lis = $('.pagination li');
    pages = Math.max(1,Math.ceil(comments.length/perpage));
    var start = Math.max(0,(page - 1) * perpage) ;
    var end = Math.min(start + perpage,comments.length);

    $lis.eq(1).find('a').html(page+ '/' +pages);

    if(page <= 1){
        page = 1;
        $lis.eq(0).html('<span>noPrePage</span>');
    }else{
        $lis.eq(0).html('<a href="javascript:;">prev</a>');
    }

    if(page >= pages){
        page = pages ;
        $lis.eq(2).html('<span>noNextPage</span>');
    }else{
        $lis.eq(2).html('<a href="javascript:;">next</a>');
    }
    if(comments.length==0){
        $("#lists").html("<div class='nodata'>还没有留言</div>");
    }else{
        var html = "";
        for(var i=start;i<end;i++){
            html +="<li><div class='top'><span>"+comments[i].username+"</span><div class='time'>"+comments[i].postTime+"</div></div><div class='content'>"+comments[i].content+"</div></li>";
        }
        $("#lists").html(html);
    }
}