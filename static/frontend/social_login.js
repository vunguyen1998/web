/*
window.fbAsyncInit = function() {
    FB.init({
    appId      : '212174092286047',
    cookie     : true,  // enable cookies to allow the server to access 
    xfbml      : true,  // parse social plugins on this page
    version    : 'v10.0' // use graph api version 2.12
});

};
// Load the SDK asynchronously
(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/sdk.js";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
document.getElementById('loginfacebook').addEventListener('click',function(e){
	e.preventDefault();
	FB.login(function(login){
	if (login.status === 'connected') {
		 FB.api('/me', {fields: 'email,name,gender'},function(response) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(ev){
                    if (xhr.readyState == 4 && xhr.status == 200) {
						if(typeof dataLayer != 'undefined'){
							dataLayer.push({'event': 'user_login'});
						}
						if(xhr.responseText!=''){
							if(location.host=='m.dtruyen.net') location.href = location.href.replace('m.dtruyen.net','dtruyen.com');
							else window.location.reload();
						}
						else alert('KhÃ´ng thá»ƒ Ä‘Äƒng nháº­p hoáº·c tÃ i khoáº£n bá»‹ khÃ³a');
                    }
                };
				var formData = new FormData();
				formData.append('email',response.email);
				formData.append('name',response.name);
				formData.append('gender',response.gender);
				formData.append('id',response.id);
				formData.append('signedRequest',login.authResponse.signedRequest);
                xhr.open('POST',location.origin+'/user/fblogin',true);
                xhr.send(formData);
		 }); 
	} }, {scope: 'public_profile,email'});
});
var script = document.createElement( "script" )
script.type = "text/javascript";
if(script.readyState) {  // only required for IE <9
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        Zalo.init({
           version: '2.0',
           appId: '4451847493765530081',
           redirectUrl: location.origin + '/user/zalo'
         });
      }
    };
} else {  //Others
    script.onload = function() {
      Zalo.init({
           version: '2.0',
           appId: '4451847493765530081',
           redirectUrl: location.origin + '/user/zalo'
         });
    };
}

script.src = "https://zjs.zdn.vn/zalo/sdk.js";
 document.getElementsByTagName( "head" )[0].appendChild( script );
document.getElementById('zalo').addEventListener('click',function(e){
	e.preventDefault();
	if(typeof Zalo == 'undefined' || !Zalo) return;
    Zalo.getLoginStatus(function(response) {
        if (response.status === 'connected') {
			if(typeof dataLayer != 'undefined'){
							dataLayer.push({'event': 'user_login'});
						}
          Zalo.api('/me',
                'GET',
                {
                  fields: 'id,name'
                },
                function (response) {
                  console.log(response);
                }
          );
        } else {
          Zalo.login();
        }
    });
});
 */
document.getElementById('loginGoogle').addEventListener('click',function(e){
	if(typeof dataLayer != 'undefined'){
							dataLayer.push({'event': 'user_login'});
						}
});