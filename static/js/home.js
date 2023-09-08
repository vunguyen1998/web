var Home = function(){
    var slideNext = function(e){
        e.preventDefault();
        if(this.className.indexOf('disabled')!==-1) return;
        var ul = this.parentNode.getElementsByTagName('ul')[0];
        var paged = parseInt(ul.getAttribute('data-paged'));
        var max = parseInt(ul.getAttribute('data-max'));
        paged++;
        ul.setAttribute('data-paged',paged);
        if(paged>=max) this.className = this.className + ' disabled';
        this.previousSibling.className = this.previousSibling.className.replace('disabled','').trim();
        var translate = (paged-1)*-100;
        ul.style.cssText = 'transform: translateX('+translate+'%);-webkit-transform: translateX('+translate+'%);-o-transform: translateX('+translate+'%);-moz-transform: translateX('+translate+'%);-ms-transform: translateX('+translate+'%);';
    };
    var slidePrev = function(e){
        e.preventDefault();
        if(this.className.indexOf('disabled')!==-1) return;
        var ul = this.parentNode.getElementsByTagName('ul')[0];
        var paged = parseInt(ul.getAttribute('data-paged'));
        paged--;
        ul.setAttribute('data-paged',paged);
        if(paged<=1) this.className = this.className + ' disabled';
        this.nextSibling.className = this.nextSibling.className.replace('disabled','').trim();
        var translate = (paged-1)*-100;
        console.log(translate);
        ul.style.cssText = 'transform: translateX('+translate+'%);-webkit-transform: translateX('+translate+'%);-o-transform: translateX('+translate+'%);-moz-transform: translateX('+translate+'%);-ms-transform: translateX('+translate+'%);';
    };
    var slideController = function(){
        var swipes = document.getElementsByClassName('swipe-stories');
        for(var i=0;i<swipes.length;i++){
            var ul = swipes[i].getElementsByTagName('ul')[0];
            ul.setAttribute('data-max',Math.floor(ul.getElementsByTagName('li').length/3));
            ul.setAttribute('data-paged',1);
            var prev = swipes[i].getElementsByClassName('prev')[0];
            var next = swipes[i].getElementsByClassName('next')[0];
            prev.className = prev.className + ' disabled';
            next.addEventListener('click',slideNext);
            prev.addEventListener('click',slidePrev);
        }
    };
    var periodTime = function(){
        var times = [].slice.call(document.querySelectorAll(".last-updated"));
        var now = (new Date()).getTime();
        for(var i=0;i<times.length;i++){
            var diff = Math.round((now - parseInt(times[i].textContent)*1000)/1000);
            if(diff<60) times[i].textContent = 'Mới đây';
            else if(diff<3600) times[i].textContent = Math.round(diff/60)+' phút trước';
            else if(diff<3600*24) times[i].textContent = Math.round(diff/3600)+' giờ trước';
            else times[i].textContent = Math.round(diff/(24*3600))+' ngày trước';
        }
    };
    var deleteHistory = function(id){
        var reading = Main.getCookie('history_read');
        if(!reading) return;
        reading = reading.split('|');
        var stories = reading[0].split(',');
        var chapters = reading[1].split(',');
        var idx = stories.indexOf(id);
        if(idx==-1) return;
        stories.splice(idx,1);
        chapters.splice(idx,1);
        reading = stories.join(',')+'|'+chapters.join(',');
        if(reading=='|') Main.deleteCookie('history_read');
        else Main.setCookie('history_read',reading,30);
        if(document.getElementById('reading-stories').childNodes.length==1) document.getElementById('reading-stories').parentNode.removeChild(document.getElementById('reading-stories'));
        else document.getElementById('reading-stories').removeChild(document.getElementById('story-his-'+id));
    };
    return {
        init: function(){
            periodTime();
            slideController();
        }
    };
}();
document.addEventListener('DOMContentLoaded', function() {
    Home.init();
});