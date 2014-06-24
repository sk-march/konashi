// forked from reo.matsumura's "４．電波強度を計測してみよう！" http://jsdo.it/reo.matsumura/6JfH
// forked from reo.matsumura's "４．電波強度を計測してみよう！" http://jsdo.it/reo.matsumura/jIta
// forked from reo.matsumura's "Samples.ReadSignalStrength.3.0" http://jsdo.it/reo.matsumura/nKxC
// forked from reo.matsumura's "Samples.ReadSignalStrength.2.0" http://jsdo.it/reo.matsumura/3iim
// forked from reo.matsumura's "Samples.ReadSignalStrength" http://jsdo.it/reo.matsumura/dPQE
/////////////////////////////////////
// view functions
/////////////////////////////////////
var mode;
$(function () {
    //console.log("aaa", location.href);
    if (location.href.match('3000')) {
        mode = 'develop';
    }

    $("#button").on('tap', function () {
        k.find();
    });

    // develop
    if (mode === 'develop') {
        $("#button").on('click', function () {
            showConnecting();
            showMeter();
        });
    }


});

/* 画面制御 */
function showFirst() {
    $("#content").animate(
        {left: "0%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function showTimeCount() {
    $("#timeCount").animate(
        {left: "-200%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function showConnecting() {
    $("#content").animate(
        {left: "-100%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function showMeter() {
    $("#content").animate(
        {left: "-200%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

/* 強度表示の変更*/

function changeMeter(value) {
    $("#meter").animate(
        {height: value + "%"},
        {duration: 500, easing: "ease-in-out"}
    );
    $("#num").html(value);
}


/////////////////////////////////////
// konashi functions
/////////////////////////////////////

var intervalId;

k.ready(function () {
    showMeter();
    k.pinModeAll(254);

    intervalId = window.setInterval(function () {
        k.signalStrengthReadRequest();
    }, 1000);
});

/* konashiに接続した時 */
k.on(k.KONASHI_EVENT_CONNECTED, function () {
    showConnecting();
});

/* 電波強度取得完了イベント */
k.updateSignalStrength(function (data) {
    RSSI = -1 * data;    // 追加
    changeMeter(RSSI);   // 追加
    if (RSSI < 75) {                    // 追加
        k.pwmMode(k.PIO1, k.KONASHI_PWM_ENABLE);

        k.pwmPeriod(k.PIO1, 500000);
        k.pwmDuty(k.PIO1, 250000);
    } else {                              //
        k.pwmMode(k.PIO1, k.KONASHI_PWM_DISABLE);
    }
});

k.disconnected(function (data) {
    window.clearInterval(intervalId);
    showFirst();
});
