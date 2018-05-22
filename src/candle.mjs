import csv from 'csvtojson'
import Promise from 'bluebird'

class Candle {
	constructor(Models) {
		this.Models = Models
	}

	fileToDatabase(options) {
		return new Promise((resolve, reject) => {
			csv({ delimiter: options.delimiter || ';' })
				.fromFile(`${process.cwd()}${options.file}`)
				.on('json', line => this.lineToDatabase({ line, ...options }).catch(err => reject(err)))
				.on('done', (err) => {
					if (err) return reject(err)
					return resolve()
				})
		})
	}

	lineToDatabase(options) {
		return new Promise((resolve, reject) => {
			const value = options.line
			if (options.database) value.database = options.database
			if (options.date) value.date = Date.now()
			new this.Models[options.type](value).save((err) => {
				if (err) {
					if (options.safe) return reject(err)
					console.log(err)
				}
				return resolve()
			})
		})
	}

	linesFromDatabase(options) {
		return new Promise((resolve, reject) => {
			this.Models[options.database.type].find({ database: options.database._id }, (err, lines) => {
				if (err) return reject(err)
				return resolve(lines)
			})
		})
	}
}

export default Candle
