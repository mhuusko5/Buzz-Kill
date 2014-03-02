chrome.app.runtime.onLaunched.addListener(function() {
    var windowHeight = 0;
    var smalled = false;
    if (screen.availHeight <= 1080) {
        windowHeight = screen.availHeight;
    } else {
        windowHeight = 1080;
        smalled = true;
    }

    var windowWidth = Math.round(windowHeight * 1.386);
    var windowLeft = Math.round((screen.availWidth - windowWidth) / 2);

    var bounds = {};
    if (smalled) {
        bounds =  {
            width: windowWidth,
            height: windowHeight,
            left: windowLeft,
            top: Math.floor((screen.availHeight - windowHeight) / 2)
        };
    } else {
        bounds =  {
            width: windowWidth,
            height: windowHeight,
            left: windowLeft
        };
    }

    chrome.app.window.create('/index.html', {
        frame: 'none',
        singleton: true,
        bounds: bounds,
        resizable: false
    });
});