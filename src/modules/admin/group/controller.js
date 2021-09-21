const model = require('./model.js')
const htmlController = require('../../../lib/htmlController.js')

const GET = async (req, res) => {
	res.render( ...htmlController(
		req.userInfo,
		await model.groups(req.query, req.userInfo),
		{ header: 'private/header.html' }
	))
}

module.exports = {
	GET
}

