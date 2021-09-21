const host = 'localhost'
const PORT = process.env.PORT || 5000

const pgConfig = {
	host: 'localhost',
	port: 5432,
	user:'postgres',
	password: '2303',
	database: 'score_db'
}

module.exports = { 
	pgConfig,
	PORT,
	host,
}