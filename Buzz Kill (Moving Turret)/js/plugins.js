// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

function scaleVector(vector, length) {
    vector.magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    vector.x /= vector.magnitude;
    vector.y /= vector.magnitude;
    vector.x *= length;
    vector.y *= length;
    return vector;
}

function pointDistance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

(function ($) {
    jQuery.timeout = function (time, callback) {
        var Timer = function (time, callback) {
            this.internalCallback = function () {
                this.state = 0;
                callback(self);
            };

            this.stop = function () {
                if (this.state === 1 && this.id) {
                    clearTimeout(this.id);
                    this.state = 0;
                    return true;
                }
                return false;
            };

            this.pause = function () {
                if (this.state === 1 && this.id) {
                    clearTimeout(this.id);
                    this.timeElapsed = new Date() - this.startDate;
                    this.state = 2;
                    return true;
                }
                return false;
            };

            this.resume = function () {
                if (this.state === 2) {
                    this.time -= this.timeElapsed;

                    this.startDate = new Date();
                    this.id = setTimeout($.proxy(this.internalCallback, this), this.time);
                    this.state = 1;
                    return true;
                }
                return false;
            };

            this.time = time;

            this.startDate = new Date();
            this.id = setTimeout($.proxy(this.internalCallback, this), this.time);
            this.state = 1;
        };

        return new Timer(time, callback);
    };
})(jQuery);

jQuery.fn.extend({
    backgroundImg: function (newImgSrc) {
        if (!this.css('background-image') || this.css('background-image') == '' || !this.css('background-image').contains(newImgSrc)) {
            if (newImgSrc.src) {
                newImgSrc = newImgSrc.src;
            }

            if (!newImgSrc.contains('url(')) {
                newImgSrc = 'url(' + newImgSrc + ')';
            }
            this.css('background-image', newImgSrc);
        }
    }
});

String.prototype.boolValue = function () {
    return (/^true$/i).test(this);
};

String.prototype.insert = function (index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substring(index, this.length);
    } else {
        return string + this;
    }
};

String.prototype.contains = function (substring) {
    return this.indexOf(substring) > -1;
};

function formatMilliseconds(ms) {
    var seconds = ms / 1000;
    var minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    seconds -= 60 * minutes;
    seconds = Math.floor(seconds);
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    return '' + minutes + ':' + seconds;
}

function formatMoney(moneyNum) {
    var moneyStringBeginning = moneyNum < 0 ? '-' : '';
    moneyNum = Math.abs(moneyNum) + '';

    var commaNum = Math.floor((moneyNum.length - 1) / 3) + 1;
    var commaI = 0;
    while (--commaNum > 0) {
        commaI++;
        moneyNum = moneyNum.insert(moneyNum.length - (commaI * 3 + commaI - 1), ',');
    }

    return moneyStringBeginning + '$' + moneyNum;
}

window.appLostFocus = function () {

}

window.appGainedFocus = function () {

}

$(window).on("blur focus", function (e) {
    var prevType = $(this).data("prevType");

    if (prevType != e.type) {
        switch (e.type) {
            case "blur":
                try {
                    appLostFocus();
                }catch(e) {}
                break;
            case "focus":
                try {
                    appGainedFocus();
                }catch(e) {}
                break;
        }
    }

    $(this).data("prevType", e.type);
});

if (typeof HTMLMediaElement != 'undefined') {
    HTMLMediaElement.prototype.startPlayback = function (loop, volume, mute) {
        this.play();

        if (loop) {
            this.loop = loop;
        }

        if (volume) {
            this.playbackVolume = volume;
        } else {
            this.playbackVolume = 1.0;
        }

        if (mute) {
            this.mutePlayback();
        } else {
            this.unmutePlayback();
        }

        try {
            this.currentTime = 0.0;
        } catch (e) {
        }

        this.isPlaying = true;
        this.playbackStarted = true;
    }

    HTMLMediaElement.prototype.pausePlayback = function () {
        if (this.playbackStarted && this.isPlaying && !this.paused) {
            this.pause();
            this.isPlaying = false;
        }
    }

    HTMLMediaElement.prototype.resumePlayback = function () {
        if (this.playbackStarted && !this.isPlaying) {
            this.play();
            this.isPlaying = true;
        }
    }

    HTMLMediaElement.prototype.stopPlayback = function () {
        this.pause();

        try {
            this.currentTime = 0.0;
        } catch (e) {
        }

        this.isPlaying = false;
        this.playbackStarted = false;
        this.playbackMuted = false;
    }

    HTMLMediaElement.prototype.setPlaybackVolume = function (newVolume) {
        this.playbackVolume = newVolume;

        if (!this.playbackMuted) {
            this.volume = this.playbackVolume;
        }
    }

    HTMLMediaElement.prototype.getPlaybackVolume = function () {
        return this.playbackVolume;
    }

    HTMLMediaElement.prototype.unmutePlayback = function () {
        this.volume = this.playbackVolume;
        this.playbackMuted = false;
    }

    HTMLMediaElement.prototype.mutePlayback = function () {
        this.volume = 0;
        this.playbackMuted = true;
    }
}

function normalizePointToDiv(windowPoint, div) {
    var divRect = div.getBoundingClientRect();
    var divPoint = {
        x: windowPoint.x - divRect.left,
        y: windowPoint.y - divRect.top
    };

    if (divPoint.x > div.width) {
        divPoint.x = div.width;
    } else if (divPoint.x < 0) {
        divPoint.x = 0;
    }

    if (divPoint.y > div.height) {
        divPoint.y = div.height;
    } else if (divPoint.y < 0) {
        divPoint.y = 0;
    }

    return divPoint;
}

jQuery.fn.extend({
    isUnderPoint: function (point) {
        var elementPosition = {
            x: this.offset().left,
            y: this.offset().top
        }

        var elementSize = {
            width: this.outerWidth(),
            height: this.outerHeight()
        }

        if (point.x > elementPosition.left && point.y > elementPosition.top
            && point.x < elementPosition.left + elementSize.width && point.y < elementPosition.top + elementSize.height) {
            return true;
        }

        return false;
    }
});

$.extend(
    $.expr[":"],
    {
        actuallyVisible: function (a) {
            var obj = $(a);
            while ((obj.css("visibility") == "inherit" && obj.css("display") != "none") && obj.parent()) {
                obj = obj.parent();
            }
            return !(obj.css("visibility") == "hidden" || obj.css('display') == 'none');
        }
    }
);

$.extend(
    $.expr[":"],
    {
        actuallyOpaque: function (a) {
            var obj = $(a);
            while ((parseFloat(obj.css("opacity")) > 0 && obj.css("display") != "none") && obj.parent()) {
                obj = obj.parent();
            }
            return !(parseFloat(obj.css("opacity")) == 0 || obj.css('display') == 'none');
        }
    }
);

function divsIntersect($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

window.removeFrom = function(arr, obj) {
    arr.splice(arr.indexOf(obj), 1);
}