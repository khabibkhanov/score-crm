const { verify } = require('../lib/jwt.js')
const { fetch, fetchAll } = require('../lib/postgres.js')

let USER_ROLE = `
	SELECT 
		CASE
			WHEN user_role = 1 THEN 'admin'
			WHEN user_role = 2 THEN 'teacher'
			WHEN user_role = 3 THEN 'assistant'
			WHEN user_role = 4 THEN 'student'
		END AS user_role
	FROM users 
	WHERE user_id = $1
`

let STUDENT_GROUPS = `
	SELECT 
		gs.group_id
	FROM group_students gs
	INNER JOIN students s ON s.student_id = gs.student_id
	INNER JOIN users u ON u.user_id = s.user_id
	WHERE u.user_id = $1
`

let TEACHER_GROUPS = `
	SELECT 
		g.group_id
	FROM groups g
	INNER JOIN teachers t ON t.teacher_id = g.teacher_id
	INNER JOIN users u ON u.user_id = t.user_id
	WHERE u.user_id = $1
`

let ASSISTANT_GROUPS = `
	SELECT 
		ga.group_id
	FROM group_assistants ga
	INNER JOIN assistants a ON a.assistant_id = ga.assistant_id
	INNER JOIN users u ON u.user_id = a.user_id
	WHERE u.user_id = $1
`

let ADMIN_GROUPS = `
	SELECT 
		group_id
	FROM groups
`

module.exports = async (req, res, next) => {
	try {
		if(!(req.url == '/' || req.url == '/login') && !req.cookies.token) return res.redirect('/')
		if((req.url == '/' || req.url == '/login') && !req.cookies.token) return next()
		let token = req.cookies.token
		let payload = verify(token)
		// if(req.url == '/' && req.cookies.token) return next()
		if(req.url == '/login' && req.cookies.token) return res.redirect('/')
		let userId = payload.user_id
		let role = await fetch(USER_ROLE, userId)
		role = role.user_role

		if(role == 'student') {
			let groups = await fetchAll(STUDENT_GROUPS, userId)
			groups = groups.map(group => group.group_id)
			req.userInfo = {
				userId,
				role,
				groups
			}	
			return next()
		} else if (role == 'teacher') {
			let groups = await fetchAll(TEACHER_GROUPS, userId)
			groups = groups.map(group => group.group_id)
			req.userInfo = {
				userId,
				role,
				groups
			}
		} else if (role == 'assistant') {
			let groups = await fetchAll(ASSISTANT_GROUPS, userId)
			groups = groups.map(group => group.group_id)
			req.userInfo = {
				userId,
				role,
				groups
			}
		} else if (role == 'admin') {
			let groups = await fetchAll(ADMIN_GROUPS)
			groups = groups.map(group => group.group_id)
			req.userInfo = {
				userId,
				role,
				groups
			}
		}

		next()

	} catch(err) {
		res.render('index.html', {
			header: 'public/header.html',
			headerData: {
				links: [],
				input: false,
				isLoggedIn: false
			},
			html: 'public/error.html',
			data: {
				message: err.message
			}
		})
	}

}