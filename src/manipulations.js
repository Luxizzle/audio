/**
 * Extend audio with manipulations functionality
 *
 * @module  audio/src/manipulations
 */

'use strict'


const util = require('audio-buffer-utils')
const nidx = require('negative-index')
const db = require('decibels')

let Audio = require('../')


//normalize contents by the offset
Audio.prototype.normalize = function normalize (time = 0, duration = this.buffer.duration) {
	let start = Math.floor(time * this.buffer.sampleRate)
	let end = Math.floor(duration * this.buffer.sampleRate) + start

	util.normalize(this.buffer, start, end)

	return this;
}

//fade in/out by db range
Audio.prototype.fade = function (start, duration, map) {
	//0, 1, easing
	//0, -1, easing
	//-0, -1, easing
	if (arguments.length === 3) {

	}

	//1, easing
	//-1, easing
	//0, 1
	//0, -1
	//-0, -1
	else if (arguments.length === 2) {
		let last = arguments[arguments.length - 1]
		if (typeof last === 'number') {
			duration = last
		}
		else {
			map = last
			duration = start
			start = 0
		}
	}

	//1
	//-1
	else if (arguments.length === 1) {
		duration = start
		start = 0
	}

	map = typeof map === 'function' ? map : t => t

	start = nidx(start, this.buffer.duration)

	let step = duration > 0 ? 1 : -1
	let halfStep = step*.5
	let startOffset = start * this.buffer.sampleRate
	let len = duration * this.buffer.sampleRate
	let endOffset = startOffset + len
	let range = this.range

	for (let c = 0, l = this.buffer.length; c < this.buffer.numberOfChannels; c++) {
		let data = this.buffer.getChannelData(c)
		for (let i = startOffset; i != endOffset; i+=step) {
			let idx = Math.floor(nidx(i + halfStep, l))
			let t = (i + halfStep - startOffset) / len

			//volume is mapped by easing and 0..-40db
			data[idx] *= db.toGain(map(t) * range - range)
		}
	}

	return this
}

//trim start/end silence
Audio.prototype.trim = function trim (threshold = 0) {
	this.buffer = util.trim(this.buffer, threshold)

	//TODO: trimLeft, trimRight

	return this;
}

//change gain of the audio
Audio.prototype.gain = function gain (volume = 1, start = 0, duration = this.buffer.duration) {
	start = nidx(start, this.buffer.duration)
	let startOffset = start * this.buffer.sampleRate

	return this;
};

//regulate rate of playback/output/read etc
Audio.prototype.rate = function rate () {
	return this;
};

Audio.prototype.reverse = function reverse () {

	return this;
}
Audio.prototype.mix = function mix () {

	return this;
}

Audio.prototype.shift = function shift () {

	return this;
}
Audio.prototype.pad = function pad () {

	return this;
}
Audio.prototype.concat = function concat () {

	return this;
}
Audio.prototype.slice = function slice () {

	return this;
}
Audio.prototype.invert = function invert () {

	return this;
}
Audio.prototype.copy = function copy () {

	return this;
}
Audio.prototype.isEqual = function isEqual () {

	return this;
}
