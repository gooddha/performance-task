function quantile(arr, q) {
	const sorted = arr.sort((a, b) => a - b);
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;

	if (sorted[base + 1] !== undefined) {
		return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
	} else {
		return Math.floor(sorted[base]);
	}
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

// TODO: реализовать

// сравнить метрику в разных срезах
function compareMetricByPlatforms(data, page, name, date) {
	console.log(`Compare metric "${name}" by platforms`);
	let filterDataByDate = data.filter(item => item.timestamp.split('T')[0] == date);
	let platforms = [...new Set(filterDataByDate.map(item => item.additional.platform))];
	let table = {};

	platforms.forEach(platform => {
		let filtered = data.filter(item => item.additional.platform == platform);
		table[platform] = addMetricByDate(filtered, page, name, date)
	})

	console.table(table);
}

function compareMetricByUserAgents(data, page, name, date) {
	console.log(`Compare metric "${name}" by user agents`);

	let filterDataByDate = data.filter(item => item.timestamp.split('T')[0] == date);
	let userAgents = [...new Set(filterDataByDate.map(item => item.additional.userAgent))];
	let table = {};

	userAgents.forEach(userAgent => {
		let filtered = data.filter(item => item.additional.userAgent == userAgent);
		table[userAgent] = addMetricByDate(filtered, page, name, date)
	})

	console.table(table);
}

function compareMetricByEnv(data, page, name, date) {
	console.log(`Compare metric "${name}" by environment`);
	let filterDataByDate = data.filter(item => item.timestamp.split('T')[0] == date);

	let envs = [...new Set(filterDataByDate.map(item => item.additional.env))];
	let table = {};

	envs.forEach(env => {
		let filtered = data.filter(item => item.additional.env == env);
		table[env] = addMetricByDate(filtered, page, name, date)
	});

	console.table(table);
}

// показать значение метрики за несколько дней
function showMetricByPeriod(data, page, name, period) {

	console.log(`Show metric "${name}" by period: ${period.start} - ${period.end}`);

	let filterDataByDate = data.filter(item => {
		let itemDate = item.timestamp.split('T')[0]
		return item.page == page && item.name == name && itemDate >= period.start && itemDate <= period.end;
	});

	let table = {};
	table[name] = addMetricByPeriod(filterDataByDate);
	console.table(table);
}



// Пример
// добавить метрику за выбранный день
function addMetricByDate(data, page, name, date) {
	let sampleData = data
		.filter(item => item.page == page && item.name == name && item.date == date)
		.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}

function addMetricByPeriod(data) {
	let sampleData = data.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}


// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
	console.log(`All metrics for ${date}:`);

	let table = {};
	table.connect = addMetricByDate(data, page, 'connect', date);
	table.ttfb = addMetricByDate(data, page, 'ttfb', date);
	table.fcp = addMetricByDate(data, page, 'fcp', date);
	table.lcp = addMetricByDate(data, page, 'lcp', date);

	console.table(table);
	console.log('-----------')
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E59-3339-11E9-9ED9-9F93090795B9')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'slider', '2021-10-31');
		compareMetricByPlatforms(data, 'slider', 'connect', '2021-10-31');
		compareMetricByPlatforms(data, 'slider', 'ttfb', '2021-10-31');
		compareMetricByPlatforms(data, 'slider', 'fcp', '2021-10-31');
		compareMetricByUserAgents(data, 'slider', 'connect', '2021-10-31');
		compareMetricByUserAgents(data, 'slider', 'ttfb', '2021-10-31');
		compareMetricByUserAgents(data, 'slider', 'fcp', '2021-10-31');
		compareMetricByEnv(data, 'slider', 'connect', '2021-10-31');
		compareMetricByEnv(data, 'slider', 'ttfb', '2021-10-31');

		showMetricByPeriod(data, 'slider', 'connect', { start: '2021-10-30', end: '2021-10-31' })
		showMetricByPeriod(data, 'slider', 'fcp', { start: '2021-10-30', end: '2021-10-31' })

		// добавить свои сценарии, реализовать функции выше
	});
