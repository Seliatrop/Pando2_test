let allData = [];
let chartsCO2, chartsTMP, chartsVOCT, chartsHUM;

async function loadData() {
	try {
		const response = await fetch('/api/data');
		const result = await response.json();

		console.log('Données reçues:', result);

		allData = result.data;
		displayData(allData);
	} catch (error) {
		console.error('Erreur:', error);
		document.getElementById('content').innerHTML =
			'<p style="color: red;">Erreur de chargement</p>';
	}
}

function displayData(data, selectedRoom = 'Tout') {
	const contentDiv = document.getElementById('content');

	let html = '';

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

	const roomsToShow =
		selectedRoom === 'Tout'
			? ['Room 8F', 'Room 8A', 'Room B2']
			: [selectedRoom];

	const datasetsCO2 = roomsToShow.map((room) => {
		const colors = {
			'Room 8F': '#3b82f6',
			'Room 8A': '#eab308',
			'Room B2': '#10b981',
		};
		return {
			label: room,
			data: uniqueTimestamps.map((timestamp) => {
				const item = co2ByRoom[room].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: colors[room],
			fill: false,
			spanGaps: true,
			tension: 0.4,
		};
	});
	const datasetsTMP = roomsToShow.map((room) => {
		const colors = {
			'Room 8F': '#3b82f6',
			'Room 8A': '#eab308',
			'Room B2': '#10b981',
		};
		return {
			label: room,
			data: uniqueTimestamps.map((timestamp) => {
				const item = tmpByRoom[room].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: colors[room],
			fill: false,
			spanGaps: true,
			tension: 0.4,
		};
	});
	const datasetsVOCT = roomsToShow.map((room) => {
		const colors = {
			'Room 8F': '#3b82f6',
			'Room 8A': '#eab308',
			'Room B2': '#10b981',
		};
		return {
			label: room,
			data: uniqueTimestamps.map((timestamp) => {
				const item = voctByRoom[room].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: colors[room],
			fill: false,
			spanGaps: true,
			tension: 0.4,
		};
	});
	const datasetsHUM = roomsToShow.map((room) => {
		const colors = {
			'Room 8F': '#3b82f6',
			'Room 8A': '#eab308',
			'Room B2': '#10b981',
		};
		return {
			label: room,
			data: uniqueTimestamps.map((timestamp) => {
				const item = humByRoom[room].find(
					(d) => d['@timestamp'] === timestamp
				);
				return item ? parseFloat(item.measure_float) : null;
			}),
			borderColor: colors[room],
			fill: false,
			spanGaps: true,
			tension: 0.4,
		};
	});

	html +=
		'<div class="chart-wrapper" id="co2-wrapper"><canvas id="co2Chart" class="chart-canvas"></canvas></div>';
	html +=
		'<div class="chart-wrapper" id="tmp-wrapper"><canvas id="tmpChart" class="chart-canvas"></canvas></div>';
	html +=
		'<div class="chart-wrapper" id="voct-wrapper"><canvas id="voctChart" class="chart-canvas"></canvas></div>';
	html +=
		'<div class="chart-wrapper" id="hum-wrapper"><canvas id="humChart" class="chart-canvas"></canvas></div>';

	contentDiv.innerHTML = html;
	contentDiv.classList.add('fade-in');

	if (chartsCO2) chartsCO2.destroy();
	if (chartsTMP) chartsTMP.destroy();
	if (chartsVOCT) chartsVOCT.destroy();
	if (chartsHUM) chartsHUM.destroy();

	chartsCO2 = new Chart(document.getElementById('co2Chart'), {
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
					title: {
						display: true,
						text: 'ppm',
					},
				},
			},
		},
	});
	chartsTMP = new Chart(document.getElementById('tmpChart'), {
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
					title: {
						display: true,
						text: '°C',
					},
				},
			},
		},
	});
	chartsVOCT = new Chart(document.getElementById('voctChart'), {
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
					title: {
						display: true,
						text: 'ppb',
					},
				},
			},
		},
	});
	chartsHUM = new Chart(document.getElementById('humChart'), {
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
					title: {
						display: true,
						text: '%',
					},
				},
			},
		},
	});

	if (!window.filtersInitialized) {
		initializeFilters();
		window.filtersInitialized = true;
	}
}

function initializeFilters() {
	const roomFilter = document.getElementById('filter-rooms');
	const paramFilter = document.getElementById('filter-params');

	paramFilter.addEventListener('change', function () {
		const selectedParam = this.value;

		if (selectedParam === 'Tout') {
			document.getElementById('co2-wrapper').classList.remove('hidden');
			document.getElementById('tmp-wrapper').classList.remove('hidden');
			document.getElementById('voct-wrapper').classList.remove('hidden');
			document.getElementById('hum-wrapper').classList.remove('hidden');
		} else {
			document.getElementById('co2-wrapper').classList.add('hidden');
			document.getElementById('tmp-wrapper').classList.add('hidden');
			document.getElementById('voct-wrapper').classList.add('hidden');
			document.getElementById('hum-wrapper').classList.add('hidden');

			// Afficher uniquement le graphique sélectionné
			if (selectedParam === 'CO2') {
				document
					.getElementById('co2-wrapper')
					.classList.remove('hidden');
			} else if (selectedParam === 'TMP') {
				document
					.getElementById('tmp-wrapper')
					.classList.remove('hidden');
			} else if (selectedParam === 'VOCT') {
				document
					.getElementById('voct-wrapper')
					.classList.remove('hidden');
			} else if (selectedParam === 'HUM') {
				document
					.getElementById('hum-wrapper')
					.classList.remove('hidden');
			}
		}
	});

	roomFilter.addEventListener('change', function () {
		const selectedRoom = this.value;
		console.log('Filtre salles changé:', selectedRoom);
		displayData(allData, selectedRoom);
	});
}

document.addEventListener('DOMContentLoaded', loadData);
