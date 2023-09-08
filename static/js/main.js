var Main = function(){
    var isLogedin = false;
    var modals = [];
    var staticUrl = '/';

    var loadDeferreds = function(){
        var addStylesNode = document.getElementById("deferred-styles");
        var replacement = document.createElement("div"); 
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement);
        addStylesNode.parentElement.removeChild(addStylesNode);
        var addScriptsNode = document.getElementById('deferred-scripts');
        var jss = addScriptsNode.textContent.split(';');
        var script;
        for(var i=0;i<jss.length;i++){
            script = document.createElement('script');
            script.setAttribute('src',jss[i]);
            document.body.appendChild(script);
        }
        addScriptsNode.parentElement.removeChild(addScriptsNode);
    };
    var doLogin = function(){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200){
                var data = JSON.parse(xhr.responseText);
                if(data.status==0) return alert(data.message);
                if(document.getElementById('chapter')!=null) location.reload();
                dataLayer.push({'event': 'user_login'});
                userPanel(data);
                Main.setCookie('lcache',true,180);
                document.body.removeChild(document.getElementById('login-modal'));
            }
        };
        xhr.open('POST',location.origin+'/dang-nhap/',true);
        var formData = new FormData();
        formData.append('email',document.getElementById('email').value);
        formData.append('password',document.getElementById('password').value);
        if(document.getElementById('remember-checkbox').checked){
            formData.append('remember',1);
        }
        var reading = Main.getCookie('readings');
        formData.append('readings',reading);
        xhr.send(formData);
    };
    var userPanel = function(user){
        var avatar = (typeof(user.avatar) != "undefined" && user.avatar)?'https://img.dtruyen.com/public/images/avatars/'+Math.floor(parseInt(user.id)/5000)+'/'+user.avatar+'.jpg':'https://img.dtruyen.com/public/frontend/mobile/img/avatar.png';
        var html = '<div class="userinfo"><img src="'+avatar+'" alt="user img"/><br/>Xin chào <span>'+user.email+'</span><p class="upoint">Bạn có: <strong>'+user.point+'</strong> linh thạch</p></div><nav>';
        if(user.role=="2") html += '<a rel="nofollow" class="author-link" target="_blank" href="'+rootUrl+'/ueditor/story" title="Quản lý và Đăng truyện"><i class="fa fa-cloud-upload"></i> Quản lý &amp; đăng truyện</a>'+
            '<a rel="nofollow" href="'+rootUrl+'/ueditor/billing_setup" title="Cài đặt thanh toán"><i class="fa fa-money"></i> Cài đặt thanh toán</a>'+
            '<a rel="nofollow" href="'+rootUrl+'/ueditor/withdraw" title="Đổi linh thạch"><i class="fa fa-money"></i> Đổi linh thạch</a>';
        else html += '<a rel="nofollow" class="author-link" target="_blank" href="'+rootUrl+'/author" title="Quản lý và Đăng truyện"><i class="fa fa-cloud-upload"></i> Quản lý &amp; đăng truyện</a>';
        html += '<a rel="nofollow" href="'+rootUrl+'/profile/'+user.id+'" title="nạp linh thạch"><i class="fa-user"></i> Trang cá nhân</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/user/point" title="nạp linh thạch"><i class="fa-money"></i> Mua linh thạch bằng thẻ cào ĐT</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/user/paypal" title="nạp linh thạch"><i class="fa-paypal"></i> Mua linh thạch bằng Paypal/VISA</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/user/logpoint" title="nạp linh thạch"><i class="fa-refresh"></i> Lịch sử sử dụng linh thạch</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/favorite" title="Truyện Yêu Thích"><i class="fa-heart-empty"></i> Truyện Yêu Thích</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/history" title="Truyện Đang Đọc"><i class="fa-history"></i> Truyện Đang Đọc</a>' +
            '<a rel="nofollow" href="'+rootUrl+'/doi-mat-khau/" title="Đổi Mật Khẩu"><i class="fa-cog"></i> Đổi Mật Khẩu</a>' +
            '<a rel="nofollow" href="#" id="logout-btn" title="đăng xuất"><i class="fa-off"></i> Đăng Xuất</a>' +
            '</nav>';
        document.getElementById('userPanel').innerHTML = '<a href="#" rel="nofollow" id="show-user-panel"><img src="'+avatar+'" width="35px" height="35px" alt="user icon"></a><div class="panel">'+html+'</div>';
        document.getElementById('userPanel').setAttribute('data-id',user.id);
        loggedEvent();

    };
    var createLoginModal = function(){
        var link = document.createElement('link');
        link.setAttribute('href',staticUrl+'css/login-form.css?t=1');
        link.setAttribute('rel','stylesheet');
        var script = document.createElement('script');
        document.head.appendChild(link);
        script.setAttribute('src','https://img.dtruyen.com/public/frontend/social_login.js?t=23');
        document.head.appendChild(script);
        var script2 = document.createElement('script');
        script2.setAttribute('src','https://apis.google.com/js/platform.js?onload=gapionLoad');
        document.head.appendChild(script2);
        
        var loginForm = '<form id="login-form">' +
            '<input type="email" class="form-control" name="email" id="email" placeholder="Email">' +
            '<input type="password" class="form-control" name="password" id="password" placeholder="Mật khẩu">' +
            '<input type="checkbox" name="remember" checked="checked" id="remember-checkbox"><label for="remember-checkbox">Ghi nhớ mật khẩu</label>' +
            '<button type="submit" name="login">Đăng Nhập</button>' +
            '<a rel="nofollow" title="Quên mật khẩu" href="https://dtruyen.com/quen-mat-khau/">Quên mật khẩu?</a>' +
            '<div class="social-logins">' +
            '<a class="facebook" href="https://www.facebook.com/dialog/oauth?client_id=212174092286047&scope=public_profile,email&redirect_uri=https://dtruyen.com/user/fblogin"><i class="fa fa-facebook-f"></i> Facebook</a>' +
            '<button id="loginGoogle" class="g-signin2" data-onsuccess="onSignIn"></button>' +
            '<a id="zalo" href="" title="zalo">Zalo</a>' +
            '</div>'+
            '<div style="padding: 10px;margin: 10px;border: 1px solid #ddd;color: #7f231c;background-color: #fde1df;border-color: #f55246;">Vui lòng đăng nhập để đăng truyện.</div></form>';
        createModal('login-modal','ĐĂNG NHẬP',loginForm,'<span>Chưa có tài khoản? </span><a rel="nofollow" title="đăng ký thành viên" href="'+rootUrl+'/dang-ky/"><b>Đăng Ký</b></a>');
        var xhrza = new XMLHttpRequest();
        xhrza.onreadystatechange = function(ev){
        if (xhrza.readyState == 4 && xhrza.status == 200) {
           data = JSON.parse(xhrza.responseText);
           document.getElementById("zalo").href = 'https://oauth.zaloapp.com/v4/permission?app_id=4451847493765530081&redirect_uri='+rootUrl+'/user/zalov4&code_challenge='+data.code_challenge+'&state='+data.state;
         }
        }
        xhrza.open("GET", rootUrl+"/ajax/zalov4", true);
        xhrza.send();
        document.getElementById('login-form').addEventListener('submit',function(e){
            e.preventDefault();
            doLogin();
        });
    };
    var unloggedEvent = function(){
        document.getElementById('userPanel').getElementsByClassName('login-btn')[0].addEventListener('click',function(e){
            e.preventDefault();
            createLoginModal();
        });
        var elms = document.getElementsByClassName('show-login-modal');
        for(var i=0;i<elms.length;i++){
            elms[i].addEventListener('click',function(e){
                e.preventDefault();
                createLoginModal();
            });
        }
    };
    var loggedEvent = function(){
        document.getElementById('logout-btn').addEventListener('click',function(e){
            e.preventDefault();
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(ev){
                if (xhr.readyState == 4 && xhr.status == 200){
                    Main.deleteCookie('member');
                    Main.deleteCookie('lcache');
                    document.getElementById('userPanel').innerHTML = '<a href="#" rel="nofollow" class="login-btn" title="Đăng nhập"><i class="fa fa-user"></i> Thành viên</a>';
                    unloggedEvent();
                    var script2 = document.createElement('script');
                    script2.setAttribute('src','https://apis.google.com/js/platform.js?onload=signOut');
                    document.head.appendChild(script2);
                }
            };
            xhr.open('GET',rootUrl+'/dang-xuat/?ajax=1',true);
            xhr.send();
        });
    };
    var initUser = function(){
        // data = {id: 1234, email: 'admin@gmail.com', avatar: 'https://img.dtruyen.com/public/frontend/mobile/img/avatar.png', point: 999}

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var html = '';
                var data;
                if(xhr.responseText==''){
                    html = '<a href="#" rel="nofollow" class="login-btn" title="Đăng nhập"><i class="fa fa-user"></i> Thành viên</a>';
                }else{
                    data = JSON.parse(xhr.responseText);
                    if(data.status==0){
                        html = '<a href="#" rel="nofollow" class="login-btn" title="Đăng nhập"><i class="fa fa-user"></i> Thành viên</a>';
                    }else{
                        isLogedin = true;
                        html = '';
                    }
                }
                document.getElementById('userPanel').innerHTML = html;
                if(!isLogedin){
                    unloggedEvent();
                }else{
                    userPanel(data);
                }
            }
        };

        xhr.open('POST', location.origin+'/ajax/loginInfo', true);
        xhr.send();
    };
    var createModal = function(id,title,content,footer){
        if(document.getElementById('modal-style')==null){
            var link = document.createElement('link');
            link.setAttribute('href',staticUrl+'css/modal.css');
            link.setAttribute('rel','stylesheet');
            document.head.appendChild(link);
        }
        var modal = document.getElementById(id);
        if(modal==null){
            modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = id;
            var html = '<div class="modal-dialog"><div class="modal-content">' +
                '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n' +
                '<h4 class="modal-title">'+title+'</h4></div>' +
                '<div class="modal-body">'+content+'</div></div>';
            if(typeof footer!="undefined" && footer!='') html += '<footer>'+footer+'</footer>';
            html += '</div>';
            modal.innerHTML = html;
            document.body.appendChild(modal);
            modal.style.display = 'block';
            modal.style.opacity = '1';
            modals.push(modal);
            modal.addEventListener('click',function(e){
                e = e || window.event;
                var targ = e.target || e.srcElement || e;
                if (targ.nodeType == 3) targ = targ.parentNode;
                if(targ.className=='modal'){
                    targ.style.display = 'none';
                    targ.style.opacity = '0';
                }else if(targ.className=='close'){
                    var m = targ.parentNode.parentNode.parentNode.parentNode;
                    m.style.display = 'none';
                    m.style.opacity = '0';
                }
            });
        }else{
            modal.style.display = 'block';
            modal.style.opacity = '1';
        }
    };
    var rootUrl = window.location.protocol+'//'+window.location.hostname;
    var deleteHistory = function(id){
        var reading = Main.getCookie('readings');
        if(!reading) return;
        reading = JSON.parse(reading);
        if(typeof reading[id] != "undefined"){
            delete reading[id];
        }
        if(Object.keys(reading).length === 0) document.getElementById('reading-stories').parentNode.removeChild(document.getElementById('reading-stories'));
        else document.getElementById('reading-stories').removeChild(document.getElementById('story-his-'+id));
        Main.setCookie('readings',JSON.stringify(reading),30);
    };
    var chapterNo = function(item){
        var no = 'C'+item.chapter;
        if(item.book && item.book!=0) no = 'Q'+item.book+'-'+no;
        return no;
    };
    var loadReading = function(){
        if(document.getElementsByTagName('aside').length==0) return;
        if(window.location.href != window.location.origin+'/')return;
        var reading = Main.getCookie('readings');
        if(!reading){
            reading = Main.getCookie('history_read');
            if(reading=="") return;
            var stories = reading.split('|')[0].split(',');
            if(stories[0]==''){
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(ev){
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = JSON.parse(xhr.responseText);
                    if(data.status==0 || data.stories.length==0) return;
                    reading = {};
                    for(var i=0;i<data.stories.length;i++){
                        reading[data.stories[i].storyID] = {
                            name: data.stories[i].Name,
                            key: data.stories[i].Key,
                            lastChapter: data.stories[i].lastChapter,
                            chapterID: data.stories[i].chapterID,
                            book: data.stories[i].book,
                            chapter: data.stories[i].chapter,
                            alias: data.stories[i].alias
                        };
                    }
                    Main.setCookie('readings',JSON.stringify(reading),30);
                    loadReading();
                }
            };

            xhr.open('POST', location.origin+'/ajax/historyData', true);
            var formData = new FormData();
            formData.append('reading',reading);
            xhr.send(formData);
            return;
        }
        if(reading == '{}') return;
        reading = JSON.parse(reading);
        var readingElm = document.createElement('div');
        readingElm.id = 'reading-stories';
        document.getElementsByTagName('aside')[0].insertBefore(readingElm,document.getElementsByTagName('aside')[0].lastChild);
        var item,last;
        for(var storyID in reading){
            item = document.createElement('div');
            item.id = 'story-his-'+storyID;
            last = reading[storyID].lastChapter == false?'FULL':'Mới nhất '+chapterNo(reading[storyID].lastChapter);
            item.innerHTML = '<i class="fa-history"></i><a href="'+location.origin+'/'+reading[storyID].key+'/'+reading[storyID].alias+'_'+reading[storyID].chapterID+'.html'+'" rel="nofollow" class="title"><h5>'+reading[storyID].name+'</h5>' +
                '<em>Đang đọc '+chapterNo(reading[storyID])+'</em><span>'+last+'</span></a><button data-id="'+storyID+'">&times;</button>';
            readingElm.appendChild(item);
            item.getElementsByTagName('button')[0].addEventListener('click',function(e){
                deleteHistory(this.getAttribute('data-id'));
            });
        }
    };
    var viaCardForm = '<div id="via-card" class="method-content"><p>Hỗ trợ: <span style="color:#df1a0c">Viettel</span> - <span style="color:#df1a0c">Mobifone</span> - <span style="color:#df1a0c">Vina</span></p>' +
        '<img src="https://img.dtruyen.com/public/frontend/desk/img/the-cao.jpg"/>' +
        '<p class="note"><strong>Chọn đúng nhà mạng - mệnh giá - nhập đúng mã thẻ + số seri để được kiểm duyệt nhanh hơn</strong>' +
        '<br/><span style="color:#df1a0c">GIỮ LẠI THẺ CÀO</span> cho đến khi nhận được điểm!</p>' +
        '<form method="post" action="'+location.origin+'/user/point">' +
        '<div class="form-group"><label>Chọn nhà mạng</label><select name="carrier"><option value="viettel">Viettel</option><option value="mobifone">Mobifone</option><option value="vinaphone">Vinaphone</option></select></div>' +
        '<div class="form-group"><label>Mã thẻ cào</label><input type="text" name="code" placeholder="Mã số sau lớp bạc mỏng"/></div>' +
        '<div class="form-group"><label>Số seri</label><input type="text" name="seri" placeholder="Mã số seri phía sau thẻ"/></div>' +
        '<div class="form-group"><label>Chọn mệnh giá</label><select name="value">' +
        '<option value="">Chọn mệnh giá thẻ</option><option value="">Chọn SAI mệnh giá MẤT THẺ</option>' +
        '<option value="10000">10,000 (140 linh thạch)</option><option value="20000">20,000 (280 linh thạch)</option>' +
        '<option value="30000">30,000 (420 linh thạch)</option><option value="50000">50,000 (700 linh thạch)</option>' +
        '<option value="100000">100,000 (1400 linh thạch)</option><option value="200000">200,000 (2800 linh thạch)</option>' +
        '<option value="300000">300,000 (4200 linh thạch)</option><option value="500000">500,000 (7000 linh thạch)</option><option value="1000000">1,000,000 (14000 linh thạch)</option></select></div>' +
        '<p class="note">Vui lòng kiểm tra kỹ seri vã mã thẻ để duyệt nhanh hơn! <span style="color:#df1a0c">Các bạn nên dùng thẻ Viettel<br/>Số đt hỗ trợ Bank/Zalo: 0382282783</span></p>' +
        '<input class="submit-btn" name="ok" value="Nạp thẻ và chờ duyệt" type="submit"></form></div>';
    var viaPaypalForm = '<div id="via-paypal" class="method-content" style="display: block;"><a target="_blank" style="font-size:30px" href="https://dtruyen.com/user/paypal">Nhấn vào đây để Nạp Linh thạch qua Paypal/Visa</a></div>';
    var viaBankForm = '<div id="via-bank" class="method-content" style="display:none;"><div id="selected-bank">Chọn 1 ngân hàng để chuyển khoản</div><div id="banks">' +
        '<a href="#" class="bank" data-bank="Ngân hàng Vietcombank"><div class="bank-info">Số đt hỗ trợ Bank/Zalo: 0382282783</div></a>' +
        '</div></div>';
    var chooseMethod = function(e){e.preventDefault();
        var cts = document.getElementById('topupModal').getElementsByClassName('method-content');
        var as = document.getElementById('topupModal').getElementsByTagName('nav')[0].getElementsByTagName('a');
        for(var i=0;i<cts.length;i++) cts[i].style.display = 'none';
        for(i=0;i<as.length;i++) as[i].className = '';
        this.className = 'current';
        document.getElementById(this.getAttribute('href').replace('#','')).style.display = 'block';
    };
    var chooseBank = function(e){e.preventDefault();
        var email = document.getElementById('userPanel').getElementsByClassName('userinfo')[0].getElementsByTagName('span')[0].textContent;
        email = email.split('@')[0];
        var x = email.split('_')[0];
        if(x=='zalo' || x=='fb') email = '#'+document.getElementById('userPanel').getAttribute('data-id');
        var bank = this.getAttribute('data-bank').split(' ');
        bank = bank[bank.length-1];
        var html = '<p>Vui lòng chuyển khoản đến tài khoản '+this.getAttribute('data-bank')+'</p>' +
            '<p>'+this.getElementsByTagName('div')[0].innerHTML+'</p>' +
            '<p>Với nội dung: <strong style="color:#df1a0c">WT '+email+'</strong></p>' +
            '<p>Sau đó thông báo với Quản Trị Viên:</p>' +
            '<form method="post" action="https://dtruyen.com/user/point_bank/">' +
            '<div class="form-group"><label>Số tiền</label><input type="number" name="amount" required value="" placeholder="Nhập số tiền đã chuyển"/></div>' +
            '<div class="form-group"><label>Mã giao dịch hoặc nội dung chuyển khoản</label><input type="text" name="content" placeholder="Mã giao dịch hoặc nội dung chuyển khoản" /></div>' +
            '<input class="submit-btn" name="thongbao" value="Thông báo ngay" type="submit"/>' +
            '<input type="hidden" name="bank" value="'+bank+'"/></form>';
        document.getElementById('selected-bank').innerHTML = html;
    };
    var topupEvents = function(){
        var as = document.getElementById('topupModal').getElementsByTagName('nav')[0].getElementsByTagName('a');
        for(var i=0;i<as.length;i++){
            as[i].addEventListener('click',chooseMethod);
        }
        var bs = document.getElementById('topupModal').getElementsByClassName('bank');
        for(i=0;i<bs.length;i++){
            bs[i].addEventListener('click',chooseBank);
        }
    };
    var topupModal = function(data){
        var xviaPaypalForm = viaPaypalForm.replace('current_email',data.email);
        xviaPaypalForm = xviaPaypalForm.replace('custom_value',data.custom_value);
        var content = '<nav><label>Hình thức nạp:</label><a href="#via-card" class="current">Thẻ Cào</a><a href="#via-paypal">Paypal/VISA</a><a href="#via-bank">Ngân Hàng</a></nav>' +
            '<div class="method-contents">' +
            viaCardForm + xviaPaypalForm + viaBankForm +
            '</div>';
        createModal('topupModal','NẠP ĐIỂM',content,'');
        if(document.getElementById('topup-style')==null){
            var style = document.createElement('link');
            style.id = 'topup-style';
            style.setAttribute('rel','stylesheet');
            style.setAttribute('type','text/css');
            style.setAttribute('href','https://dtruyen.com/assets/desktop/css/topup.css');
            document.body.appendChild(style);
        }
        topupEvents();
    };
    var donateModal = function(data){
        var works = ['','sáng tác','dịch','convert'],
            job_titles = ['','Tác Giả','Dịch Giả','Converter'];
        var content = '<h5>Truyện được '+works[data.type]+' bởi '+job_titles[data.type]+' <a target="_blank" href="'+location.origin+'/profile/'+data.authorID+'">'+data.author+'</a>'+'. Nếu cảm thấy hay, hãy khích lệ tinh thần của họ bằng cách ủng hộ Linh Thạch.</h5>' +
            '<div class="form-group"><label>Số linh thạch muốn ủng hộ</label>' +
            '<select name="point" id="donate-point" class="form-control"><option value="10">10 linh thạch</option>' +
            '<option value="20">20 linh thạch</option>' +
            '<option value="30">30 linh thạch</option>' +
            '<option value="40">40 linh thạch</option>' +
            '<option value="50">50 linh thạch</option>' +
            '<option value="100">100 linh thạch</option>' +
            '<option value="200">200 linh thạch</option>' +
            '<option value="300">300 linh thạch</option>' +
            '<option value="500">500 linh thạch</option>' +
            '<option value="1000">1000 linh thạch</option></select></div>' +
            '<div class="form-group"><label>Lời nhắn cho '+job_titles[data.type]+'</label>' +
            '<textarea id="donate-message" name="message" class="form-control" placeholder="Cảm ơn bạn"></textarea></div><input name="story" id="donate-story" type="hidden" value="'+data.storyID+'"/>';
        if(document.getElementById('donate-style')==null){
            var style = document.createElement('style');
            style.id = 'donate-style';
            style.innerText = '#donateModal h5{margin-bottom:15px;font-size: 1.2em;line-height: 1.3em;}' +
                '#donateModal .form-group{margin-bottom: 10px;}#donateModal .form-group label{display:block;font-weight:bold;margin-bottom:5px;}' +
                '#donateModal .form-group .form-control{display:block;padding: 10px 16px;border: 1px solid #ddd;border-radius: 3px;width:100%;}' +
                '#do-donate{border:none;display: inline-block;padding: 12px 16px;border-radius: 2px;color: #fff;background: #2c7abe;font-size: 13px;font-weight:bold;}';
            document.head.appendChild(style);
        }
        createModal('donateModal','ỦNG HỘ '+job_titles[data.type].toUpperCase(),content,'<button type="button" id="do-donate">Ủng Hộ</button>');
        donateEvents();
    };
    var donateEvents = function(){
        document.getElementById('do-donate').addEventListener('click',function(e){
            e.preventDefault();
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(ev){
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = JSON.parse(xhr.responseText);
                    if(data.status==0){
                        if(typeof data.callback!="undefined"){
                            eval(data.callback+'(data.data)');
                            document.body.removeChild(document.getElementById('donateModal'));
                        }
                        return alert(data.message);
                    }
                    document.body.removeChild(document.getElementById('donateModal'));
                    alert(data.message);
                }
            };

            xhr.open('POST', location.origin+'/ajax/donate', true);
            var formData = new FormData();
            formData.append('storyID',document.getElementById('donate-story').value);
            formData.append('point',document.getElementById('donate-point').value);
            formData.append('message',document.getElementById('donate-message').value);
            xhr.send(formData);
        });
    };
    var loginAds = function(){
        if(Main.isLoged()) return;
        var isShowed = Main.getCookie('show-login-ads');
        if(isShowed) return;
        Main.setCookie('show-login-ads',1,1);
        var loginAdsElm = document.createElement('div');
        loginAdsElm.id = 'login-ads';
        loginAdsElm.innerHTML = '<a href="#" id="show-login-modal" rel="nofollow"><img src="https://img.dtruyen.com/login-ads-desktop.gif" alt="login-ads"/></a><a id="close-login-ads" href="#" rel="nofollow">&times;</a>';
        document.body.appendChild(loginAdsElm);
        document.getElementById('show-login-modal').addEventListener('click',function(e){
            e.preventDefault();
            document.body.removeChild(document.getElementById('login-ads'));
            createLoginModal();
        });
        document.getElementById('close-login-ads').addEventListener('click',function(e){
            document.body.removeChild(document.getElementById('login-ads'));
        });
    };
    var shuffle = function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };
    return {
        showloginAds: function(){
            loginAds();
        },
        init: function(){
            loadDeferreds();
            if(document.getElementById('main').getAttribute('data-type')=='chapter' && parseInt(Main.getCookie('autoLoadVip'))){
                setTimeout(initUser,2000);
            }else{
                initUser();
                loadReading();
            }
            var wt_ref = Main.getCookie("wt_ref");
            if(wt_ref==""){
                wt_ref = document.referrer;
                if(wt_ref=="") wt_ref='direct';
                Main.setCookie("wt_ref",wt_ref,0.1);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(ev){
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var links = JSON.parse(xhr.responseText);
                    links = shuffle(links);
                    links = links.slice(0,10);
                    var ct = document.getElementById('footer-links');
                    var a;
                    for(var i=0;i<links.length;i++){
                        a = document.createElement('a');
                        a.setAttribute('href',links[i].url);
                        a.setAttribute('title',links[i].keyword);
                        a.innerText = links[i].keyword;
                        ct.appendChild(a);
                    }
                }
            };
            xhr.open('GET', 'https://img.dtruyen.com/public/frontend/footer_links.json', true);
            xhr.send();
        },
        showTopup: function(data){
            topupModal(data);
        },
        showDonate: function(data){
            donateModal(data);
        },
        isLoged: function(){
            if(document.getElementById('show-user-panel')) return true;
            return false;
        },
        setCookie: function(cname, cvalue, exdays){
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;domain=."+location.host;
        },
        getCookie: function(cname){
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        deleteCookie: function(cname){
            this.setCookie(cname,'',-1);
        },
        str2url: function (str){
            if(str!="") {
                str= str.toLowerCase();
                str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
                str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
                str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
                str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
                str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
                str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
                str= str.replace(/đ/g,"d");
                str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|\“|\”|~|$|_/g,"-");
                str= str.replace(/-+-/g,"-");
                str= str.replace(/^\-+|\-+$/g,"");

            }
            return str;
        }
    };
}();
document.addEventListener('DOMContentLoaded', function() {
    Main.init();
});
var lazyImages = [].slice.call(document.querySelectorAll("img[data-layzr]"));
if ("IntersectionObserver" in window) {
    var lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var lazyImage = entry.target;
                lazyImage.src = lazyImage.getAttribute('data-layzr');
                lazyImageObserver.unobserve(lazyImage);
            }
        });
    });
    lazyImages.forEach(function(lazyImage) {
        lazyImageObserver.observe(lazyImage);
    });
} else {
    var active = false;
    var lazyLoad_fnc = function() {
        if (active === false) {
            active = true;
            setTimeout(function() {
                lazyImages.forEach(function(lazyImage) {
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                        lazyImage.src = lazyImage.getAttribute('data-layzr');
                        lazyImages = lazyImages.filter(function(image) {
                            return image !== lazyImage;
                        });
                        if (lazyImages.length === 0) {
                            document.removeEventListener("scroll", lazyLoad_fnc,{passive: true});
                            window.removeEventListener("resize", lazyLoad_fnc);
                            window.removeEventListener("orientationchange", lazyLoad_fnc);
                        }
                    }
                });
                active = false;
            }, 200);
        }
    };
    document.addEventListener("scroll", lazyLoad_fnc,{passive: true});
    window.addEventListener("resize", lazyLoad_fnc);
    window.addEventListener("orientationchange", lazyLoad_fnc);
    lazyLoad_fnc();
}
function gapionLoad(){
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}
function onSignIn(googleUser){
    var idtoken = googleUser.getAuthResponse().id_token;
    location.href = location.origin+'/user/ggLogin2?code='+idtoken;
}
function signOut() {
    gapi.load('auth2', function() {
        gapi.auth2.init().then(function(){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
        });
    });
}