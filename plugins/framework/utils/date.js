import _ from './_.js';

const DAY_SECONDS = 86400000;
const HOUR_SECONDS = 3600000;
const MINUTE_SECONDS = 60000;
const MS_SECONDS = 1000;
const WEEKS = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
const STR_INTERVALS = ['s', 'n', 'h', 'd', 'w', 'q', 'm', 'y'];

const GAPS = [{
		s: "年",
		l: 365 * DAY_SECONDS
	},
	{
		s: "个月",
		l: 30 * DAY_SECONDS
	},
	{
		s: "天",
		l: DAY_SECONDS
	},
	{
		s: "时",
		l: HOUR_SECONDS
	},
	{
		s: "分",
		l: MINUTE_SECONDS
	},
	{
		s: "秒",
		l: MS_SECONDS
	}
]


const _dataFormat = function(d, f) {
	if (!d) return ''
	//d = toDate(d);
	d = _.isDate(d) ? d : toDate(d);
	f = f || 'yyyy-MM-dd hh:mm:ss';
	let w = '星期',
		r = {
			yyyy: d.getFullYear(),
			MM: d.getMonth() + 1,
			dd: d.getDate(),
			hh: d.getHours(),
			mm: d.getMinutes(),
			ss: d.getSeconds(),
			ww: w + WEEKS[d.getDay()],
			SSS: d.getMilliseconds()
		}

	for (let k in r) {
		let v = r[k]
		if (k != 'yyyy' && v < 10) r[k] = '0' + v
	}
	return f.replace(/(?!\\)(yyyy|MM|dd|SSS|hh|mm|ss|ww)/gi, function(f) {
		return r[f]
	})
}

function toDate(v) {
	if (_.isDate(v)) {
		return v;
	}
	let t;
	if (typeof v == "string") {
		if (v.indexOf('+') != -1 || v.indexOf("T") != -1) {
			t = new Date(v);
		}
		if (!t && v.indexOf('-') != -1) {
			t = new Date(Date.parse(v.replace(/-/g, '/')))
		}
	}

	if (!t && !isNaN(v)) {
		t = new Date(Number(v))
	}

	if (!t && v) {
		t = new Date(v);
	}
	return t
}

function toUp(dtTmp, strInterval, num) {
	switch (strInterval) {
		case 's':
			return new Date(Date.parse(dtTmp) + (MS_SECONDS * num));
		case 'n':
			return new Date(Date.parse(dtTmp) + (MINUTE_SECONDS * num));
		case 'h':
			return new Date(Date.parse(dtTmp) + (HOUR_SECONDS * num));
		case 'd':
			return new Date(Date.parse(dtTmp) + (DAY_SECONDS * num));
		case 'w':
			return new Date(Date.parse(dtTmp) + ((DAY_SECONDS * 7) * num));
		case 'q':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
		case 'm':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
		case 'y':
			return new Date((dtTmp.getFullYear() + num), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
	}
	return dtTmp;
}

function toDown(dtTmp, strInterval, num) {
	switch (strInterval) {
		case 's':
			return new Date(Date.parse(dtTmp) - (MS_SECONDS * num));
		case 'n':
			return new Date(Date.parse(dtTmp) - (MINUTE_SECONDS * num));
		case 'h':
			return new Date(Date.parse(dtTmp) - (HOUR_SECONDS * num));
		case 'd':
			return new Date(Date.parse(dtTmp) - (DAY_SECONDS * num));
		case 'w':
			return new Date(Date.parse(dtTmp) - ((DAY_SECONDS * 7) * num));
		case 'q':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - num * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
		case 'm':
			return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) - num, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
		case 'y':
			return new Date((dtTmp.getFullYear() - num), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(),
				dtTmp.getSeconds());
	}
	return dtTmp;
}

function getUpTime(expires, date) {
	let len = expires.length;
	if (len > 1) {
		for (var i = 1; i < len; i++) {
			var v = expires.charAt(i).toLowerCase();
			var index = STR_INTERVALS.indexOf(v);
			if (index != -1) {
				var n = expires.substring(0, i);
				var s = STR_INTERVALS[index];
				date = toUp(date || new Date(), s, Number(n));
				let _expires = expires.substring(i + 1);
				if (_expires) {
					return getUpTime(_expires, date);
				}
			}
		}
	}
	return date;
}


