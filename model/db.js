let mysql = require('mysql')

let pool = mysql.createPool({
  host: 'xdm294599118.my3w.com',
  user: 'xdm294599118',
	database: 'xdm294599118_db',
	insecureAuth: true,
})

exports.query = function (sql, arr, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {throw err;return;}
    connection.query(sql, arr, function (error, results, fields) {
			connection.release();
			if(error) throw error;
			callback && callback(results, fields)
		})
  })
}
