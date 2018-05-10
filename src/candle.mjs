import csv from 'csvtojson'
import Promise from 'bluebird'

class Candle {
	constructor(Models) {
		this.Models = Models
	}

	fileToDatabase(options) {
		return new Promise((resolve, reject) => {
			csv({ delimiter: options.delimiter || ';' })
				.fromFile(options.file)
				.on('json', line => this.lineToDatabase({ line, ...options }).catch(err => reject(err)))
				.on('done', (err) => {
					if (err) return reject(err)
					return resolve()
				})
		})
	}

	lineToDatabase(options) {
		return new Promise((resolve, reject) => {
			const value = { database: options.database, ...options.line }
			new this.Models[options.type](value).save((err) => {
				if (err) {
					if (options.safe) return reject(err)
					console.log(err)
				}
				return resolve()
			})
		})
	}
}

export default Candle
