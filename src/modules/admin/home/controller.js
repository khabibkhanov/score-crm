const htmlController = require('../../../lib/htmlController.js')

const GET = async (req, res) => {
	res.redirect('/admin/groups')
}

module.exports = {
	GET
}