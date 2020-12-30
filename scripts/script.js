(function () {

    function getCountryCode(cb) {

        var xhr = new XMLHttpRequest();

        function handleStateChange() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                cb(xhr.getResponseHeader('GeoIP-Country-Code') || 'US');
            }
        }

        xhr.open('HEAD', '/');
        xhr.onreadystatechange = handleStateChange;
        xhr.send();
    }

    function getCookieValue(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
        return null;
    }

    var userId = getCookieValue('__we_bucket_id') || 'dev';

    var requestId = getCookieValue('__we_request_id') || 'dev_request';

    window.analyticsGlobals = window.analyticsGlobals || {};
    window.analyticsGlobals.userId = userId;
    window.analyticsGlobals.requestId = requestId;
    window.analyticsGlobals.appVersion = "7.0.0";

    var base64SegmentKey = window.btoa("h9Z4ewnWf83L60TdwjeJcDW8mFBKnbZO:");

    var countryCode = 'US';

    var makeSegmentTrackCall = function (data) {
        var payload = data || {};

        var url = 'https://api.segment.io/v1/track';

        payload.timestamp = (new Date()).toISOString();

        payload.integrations = {
            Heap: true,
        }

        if (payload.properties) {
            payload.properties.app_version = "7.0.0";
            payload.properties.app_name = "vanilla";
            payload.properties.path = window.location.pathname;
            payload.properties.url = window.location.href;
            payload.properties.experiments =
                "&#x3D;control; select1_2&#x3D;2; buildings_near_me&#x3D;2; buttonColor&#x3D;2; dynamicProduct&#x3D;2; enterprisePageUpdates&#x3D;2; hidePricingSection&#x3D;2; howTomorrowWorks&#x3D;2; interactiveFloorplan&#x3D;control; marketHeader&#x3D;2; marketPageVsOfficeSpacePage&#x3D;2; marketing_assets&#x3D;2; newCheckoutWeMembership&#x3D;2; newCheckoutFlowMaintenance&#x3D;1; newSearchCards&#x3D;1; onDemandLink&#x3D;2; productDetailsPages&#x3D;1; saveButton&#x3D;2; searchPage&#x3D;2; self_serve&#x3D;2; siloPageLinking&#x3D;2; stickerShock&#x3D;control; vanillaSelfServe&#x3D;2; virtual_tour_engagement_v2&#x3D;1";
            payload.properties.request_id = requestId;
            payload.properties.device_type = "Desktop";
            payload.properties.country_code = countryCode;
        }

        payload.userId = userId;

        var xhr = new XMLHttpRequest();

        function handleStateChange() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // success
                } else {
                    // failure
                }
            }
        }

        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('Authorization', 'Basic ' + base64SegmentKey);
        xhr.onreadystatechange = handleStateChange;
        xhr.send(JSON.stringify(payload));
    }

    var perfTiming = window.performance.timing;

    function makeTimingCalls(country) {
        countryCode = country;

        makeSegmentTrackCall({
            event: 'Timing Early',
            properties: {
                timingAppcacheTime: perfTiming.domainLookupStart - perfTiming.fetchStart,
                timingConnectEnd: perfTiming.connectEnd,
                timingConnectStart: perfTiming.connectStart,
                timingConnectTime: perfTiming.connectEnd - perfTiming.connectStart,
                timingDomainLookupEnd: perfTiming.domainLookupEnd,
                timingDomainLookupStart: perfTiming.domainLookupStart,
                timingFetchStart: perfTiming.fetchStart,
                timingLookupDomainTime: perfTiming.domainLookupEnd - perfTiming.domainLookupStart,
                timingNavigationStart: perfTiming.navigationStart,
                timingReadyStart: perfTiming.fetchStart - perfTiming.navigationStart,
                timingRedirectEnd: perfTiming.redirectEnd,
                timingRedirectStart: perfTiming.redirectStart,
                timingRedirectTime: perfTiming.redirectEnd - perfTiming.redirectStart,
                timingRequestStart: perfTiming.requestStart,
                timingRequestTime: perfTiming.responseEnd - perfTiming.requestStart,
                timingResponseEnd: perfTiming.responseEnd,
                timingResponseStart: perfTiming.responseStart,
                timingSecureConnectionStart: perfTiming.secureConnectionStart,
            }
        })

        function handleDocumentLoading() {
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingDomLoading: perfTiming.domLoading,
                }
            });
        }

        function handleDocumentComplete() {
            var domReadyTime = perfTiming.domComplete - perfTiming.domInteractive;
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingDomReadyTime: domReadyTime,
                    timingDomComplete: perfTiming.domComplete,
                }
            });
        }

        function handleDocumentInteractive() {
            var initDomTreeTime = perfTiming.domInteractive - perfTiming.responseEnd;
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingDomInteractive: perfTiming.domInteractive,
                    timingInitDomTree: initDomTreeTime,
                }
            });
        }

        function handleLoadEvent() {
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingLoadEventStart: perfTiming.loadEventStart,
                }
            });
        }

        function handleLoadEventEnd() {
            var loadTime = perfTiming.loadEventEnd - perfTiming.fetchStart;
            var loadEventTime = perfTiming.loadEventEnd - perfTiming.loadEventStart;
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingLoadTime: loadTime,
                    timingLoadEventTime: loadEventTime,
                    timingLoadEventEnd: perfTiming.loadEventEnd,
                }
            });
        }

        function handleDOMContentLoaded() {
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingDomContentLoadedEventStart: perfTiming.domContentLoadedEventStart,
                }
            });
            setTimeout(function () {
                makeSegmentTrackCall({
                    event: 'Timing Early',
                    properties: {
                        timingDomContentLoadedEventEnd: perfTiming.domContentLoadedEventEnd,
                    }
                });
            })
        }

        function handleUnloadEvent() {
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingUnloadEventStart: perfTiming.unloadEventStart,
                }
            });
        }

        function handleUnloadEventEnd() {
            makeSegmentTrackCall({
                event: 'Timing Early',
                properties: {
                    timingUnloadEventEnd: perfTiming.unloadEventEnd,
                    timingUnloadEventTime: perfTiming.unloadEventEnd - perfTiming.unloadEventStart,
                }
            });
        }
    }
    getCountryCode(makeTimingCalls);


})();

















! function () {
    var analytics = window.analytics = window.analytics || [];
    if (!analytics.initialize)
        if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
        else {
            analytics.invoked = !0;
            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset",
                "group", "track", "ready", "alias", "debug", "page", "once", "off", "on"
            ];
            analytics.factory = function (t) {
                return function () {
                    var e = Array.prototype.slice.call(arguments);
                    e.unshift(t);
                    analytics.push(e);
                    return analytics
                }
            };
            for (var t = 0; t < analytics.methods.length; t++) {
                var e = analytics.methods[t];
                analytics[e] = analytics.factory(e)
            }
            analytics.load = function (t, e) {
                var n = document.createElement("script");
                n.type = "text/javascript";
                n.async = !0;
                n.src = "https://cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(n, a);
                analytics._loadOptions = e
            };
            analytics.SNIPPET_VERSION = "4.1.0";
            analytics.load(window.clientSideInjectionVars.segmentKey);
        }
}();