/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

class AsyncUtils {
	/**
	 * An async version of the filter function.
	 * @param arr The array that needs to be filtered.
	 * @param predicate The predicate which is an async function that is used to do the filtering.
	 */
	static readonly asyncFilter = async (
		arr: any[],
		predicate: (authenticator: any) => Promise<boolean>
	) =>
		Promise.all(arr.map(predicate)).then((results) =>
			arr.filter((_v: any, index: number) => results[index])
		);
}

export default AsyncUtils;
