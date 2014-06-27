// forked from reo.matsumura's "４．電波強度を計測してみよう！" http://jsdo.it/reo.matsumura/6JfH
// forked from reo.matsumura's "４．電波強度を計測してみよう！" http://jsdo.it/reo.matsumura/jIta
// forked from reo.matsumura's "Samples.ReadSignalStrength.3.0" http://jsdo.it/reo.matsumura/nKxC
// forked from reo.matsumura's "Samples.ReadSignalStrength.2.0" http://jsdo.it/reo.matsumura/3iim
// forked from reo.matsumura's "Samples.ReadSignalStrength" http://jsdo.it/reo.matsumura/dPQE
/////////////////////////////////////
// view functions
/////////////////////////////////////
var mode;
var cnt;
var min = 60; // 1min = x sec
//
var maxMin = 30 * min;  // 60 min 定姿勢なら 、動作開始


//var SEN11763P_ADDR = 0x68;
var ITG3200_WHO = 0x00;
var	ITG3200_SMPL = 0x15;
var ITG3200_DLPF = 0x16;
var ITG3200_INT_C = 0x17;
var ITG3200_INT_S = 0x1A;
var	ITG3200_TMP_H = 0x1B;
var	ITG3200_TMP_L = 0x1C;
var ITG3200_GX_H = 0x1D;
var ITG3200_GX_L = 0x1E;
var	ITG3200_GY_H = 0x1F;
var	ITG3200_GY_L = 0x20;
var ITG3200_GZ_H = 0x21;
var ITG3200_GZ_L = 0x22;
var ITG3200_PWR_M = 0x3E;


jQuery = Zepto;
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

            timerCount();
        });
    }

    // タイマーリセット
    $('#reset').on('tap click', function () {
        cnt = 0;
        $('#minCnt').text(cnt);
    });

    // video画面遷移
    $('#videoButton').on('tap click', function () {
        showVideo();
    });

    // ビデオ画面からの戻るボタン
    $('#returnBtn').on('tap click', function () {
        returnVideo();
        cnt = 0;
    });

});



/* 画面制御 */


function timerCount() {
    cnt = $('#minCnt').text();
    //var cnt ++;

    setInterval(function () {
        cnt ++;
        $('#minCnt').text(cnt);

        if (cnt >= maxMin) {
            //alert("aaaa");
            showVideo();
        }

    }, 1000 * min);
}

function showVideo() {
    $('#content').animate(
        {left: "-300%"},
        {duration: 500, easing: "ease-in-out"}
    );
}

function returnVideo() {
    $('#content').animate(
        {left: "-200%"},
        {duration: 500, easing: "ease-in-out"}
    );
};

function showFirst() {
    $("#content").animate(
        {left: "0%"},
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
    //k.pinModeAll(254);

    //showPio();

    k.i2cMode(k.KONASHI_I2C_ENABLE_400K);

    //Initialize

    k.i2cRestartCondition();
    alert("a1");
    var address = 0x4c;
    //var length = KONASHI_I2C_DATA_MAX_LENGTH;



    alert("a2");

    intervalId = window.setInterval(function () {
        //k.signalStrengthReadRequest();
        //alert("zzz");
        try {
            k.i2cReadRequest(10, address);
            //k.i2cStartCondition();
        } catch (e) {
            alert(e);
        }


    }, 1000);
});

/* konashiに接続した時 */
k.on(k.KONASHI_EVENT_CONNECTED, function () {
    showConnecting();
});

k.on(k.KONASHI_EVENT_I2C_READ_COMPLETE, function () {
    alert("aaa");
});
k.completeReadI2c(function (data) {
    alert("bbb" + data);
});

/* 電波強度取得完了イベント */
/*
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
*/


k.disconnected(function (data) {
    window.clearInterval(intervalId);
    showFirst();
});


