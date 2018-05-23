import csv from 'csvtojson'
import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'
import xml from 'xml2js'

const fsAsync = Promise.promisifyAll(fs)
	, xmlAsync = Promise.promisifyAll(xml)

class Candle {
	constructor(Models) {
		this.Models = Models
	}

	fileToDatabase(options) {
		return new Promise((resolve, reject) => {
			switch (path.extname(options.file).toLowerCase()) {
				case '.csv': return this._csvToDatabase(options)
				case '.json': return this._jsonToDatabase(options)
				case '.xml': return this._xmlToDatabase(options)
				default: return reject(new Error('File type not supported'))
			}
		})
	}

	_csvToDatabase(options) {
		return new Promise((resolve, reject) => {
			csv({ delimiter: options.delimiter || ';' })
				.fromFile(`${process.cwd()}${options.file}`)
				.on('json', (line) => {
					this._lineToDatabase({ line, ...options })
						.then((err) => { if (err) console.log(err) })
						.catch(err => reject(err))
				})
				.on('done', (err) => {
					if (err) return reject(err)
					return resolve()
				})
		})
	}

	_jsonToDatabase(options) {
		return new Promise((resolve, reject) => {
			fsAsync.readFileAsync(`${process.cwd()}${options.file}`, 'utf8')
				.then(data => JSON.parse(data)
					.reduce((promises, line) => this._lineToDatabase({ line, ...options })), Promise.resolve())
				.then(() => resolve())
				.catch(err => reject(err))
		})
	}

	_xmlToDatabase(options) {
		return new Promise((resolve, reject) => {
			fsAsync.readFileAsync(`${process.cwd()}${options.file}`, 'utf8')
				.then(data => xmlAsync.parseStringAsync(data))
				.then(json => json[options.root ? options.root : 'root.line']
					.reduce((promises, line) => this._lineToDatabase({ line, ...options })), Promise.resolve())
				.then(() => resolve())
				.catch(err => reject(err))
		})
	}

	_lineToDatabase(options) {
		return new Promise((resolve, reject) => {
			const line = {
				database: options.database ? options.database : null
				, date: options.date ? Date.now() : null
				, ...options.line
			}
			return new this.Models[options.type](line).save()
				.then(() => resolve())
				.catch((err) => {
					if (!options.safe) return resolve(err)
					return this.removeFromDatabase(options)
						.then(() => reject(err))
						.catch(err2 => reject(err2))
			})
		})
	}

	linesFromDatabase(options) {
		return new Promise((resolve, reject) => this.Models[options.type]
			.find({ database: options.database })
			.then(lines => resolve(lines))
			.catch(err => reject(err)))
	}

	removeFromDatabase(options) {
		return new Promise((resolve, reject) => this.Models[options.type]
			.deleteMany({ database: options.database })
			.then(() => resolve())
			.catch(err => reject(err)))
	}
}

export default Candle
