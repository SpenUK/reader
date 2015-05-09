function randomID (length) {
	var a = new Array(length);

	for (var i = a.length - 1; i >= 0; i--) {
		a[i] = Math.floor(Math.random() * 9.99);
	};

	return a.join('');
};

function generateRecord (options) {
	options = (options || {});
	var ID = options.ID ? options.ID : randomID(4);

	return {
		'ID': ID,
		'title' : 'example title',
		'slug' : 'example slug',
		'global_ID' : ID
		// More fields should be added as needed for testing
	};
};

function generateRecords (options) {
	options = (options || {random: true, count: 20});
	var a;
	if (options.IDs) {
		a = options.IDs.map(function(ID){
			return generateRecord({ID: ID});
		});
	} else {
		a = new Array(options.count);

		for (var i = a.length - 1; i >= 0; i--) {
			a[i] = generateRecord({random: true});
		};
	};

	return a;
};

module.exports = {
	random: function (n) {
		var records = generateRecords({count: n, random: true});

		return {
			"date_range":{
				"before":"2015-04-17T11:12:02+00:00",
				"after":"2015-03-28T19:08:12-04:00"
			},
			"number":10,
			'posts': records
		};
	},
	withIDs: function (IDs) {
		var records = generateRecords({IDs: IDs});

		return {
			"date_range":{
				"before":"2015-04-17T11:12:02+00:00",
				"after":"2015-03-28T19:08:12-04:00"
			},
			"number":10,
			'posts': records
		};
	},
	generateRecord: generateRecord,
	generateRecords: generateRecords
};