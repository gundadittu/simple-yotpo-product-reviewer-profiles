var head = document.getElementsByTagName("head")[0];

var jqueryScript = document.createElement('script');
jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js';

var jqueryModalScript = document.createElement('script');
jqueryModalScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js';

var jqueryModalCssLink = document.createElement('link');
jqueryModalCssLink.rel = 'stylesheet';
jqueryModalCssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css';

head.append(jqueryScript, jqueryModalScript, jqueryModalCssLink);

function attachProfileLinksToReviewHeader() {
  const profileOverlayDiv = $("#reviewer-profile-overlay-view");
  const yotpoReviewsDivs = $("div.yotpo-review.yotpo-regular-box");
  
  yotpoReviewsDivs.each(function (_, _) {
    const reviewId = $(this).attr("data-review-id");
    const requestUrl = profileOverlayDiv.attr("data-url") + '/reviewer-profile/' + reviewId;
    const yotpoReviewHeaderDiv = $(this).find("div.yotpo-header");
    yotpoReviewHeaderDiv.click(function () {
      profileOverlayDiv.empty();
      profileOverlayDiv.append("Loading...");
      profileOverlayDiv.modal();
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: { 'Access-Control-Allow-Origin': '*' },
        dataType: "html",
        success: function (html) {
          console.log("entered attachProfileLinksToReviewHeader ajax-success")
          profileOverlayDiv.empty();
          profileOverlayDiv.append(html);
        },
        error: function (_xhr, _ajaxOptions, _thrownError) {
          // TODO: report error? 
          profileOverlayDiv.empty();
          profileOverlayDiv.append("Something went wrong...");
        }
      });
    });
    yotpoReviewHeaderDiv.css('cursor', 'pointer');
  });
}

// TODO: test this, any IE browser stuff needed?
function ready(e, attempt) {
  if (attempt > 5) {
    // TODO: report error here?
    return
  } else if ("complete" === document.readyState) {
    e();
  } else {
    setTimeout(ready(e, ++attempt), 1000);
  }
}

setTimeout(function () {
  ready(attachProfileLinksToReviewHeader, 0);
}, 1500);