function getGapTimes(t, s, c = 2) {
	t = toDate(t), s = toDate(s);
	let gap = Math.abs(t.getTime() - s.getTime());
	let results = []
	let count = 0

	function calc(remain) {
		for (let i = 0; i < GAPS.length; i++) {
			let v = GAPS[i]
			let val = Math.floor(remain / v.l);
			if (val > 0) {
				results.push(val, v.s)
				count += 1
				if (count >= c) {
					return
				} else {
					calc(remain - val * v.l)
					break;
				}
			}
		}
	}
	calc(gap)
	return results
}


function setCountDownInterval(s, e, layer = 4, callback, clearTimer = 0) {
	let count = Math.abs(toDate(s).getTime() - toDate(e).getTime());
	let sleep = 1000;
	let joinChar = ":"
	let countDownTimer = clearTimer;

	function countDown(tatal) {
		if (tatal > 0) {
			let gaps = GAPS.slice(GAPS.length - layer)
			let results = [];
			while (gaps.length) {
				let v = gaps.shift();
				if (results.length) {
					let s = results[results.length - 1];
					s.value && (tatal = tatal - s.value * s.v.l)
				}

				let value = Math.floor(tatal / v.l);
				if (value) {
					results.push({
						value,
						v
					})
				} else {
					if (results.length) {
						results.push({
							value: 0,
							v
						})
					}
				}
			}

			return results.map(s => {
				return {
					value: s.value < 10 ? '0' + s.value : s.value,
					label: s.v.s
				}
			});
		}

		countDownTimer && window.clearInterval(countDownTimer)
		return []
	}


	function resHandler(res) {
		let values = res.map(v => v.value).join(joinChar);
		let labels = res.map(v => v.value + v.label).join('');
		return [res, values, labels];
	}


	function run() {
		let res = countDown(count);
		count = count - sleep;
		callback && callback.apply(null, resHandler(res))
	}
	countDownTimer && window.clearInterval(countDownTimer);
	return run(), (countDownTimer = window.setInterval(run, sleep)), countDownTimer;
}



const date = {

	toUp,

	toDown,

	toDate,

	toFormat: _dataFormat,

	getUpTime,

	getGapTimes,

	setCountDownInterval,

	format: function(v, f) {
		let d = toDate(v)
		return _dataFormat(d, f)
	},

	splitFormat(v, f, splitStr) {
		let vals = [];
		if (v) {
			let _values = [];
			if (splitStr && _.isString(v)) {
				_values = v.split(splitStr)
			}

			if (_values.length == 0) {
				if (v instanceof Date) {
					_values.push(v)
				} else if (_.isNumber(v)) {
					_values.push(new Date(v).getTime())
				} else if (_.isString(v)) {
					_values.push(new Date(v).getTime())
				}
			}
			_values.forEach(v => {
				vals.push(_dataFormat(toDate(v), f))
			})
		}
		return vals
	},

	now: function(f) {
		return _dataFormat(new Date(), f || 'yyyy-MM-dd hh:mm:ss.SSS')
	},

	toTime: function(n) {
		function a(v) {
			return (v >= 10 ? v : "0" + v);
		}
		if (n < 60) {
			return "00:" + a(n);
		} else {
			var ss = n % 60;
			var mm = Math.floor(n / 60);
			if (mm < 60) {
				return a(mm) + ":" + a(ss);
			} else {
				mm = mm % 60;
				var hh = Math.floor(mm / 60);
				return a(hh) + ":" + a(mm) + ":" + a(ss);
			}
		}
		return "00:00";
	},

	gapTime: function(t, s) {
		t = toDate(t), s = toDate(s);
		let v = Math.abs(t.getTime() - s.getTime());

		function gapTo(i) {
			let d = GAPS[i]
			let val = Math.floor(v / d.l);
			if (val > 0) {
				return val + d.s;
			}
			return i < 5 ? gapTo(i + 1) : "刚刚";
		}
		return gapTo(0)
	},



	// 详细的时间间隔
	detailGapTime: function(t, s, c = 2) {
		return getGapTimes(t, s, c).join('')
	},

	gapTimeInterval: function(option) {
		let begin = option.begin
		let end = option.end
		let up = option.up
		if (begin && up) {
			end = getUpTime(up, toDate(begin))
		}
		if (!end) {
			return
		}


		let intervalId = setInterval(() => {
			let now = new Date()
			option.counter && option.counter(this.detailGapTime(now, end))
			if (now.getTime() >= end.getTime()) {
				option.finish && option.finish()
				clearInterval(intervalId)
			}
		}, 1000)
	}
}

export default date
