window.forLeapStore = false;
window.forTesting = true;

window.loadScript = function (src) {
    var headID = document.getElementsByTagName("body")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;
    headID.appendChild(newScript);
}

nodeWebkit = null;
if (window.forLeapStore && typeof require != 'undefined' && (nodeWebkit = require('nw.gui'))) {
    var win = nodeWebkit.Window.get();

    function openWin() {
        var h = screen.availHeight;
        var maxH = 1400;
        if (h > maxH) {
            var offset = h - maxH;
            h = maxH;
            win.height = Math.floor(h);
            win.y += Math.floor(offset / 2);
        }

        var w = h * 1.386;

        win.width = Math.floor(w);
        win.x = Math.floor((screen.availWidth - w) / 2);

        win.setResizable(false);
        win.show(true);

        win.on('blur', function() {
            window.appFront = false;
            try {
                appLostFocus();
            }catch(e) {}
        });

        win.on('focus', function() {
            window.appFront = true;
            try {
                appGainedFocus();
            }catch(e) {}
        });

        setTimeout(function () {
            win.focus();
            loadScript('js/setupGamePlay.js');
        }, 200);
    }

    if (require('os').platform().toLowerCase() == 'darwin') {
        win.maximize();
        win.on('maximize', function () {
            openWin();
        });
    } else {
        win.y = win.x = 0;
        win.height = screen.availHeight;
        win.width = screen.availWidth;

        openWin();
    }
} else {
    $(function () {
        loadScript('js/setupGamePlay.js');
    });
}