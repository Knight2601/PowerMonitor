"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dayjs_1 = __importDefault(require("dayjs"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const body_parser_1 = __importDefault(require("body-parser"));
const sql = sqlite3_1.default.verbose();
const app = (0, express_1.default)();
const port = 3000;
const db = new sql.Database('liteDb.db');
db.serialize(() => {
    db.run("CREATE TABLE if not exists data (val0 number, val1 number, val2 number, val3 number, asat text)");
});
process.on('SIGBREAK', () => {
    db.close();
    console.log('SIGBREAK terminated cleanly');
    process.exit(0);
});
process.on('SIGTERM', () => {
    db.close();
    console.log('SIGTERM terminated cleanly');
    process.exit(0);
});
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.text({ type: 'text/plain' }));
app.post('/', (req, res) => {
    const values = req.body.split(',');
    const r = {
        val1: parseFloat(values[0]),
        val2: parseFloat(values[1]),
        val3: parseFloat(values[2]),
        val4: parseFloat(values[3]),
        asat: (values.length > 3 ? values[4] : '')
    };
    updatePlot(r);
    res.send('ok');
});
app.get('/clean', (req, res) => {
    clean();
    res.send('cleaned');
});
app.get('/get', (req, res) => {
    const freq = req.query.f.toString();
    const timerange = req.query.timerange.toString();
    console.log(freq, timerange);
    getData(freq, timerange).then(d => {
        res.json(d);
    });
});
app.listen(port, () => {
    console.log(`PowerMon listening on port ${port}  [CTRL + BREAK] to exit clean...`);
});
function updatePlot(r) {
    const date = (0, dayjs_1.default)().format();
    const stmt = db.prepare("INSERT INTO data VALUES (?, ?, ?, ?, ?)");
    stmt.run([r.val1, r.val2, r.val3, r.val4, (r.asat != '' ? r.asat : date)]);
    stmt.finalize();
}
function clean() {
    db.each("DELETE FROM data", (err, row) => {
        console.log(err);
        console.log(row);
    });
    console.log('CLEANED');
}
function getData(freq, timerange) {
    const rows = [];
    return new Promise((resolve, reject) => {
        const f = parseInt(freq);
        let p = timerange;
        const limit = 100;
        switch (timerange) {
            case 'hour':
                p = (0, dayjs_1.default)().add(-1, 'hour').format();
                break;
            case 'day':
                p = (0, dayjs_1.default)().add(-1, 'day').format();
                break;
            case 'week':
                p = (0, dayjs_1.default)().add(-1, 'week').format();
                break;
            case 'month':
                p = (0, dayjs_1.default)().add(-1, 'month').format();
                break;
            case 'quarter':
                p = (0, dayjs_1.default)().add(-3, 'month').format();
                break;
            case 'year':
                p = (0, dayjs_1.default)().add(-1, 'year').format();
                break;
            default:
                p = (0, dayjs_1.default)().add(-1, 'minute').format();
        }
        let select = `SELECT val0, val1, val2, val3, asat FROM data where asat > '${p}'  order by asat desc limit ${limit}`;
        if (f >= 86400) {
            select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d', asat) as asat FROM data  where asat > '${p}'  GROUP BY strftime('%Y-%m-%d', asat) 
      order by strftime('%Y-%m-%d', asat) desc limit ${limit};`;
        }
        else if (f >= 3600) {
            select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data  where asat > '${p}' GROUP BY strftime('%Y-%m-%d %H', asat) 
      order by strftime('%Y-%m-%d %H', asat) desc limit ${limit};`;
        }
        else if (f >= 60) {
            select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data where asat > '${p}'  GROUP BY strftime('%Y-%m-%d %H:%M', asat) 
      order by strftime('%Y-%m-%d %H:%M', asat) desc limit ${limit};`;
        }
        else if (f > 1) {
            select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data  where asat > '${p}' GROUP BY strftime('%Y-%m-%d %H:%M:%S', asat) 
      order by strftime('%Y-%m-%d %H:%M:%S', asat) desc limit ${limit};`;
        }
        db.all(select, (err, row) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            if (row) {
                row.forEach(r => {
                    rows.push({ val1: r.val0, val2: r.val1, val3: r.val2, val4: r.val3, asat: r.asat });
                });
            }
            resolve(rows);
        });
    });
}
//# sourceMappingURL=index.js.map