import { ShareTargetSettings } from "./types.js";
import { MODULE_ID, setBodyData, toggleRender } from "./utils.js";

// Override for custom configurations
declare module "fvtt-types/configuration" {
	interface SettingConfig {
		"mobile-sheet.send-button": string;
		"mobile-sheet.header-button-text": string;
		"mobile-sheet.mobile-layout": string;
		"mobile-sheet.mobile-windows": string;
		"mobile-sheet.show-mobile-toggle": boolean;
		"mobile-sheet.disable-canvas": boolean;
		"mobile-sheet.show-player-list": boolean;
		"mobile-sheet.mobile-share-targets": Array<ShareTargetSettings>;
		// Third party theme module
		"pf2e-dorako-ui.theme.app-theme": unknown;
		"foundry-taskbar.enableplayers": boolean;
	}
}

export function registerSettings() {
	game.settings?.register(MODULE_ID, "send-button", {
		name: `${MODULE_ID}.settings.send-button.name`,
		hint: `${MODULE_ID}.settings.send-button.hint`,
		config: true,
		scope: "client",
		type: String,
		choices: {
			off: `${MODULE_ID}.settings.toggle.off`,
			on: `${MODULE_ID}.settings.toggle.on`,
			auto: `${MODULE_ID}.settings.toggle.auto`,
		},
		default: "auto",
		requiresReload: true,
	});
	game.settings?.register(MODULE_ID, "header-button-text", {
		name: `${MODULE_ID}.settings.header-button-text.name`,
		hint: `${MODULE_ID}.settings.header-button-text.hint`,
		config: true,
		scope: "client",
		type: String,
		choices: {
			off: `${MODULE_ID}.settings.toggle.off`,
			on: `${MODULE_ID}.settings.toggle.on`,
			auto: `${MODULE_ID}.settings.toggle.auto`,
		},
		default: "auto",
		requiresReload: false,
		onChange: (value) => setBodyData("force-hide-header-button-text", value),
	});
	game.settings?.register(MODULE_ID, "mobile-layout", {
		name: `${MODULE_ID}.settings.mobile-layout.name`,
		hint: `${MODULE_ID}.settings.mobile-layout.hint`,
		config: true,
		scope: "client",
		type: String,
		choices: {
			off: `${MODULE_ID}.settings.toggle.off`,
			on: `${MODULE_ID}.settings.toggle.on`,
			auto: `${MODULE_ID}.settings.toggle.auto`,
		},
		default: "auto",
		requiresReload: false,
		onChange: (value) => setBodyData("force-mobile-layout", value),
	});
	game.settings?.register(MODULE_ID, "mobile-windows", {
		name: `${MODULE_ID}.settings.mobile-windows.name`,
		hint: `${MODULE_ID}.settings.mobile-windows.hint`,
		config: true,
		scope: "client",
		type: String,
		choices: {
			off: `${MODULE_ID}.settings.toggle.off`,
			on: `${MODULE_ID}.settings.toggle.on`,
			auto: `${MODULE_ID}.settings.toggle.auto`,
		},
		default: "auto",
		requiresReload: false,
		onChange: (value) => {
			setBodyData("force-mobile-window", value);
			for (const win of $(".window-app:not(#fsc-ng)")) {
				const width = Number.parseInt($(win).css("width").slice(0, -2));
				$(win).css("width", `${width - 1}px`);
				setTimeout(() => $(win).css("width", `${width}px`), 10);
			}
		},
	});
	game.settings?.register(MODULE_ID, "show-mobile-toggle", {
		name: `${MODULE_ID}.settings.show-mobile-toggle.name`,
		hint: `${MODULE_ID}.settings.show-mobile-toggle.hint`,
		config: true,
		scope: "client",
		type: Boolean,
		default: false,
		requiresReload: false,
		onChange: (value: boolean) => {
			setBodyData("show-mobile-toggle", value);
		},
	});
	game.settings?.register(MODULE_ID, "disable-canvas", {
		name: `${MODULE_ID}.settings.disable-canvas.name`,
		hint: `${MODULE_ID}.settings.disable-canvas.hint`,
		config: true,
		scope: "client",
		type: Boolean,
		default: false,
		requiresReload: false,
		onChange: (value: boolean) => {
			toggleRender(!value);
			setBodyData("disable-canvas", value);
		},
	});
	game.settings?.register(MODULE_ID, "show-player-list", {
		config: false,
		scope: "client",
		type: Boolean,
		default: false,
		requiresReload: false,
		onChange: (value: boolean) => {
			setBodyData("hide-player-list", !value);
		},
	});
	game.settings?.register(MODULE_ID, "mobile-share-targets", {
		scope: "world",
		config: false,
		type: Array<ShareTargetSettings>,
		default: [],
		requiresReload: false,
	});
	game.settings?.registerMenu(MODULE_ID, "mobile-share-targets-settings", {
		name: `${MODULE_ID}.settings.mobile-share-targets.name`,
		hint: `${MODULE_ID}.settings.mobile-share-targets.hint`,
		label: `${MODULE_ID}.settings.mobile-share-targets.name`,
		type: EnableShareReceiveTargets,
		restricted: true,
		icon: "fas fa-bullseye",
	});
}

export class EnableShareReceiveTargets extends FormApplication {
	static readonly namespace: string;

	/**
	 * Default Options for this FormApplication
	 */
	static override get defaultOptions() {
		return fu.mergeObject(super.defaultOptions, {
			id: "enableShareReceiveTargets",
			title: "Mobile Share Targets",
			template: "./modules/mobile-sheet/templates/enableShareReceiveTargets.hbs",
			resizable: true,
		});
	}

	// noinspection JSUnusedGlobalSymbols
	static registerSettings(): void {}

	/**
	 * Provide data to the template
	 */
	override getData() {
		const users = game.data?.users;
		const settings = game.settings?.get(MODULE_ID, "mobile-share-targets");
		const data = [] as (ShareTargetSettings & { name: string })[];

		users?.forEach((user) => {
			const userSettings = settings?.find((u) => u.id === user._id);

			const dataNew: ShareTargetSettings & { name: string } = {
				id: user._id as string,
				send: userSettings?.send ? userSettings.send : false,
				receive: userSettings?.receive ? userSettings.receive : false,
				name: user.name,
				force: userSettings?.force ? userSettings.force : false,
			};
			data.push(dataNew);
		});

		return {
			data,
		};
	}

	protected override async _updateObject(_event: Event, data: Record<string, unknown>): Promise<void> {
		const newData: ShareTargetSettings[] = [];
		for (const id of data.id as string[]) {
			newData.push(<ShareTargetSettings>{
				id,
				receive: data[`receive-${id}`],
				send: data[`send-${id}`],
				force: data[`force-${id}`],
			});
		}
		await game.settings?.set(MODULE_ID, "mobile-share-targets", newData);
	}
}
