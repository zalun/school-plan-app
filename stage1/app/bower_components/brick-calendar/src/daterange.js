
var DateRange = (function () {

  var DAY = 24 * 60 * 60 * 1000;

  function toDate(s) {
    s = s.split('-');
    return Date.UTC(s[0],s[1]-1,s[2]);
  }

  function iso(d) {
    return d.getUTCFullYear() + '-' +
           pad2(d.getUTCMonth() + 1) + '-' +
           pad2(d.getUTCDate());
  }

  var test = /^\d{4}-\d{2}-\d{2}$/;
  function isValid(s) {
    return typeof s === 'string' && test.test(s);
  }

  function pad2(n) {
    return ('0' + n.toString()).substr(-2);
  }

  function diff(a, b) {
    return Math.round((toDate(a) - toDate(b)) / DAY);
  }

  function prevDay(d) {
    d = new Date(toDate(d) - DAY);
    return iso(d);
  }

  function nextDay(d) {
    d = new Date(toDate(d) + DAY);
    return iso(d);
  }


  /*
    0)  < > [ ]
    1)  < [ > ]
    2)  < [ ] >
    3)  [ < > ]
    4)  [ < ] >
    5)  [ ] < >
  */
  function rangeCompare(r1, r2) {
    if (r1[1] < r2[0]) {
      return 0;
    }
    if (r1[0] < r2[0] && r2[0] <= r1[1] && r1[1] < r2[1]) {
      return 1;
    }
    if (r1[0] <= r2[0] && r2[1] <= r1[1]) {
      return 2;
    }
    if (r2[0] <= r1[0] && r1[1] <= r2[1]) {
      return 3;
    }
    if (r2[0] < r1[0] && r1[0] <= r2[1] && r2[1] < r1[1]) {
      return 4;
    }
    if (r2[1] < r1[0]) {
      return 5;
    }
  }

  // if two adjacent dates/ ranges touch, combine them
  function merge(o) {
    for (var i = 0; i < o.length - 1; i++) {
      var curr = o[i];
      var next = o[i + 1];
      var delta;
      var merged = false;
      if (curr instanceof Array) {
        if (next instanceof Array) {
          if (diff(next[0], curr[1]) === 1) {
            o[i] = [curr[0], next[1]];
            merged = true;
          }
        } else {
          if (diff(next, curr[1]) === 1) {
            o[i] = [curr[0], next];
            merged = true;
          }
        }
      } else {
        if (next instanceof Array) {
          if (diff(next[0], curr) === 1) {
            o[i] = [curr, next[1]];
            merged = true;
          }
        } else {
          if (diff(next, curr) === 1) {
            o[i] = [curr, next];
            merged = true;
          }
        }
      }
      if (merged) {
        o.splice(i+1, 1);
        i--;
      }
    }
  }

  // flatten ranges that start and end on the same date
  function dedupe(o) {
    for (var i = 0; i < o.length; i++) {
      var d = o[i];
      if (d instanceof Array && d[0] === d[1]) {
        o[i] = d[0];
      }
    }
  }

  function DateRange(o, d2) {
    this.obj = [];

    // check to see if supplied object is a valid internal representation
    if (o instanceof Array) {
      var valid = true;
      for (var i = 0; i < o.length; i++) {
        var d = o[i];
        if (d instanceof Array) {
          if (d.length !== 2) {
            valid = false;
          }
          if (!(isValid(d) && isValid(d))) {
            valid = false;
          }
        } else {
          if (!isValid(d)) {
            valid = false;
          }
        }
      }
      if (valid) {
        this.obj = o;
      }
    } else {
      // check to see if single date or range was supplied
      if (d2) {
        if (o instanceof Date && d2 instanceof Date) {
          this.obj = [[iso(o), iso(d2)]];
        } else {
          if (isValid(o) && isValid(d2)) {
            this.obj = [[o, d2]];
          }
        }
      } else {
        if (o instanceof Date) {
          this.obj = [iso(o)];
        }
        if (isValid(o)) {
          this.obj = [o];
        }
      }
    }
  }

  DateRange.prototype = {
    add: function (o) {
      if (o instanceof Date) {
        this._add(iso(o));
      } else if (o instanceof Array &&
                 o.length === 2 &&
                 isValid(o[0]) &&
                 isValid(o[1])) {
        this._addRange(o);
      } else if (typeof o === 'string' && isValid(o)) {
        this._add(o);
      }
    },
    remove: function (o) {
      if (o instanceof Date) {
        this._remove(iso(o));
      } else if (o instanceof Array &&
                 o.length === 2 &&
                 isValid(o[0]) &&
                 isValid(o[1])) {
        this._removeRange(o);
      } else if (typeof o === 'string' && isValid(o)) {
        this._remove(o);
      }
    },
    _add: function (date) {
      // insert sorted
      for (var i = 0; i < this.obj.length; i++) {
        var d = this.obj[i];
        if (d instanceof Array) {
          if (date < d[0]) {
            break;
          }
          // if the value is inside an existing range bail
          if (d[0] <= date && date <= d[1]) {
            return;
          }
        } else {
          if (date === d) {
            return;
          }
          if (date < d) {
            break;
          }
        }
      }
      this.obj.splice(i, 0, date);
      merge(this.obj);
    },
    _addRange: function (r) {
      var done = false;
      for (var i = 0; i < this.obj.length; i++) {
        var d = this.obj[i];
        if (d instanceof Array) {
          var compare = rangeCompare(r, d);
          if (compare === 0) {
            this.obj.splice(i, 0, r);
            done = true;
            break;
          }
          if (compare === 1) {
            this.obj.splice(i, 1);
            this._addRange([r[0], d[1]]);
            return;
          }
          if (compare === 2) {
            this.obj.splice(i, 1);
            this._addRange([r[0], r[1]]);
            return;
          }
          if (compare === 3) {
            return;
          }
          if (compare === 4) {
            this.obj.splice(i, 1);
            this._addRange([d[0], r[1]]);
            return;
          }
        } else {
          if (r[1] < d) {
            this.obj.splice(i, 0, r);
            done = true;
            break;
          }
        }
      }
      if (!done) {
        this.obj.push(r);
      }
      merge(this.obj);
    },
    _remove: function (date) {
      for (var i = 0; i < this.obj.length; i++) {
        var d = this.obj[i];
        if (d instanceof Array) {
          if (d[0] <= date && date <= d[1]) {
            this.obj.splice(i, 1);
            if (date < d[1]) {
              this.obj.splice(i, 0, [nextDay(date), d[1]]);
            }
            if (date > d[0]) {
              this.obj.splice(i, 0, [d[0], prevDay(date)]);
            }
            break;
          }
        } else {
          if (date === d) {
            this.obj.splice(i, 1);
            break;
          }
        }
      }
      dedupe(this.obj);
    },
    _removeRange: function (r) {
      for (var i = 0; i < this.obj.length; i++) {
        var d = this.obj[i];
        if (d instanceof Array) {
          var compare = rangeCompare(r, d);
          if (compare === 1) {
            this.obj[i] = [nextDay(r[1]), d[1]];
          }
          if (compare === 2) {
            this.obj.splice(i, 1);
            i--;
          }
          if (compare === 3) {
            this.obj[i] = [d[0], prevDay(r[0])];
            this.obj.splice(i+1, 0, [nextDay(r[1]), d[1]]);
            break;
          }
          if (compare === 4) {
            this.obj[i] = [d[0], prevDay(r[0])];
          }
        } else {
          if (r[0] <= d && d <= r[1]) {
            this.obj.splice(i, 1);
            i--;
          }
        }
      }
      dedupe(this.obj);
    },
    firstDate: function () {
      var date = this.obj[0];
      return date instanceof Array ? date[0] : date;
    },
    lastDate: function () {
      var date = this.obj[this.obj.length - 1];
      return date instanceof Array ? date[1] : date;
    },
    flatten: function () {
      var ret = [];
      this.eachDay(function (d) {
        ret.push(d);
      });
      return ret;
    },
    eachDay: function (fn) {
      for (var i = 0; i < this.obj.length; i++) {
        var date = this.obj[i];
        if (date instanceof Array) {
          for (var d = date[0]; d <= date[1]; d = nextDay(d)) {
            fn(d);
          }
        } else {
          fn(date);
        }
      }
    }
  };

  return DateRange;

})();
