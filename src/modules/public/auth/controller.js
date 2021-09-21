const model = require('./model.js')
const htmlController = require('../../../lib/htmlController.js')
const { sign } = require('../../../lib/jwt.js')

const GET = async (req, res) => {
	res.render(...htmlController(req.userInfo, { html: 'public/login.html' } ))
}

const POST = async (req, res) => {
	let user = await model.validate( req.body )
	if(user) {
		res.cookie('token', sign(user), { maxAge: 50000000 })
		   .redirect('/groups')
	} else {
		res.render(...htmlController(req.userInfo, { html: 'public/login.html', errorMessage: 'wrong username or password!' } ))
	}
}

const LOGOUT = async (req, res) => {
	res.clearCookie('token')
		.redirect('/')
}

module.exports = {
	LOGOUT,
	POST,
	GET,
}