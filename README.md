md5sum
===========================

A simple MD5 checksum utility for NodeJS.

## Install

	npm install md5sum

## API

### md5sum.calculate(dir, filename, callback)

	var md5sum = require('md5sum');

	md5sum.calculate('some/dir', 'checksum', function (err) {
		if (err) {
			// Something wrong.
		} else {
			// 'checksum' file generated under 'some/dir'
		}
	});

### md5sum.validate(dir, filename, callback)

	var md5sum = require('md5sum');

	md5sum.validate('some/dir', 'checksum', function (err) {
		if (err) {
			// Something wrong.
		} else {
			// All files are validated.
		}
	});

## LICENSE

Copyright (c) 2014 Alibaba.com, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.