/**
 * Geohash utility functions.
 * Implementation adapted to be dependency-free for n8n Cloud.
 */

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export class GeohashUtils {

	/**
	 * Encodes latitude/longitude to geohash of length precision
	 */
	static encode(lat: number, lon: number, precision: number = 10): string {
		let idx = 0; // index into base32 map
		let bit = 0; // each char holds 5 bits
		let evenBit = true;
		let geohash = '';

		let latMin = -90, latMax = 90;
		let lonMin = -180, lonMax = 180;

		while (geohash.length < precision) {
			if (evenBit) {
				// bisect E-W longitude
				const lonMid = (lonMin + lonMax) / 2;
				if (lon >= lonMid) {
					idx = idx * 2 + 1;
					lonMin = lonMid;
				} else {
					idx = idx * 2;
					lonMax = lonMid;
				}
			} else {
				// bisect N-S latitude
				const latMid = (latMin + latMax) / 2;
				if (lat >= latMid) {
					idx = idx * 2 + 1;
					latMin = latMid;
				} else {
					idx = idx * 2;
					latMax = latMid;
				}
			}
			evenBit = !evenBit;

			if (++bit === 5) {
				// 5 bits gives us a character: append it and start over
				geohash += BASE32.charAt(idx);
				bit = 0;
				idx = 0;
			}
		}

		return geohash;
	}

	/**
	 * Decode geohash to latitude/longitude (center of the box)
	 */
	static decode(geohash: string): { lat: number; lon: number } {
		const bounds = this.bounds(geohash);
		const latMin = bounds.sw.lat, latMax = bounds.ne.lat;
		const lonMin = bounds.sw.lon, lonMax = bounds.ne.lon;

		return {
			lat: Number(((latMin + latMax) / 2).toFixed(Math.floor(2 - Math.log(latMax - latMin) / Math.LN10))),
			lon: Number(((lonMin + lonMax) / 2).toFixed(Math.floor(2 - Math.log(lonMax - lonMin) / Math.LN10))),
		};
	}

	/**
	 * Returns SW/NE latitude/longitude bounds of specified geohash.
	 */
	static bounds(geohash: string) {
		let evenBit = true;
		let latMin = -90, latMax = 90;
		let lonMin = -180, lonMax = 180;

		for (let i = 0; i < geohash.length; i++) {
			const chr = geohash.charAt(i);
			const idx = BASE32.indexOf(chr);
			if (idx === -1) throw new Error('Invalid geohash');

			for (let n = 4; n >= 0; n--) {
				const bitN = (idx >> n) & 1;
				if (evenBit) {
					// longitude
					const lonMid = (lonMin + lonMax) / 2;
					if (bitN === 1) {
						lonMin = lonMid;
					} else {
						lonMax = lonMid;
					}
				} else {
					// latitude
					const latMid = (latMin + latMax) / 2;
					if (bitN === 1) {
						latMin = latMid;
					} else {
						latMax = latMid;
					}
				}
				evenBit = !evenBit;
			}
		}

		return {
			sw: { lat: latMin, lon: lonMin },
			ne: { lat: latMax, lon: lonMax },
		};
	}

	/**
	 * Determines adjacent cell in given direction.
	 * direction: n, s, e, w
	 */
	static adjacent(geohash: string, direction: string): string {
		// simple adjacency logic based on neighbors
		geohash = geohash.toLowerCase();
		direction = direction.toLowerCase();

		if (geohash.length === 0) throw new Error('Invalid geohash');
		if ('nsew'.indexOf(direction) === -1) throw new Error('Invalid direction');

		const neighbour = {
			n: [ 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx' ],
			s: [ '14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp' ],
			e: [ 'bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' ],
			w: [ '238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb' ],
		};

		const border = {
			n: [ 'prxz',     'bcfguvyz' ],
			s: [ '028b',     '0145hjnp' ],
			e: [ 'bcfguvyz', 'prxz'     ],
			w: [ '0145hjnp', '028b'     ],
		};

		const lastCh = geohash.slice(-1);
		let parent = geohash.slice(0, -1);
		const type = geohash.length % 2;

		// @ts-expect-error: Implicit string index lookup for direction map
		if (border[direction][type].indexOf(lastCh) !== -1 && parent !== '') {
			parent = this.adjacent(parent, direction);
		}

		// @ts-expect-error: Implicit string index lookup for direction map
		return parent + BASE32.charAt(neighbour[direction][type].indexOf(lastCh));
	}
	
	static neighbours(geohash: string) {
		return {
			n: this.adjacent(geohash, 'n'),
			ne: this.adjacent(this.adjacent(geohash, 'n'), 'e'),
			e: this.adjacent(geohash, 'e'),
			se: this.adjacent(this.adjacent(geohash, 's'), 'e'),
			s: this.adjacent(geohash, 's'),
			sw: this.adjacent(this.adjacent(geohash, 's'), 'w'),
			w: this.adjacent(geohash, 'w'),
			nw: this.adjacent(this.adjacent(geohash, 'n'), 'w'),
		};
	}
}