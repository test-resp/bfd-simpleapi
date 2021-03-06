// Type definitions for bfd-simpleapi v3.0.0
// Project: https://github.com/BLU-Shack/bfd-simpleapi
// Definitions by:
//   iREDMe <foodrickme@gmail.com> (https://github.com/iREDMe)
// License: MIT

declare module 'bfd-simpleapi' {
	import Store from '@ired_me/red-store';
	export const version: string;

	export class Client {
		constructor(options: ClientOptions);

		public options: ClientOptions;
		public bots: Store<string, Bot>;
		public users: Store<string, User>;

		public get(point: string, ...headers: string[]): Promise<any>;
		public authGet(point: string, Authorization: string, ...headers: string[]): Promise<any>;
		public post(point: string, Authorization: string, ...headers: string[]): Promise<any>;
		public edit(options: ClientOptions, preset?: boolean): ClientOptions;
		public fetchBot(id?: string | FetchOptions, options?: FetchOptions): Bot;
		public fetchBotsOfUser(id?: string): string[];
		public fetchUpvotes(id?: string | FetchOptions, botToken?: string): VoteContents;
		public fetchUser(id: string, options?: FetchOptions): User;
		public postCount(id?: string | number | PostOptions, options?: PostOptions | number): object;
	}

	export class Bot extends Base {
		constructor(obj: object);

		public approved: boolean;
		public approvedTimestamp: number;
		public avatar: string;
		public discriminator: string;
		public featured: boolean;
		public id: string;
		public inviteURL: string;
		public library: string;
		public name: string;
		public ownerID: string;
		public prefix: string;
		public secondaryOwnerIDs: string[];
		public shortDescription: string;
		public tag: string;
		public verified: boolean;
		public votes: {
			total: number,
			last24Hours: number,
			lastMonth: number,
		};
		public websiteBot: boolean;
		public backgroundColor?: string;
		public clientID?: string;
		public github?: string;
		public guildCount?: number;
		public supportURL?: string;
		public vanityURL?: string;

		public readonly avatarURL: string;
		public readonly inviteNoPerms: string;
		public readonly page: string;
		public readonly supportCode?: string;
		public readonly vanityCode?: string;

		public toString(): string;
	}

	export class FetchError extends Error {
		constructor(i: Response);

		public readonly name: 'FetchError';

		public toString(): string;
	}

	export class User extends Base {
		constructor(obj: object);

		public avatar: string;
		public background: string;
		public biography: string;
		public discriminator: string;
		public id: string;
		public positions: {
			admin: boolean,
			juniorMod: boolean,
			mod: boolean,
			verifiedDev: boolean,
		};
		public tag: string;
		public username: string;
		public website?: string;

		public readonly avatarURL: string;
		public readonly page: string;

		public toString(): string;
	}

	export class VoteContents extends Base {
		constructor(obj: object, id: string);
		public recipientID: string;
		public voters: string[];
		public voters24Hours: string[];
		public votes: {
			total: number,
			last24Hours: number,
			lastMonth: number,
		};
	}

	type ClientOptions = {
		botToken?: string,
		botID?: string,
		cache?: boolean, 
	}

	type FetchOptions = {
		botToken?: string,
		cache?: boolean,
		raw?: boolean,
	}

	type PostOptions = {
		botToken?: string,
		guildCount?: number,
	}
}

declare class Base {
	constructor(obj: object);
	public readonly raw: object;
}