/* 
* This js script is inserted into a script tag on a shopify site. 
* It downloads the necessary html and css to attach a popup profile to each Yotpo review.
*/

var libs = [
  {
    tag: 'script',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js',
  },
  {
    tag: 'script',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js',
  },
  {
    tag: 'link',
    rel: 'stylesheet',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css',
  }
];

/*
* Injects required libraries sequentially
* based on dependency tree hierarchy
*/
(function injectLibsFromStack() {
  if (libs.length === 0) {
    return;
  }
  const nextLib = libs.shift();
  var head = document.getElementsByTagName("head")[0];
  if (nextLib.tag === 'script') {
    var scriptTag = document.createElement('script');
    scriptTag.src = nextLib.src
    scriptTag.onload = function (e) {
      injectLibsFromStack();
    };
    head.appendChild(scriptTag);
  } else if (nextLib.tag === 'link') {
    var linkTag = document.createElement('link');
    linkTag.href = nextLib.href;
    linkTag.rel = nextLib.rel;
    head.appendChild(linkTag);
    injectLibsFromStack();
  }
})();

/*
* Extracts the review id from each Yotpo review div
* and attaches a click action that fetches and displays
* the relevant profile
*/
function attachProfileLinksToAllReviews() {
  const profileOverlayDiv = $("#reviewer-profile-overlay-view");
  const profileOverlayChildDiv = profileOverlayDiv.find("#reviewer-profile-overlay-view-child");

  const yotpoReviewsDivs = $("div.yotpo-review.yotpo-regular-box");

  yotpoReviewsDivs.each(function (_ind, _obj) {
    const reviewId = $(this).attr("data-review-id") || null;
    const requestUrl = profileOverlayDiv.attr("data-url") + '/reviewer-profile/' + reviewId;
    const yotpoReviewHeaderDiv = $(this).find("div.yotpo-header");
    yotpoReviewHeaderDiv.click(function () {
      profileOverlayChildDiv.empty();
      profileOverlayChildDiv.append("<h1> Loading... </h1>");
      
      profileOverlayDiv.modal();
      
      $.ajax({
        url: requestUrl,
        type: 'GET',
        headers: { 'Access-Control-Allow-Origin': '*' },
        dataType: "html",
        success: function (htmlStr) {
          profileOverlayChildDiv.empty();        
          profileOverlayChildDiv.append(htmlStr);
        },
        error: function (_xhr, _ajaxOptions, _thrownError) {
          profileOverlayChildDiv.empty();
          profileOverlayChildDiv.append("<h1> We couldn't find this reviewer's profile... </h1>");
        }
      });
    });
    yotpoReviewHeaderDiv.css('cursor', 'pointer');
  });
}

/* 
* Sets up a listener to changes to the Yotpo widget
* such as new reviews added, page changes, etc.
*/
var subtreeModifiedTimer = false;
function bindYotpoWidgetListener() {
  $('div.yotpo-nav-content').bind('DOMSubtreeModified', function (_event) {
    if (subtreeModifiedTimer) {
      return;
    }

    subtreeModifiedTimer = true;
    setTimeout(attachProfileLinksToAllReviews, 500);

    setTimeout(function () {
      subtreeModifiedTimer = false;
    }, 100);
  });
}

/*
* Checks that required dependencies exists 
* and adds retries for calling attachProfileLinksToAllReviews()
* and bindYotpoWidgetListener()
*/
function setUp(attempt=0) {
  if (attempt > 5) {
    return;
  } else if (window.jQuery) {
    attachProfileLinksToAllReviews();
    bindYotpoWidgetListener();
  } else {
    setTimeout(() => setUp(++attempt), 500);
  }
}

/*
* Checks to see if page DOM has loaded
* before executing function e
*/
function ready(e) {
  if ("interactive" !== document.readyState) {
    if ("complete" === document.readyState) {
      e();
    } else if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", function () {
        e();
      });
    } else {
      document.attachEvent("onreadystatechange", function () {
        if ("complete" === document.readyState) {
          e();
        }
      });
    }
  } else {
    setTimeout(function () {
      ready(e);
    }, 500);
  }
}

ready(setUp);