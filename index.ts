import express from 'express';
import dayjs from 'dayjs';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import {Message} from './db';

const sql = sqlite3.verbose();

const app = express()
const port = 8080

const dbs = new sql.Database('liteDb.db');

// db.init().then(() => {});

dbs.serialize(() => {
  dbs.run("CREATE TABLE if not exists data (val0 number, val1 number, val2 number, val3 number, asat text)");
});

process.on('SIGBREAK', () => {
  dbs.close();
  console.log('SIGBREAK terminated cleanly');
  process.exit(0);
})
process.on('SIGTERM', () => {
  dbs.close();
  console.log('SIGTERM terminated cleanly');
  process.exit(0);
})


app.use(express.static('public'));
app.use(bodyParser.text({ type: 'text/plain' }));


app.post('/', (req, res) => {
  const values: string[] = req.body.split(',');
  const r: Message = {
    val1: parseFloat(values[0]),
    val2: parseFloat(values[1]),
    val3: parseFloat(values[2]),
    val4: parseFloat(values[3]),
    asat: (values.length > 3 ? values[4] : '')
  };
  updatePlot(r);
  res.send('ok');
})

app.get('', (req, res) => res.send('ok'));

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
  console.log(`PowerMon listening on port ${port}  [CTRL + BREAK] to exit clean...`)
})


function updatePlot(r: Message) {
  const date = dayjs().format();
  if(!r.asat || r.asat == '') r.asat = date;
  // db.insert(r);

  const stmt = dbs.prepare("INSERT INTO data VALUES (?, ?, ?, ?, ?)");
  stmt.run([r.val1, r.val2, r.val3, r.val4, (r.asat != '' ? r.asat : date)]);
  stmt.finalize();
}

function clean() {
  dbs.each("DELETE FROM data", (err, row) => {
    console.log(err);
    console.log(row);
  });
  console.log('CLEANED');

}
function getData(freq: string, timerange: string) {
  const rows: Message[] = [];
  return new Promise((resolve, reject) => {
    const f = parseInt(freq);
    let p = timerange;
    let limit = 100;
    switch (timerange) {
      case 'hour':
        p = dayjs().add(-1, 'hour').format();
        break;
      case 'day':
        p = dayjs().add(-1, 'day').format();
        break;
      case 'week':
        p = dayjs().add(-1, 'week').format();
        break;
      case 'month':
        p = dayjs().add(-1, 'month').format();
        break;
      case 'quarter':
        p = dayjs().add(-3, 'month').format();
        break;
      case 'year':
        p = dayjs().add(-1, 'year').format();
        break;
      default:
        p = dayjs().add(-1, 'minute').format();
    }
    let select = `SELECT val0, val1, val2, val3, asat FROM data where asat > '${p}'  order by asat desc limit ${limit}`;
    if (f >= 86400) {
      select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d', asat) as asat FROM data  where asat > '${p}'  GROUP BY strftime('%Y-%m-%d', asat) 
      order by strftime('%Y-%m-%d', asat) desc limit ${limit};`;
    } else if (f >= 3600) {
      select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data  where asat > '${p}' GROUP BY strftime('%Y-%m-%d %H', asat) 
      order by strftime('%Y-%m-%d %H', asat) desc limit ${limit};`;
    } else if (f >= 60) {
      select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data where asat > '${p}'  GROUP BY strftime('%Y-%m-%d %H:%M', asat) 
      order by strftime('%Y-%m-%d %H:%M', asat) desc limit ${limit};`;
    } else if (f > 1) {
      select = `SELECT avg(val0) as val0, avg(val1) as val1, avg(val2) as val2, avg(val3) as val3, 
      strftime('%Y-%m-%d %H:%M:%S', asat) as asat FROM data  where asat > '${p}' GROUP BY strftime('%Y-%m-%d %H:%M:%S', asat) 
      order by strftime('%Y-%m-%d %H:%M:%S', asat) desc limit ${limit};`;
    }
// 2022-04-25T15:33:34
    // console.log(select);
    // db.query(select).then((r:Message[]) => {
    //   resolve(r);
    // });

    dbs.all(select, (err, row) => {
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