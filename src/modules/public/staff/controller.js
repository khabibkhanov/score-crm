const htmlController = require('../../../lib/htmlController.js')
const model = require('./model.js')

const TEACHERS = async (req, res) => {
	res.render( ...htmlController(
		req.userInfo,
		await model.teachers(req.userInfo)
	) )
}

const ASSISTANTS = async (req, res) => {
	res.render( ...htmlController(
		req.userInfo,
		await model.assistants(req.query, req.userInfo)
	) )
}


module.exports = {
	ASSISTANTS,
	TEACHERS,
}