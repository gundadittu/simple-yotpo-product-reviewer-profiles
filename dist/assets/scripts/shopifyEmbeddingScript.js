var head=document.getElementsByTagName("head")[0],jqueryScript=document.createElement("script");jqueryScript.src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js";var jqueryModalScript=document.createElement("script");jqueryModalScript.src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js";var jqueryModalCssLink=document.createElement("link");function attachProfileLinksToReviewHeader(){console.log("entered attachProfileLinksToReviewHeader");const e=$("#reviewer-profile-overlay-view");$("div.yotpo-review.yotpo-regular-box").each((function(o,o){const t=$(this).attr("data-review-id"),r=e.attr("data-url")+"/reviewer-profile/"+t,a=$(this).find("div.yotpo-header");a.click((function(){e.empty(),e.append("Loading..."),e.modal(),$.ajax({url:r,type:"GET",headers:{"Access-Control-Allow-Origin":"*"},dataType:"html",success:function(o){console.log("entered attachProfileLinksToReviewHeader ajax-success"),e.empty(),e.append(o)},error:function(o,t,r){console.log(o),e.empty(),e.append("Something went wrong...")}})})),a.css("cursor","pointer")}))}function ready(e,o){console.log("entered ready - attempt "+o),o>5?console.log("Attempt > 5. Skipping. Something went wrong."):"complete"===document.readyState?(console.log("ready 1"),e()):(console.log("ready 2"),setTimeout(ready(e,++o),1e3))}jqueryModalCssLink.rel="stylesheet",jqueryModalCssLink.href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css",head.append(jqueryScript,jqueryModalScript,jqueryModalCssLink),setTimeout((function(){ready(attachProfileLinksToReviewHeader,0)}),1500);