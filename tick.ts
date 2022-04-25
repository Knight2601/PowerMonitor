//import querystring from 'querystring';
import http from 'http';
import dayjs from 'dayjs';
import sleep from 'system-sleep';

const x = true;

async function set(n?) {
    if(x) {
      if(!n) n = 1;
        for (let ox = 0; ox < n; ox++) {
            // 0 > 1
            const n1 = Math.random();
            const n2 = Math.random();
            const n3 = Math.random();
            const n4 = Math.random();
            const date = dayjs().format();
            const post_data = `${n1},${n2},${n3},${n4},${date}`;
            console.log(post_data);
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
        host: 'powermon.azurewebsites.net',
        port: '80',
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