var MainEvents = function(){
    var searchStory = function(){
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(ev){
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                if(data.stories.length==0 && data.authors.length==0){
                    document.getElementById('search_result').className = 'no-result';
                }
                document.getElementById('search_result').className = 'has-result';
                var html = '<div class="results">';
                for(var i=0;i<data.authors.length;i++){
                    html += '<a href="'+location.origin+'/tac-gia/'+data.authors[i].Key+'/" class="author"><i class="fa-user"></i> Tác giả: '+data.authors[i].AuthorName+'</a>';
                }
                var r = '',l = '';
                for(i=0;i<data.stories.length;i++){
                    r = data.stories[i].redirect==0?'':'-wt'+data.stories[i].redirect;
                    if(data.stories[i].Status=='end') l = 'FULL';
                    else{
                        if(data.stories[i].HaveBook!=0) l = 'Q.'+data.stories[i].MaxBook+' - ';
                        else l = '';
                        l += 'Chương '+data.stories[i].MaxChapter;
                    }
                    html += '<a href="'+location.origin+'/'+data.stories[i].Key+r+'/" class="story">' +
                        '<h4>'+data.stories[i].Name+'</h4><span><i class="fa-user"></i> '+data.stories[i].AuthorName+'</span>' +
                        '<em>'+l+'</em></a>';
                }
                html += '</div><a href="'+location.origin+'/searching/'+Main.str2url(document.getElementById('key').value)+'/" class="">Xem thêm <i class="fa-angle-down"></i></a>';
                document.getElementById('search_result').innerHTML = html;
            }
        };
        xhr.open('POST',location.origin+'/ajax/search/',true);
        var data = new FormData();
        data.append('key',document.getElementById('key').value);
        xhr.send(data);
    };
    var searchBounce=null;
    var searchEvent = function(){
        document.getElementById('key').addEventListener('input',function(){
            clearTimeout(searchBounce);
            searchBounce = setTimeout(searchStory,1000);
        });
    };
    return {
        init: function(){
            searchEvent();
        }
    };
}();
MainEvents.init();