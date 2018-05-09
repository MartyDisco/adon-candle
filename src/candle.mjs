import csv from 'csvtojson'
import Promise from 'bluebird'

class Candle {
	constructor(Models) {
		this.Models = Models
	}

	databaseInsert(options) {
		return new Promise((resolve, reject) => {
			csv({ delimiter: options.delimiter })
				.fromFile(options.file)
				.on('json', (line) => {
					const value = { date: Date.now(), candle: options.candle, ...line }
					new this.Models[options.type](value).save((err) => { if (err) console.log(err) })
				})
				.on('done', (err) => {
					if (err) return reject(err)
					return resolve(options)
				})
		})
	}
}

export default Candle
