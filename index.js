var crypto = require('crypto'),
	fs = require('fs'),
	path = require('path');
	
var PATTERN_BACK_SLASH = /\\/g;

/**
 * Calculate 128-bit MD5 checksum of the given ReadStream.
 * @param rs {Object}
 * @param callback {Function}
 */
function md5sum(rs, callback) {
	var hash = crypto.createHash('md5');

	rs.on('data', function (data) {
		hash.update(data);
	});
	
	rs.on('end', function () {
		callback(hash.digest('hex'));
	});
}

/**
 * Get a file list of the given directory.
 * @param base {string}
 * @param callback {Function}
 * @param _current {string}
 * @param _result {Array}
 */
function travel(base, callback, _current, _result) {
	_current = _current || '';
	_result = _result || [];

	fs.readdir(path.join(base, _current), function (err, filenames) {
		if (err) {
			return callback(err);
		}
		
		var len = filenames.length,
			i = 0;
	
		(function next(err) {
			if (err) {
				return callback(err);
			}
		
			if (i < len) {
				var pathname = path.join(_current, filenames[i++]);

				fs.stat(path.join(base, pathname), function (err, stats) {
					if (err) {
						return callback(err);
					}
					
					if (stats.isFile()) {
						_result.push(pathname);
						next();
					} else if (stats.isDirectory()) {
						travel(base, next, pathname, _result); 
					}
				});
			} else {
				callback(null, _result);
			}
		}());
	});
}

/**
 * Calculate MD5 checksums for a directory.
 * @param dir {string}
 * @param filename {string}
 * @param callback {Function}
 */
exports.calculate = function (dir, filename, callback) {
	travel(dir, function (err, pathnames) {
		if (err) {
			return callback(err);
		}
		
		var result = [];
		
		(function next(i) {
			if (i < pathnames.length) {
				var rs = fs.createReadStream(
						path.join(dir, pathnames[i]));
				
				md5sum(rs, function (md5) {
					var pathname = pathnames[i]
							.replace(PATTERN_BACK_SLASH, '/');
						
					result.push(md5 + ' ' + pathname);
					next(i + 1);
				});
			} else {
				fs.writeFile(path.join(dir, filename),
					result.join('\n'), callback);
			}
		}(0));
	});
};

/**
 * Validate files with the given checksums.
 * @param dir {string}
 * @param filename {string}
 * @param callback {Function}
 */
exports.validate = function (dir, filename, callback) {
	fs.readFile(path.join(dir, filename), 'utf8', function (err, checksum) {
		if (err) {
			return callback(err);
		}
		
		checksum = checksum.split('\n').map(function (line) {
			line = line.trim().split(' ');
			
			return {
				md5: line.shift(),
				pathname: line.join(' ')
			};
		});
		
		(function next(i) {
			if (i < checksum.length) {
				var rs = fs.createReadStream(
						path.join(dir, checksum[i].pathname));
				
				md5sum(rs, function (md5) {
					if (md5 !== checksum[i].md5) {
						callback(new Error('"'
							+ checksum[i].pathname + '" failed'));
					} else {
						next(i + 1);
					}
				});
			} else {
				callback(null);
			}
		}(0));
	});
};
