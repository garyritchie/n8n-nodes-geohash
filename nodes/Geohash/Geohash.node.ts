import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { GeohashUtils } from './GeohashUtils';

export class Geohash implements INodeType {
	description: INodeTypeDescription = {
		usableAsTool: true,
		displayName: 'Geohash',
		name: 'geohash',
		icon: 'file:Geohash.svg',
		group: ['transform'],
		version: 1,
		description: 'Encode and decode Geohashes using latlon-geohash',
		defaults: {
			name: 'Geohash',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Decode (Hash to Lat/Lon)',
						value: 'decode',
						action: 'Decode center of geohash to latitude and longitude',
					},
					{
						name: 'Encode (Lat/Lon to Hash)',
						value: 'encode',
						action: 'Encode latitude and longitude to geohash',
					},
					{
						name: 'Get Adjacent',
						value: 'adjacent',
						action: 'Return adjacent cell to given geohash in specified direction (N/S/E/W)',
					},
					{
						name: 'Get Bounds',
						value: 'bounds',
						action: 'Return bounds of given geohash',
					},
					{
						name: 'Get Neighbours',
						value: 'neighbours',
						action: 'Return all 8 adjacent cells to given geohash'
					},
				],
				default: 'encode',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['encode'],
					},
				},
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						operation: ['encode'],
					},
				},
			},
			{
				displayName: 'Precision',
				name: 'precision',
				type: 'number',
				default: 10,
				displayOptions: {
					show: {
						operation: ['encode'],
					},
				},
			},
			{
				displayName: 'Geohash',
				name: 'geohash',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['decode', 'bounds', 'adjacent', 'neighbours'],
					},
				},
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'North', value: 'n' },
					{ name: 'South', value: 's' },
					{ name: 'East', value: 'e' },
					{ name: 'West', value: 'w' },
				],
				default: 'n',
				displayOptions: {
					show: {
						operation: ['adjacent'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject;

				if (operation === 'encode') {
					const lat = this.getNodeParameter('latitude', i) as number;
					const lon = this.getNodeParameter('longitude', i) as number;
					const precision = this.getNodeParameter('precision', i) as number;

					// FIX: Using the renamed library import
					result = {
						geohash: GeohashUtils.encode(lat, lon, precision),
					};

				} else if (operation === 'decode') {
					const hash = this.getNodeParameter('geohash', i) as string;
					result = GeohashUtils.decode(hash);

				} else if (operation === 'bounds') {
					const hash = this.getNodeParameter('geohash', i) as string;
					result = GeohashUtils.bounds(hash);

				} else if (operation === 'adjacent') {
					const hash = this.getNodeParameter('geohash', i) as string;
					const direction = this.getNodeParameter('direction', i) as string;

					result = {
						geohash: GeohashUtils.adjacent(hash, direction),
					};

				} else if (operation === 'neighbours') {
					const hash = this.getNodeParameter('geohash', i) as string;
					result = GeohashUtils.neighbours(hash);
				}

				returnData.push({
					json: result,
					pairedItem: {
						item: i,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}