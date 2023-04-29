import { HomeAssistant } from 'custom-card-helpers';
import { Background } from '../core/colors/background';
import { Action1 } from './functions';

export type ValueFactory = () => unknown;

export interface INotify {
    /**
     * Will register callback on property change events. 
     * @param id Id for this specific callback. If this id already exists, it's callback will be overwriten.
     * @param callback Action that will be called when any supported property if changed (takes propertyName as parameter).
     */
    registerOnPropertyChanged(id: string, callback: Action1<string | number | symbol>): void;

    /**
     * Will unregister callback from property change events.
     * @param id Id for specific callback
     */
    unregisterOnPropertyChanged(id: string): void;
}

export interface INotifyGeneric<TThis> extends INotify {
    /**
     * Will register callback on property change events. 
     * @param id Id for this specific callback. If this id already exists, it's callback will be overwriten.
     * @param callback Action that will be called when any supported property if changed (takes propertyName as parameter).
     */
    registerOnPropertyChanged(id: string, callback: Action1<keyof TThis>): void;
}

export interface IHassTextTemplate {
    /**
     * Resolves this template to string, using hass states.
     */
    resolveToString(hass: HomeAssistant | null): string;
}

export interface ILightConfig {
    /**
     * Sets current hass instance to this container.
     */
    set hass(hass: HomeAssistant);

    /**
     * @returns icon for this container of lights.
     */
    getIcon(): string | undefined | null;

    /**
     * @returns suggested title for card with lights in this container.
     */
    getTitle(): IHassTextTemplate;

    /**
     * @returns background style for card with lights in this container.
     */
    getBackground(): Background | null;

    /**
     * @returns entity_id of light inside.
     * @throws Error when this container contains multiple lights.
     */
    getEntityId(): string;

    /**
     * Gets features of lights in this container.
     */
    get features(): ILightFeatures;
}

export interface ILightContainer extends ILightConfig, INotify {
    /**
     * @returns true if any light in this container is on.
     */
    isOn(): boolean;

    /**
     * @returns true if all lights in this container are off.
     */
    isOff(): boolean;

    /**
     * @returns true if all lights in this container are unavailable.
     */
    isUnavailable(): boolean;

    /**
     * Will turn all lights on.
     */
    turnOn(): void;

    /**
     * Will turn all lights off.
     */
    turnOff(): void;

    /**
     * Gets or sets current brightness (0 - 255) of lights in this container.
     */
    value: number;
}

export interface ILightFeatures {
    /**
     * Gets if it's possible to set the lights brightness.
     */
    get brightness(): boolean;

    /**
     * Gets if it's possible to set temperature of white color (warm, cold) in Kelvins.
     */
    get colorTemp(): boolean;

    /**
     * Gets if it's possible to set color of the light.
     */
    get color(): boolean;
}