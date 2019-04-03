const electron = require('electron');
const ipcRenderer=electron.ipcRenderer;
const fs = require('fs');
const id = new Date().getTime();
console.log("id "+id);
function drop(){
console.log("drop");
}

function allowDrop(){
console.log("on drag over");
}

ipcRenderer.on('add-new-tab',(e,args1)=>{
  undockTab();
})

function undockTab(){
    console.log($('.tab').find('span').html());
    if($('.tab').find('span').html()==='Twitter'){
      $('.tabs').append('<li class="tab" data-target="#page1"> <span>Google</span>'+
      '<button type="button" class="close">×</button>'+
    '</li>');
    $('.tab-content').append(' <div class="tab-pane" id="page1">'+
    '<webview id="tab1-webview" src="https://www.google.com/" ></webview>'+
  '</div>');
    }else{
        $('.tabs').append('<li class="tab" data-target="#page2"> <span>Twitter</span>'+
      '<button type="button" class="close">×</button>'+
    '</li>');
    $('.tab-content').append(' <div class="tab-pane" id="page2">'+
    '<webview id="tab2-webview" src="https://www.twitter.com/" ></webview>'+
  '</div>');
    }
    $('webview').height(window.innerHeight-60);
    $('.tabs').chrometab();
}
ipcRenderer.on('is-tab-available-reply',function(e,arg){
    console.log("is tab available reply ");
    if(arg.id===id){
        console.log("id matched");
        $('.tab').remove();
         $('.tab-pane').remove();
         replyArg=arg;
         addNewTab();
         
    }



    
});

function addNewTab(){
    $('.tabs').append(replyArg.tab);
    $('.tab-content').append(replyArg.tabContent);
    $('.tabs').chrometab();
    webview = document.querySelector('webview');
    webview.addEventListener('did-stop-loading',function(){
        console.log("stop loading ");
        let content = webview.getWebContents();
        let executable = 'document.querySelector(\'input[name="q"]\').value=\"'+replyArg.webviewContent+'\"';
        console.log("executable "+executable);
        content.executeJavaScript(executable, true)
        .then((result) => {
            console.log("conent added");
        },err=>{
            console.log("error "+JSON.stringify(err));
        })
        
    })
}
ipcRenderer.send('is-tab-available',id);

(function($){
    console.log("window.inner "+window.innerHeight);
    
    $('webview').height(window.innerHeight-60);

  

    window.expandInnerWebview=function expandInnerWebview(){
        console.log("right "+$('#innerWebview').css("margin-right"));
        if($('#innerWebview').css("margin-right")==="5px"){
            console.log("here01");
            $('#innerWebview').css({"margin-right":"420px"});
            $('#innerWebview').css({"margin-left":"60px"});
        }else{
            console.log("here02");
            $('#innerWebview').css({"margin-right":"5px"});
            $('#innerWebview').css({"margin-left":"5px"});
        }
        
    }

    window.expandOuterWebview=function expandOuterWebview(){
        console.log("right "+$('#innerWebview').css("margin-right"));
        if($('#innerWebview').css("margin-right")==="60px"){
            console.log("here01");
            $('#innerWebview').css({"margin-right":"420px"});
        }else{
            console.log("here02");
            $('#innerWebview').css({"margin-right":"60px"});
        }
        
    }
    
})($);


