
;(function($){
    $.fn.extend({
        chrometab: function(options) {

            this.defaultOptions = {};
            var settings = $.extend({}, this.defaultOptions, options);

            return this.each(function() {
                var $tabContainer = $(this),
                    $tabs = $tabContainer.find('.tab'),
                    mouseDown = false,
                    draggedTab = null,
                    tCount = $tabs.length;


                // Fix inline-block margin issues.
                $tabContainer.append($tabs.detach())

                $tabs.on('mousedown', function(e){
                    console.log("mousedown");
                    var $this = $(this),
                        $pane = $this.data('target');

                    $('.tab').add('.tab-pane').removeClass('active')
                    $this.add($pane).addClass('active')

                    mouseDown = true;
                    docked=false;
                    draggedTab = $this;
                    offset = e.offsetX
                    offsetY=e.offsetY;
                    initialTop=e.clientY;
                })

            

                $(document).on('mousemove', function(e){
                    if($('.tab').length<=1){
                       if(mouseDown){
                        console.log("trying to drag");
                        ipcRenderer.send('undock-start',{top:e.clientY})
                       }
                        return;
                    }
                    if(!mouseDown && !draggedTab) return; 
                    var left = e.clientX - offset,
                        ati = $('.tabs').find('.tab.active').index(),
                        top=e.clientY- offsetY;

                    draggedTab.offset({ left: left,top:top });

                    if(initialTop+10<top){
                        console.log("less than top");
                        
                        if(!docked){
                            $tabToDock=$('.tabs').find('.tab.active');
                            console.log("not docked "+$tabToDock.attr('data-target'));
                            $tabContent = $($tabToDock.attr('data-target'));
                            const browserView = document.getElementById('tab1-webview');
                    const browser = browserView.getWebContents();
                    docked=true;
                    browser.executeJavaScript(`document.querySelector('input[name="q"]').value;`, true)
    .then((result) => {
      console.log("extracted result "+result) // Will be the JSON object from the fetch call
      console.log("---------------------------");
      $webviewContent=result;
      $tabContent.remove();
      $('.tab-content').find('.tab-pane').attr('class','tab-pane active');
      console.log('ta '+JSON.stringify($tabToDock));
      $tabToDock.remove();
      $('.tabs').find('.tab').attr('class','tab active');
      openNewWindow();
  
    })
                           
                        
                        }
                        
                        return;
                    }

                    t = $tabs.sort(function(a, b){
                        return $(a).offset().left > $(b).offset().left
                    });

                    $tabs.detach();
                    $tabContainer.append(t)
                   
                    

                    if(ati != $('.tabs').find('.tab.active').index()){
                        $('.tabs').find('.tab.active').css('left', '');
                        $('.tabs').find('.tab.active').css('top','');

                    }

                    $tabs = $tabContainer.find('.tab')

                    e.preventDefault()
                })

                function openNewWindow(){
                    $tabToDock.css({left:'',top:''});
                    var tabHtml = $tabToDock.wrap('<p/>').parent().html();
                    $tabToDock.unwrap();
                    var tabContentHtml = $tabContent.wrap('<p/>').parent().html();
                    $tabContent.unwrap();
                    

                     // Will be the JSON object from the fetch call
      ipcRenderer.send('doc-window', {tab:tabHtml,tabContent:tabContentHtml,
        webviewContent:$webviewContent});
   
                    
                   
                }

                $(document).on('mouseup', function(){
                    console.log("mouse up");
                   
                    docked=false;

                    if(mouseDown && draggedTab){
                        $tabs.css('left', '');
                        $tabs.css('top', '')
                    }
                    mouseDown = false;
                    draggedTab = null;
                })
            });
        }
    });
})(jQuery);