var crypto = require('crypto')

const cryptoString = (string) => {
	const md5 = crypto.createHash('md5')
	md5.update(string)
	return md5.digest('hex')
}

module.exports = {
	cryptoString
}
