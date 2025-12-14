async function loadData() {
	try {
		const response = await fetch('/api/data');
		const result = await response.json();

		console.log('Données reçues:', result);

		displayData(result.data);
	} catch (error) {
		console.error('Erreur:', error);
		document.getElementById('content').innerHTML =
			'<p style="color: red;">Erreur de chargement</p>';
	}
}

function displayData(data) {
	const contentDiv = document.getElementById('content');

	let html = '<h2>Pando2</h2>';

	const type = {
		co2: [],
		tmp: [],
		voct: [],
		hum: [],
	};
	data.forEach((item) => {
		if (item.measure_type === 'CO2') {
			type.co2.push(item);
		} else if (item.measure_type === 'TMP') {
			type.tmp.push(item);
		} else if (item.measure_type === 'VOCT') {
			type.voct.push(item);
		} else if (item.measure_type === 'HUM') {
			type.hum.push(item);
		}
	});
	const co2ByRoom = {
		'Room 8F': [],
		'Room 8A': [],
		'Room B2': [],
	};
	const tmpByRoom = {
		'Room 8F': [],
		'Room 8A': [],
		'Room B2': [],
	};
	const voctByRoom = {
		'Room 8F': [],
		'Room 8A': [],
		'Room B2': [],
	};
	const humByRoom = {
		'Room 8F': [],
		'Room 8A': [],
		'Room B2': [],
	};
	type.co2.forEach((item) => {
		if (item.room_name === 'Room 8F') {
			co2ByRoom['Room 8F'].push(item);
		} else if (item.room_name === 'Room 8A') {
			co2ByRoom['Room 8A'].push(item);
		} else if (item.room_name === 'Room B2') {
			co2ByRoom['Room B2'].push(item);
		}
	});
	type.tmp.forEach((item) => {
		if (item.room_name === 'Room 8F') {
			tmpByRoom['Room 8F'].push(item);
		} else if (item.room_name === 'Room 8A') {
			tmpByRoom['Room 8A'].push(item);
		} else if (item.room_name === 'Room B2') {
			tmpByRoom['Room B2'].push(item);
		}
	});
	type.voct.forEach((item) => {
		if (item.room_name === 'Room 8F') {
			voctByRoom['Room 8F'].push(item);
		} else if (item.room_name === 'Room 8A') {
			voctByRoom['Room 8A'].push(item);
		} else if (item.room_name === 'Room B2') {
			voctByRoom['Room B2'].push(item);
		}
	});
	type.hum.forEach((item) => {
		if (item.room_name === 'Room 8F') {
			humByRoom['Room 8F'].push(item);
		} else if (item.room_name === 'Room 8A') {
			humByRoom['Room 8A'].push(item);
		} else if (item.room_name === 'Room B2') {
			humByRoom['Room B2'].push(item);
		}
	});

	const xaxis = (timestamp) => {
		const date = new Date(timestamp);
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	const uniqueTimestamps = [
		...new Set(type.co2.map((item) => item['@timestamp'])),
	].sort();

	const datasetsCO2 = [
		{
			label: 'Room 8F',
			data: uniqueTimestamps.map((timestamp) => {
				const item = co2ByRoom['Room 8F'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(255, 99, 132, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room 8A',
			data: uniqueTimestamps.map((timestamp) => {
				const item = co2ByRoom['Room 8A'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(54, 162, 235, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room B2',
			data: uniqueTimestamps.map((timestamp) => {
				const item = co2ByRoom['Room B2'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(75, 192, 192, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
	];
	const datasetsTMP = [
		{
			label: 'Room 8F',
			data: uniqueTimestamps.map((timestamp) => {
				const item = tmpByRoom['Room 8F'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(255, 159, 64, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room 8A',
			data: uniqueTimestamps.map((timestamp) => {
				const item = tmpByRoom['Room 8A'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(153, 102, 255, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room B2',
			data: uniqueTimestamps.map((timestamp) => {
				const item = tmpByRoom['Room B2'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(255, 206, 86, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
	];
	const datasetsVOCT = [
		{
			label: 'Room 8F',
			data: uniqueTimestamps.map((timestamp) => {
				const item = voctByRoom['Room 8F'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(54, 162, 235, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room 8A',
			data: uniqueTimestamps.map((timestamp) => {
				const item = voctByRoom['Room 8A'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(255, 99, 132, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room B2',
			data: uniqueTimestamps.map((timestamp) => {
				const item = voctByRoom['Room B2'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(75, 192, 192, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
	];
	const datasetsHUM = [
		{
			label: 'Room 8F',
			data: uniqueTimestamps.map((timestamp) => {
				const item = humByRoom['Room 8F'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(255, 206, 86, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room 8A',
			data: uniqueTimestamps.map((timestamp) => {
				const item = humByRoom['Room 8A'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(153, 102, 255, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
		{
			label: 'Room B2',
			data: uniqueTimestamps.map((timestamp) => {
				const item = humByRoom['Room B2'].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: 'rgba(54, 162, 235, 1)',
			fill: false,
			spanGaps: true,
			tension: 0.4,
		},
	];

	html +=
		'<div style="width: 1000px; height: 500px;"><canvas id="co2Chart"></canvas></div>';
	html +=
		'<div style="width: 1000px; height: 500px;"><canvas id="tmpChart"></canvas></div>';
	html +=
		'<div style="width: 1000px; height: 500px;"><canvas id="voctChart"></canvas></div>';
	html +=
		'<div style="width: 1000px; height: 500px;"><canvas id="humChart"></canvas></div>';

	contentDiv.innerHTML = html;

	new Chart(document.getElementById('co2Chart'), {
		type: 'line',
		data: {
			labels: uniqueTimestamps.map(xaxis),
			datasets: datasetsCO2,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'CO2 par pièce',
					font: {
						size: 18,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						maxTicksLimit: 20,
					},
				},
				y: {
					beginAtZero: false,
				},
			},
		},
	});
	new Chart(document.getElementById('tmpChart'), {
		type: 'line',
		data: {
			labels: uniqueTimestamps.map(xaxis),
			datasets: datasetsTMP,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'Température par pièce',
					font: {
						size: 18,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						maxTicksLimit: 20,
					},
				},
				y: {
					beginAtZero: false,
				},
			},
		},
	});
	new Chart(document.getElementById('voctChart'), {
		type: 'line',
		data: {
			labels: uniqueTimestamps.map(xaxis),
			datasets: datasetsVOCT,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'VOCT par pièce',
					font: {
						size: 18,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						maxTicksLimit: 20,
					},
				},
				y: {
					beginAtZero: false,
				},
			},
		},
	});
	new Chart(document.getElementById('humChart'), {
		type: 'line',
		data: {
			labels: uniqueTimestamps.map(xaxis),
			datasets: datasetsHUM,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'Humidité par pièce',
					font: {
						size: 18,
					},
				},
			},
			scales: {
				x: {
					ticks: {
						maxTicksLimit: 20,
					},
				},
				y: {
					beginAtZero: false,
				},
			},
		},
	});
}
document.addEventListener('DOMContentLoaded', loadData);
