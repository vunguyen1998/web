var Story = function(){
    var readMoreControll = function(){
        var descriptionElm = document.getElementById('story-detail').getElementsByClassName('description')[0];
        descriptionElm.addEventListener('click',function(){
            if(this.className.indexOf('show')!==-1){
                this.className = this.className.replace(' show','');
            }else{
                this.className = this.className + ' show';
            }

        });
    };
    var avatarLetter = function(name){
        var ws = name.split(' ');
        if(ws.length>2) ws = ws.splice(ws.length-2);
        var avatar = '';
        ws.forEach(function(w){avatar+=w.split('')[0];});
        return avatar;
    };
    var userAvatar = function(data){
        var namedisplay = typeof(data.namedisplay)=="undefined"?data.Name:data.namedisplay;
        if(typeof(data.avatar)!="undefined" && data.avatar!=null && data.avatar!=''){
            var userID = typeof(data.UserID)=="undefined"?data.id:data.UserID;
            return '<img class="avatar" src="https://img.dtruyen.com/public/images/avatars/'+Math.floor(userID/5000)+'/'+data.avatar+'.jpg" alt="'+namedisplay+'" width="40" height="40"/>';
        }
        return '<span class="avatar-letter">'+avatarLetter(namedisplay)+'</span>';
    };
    var userLabels = {
        'normal':'Thành viên thường',
        'vip':'Mạnh thường quân',
        'author':'Tác giả',
        'trans':'Dịch giả',
        'converter':'Converter',
        'admin':'Admin'
    };
    var commentElement = function(comment){
        var d = new Date(comment.Time*1000);
        var cl = 'comment clearfix';
        cl += comment.replyTo>0?' subComment':'';
        var li = document.createElement('li');
        li.className = cl;
        li.setAttribute('data-user-id',comment.UserID);
        li.setAttribute('data-parent',comment.replyTo);
        li.setAttribute('data-id',comment.ID);
        li.innerHTML = userAvatar(comment)+'<div class="comment-content"><p class="userinfo"><a href="#">'+comment.Name+'</a> <i class="fa fa-circle"></i> <span>'+(d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear())+'</span></p>\n' +
            '                                        <p class="message">'+ comment.Comment +
            '</p> </div>\n' +
            '                                    <div class="acts">\n' +
            '                                        <a href="#" rel="nofollow" class="action-reply-comment" title="Trả lời" data-type="story" data-object="'+comment.StoryID+'" data-id="'+comment.ID+'"><i class="fa fa-reply"></i> Trả lời</a><a href="#" rel="nofollow" class="action-love-comment" data-id="'+comment.ID+'"><i class="fa fa-thumbs-o-up"></i> Thích <span class="likeCount">. '+comment.liked+'</span></a></div>';
        return li;
    };
    var commentItem = function(comment){
        var ts = ['','Tác giả','Dịch giả','Converter'];
        var ts2 = ['','author','trans','converter'];
        var d = new Date(comment.Time*1000);
        var cl = comment.replyTo>0?' subComment':'';
        var labels = [];
        if(typeof comment.labels != "undefined" && comment.labels!=null && comment.labels!=''){
            labels = comment.labels.split(';');
        }
        var owner = false;
        if(editorids.indexOf(parseInt(comment.UserID))!=-1){
            owner = true;
            if(labels.indexOf(ts2[storytype])==-1) labels.push(ts2[storytype]);
        }
        cl += ' '+labels.join(' ');

        var html = '<li id="comment'+comment.ID+'" class="comment clearfix'+cl+'" data-user-id="'+comment.UserID+'" data-parent="'+comment.replyTo+'" data-id="'+comment.ID+'" itemscope itemtype="http://schema.org/UserComments">\n' +
            userAvatar(comment)+'<div class="comment-content"><div class="userinfo"><p itemprop="creator" itemscope itemtype="http://schema.org/Person"><span itemprop="name">';
        if(comment.UserID!="0") html += '<a href="'+location.origin+'/profile/'+comment.UserID+'" itemprop="url">'+comment.Name+'</a>';
        else html += '<a href="#">'+comment.Name+'</a>';
        html += '</span></p>';
        if(labels){
            html += '<p class="labels">';
            for(var i=0;i<labels.length;i++) html += '<span class="label-'+labels[i]+'">'+userLabels[labels[i]]+'</span>';
            html += '</p>';
        }
        html += ' <i class="fa fa-circle"></i> <time itemprop="commentTime">'+(d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear())+'</time>';
        if(owner) html += '<small style="margin-left: 10px;color: #e91b0c;"><em>'+ts[storytype]+' truyện <strong>'+storyname+'</strong></em></small>';
        html += '</div>\n' +
            '                                        <p class="message" itemprop="commentText">'+ comment.Comment +
            '</p> </div>\n' +
            '                                    <div class="acts">\n' +
            '                                        <a href="#" rel="nofollow" class="action-reply-comment" title="Trả lời" data-type="story" data-object="'+comment.StoryID+'" data-id="'+comment.ID+'"><i class="fa fa-reply"></i> Trả lời</a><a href="#" rel="nofollow" class="action-love-comment" data-id="'+comment.ID+'"><i class="fa fa-thumbs-o-up"></i> Thích <span class="likeCount">. '+comment.liked+'</span></a></div>\n' +
            '                                </li>';
        return html;
    };
    var commentPaged = 1;
    var handleReplyComment = function(e){
        e.preventDefault();
        var cs = document.getElementsByClassName('replyComment');
        for(var i=0;i<cs.length;i++){
            cs[i].parentNode.removeChild(cs[i]);
        }
        if(!Main.isLoged()){
            replyCommentID = this.getAttribute('data-id');
            document.getElementById('userPanel').firstChild.click();
            return;
        }
        var reCm = document.createElement('div');
        reCm.className = 'comment replyComment clearfix';
        reCm.innerHTML = '<div class="comment-content"><textarea data-object="'+this.getAttribute('data-object')+'" data-id="'+this.getAttribute('data-id')+'" class="comment-text" placeholder="Trả lời bình luận"></textarea><button type="button"><i class="fa-paper-plane"></i> Gửi</button></div>';
        var cmbox = this.parentNode.parentNode;
        var lastSub,nextCmt;
        if(cmbox.getAttribute('data-parent')!=0){
            nextCmt = cmbox.nextSibling;
            while(nextCmt){
                if(nextCmt.getAttribute('data-parent')==0){
                    lastSub = nextCmt.previousSibling;
                    lastSub.appendChild(reCm);
                    reCm.style.paddingLeft='0';
                    break;
                }
                nextCmt = nextCmt.nextSibling;
            }
        }else{
            cmbox.appendChild(reCm);
        }
        reCm.getElementsByTagName('button')[0].addEventListener('click',function () {
            var textarea = this.previousSibling;
            sendPostComment(textarea.getAttribute('data-object'),textarea.value,textarea.getAttribute('data-id'),function(xhr){
                var data = JSON.parse(xhr.responseText);
                if(data.status==0) return alert(data.message);
                var parentCmt = textarea.parentNode.parentNode.parentNode;
                if(parentCmt.nextSibling){
                    parentCmt.parentNode.insertBefore(commentElement(data.comment),parentCmt.nextSibling);
                }else{
                    parentCmt.parentNode.appendChild(commentElement(data.comment));
                }
                var cs = document.getElementsByClassName('replyComment');
                for(var i=0;i<cs.length;i++){
                    cs[i].parentNode.removeChild(cs[i]);
                }
            });
        });
        var rlText = reCm.getElementsByTagName('textarea')[0];
        rlText.focus();
    };
    var loadComments = function(storyID,paged,limit){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if(data.status==0) return;
                var html = '';
                for(var i=0;i<data.comments.length;i++){
                    html += commentItem(data.comments[i]);
                }
                document.getElementById('comment-list').innerHTML = html;
                var cmts = document.getElementById('comment-list').getElementsByTagName('li');
                for(i=0;i<cmts.length;i++){
                    cmts[i].getElementsByClassName('action-reply-comment')[0].addEventListener('click',handleReplyComment);
                    cmts[i].getElementsByClassName('action-love-comment')[0].addEventListener('click',function (e) {
                        e.preventDefault();
                        var id = this.getAttribute('data-id');
                        likeComment(id);
                    });
                }
                var m = document.getElementById('comment-more');
                commentPaged++;
                if(data.more==true){
                    m.innerHTML = '<a href="#" data-paged="'+commentPaged+'" rel="nofollow"><i class="fa-angle-down"></i> Xem thêm</a>';
                    m.firstChild.addEventListener('click',function(e){
                        e.preventDefault();
                        loadComments(document.getElementById('storyID').value,this.getAttribute('data-paged'),10);
                        document.getElementById('comment-list').scrollIntoView(true);
                    });
                }else{
                    m.parentNode.removeChild(m);
                }
            }
        };

        xhr.open('GET', location.origin+'/ajax/comments?storyID='+storyID+'&paged='+paged+'&limit='+limit, true);
        xhr.send();
    };
	var commenting = false;
    var postComment = function(){
        var commentFrm = document.getElementsByClassName('comment-form')[0];
        sendPostComment(commentFrm.storyID.value,commentFrm.message.value,commentFrm.replyTo.value,function(xhr){
            var data = JSON.parse(xhr.responseText);
            if(data.status==0) return alert(data.message);
            document.getElementById('comment-list').innerHTML = commentItem(data.comment)+document.getElementById('comment-list').innerHTML;
        });
    };
    var likeComment = function(id){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if(data.status==0) return alert(data.message);
                document.getElementById('comment'+data.ID).getElementsByClassName('likeCount')[0].innerHTML = '. '+data.liked;
            }
        };

        xhr.open('POST', location.origin+'/ajax/likeComment/', true);
        var formData = new FormData();
        formData.append('ID',id);
        xhr.send(formData);
    };
    var sendPostComment = function(storyID,message,replyTo,callback){
		if(commenting) return;
		commenting = true;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
			commenting = false;
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr);
            }
        };

        xhr.open('POST', location.origin+'/ajax/postComment/', true);
        var formData = new FormData();
        formData.append('storyID',storyID);
        formData.append('message',message);
        formData.append('replyTo',replyTo);
        xhr.send(formData);
    };
    var isFacebookLoaded = false;
    var loadFacebookSdk = function(){
        if(isFacebookLoaded) return;
        isFacebookLoaded = true;
        var js = document.createElement('script');
        js.onload = function() {
            FB.init({
                appId            : '186176814913219',
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v7.0'
            });
        };
        js.src = "https://connect.facebook.net/vi_VN/sdk.js";
        document.body.appendChild(js);
    };
    var rating = function(){
        var  i= 0;
        var elem = this;
        while((elem=elem.previousSibling)!=null) ++i;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if(data.status==0) return alert(data.message);
                var res = (data.sumrate/data.count).toFixed(1);
                document.getElementsByClassName('rate-holder')[0].firstChild.style.width = (res*10)+'%';
                var strongs = document.getElementsByClassName('rate')[0].getElementsByTagName('strong');
                strongs[0].innerText = res;
                strongs[1].innerText = data.count;
                alert('Cảm ơn bạn đã đánh giá truyện');
            }
        };

        xhr.open('POST', location.origin+'/ajax/rating/', true);
        var formData = new FormData();
        formData.append('storyID',document.getElementById('storyID').value);
        formData.append('rate',i);
        xhr.send(formData);
    };
    var ratingEvent = function(){
        var is = document.getElementById('rating-action').getElementsByTagName('i');
        for(var i=0;i<is.length;i++){
            is[i].addEventListener('click',rating);
        }
    };
    var scrollEvent = function(){
        windowHeight = window.innerHeight;
        window.onscroll = function(){
            if(document.getElementById('facebook-comments').getBoundingClientRect().top - window.scrollY<=0) loadFacebookSdk();
        };
    };
    return {
        init: function(){
            readMoreControll();
            loadComments(document.getElementById('storyID').value,1,10);
            scrollEvent();
            ratingEvent();
            document.getElementsByClassName('comment-form')[0].addEventListener('submit',function(e){
                e.preventDefault();
                if(!Main.isLoged()){
                    document.getElementById('userPanel').firstChild.click();
                    return;
                }
                postComment();
            });
            if(document.getElementById('goto-page')!=null){
                document.getElementById('goto-page').addEventListener('click',function(e){
                    e.preventDefault();
                    var page = parseInt(this.previousSibling.value);
                    if(page<0 || page>parseInt(this.getAttribute('data-total'))) return;
                    var storyUrl = location.href.replace(location.origin+'/','').split('/')[0];
                    location.href = location.origin+'/'+storyUrl+'/'+page+'/';
                });
            }
            document.getElementById('add_favorite').addEventListener('click',function(e){
                e.preventDefault();
                if(!Main.isLoged()){
                    document.getElementById('userPanel').firstChild.click();
                    return;
                }
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(ev){
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        alert('Đã thêm vào danh sách truyện yêu thích');
                    }
                };
                xhr.open('POST',location.origin+'/user/mt_add_favorite/'+document.getElementById('storyID').value);
                xhr.send();
            });
            if(location.href.split('/').length>=6){
                window.scrollTo(0,document.getElementById('chapters').getBoundingClientRect().top);
            }
            document.getElementById('comment-message').addEventListener('input',function(){
                document.getElementById('comment-char-count').lastChild.textContent = this.value.length;
            });
            var buy_combo_btn = document.getElementById('buy-combo');
            if(buy_combo_btn != undefined){
                buying = false;
                buy_combo_btn.addEventListener('click',function(){
                    if(buying) return;
                    buying = true;
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function(ev){
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var data = JSON.parse(xhr.responseText);
                            if(data.status==0){
                                alert(data.message);
                                if(typeof data.paypaldata != 'undefined') Main.showTopup(data.paypaldata);
                                return;
                            }
                            alert('Thành công! Bạn được đọc toàn bộ truyện '+document.getElementsByTagName('h1')[0].innerHTML+' 1 lần');
                            buy_combo_btn.parentNode.innerHTML = '<p>Bạn có <strong class="point">'+data.combo.times+'</strong> lượt đọc chương truyện <strong>'+document.getElementsByTagName('h1')[0].innerHTML+'</strong></p>';
                        }
                    };
                    xhr.open('POST',location.origin+'/user/buy_combo/');
                    var formData = new FormData();
                    formData.append('storyID',this.getAttribute('data-id'));
                    xhr.send(formData);
                });
            }
        }
    };
}();
document.addEventListener('DOMContentLoaded', function() {
    Story.init();
});