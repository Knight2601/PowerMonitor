"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import querystring from 'querystring';
const http_1 = __importDefault(require("http"));
const dayjs_1 = __importDefault(require("dayjs"));
const system_sleep_1 = __importDefault(require("system-sleep"));
const x = true;
function set(n) {
    return __awaiter(this, void 0, void 0, function* () {
        if (x) {
            if (!n)
                n = 1;
            for (let ox = 0; ox < n; ox++) {
                // 0 > 1
                const n1 = Math.random();
                const n2 = Math.random();
                const n3 = Math.random();
                const n4 = Math.random();
                const date = (0, dayjs_1.default)().format();
                const post_data = `${n1},${n2},${n3},${n4},${date}`;
                console.log(post_data);
                postData(post_data);
            }
        }
    });
}
for (let i = 0; i < 10000; i++) {
    (0, system_sleep_1.default)(1002);
    set(1);
}
function postData(post_data) {
    const post_options = {
        host: 'localhost',
        port: '3000',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    // Set up the request
    const post_req = http_1.default.request(post_options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
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
    };
    const req = http_1.default.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d);
        });
    });
    req.on('error', error => {
        console.error(error);
    });
    req.end();
}
//# sourceMappingURL=tick.js.map