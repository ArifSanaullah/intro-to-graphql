import React from 'react';
import { Bar as BarChart } from 'react-chartjs-2';

const BOOKINGS_BUCKET = {
	cheap: { max: 50, min: 0 },
	normal: { max: 100, min: 50 },
	expensive: { max: 100000, min: 100 },
};

function BookingsChart({ bookings }) {
	const chartData = { labels: [], datasets: [] };

	let values = [];

	for (const bucket in BOOKINGS_BUCKET) {
		if (BOOKINGS_BUCKET.hasOwnProperty(bucket)) {
			const currentBucket = BOOKINGS_BUCKET[bucket];

			const totalCount = bookings.reduce((prevValue, currentItem) => {
				if (
					currentItem.event.price < currentBucket.max &&
					currentItem.event.price > currentBucket.min
				) {
					return prevValue + 1;
				} else {
					return prevValue;
				}
            }, 0);

			values.push(totalCount);

			chartData.labels.push(bucket.toUpperCase());
			chartData.datasets.push({
				label: bucket.toUpperCase(),
				data: values,
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,99,132,0.4)',
				hoverBorderColor: 'rgba(255,99,132,1)',
			});

			values = [...values];
			values[values.length - 1] = 0;
		}
	}

	return <BarChart data={chartData} />;
}

export default BookingsChart;
