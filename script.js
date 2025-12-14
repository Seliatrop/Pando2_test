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

	let html = '<h2>Données des capteurs</h2>';

	const datalenght = data.length;
	html += `<p>Total des enregistrements: ${datalenght}</p>`;
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
	type.co2.forEach((item) => {
		if (item.room_name === 'Room 8F') {
			co2ByRoom['Room 8F'].push(item);
		} else if (item.room_name === 'Room 8A') {
			co2ByRoom['Room 8A'].push(item);
		} else if (item.room_name === 'Room B2') {
			co2ByRoom['Room B2'].push(item);
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
	];
	html += `<h3>Graphique CO2 par room</h3> ${co2ByRoom['Room 8F'].length}`;

	const datasets = [
		{
			label: 'Room 8F',
			data: co2ByRoom['Room 8F'].map((item) => item.measure_float),
			borderColor: 'rgba(255, 99, 132, 1)',
			fill: false,
		},
		{
			label: 'Room 8A',
			data: co2ByRoom['Room 8A'].map((item) => item.measure_float),
			borderColor: 'rgba(54, 162, 235, 1)',
			fill: false,
		},
		{
			label: 'Room B2',
			data: co2ByRoom['Room B2'].map((item) => item.measure_float),
			borderColor: 'rgba(75, 192, 192, 1)',
			fill: false,
		},
	];

	html +=
		'<div style="width: 800px; height: 400px;"><canvas id="co2Chart"></canvas></div>';

	contentDiv.innerHTML = html;

	new Chart(document.getElementById('co2Chart'), {
		type: 'line',
		data: {
			labels: uniqueTimestamps.map(xaxis),
			datasets: datasets,
		},
		options: {
			scales: {
				x: {
					ticks: {
						maxTicksLimit: 20,
					},
				},
				y: {
					beginAtZero: true,
				},
			},
		},
	});
}

document.addEventListener('DOMContentLoaded', loadData);
