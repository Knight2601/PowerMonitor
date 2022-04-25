//import querystring from 'querystring';
import http from 'http';
import dayjs from 'dayjs';
import sleep from 'system-sleep';

const x = true;
const peakHours = [8, 9, 12, 13, 17, 18, 19, 20, 21, 22];
const mainHours = [13, 17, 18];
let basic = 0.03;
async function set(n?) {
    if(x) {
      if(!n) n = 1;
        for (let ox = 0; ox < n; ox++) {
            // 0 > 1
            const currentHour = new Date().getHours();
            const isOdd = new Date().getMinutes() % 2 == 0;
            if(peakHours.indexOf(currentHour)> -1) {
              basic = 0.3;
              if(mainHours.indexOf(currentHour)> -1) {
                basic = 0.6;
              }
            } else {
              basic = 0.03;
            }
            if(isOdd) basic = basic / 2;
            const n1 = basic + (Math.random()/20);
            const n2 = (basic + (Math.random()/20)) * 0.8;
            const n3 = (basic + (Math.random()/20)) * 1.1;
            const n4 = (basic + (Math.random()/20)) * 0.6;
            const date = dayjs().format();
            const post_data = `${n1},${n2},${n3},${n4},${date}`;
            console.log('.');
            postData(post_data);
        }    
    }    
}

for (let i = 0; i< 10000; i++) {
  sleep(1002);
  set(1);
}

function postData(post_data) {
    const post_options = {
        host: 'localhost',
        port: '8080',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
  
    // Set up the request
    const post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('error', (e) => {
          console.log(e);
        })
    });
  
    // post the data
    post_req.write(post_data);
    post_req.end();
  
  }

  function get() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/get',
        method: 'GET'
      }
    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
      
        res.on('data', d => {
          process.stdout.write(d)
        })
      })
      
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
  }