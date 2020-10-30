var qs = require('qs');
const axios = require('axios');
var crypto = require('crypto');
const cheerio = require('cheerio');
const config = require('./CONFIG.js');

// form data
const homeUrl = 'https://heidelberg.corona-ergebnis.de/';
const statusUrl = 'https://heidelberg.corona-ergebnis.de/Home/Results';

const labId = config.labId;
const orderNumber = config.orderNumber;
const birthdate = config.birthdate;
const zipCode = config.zipCode;

// hash input data
function getInputHash() {
	let data = labId + orderNumber + birthdate + zipCode;
	let hash = crypto.createHash('sha512');
	let result = hash.update(data);
	return result.digest('hex');
}

// get CSRF verification token
async function getVerificationToken() {
	let req = (await axios.get(homeUrl, {withCredentials: true}));
	let html = req.data;
	let token = cheerio('[name=__RequestVerificationToken]', html);
	let cookies = [];
	req.headers['set-cookie'].forEach(setcookie => {
		cookies.push(setcookie.substring(0, setcookie.indexOf(';')));
	});
	return {
		token: token[0].attribs.value,
		cookies: cookies
	};
}

async function checkStatus() {
	let input = getInputHash();
	let csrfToken = await getVerificationToken();

	// make post request
	var data = qs.stringify({
		'labId': labId,
		'Hash': input,
		'__RequestVerificationToken': csrfToken.token
	});
	var config = {
	  method: 'post',
	  url: statusUrl,
	  headers: { 
	    'cookie': csrfToken.cookies.join('; '), 
	    'Content-Type': 'application/x-www-form-urlencoded'
	  },
	  data : data
	};

	let result = await axios(config);

	// parse result
	let html = result.data;
	let resultText = cheerio('div[class=well]', html).text();
	let resultAvailable = resultText.search("(ER03)") == -1;

	console.log('Covid test result available: ' + resultAvailable.toString().toUpperCase())
	return resultAvailable;
}

checkStatus();

exports.check = checkStatus;
