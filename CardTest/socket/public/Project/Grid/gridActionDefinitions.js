'use strict';

app.service('gridActionDefinitions', function ($rootScope) {

	//#region key command
	var keyedActions = new Array(9);
	var active = 0;
	var user;
	this.keyPress = function (keyCode) {


	}
	//#endregion

	return {
		actionDefinition: function (body) {
			var action = {
				//#region Details
				//name (used in activeAction for ref)
				name: 'swing',
				//details for body
				details: {
					color: "green",
					shape: "block",
					name: "actions.swing",
					//color: "rgb(255,0,0)",
					offsets: { x: 0, y: 0 },
					userPos: {},
					vx: 0,
					vy: 0,
					width: 20,
					height: 20,
					getDensity: function () { return (2.5 / this.width) / this.height },
					maskBits: 0x0001,
					groupIndex: body.groupIndex,
					bodyStart: {},
					parent: body,
					bullet: true,
					tags:
					{
						//objectType: 'action'
					},
					visible: function () {
						return this.parent.details.actionTimer > 1;
					},
					updateActionIterations: function () {
						//variable details done before the action takes place, passed to server
						//------------------------------------------------------------------------

						var staticAction = this.parent.details.currentActionBody;
						var actionIndex = this.parent.details.currentActionIndex;
						var actionTimer = this.parent.details.actionTimer;
						var actionChain = this.parent.details.actionChain;

						if (!staticAction)
							return;

						if (staticAction.details && staticAction.details.queuedAction && staticAction.details.actionState.linkable) {
							this.parent.details.actionTimer = 0;
							staticAction.details.actionState = actionChain[actionIndex]("Link", staticAction, this.parent, staticAction.details.actionState);
							staticAction.details.queuedAction();
							delete staticAction.details.queuedAction;
						}
						else {
							staticAction.details.actionState = actionChain[actionIndex](actionTimer, staticAction, this.parent, staticAction.details.actionState);

							if (staticAction.details.actionState && this.parent.details.currentActionBody) {
								this.parent.details.actionTimer++;
								this.parent.details.busy = true;
								this.parent.details.parent.parent.busy = true;

								updateFunctions.push(
									{
										parent: this.parent,
										updateActionIterations: this.updateActionIterations,
										execute: this.updateActionIterations
									})
							}
							else {
								this.parent.details.busy = false;
								this.parent.details.parent.parent.busy = false;
								this.parent.details.actionTimer = 0;

								if (!staticAction.details.queuedAction) {
									this.parent.details.currentActionBody.destroy();
									delete this.parent.details.currentActionBody;
								}
								//else
								//	staticAction.details.queuedAction();
							}
						}

						//------------------------------------------------------------------------
					},
					destroyEvent: function (body) { gl_destroy(body); },
				},
				//#endregion
				//#region Declaration
				//additional helper methods
				declaration: function (details, loaded) {
					//prior to body creation
					if (!loaded) {
						//------------------------------------------------------------------------
						details.userPos = details.parent.body.m_xf.position;

						details.x = details.userPos.x + details.offsets.x;
						details.y = details.userPos.y + details.offsets.y;

						return details;
						//------------------------------------------------------------------------
					}
					//immediatly after body creation
					if (loaded) {
						//------------------------------------------------------------------------
						//------------------------------------------------------------------------
					}
				},
				//#endregion
				//#region Target Line
				targetLine: {
					//target line vars - drawn in init
					//------------------------------------------------------------------------
					type: 'projectile',
					r: { fixed: 5, multi: 20 },
					g: { fixed: 0, multi: 0 },
					b: { fixed: 0, multi: 0 },
					increment: 1,
					iterations: 16
					//------------------------------------------------------------------------
				},
				//#endregion
				//#region Constants
				//copy to active action - constant
				setActiveAction: function (callback) {
					actionReadied = this;
				},
				//action trigger on click - constant
				beginAction: function (actionIndex, actionTimer) {

					var parent = this.details.parent;
					var staticAction = this.details.parent.details.currentActionBody;
					var currentAction = this;

					if (!this.details.parent.details.currentActionBody) {
						if (this.details.getDensity)
							this.details.density = this.details.getDensity();
						this.details.parent.details.currentActionBody = new Body(this.details, this.declaration);

					}
					parent.details.currentActionIndex = actionIndex;
					body.details.actionTimer = actionTimer;
					this.details.updateActionIterations();
				},
				linkAction: function () {
					var parent = this.details.parent;
					var staticAction = this.details.parent.details.currentActionBody;
					var currentAction = this;
					var previousActionState = staticAction.details.actionState;

					//basic link, restart on action increase
					var hasNextAction = (parent.details.currentActionIndex < parent.details.actionChain.length - 1);
					var hasQueuedAction = (staticAction.details.queuedAction != undefined);
					if (hasNextAction && !hasQueuedAction) {
						staticAction.details.queuedAction = function () {
							delete staticAction.details.queuedAction;
							delete parent.activeAction;
							currentAction.beginAction(parent.details.currentActionIndex + 1, 1);
						}
					}
					if (parent.details.actionTimer == 0)
						staticAction.details.queuedAction();
				},
				init: function (arm) {

					if (!(body.details.actionTimer > 0)) {
						this.details.arm = arm;
						action.beginAction(0, 1);
					}
					else if (this.details.arm == arm)
						action.linkAction();
				}
				//#endregion
			}


			return action;
		}
	}

	function clone(obj) {
		if (obj == null || typeof (obj) != 'object')
			return obj;

		var temp = obj.constructor(); //changed

		for (var key in obj)
			temp[key] = clone(obj[key]);
		return temp;
	}
});