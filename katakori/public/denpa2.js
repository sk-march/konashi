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
var min = 1; // 1min = x sec
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

    // 低周波マッサージ機をon
    $('#onBtn').on('tap click', function () {
        switchOn();
    });

    // 低周波マッサージ機をoff
    $('#offBtn').on('tap click', function () {
        switchOff();
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

/* 低周波装置 */
var panasonicMode = "off";
var timeoutId;
function sleep_func(time, callback) {
    return setTimeout(callback, time);
}
function switchOn() {
    if(panasonicMode=="off"){
        panasonicMode="on";
        // 0.5秒だけonにする。
        k.digitalWrite(k.PIO1, k.HIGH);
        sleep_func(500, function() {
            k.digitalWrite(k.PIO1, k.LOW);
            panasonicMode="on ok";
        });
        // 16分だけLEDつける
        k.digitalWrite(k.PIO2, k.HIGH);
        timeoutId = sleep_func(16*60*1000, function() {
            k.digitalWrite(k.PIO2, k.LOW);
            timeoutId=0;
            panasonicMode="off";
        });
    }
}
function switchOff() {
    if(panasonicMode=="on ok"){
        panasonicMode="off try";
        // 1.5秒だけonにする。
        k.digitalWrite(k.PIO1, k.HIGH);
        sleep_func(1600, function() {
            k.digitalWrite(k.PIO1, k.LOW);
            if(timeoutId!=0){
                clearTimeout(timeoutId);
                timeoutId=0;
            }
            panasonicMode="off";
        });
        // PIO3をOFF
        k.digitalWrite(k.PIO2, k.LOW);
    }
}


/////////////////////////////////////
// konashi functions
/////////////////////////////////////

var intervalId;

k.ready(function () {
    showMeter();
    //k.pinModeAll(254);

    //showPio();

//    k.i2cMode(k.KONASHI_I2C_ENABLE_400K);

    // set analog pin mode
    k.pinMode(k.PIO1, k.OUTPUT); // リレー用
    k.pinMode(k.PIO2, k.OUTPUT); // LED用
    k.pinMode(k.PIO3, k.INPUT);  // 確認用

    //Initialize
//    k.i2cRestartCondition();
//    alert("a1");
//    var address = 0x4c;
    //var length = KONASHI_I2C_DATA_MAX_LENGTH;

//    alert("a2");

    intervalId = window.setInterval(function () {
        //k.signalStrengthReadRequest();
        //alert("zzz");
/*        try {
            k.i2cReadRequest(10, address);
            //k.i2cStartCondition();
        } catch (e) {
            alert(e);
        }
*/
        // yamasaki add
        k.analogReadRequest(k.AIO0); // x軸
        k.analogReadRequest(k.AIO1); // y軸
        k.analogReadRequest(k.AIO2); // z軸
    }, 1000);

});

/* konashiに接続した時 */
k.on(k.KONASHI_EVENT_CONNECTED, function () {
    showConnecting();

    showMeter();

    timerCount();

});
/*
k.on(k.KONASHI_EVENT_I2C_READ_COMPLETE, function () {
    alert("aaa");
});
k.completeReadI2c(function (data) {
    alert("bbb" + data);
});
*/
// yamasaki add start
// get analog value
var ax=0;
var ay=0;
var az=0;
var gravity=980;
var margin =50; // gravityより大きくなったら移動と判断
var forceMode="stay"; // or "move"
var moveCount=0; // 2回動いたらスイッチオン
var startTime=0; // 1回目動いた時刻
var timeLimit=2000; // 何秒以内に首を動かすと作動するか
function checkKubifuri() {
     // time over
    if(moveCount>0) {
        if(+new Date() > startTime + timeLimit) {
            moveCount=0;
            startTime=0;
        }
    }

    // calc force
    var norm = sqrt(ax*ax + ay*ay + az*az);
    if(mode=="stay") {
        if(nrom > gravity + margin) {
            // 加速度が強くなったら首振りと判断
            mode="move";
            moveCount = moveCount+1;
            startTime = + new Date();
        }
    }else{
         if(nrom < gravity + margin*2/3) {
            mode="stay";
        }
    }

    // check
    if(moveCount>2) {
        switchOn();
        moveCount=0;
        startTime=0;
    }
}

// digital 確認用
k.updatePioInput( function(data) {
    k.digitalRead(k.PIO1, function(data) {
        if(data==0){
//            $('#minCnt').text("OFF");
        }else{
//            $('#minCnt').text("ON");
		switchOn();
        }
    });
});

// アナログ読み込み関数
k.updateAnalogValueAio0( function(data) {
    // AIO0のアナログ値が取得できたら実行されます
    ax = data;
});
k.updateAnalogValueAio1( function(data) {
    // AIO1のアナログ値が取得できたら実行されます
    ay = data;
});
k.updateAnalogValueAio2( function(data) {
    // AIO2のアナログ値が取得できたら実行されます
    az = data;
    // 全軸一定周期で読み込むはずなので、z軸のときだけチェック
//    checkKubifuri();
});

// finit
k.disconnected(function (data) {
    window.clearInterval(intervalId);
    showFirst();
});


