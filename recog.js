var request = require('request');

var apiKey = "Ci8RiARV6uAgIp7MPnDYK2nA";
var secretKey = "dd750ff270a117c6ca3d3636fb8a4958";
var cuid = "mymacbookpromacaddress";
var accessToken, result;

var recog = function(bufData, socket) { //Fetch the access token.
	console.log(bufData.length);
    var options1 = {
        headers: { 'Connection': 'close' },
        url: "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + apiKey + "&client_secret=" + secretKey,
        method: 'GET',
        json: true
    };

    function callback1(error, response, data) {
        if (!error && response.statusCode == 200) {
            accessToken = data.access_token;
            console.log("AT:", accessToken);
            //send the audio file.
            var options2 = {
                headers: {
                    'Content-Type': 'audio/pcm; rate=8000',
                    'Content-Length': bufData.length
                },
                url: 'http://vop.baidu.com/server_api' + '?cuid=' + cuid + '&token=' + accessToken,
                method: 'POST',
                json: true,
                formData: {
                    my_buffer: bufData
                }
            }

            function callback2(error, response, data) {
                if (!error && response.statusCode == 200) {
                    console.log('result:', data);
                    result = data && data.result;
                    socket.emit('result', result);
                }
            }
            request(options2, callback2);
        } else {
            console.error(error);
        }
    }
    request(options1, callback1);
};

module.exports = recog;
