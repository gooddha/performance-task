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
// показать значение метрики за несколько день
function showMetricByPeriod(data, page, name, period) {



}

// показать сессию пользователя
function showSession() {



}

// сравнить метрику в разных срезах
function compareMetricByPlatforms(data, page, name, date) {
	console.log(`Compare metric "${name}" by platforms`);

	let platforms = [...new Set(data.map(item => item.additional.platform))];
	let table = {};

	platforms.forEach(platform => {
		let filtered = data.filter(item => item.additional.platform == platform);
		table[platform] = addMetricByDate(filtered, page, name, date)
	})

	console.table(table);
}

function compareMetricByUserAgents(data, page, name, date) {
	console.log(`Compare metric "${name}" by user agents`);

	let userAgents = [...new Set(data.map(item => item.additional.userAgent))];
	let table = {};

	userAgents.forEach(userAgent => {
		let filtered = data.filter(item => item.additional.userAgent == userAgent);
		table[userAgent] = addMetricByDate(filtered, page, name, date)
	})

	console.table(table);
}

function compareMetricByEnv(data, page, name, date) {
	console.log(`Compare metric "${name}" by environment`);

	let envs = [...new Set(data.map(item => item.additional.env))];
	let table = {};

	envs.forEach(env => {
		let filtered = data.filter(item => item.additional.env == env);
		table[env] = addMetricByDate(filtered, page, name, date)
	})

	console.table(table);
}

// любые другие сценарии, которые считаете полезными


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
// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
	console.log(`All metrics for ${date}:`);

	let table = {};
	table.connect = addMetricByDate(data, page, 'connect', date);
	table.ttfb = addMetricByDate(data, page, 'ttfb', date);

	console.table(table);
	console.log('-----------')
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E59-3339-11E9-9ED9-9F93090795B9')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'slider', '2021-10-30');
		compareMetricByPlatforms(data, 'slider', 'connect', '2021-10-30');
		compareMetricByPlatforms(data, 'slider', 'ttfb', '2021-10-30');
		compareMetricByUserAgents(data, 'slider', 'connect', '2021-10-30');
		compareMetricByUserAgents(data, 'slider', 'ttfb', '2021-10-30');
		compareMetricByEnv(data, 'slider', 'connect', '2021-10-30');
		compareMetricByEnv(data, 'slider', 'ttfb', '2021-10-30');

		showMetricByPeriod(data, 'slider', 'connect', { start: '2021-10-30', end: '2021-10-30' })

		// добавить свои сценарии, реализовать функции выше
	});
