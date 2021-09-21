const path = require('path')
module.exports = (userInfo, body, header) => {
	userInfo = userInfo || {}
	body = body || {}
	header = header || {}

	let links
	let data

	if(userInfo.role == 'student') {
		links = [
			{ link: '/groups', text: 'guruhlar' },
		]
	} else if (userInfo.role == 'admin' || userInfo.role == 'teacher' || userInfo.role == 'assistant') {
		links = [
			{ link: '/assistants', text: 'mentorlar' },
			{ link: '/groups', text: 'guruhlar' },
			{ link: '/teachers', text: 'ustozlar' },
			{ link: '/admin', text: 'admin' },
		]
	} else {
		links = []
	}

	if(path.basename(body.html, '.html') == 'table') {
		data = {
			tableName1: body.tableName1 || '',
			tableName2: body.tableName2 || '',
			table: body.table
		}
	} else if(path.basename(body.html, '.html') == 'login') {
		data = {
			errorMessage: body.errorMessage || null
		}
	} else if(path.basename(body.html, '.html') == 'admin') {
		 console.log(body.data)
		data = {
			panel: body.panel || 'table-groups.html',
			data: {
				data: body.data || ['olma']
			}
		}
	}

	return [
		'index.html',
		{
			header: header.header || 'public/header.html',
			headerData: {
				links,
				isLoggedIn: userInfo.role ?  true : false
			},
			html: body.html || 'public/table.html',
			data
		}
	]

}