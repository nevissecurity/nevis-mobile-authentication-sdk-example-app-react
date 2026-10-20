/**
 * Copyright © 2024 Nevis Security AG. All rights reserved.
 */

export const asyncFilter = async (
	arr: any[],
	predicate: (authenticator: any) => Promise<boolean>
) =>
	Promise.all(arr.map(predicate)).then((results) =>
		arr.filter((_v: any, index: number) => results[index])
	);
