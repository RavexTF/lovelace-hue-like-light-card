import { fireEvent } from 'custom-card-helpers';
import { HueDialog } from '../controls/dialog';
import { HueLikeLightCardConfig } from '../types/config';
import { ClickAction, ClickActionData, SceneData } from '../types/types-config';
import { LightController } from './light-controller';
import { HueLikeLightCard } from '../hue-like-light-card';

export class ActionHandler {
    private _config: HueLikeLightCardConfig;
    private _ctrl: LightController;
    private _owner: HueLikeLightCard;

    public constructor(config: HueLikeLightCardConfig, ctrl: LightController, element: HueLikeLightCard) {
        this._config = config;
        this._ctrl = ctrl;
        this._owner = element;
    }

    public showMoreInfo(entityId: string): void {
        fireEvent(this._owner, 'hass-more-info', { entityId: entityId });
    }

    public handleCardClick(): void {
        const isOn = this._ctrl.isOn();
        let action = isOn ? this._config.onClickAction : this._config.offClickAction;
        const actionData = isOn ? this._config.onClickData : this._config.offClickData;

        // resolve the default action
        if (action == ClickAction.Default) {
            action = ClickAction.HueScreen;
        }

        // execute resolved or config action
        this.executeClickAction(action, actionData);
    }

    public handleCardHold(): void {
        const isOn = this._ctrl.isOn();
        let action = isOn ? this._config.onHoldAction : this._config.offHoldAction;
        const actionData = isOn ? this._config.onHoldData : this._config.offHoldData;

        // resolve the default action
        if (action == ClickAction.Default) {
            action = ClickAction.MoreInfo;
        }

        // execute resolved or config action
        this.executeClickAction(action, actionData);
    }

    private executeClickAction(action: ClickAction, actionData: ClickActionData) {
        switch (action) {
            case ClickAction.NoAction:
                break;
            case ClickAction.TurnOn:
                this._ctrl.turnOn();
                break;
            case ClickAction.TurnOff:
                this._ctrl.turnOff();
                break;
            case ClickAction.MoreInfo:
                let entityId: string = actionData.getData('entity');

                // no entity defined in data
                if (!entityId) {
                    // if is on, get first onLight
                    if (this._ctrl.isOn()) {
                        entityId = this._ctrl.getLitLights()[0].getEntityId();
                    } else {
                        entityId = this._config.getEntities()[0];
                    }
                }

                this.showMoreInfo(entityId);
                break;
            case ClickAction.Scene:
                const sceneId = actionData.getData('scene');
                if (!sceneId)
                    throw new Error('No scene for click defined.');

                // create scene object and activate
                const scene = new SceneData(sceneId);
                scene.hass = this._ctrl.hass;
                scene.activate();

                break;
            case ClickAction.HueScreen:
                const dialog = new HueDialog(this._config, this._ctrl, this);
                dialog.show();
                break;

            case ClickAction.Default:
                throw new Error('Cannot execute Default action');
            default:
                throw new Error(`Cannot executed unwknow action ${action}.`);
        }
    }
}