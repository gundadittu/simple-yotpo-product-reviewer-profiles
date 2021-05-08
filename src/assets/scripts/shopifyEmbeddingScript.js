/* 
* This js script is inserted into a script tag on a shopify site. 
* It downloads the necessary html and css to attach a popup profile to each Yotpo review.
*/

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
      profileOverlayDiv.append("<h1> Loading... </h1>");
      profileOverlayDiv.modal();
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: { 'Access-Control-Allow-Origin': '*' },
        dataType: "html",
        success: function (html) {
          profileOverlayDiv.empty();
          profileOverlayDiv.append(html);
        },
        error: function (xhr, _ajaxOptions, _thrownError) {
          console.log('Error loading review profile: '+JSON.parse(xhr.responseText));
          profileOverlayDiv.empty();
          profileOverlayDiv.append("<h1> Something went wrong... </h1>");
        }
      });
    });
    yotpoReviewHeaderDiv.css('cursor', 'pointer');
  });
}

function bindYotpoWidgetListener() {
  $('yotpo-nav-content').bind('DOMSubtreeModified', function () {
    attachProfileLinksToReviewHeader();
  });
}

function setUp() {
  attachProfileLinksToReviewHeader();
  bindYotpoWidgetListener();
}

function ready(e) {
  if ("complete" === document.readyState) {
    e();
  } else {
    document.addEventListener("DOMContentLoaded", (_event) => {
      e();
    });
  }
}

setTimeout(function () {
  ready(setUp);
}, 1500);