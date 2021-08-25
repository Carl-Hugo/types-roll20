/**
 * Properties of the globalconfig object are set in the API settings.
 */
declare const globalconfig: any;

/**
 * Properties of the state object will persist between game sessions.
 */
declare const state: any;

type ObjectType = "graphic" | "text" | "path" | "character" | "ability" | "attribute" | "handout" | "rollabletable" | "tableitem" | "macro" | "campaign" | "player" | "page";
type RollType = "V" | "G" | "M" | "R" | "C";
type RollResultType = "sum" | "success";
type Layer = "gmlayer" | "objects" | "map" | "walls";

/**
 * Roll20 objects are a special kind of JavaScript object. They represent something in your campaign, such as a token on the tabletop or a character in the journal, and there is some special consideration for using them. 
 */
interface Roll20Object {

    /**
     * This field is shorthand for obj.get('id'). All Roll20 objects have a _id property which uniquely identifies them within a campaign, but their properties are not directly accessible. Normally you have to call get in order to get the value of a property, but because _id is needed on such a frequent basis, this shim field is provided for convenience.
     */
    readonly id: string;

    /**
     * Deletes the Roll20 object.
     */
    remove(): void;
}

interface Roll20ObjectBase<TImmutableSynchronousGetProperties, TImmutableAsynchronousGetProperties, TMutableSynchronousGetProperties, TMutableAsynchronousGetProperties> extends Roll20Object {

    /**
     * Gets the value of a specified property.
     * 
     * @param property The name of the property to get. If you are getting the value of a read-only property (one which starts with an underscore, like _id or _type), the leading underscore is not required.
     */
    get<K extends keyof (TImmutableSynchronousGetProperties & TMutableSynchronousGetProperties)>(property: K): (TImmutableSynchronousGetProperties & TMutableSynchronousGetProperties)[K];

    /**
     * Gets the value of "notes", "gmnotes", or "bio" properties of a character or handout Roll20 object.
     * 
     * @param property The name of the property to get. If you are getting the value of a read-only property (one which starts with an underscore, like _id or _type), the leading underscore is not required.
     * @param callback A callback function which will receive the value of the property as a parameter.
     */
    get<K extends keyof (TImmutableAsynchronousGetProperties & TMutableAsynchronousGetProperties)>(property: K, callback: (value: (TImmutableAsynchronousGetProperties & TMutableAsynchronousGetProperties)[K]) => void): void;

    /**
     * Sets one specified property value.
     * 
     * @param property The name of the property to set.
     * @param value The value to set for the specified property.
     */
    set<K extends keyof (TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties)>(property: K, value: (TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties)[K]): void;

    /**
     * Sets one specified property value and runs the character sheet workers related to that property (if any).
     * 
     * @param property The name of the property to set.
     * @param value The value to set for the specified property.
     */
    setWithWorker<K extends keyof (TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties)>(property: K, value: (TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties)[K]): void;

    /**
     * Sets one or more specified property values.
     * 
     * @param properties The properties of the properties object will be mapped to the properties of the Roll20 object.
     */
    set(properties: Partial<TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties>): void;

    /**
     * Sets one or more specified property values and runs the character sheet workers related to that property (if any).
     * 
     * @param properties The properties of the properties object will be mapped to the properties of the Roll20 object.
     */
    setWithWorker(properties: Partial<TMutableSynchronousGetProperties | TMutableAsynchronousGetProperties>): void;
}

interface Roll20ObjectBaseProperties {
    readonly _id: string;
    readonly _type: ObjectType;
}

interface CampaignImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "campaign";
    readonly _journalfolder: string;
    readonly _jukeboxfolder: string;
    readonly _token_markers: string;
}

interface CampaignMutableSynchronousGetProperties {
    turnorder: string;
    // on set, can be the boolean false to close initiative tracker window
    initiativepage: string | boolean;
    playerpageid: string;
    playerspecificpages: any; //TODO
}

interface Campaign extends Roll20ObjectBase<CampaignImmutableSynchronousGetProperties, never, CampaignMutableSynchronousGetProperties, never> { }

interface PlayerImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "player";
    readonly _d20userid: string;
    readonly _displayname: string;
    readonly _online: boolean;
    readonly _lastpage: string;
    readonly _macrobar: string;
}

interface PlayerMutableSynchronousGetProperties {
    speakingas: string;
    color: string;
    showmacrobar: boolean;
}

interface Player extends Roll20ObjectBase<PlayerImmutableSynchronousGetProperties, never, PlayerMutableSynchronousGetProperties, never> { }

interface MacroImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "macro";
    readonly _playerid: string;
}

interface MacroMutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    name: string;
    action: string;
    visibleto: string;
    istokenaction: boolean;
}

interface Macro extends Roll20ObjectBase<MacroImmutableSynchronousGetProperties, never, MacroMutableSynchronousGetProperties, never> { }

interface TextImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "text";
    readonly _pageid: string;
}

interface TextMutableSynchronousGetProperties {
    top: number;
    left: number;
    width: number;
    height: number;
    text: string;
    font_size: 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 26 | 32 | 40 | 56 | 72 | 100 | 200 | 300;
    rotation: number;
    color: string;
    font_family: "unset" | "Arial" | "Patrick Hand" | "Contrail" | "Light" | "Candal";
    layer: Layer;
    controlledby: string;
}

interface Text extends Roll20ObjectBase<TextImmutableSynchronousGetProperties, never, TextMutableSynchronousGetProperties, never> { }

interface GraphicImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "graphic";
    readonly _subtype: "token" | "card";
    readonly _cardId?: string;
    readonly _pageid: ""
}

interface GraphicMutableSynchronousGetProperties {
    imgsrc: string;
    bar1_link: string;
    bar2_link: string;
    bar3_link: string;
    represents: string;
    left: number;
    top: number;
    width: number;
    height: number;
    rotation: number;
    layer: Layer;
    isdrawing: boolean;
    flipv: boolean;
    fliph: boolean;
    name: string;
    gmnotes: string;
    controlledby: string;
    bar1_value: string | number;
    bar2_value: string | number;
    bar3_value: string | number;
    bar1_max: string | number;
    bar2_max: string | number;
    bar3_max: string | number;
    aura1_radius: string;
    aura2_radius: string;
    aura1_color: string;
    aura2_color: string;
    aura1_square: boolean;
    aura2_square: boolean;
    tint_color: string;
    statusmarkers: string;
    showname: boolean;
    showplayers_name: boolean;
    showplayers_bar1: boolean;
    showplayers_bar2: boolean;
    showplayers_bar3: boolean;
    showplayers_aura1: boolean;
    showplayers_aura2: boolean;
    playersedit_name: boolean;
    playersedit_bar1: boolean;
    playersedit_bar2: boolean;
    playersedit_bar3: boolean;
    playersedit_aura1: boolean;
    playersedit_aura2: boolean;
    light_radius: string;
    light_dimradius: string;
    light_otherplayers: boolean;
    light_hassight: boolean;
    light_angle: string;
    light_losangle: string;
    lastmove: string;
    light_multiplier: string;
    "status_all-for-one": boolean | number;
    "status_angel-outfit": boolean | number;
    "status_archery-target": boolean | number;
    "status_arrowed": boolean | number;
    "status_aura": boolean | number;
    "status_back-pain": boolean | number;
    "status_black-flag": boolean | number;
    "status_bleeding-eye": boolean | number;
    "status_blue": boolean | number;
    "status_bolt-shield": boolean | number;
    "status_broken-heart": boolean | number;
    "status_broken-shield": boolean | number;
    "status_broken-skull": boolean | number;
    "status_brown": boolean | number;
    "status_chained-heart": boolean | number;
    "status_chemical-bolt": boolean | number;
    "status_cobweb": boolean | number;
    "status_dead": boolean | number;
    "status_death-zone": boolean | number;
    "status_drink-me": boolean | number;
    "status_edge-crack": boolean | number;
    "status_fishing-net": boolean | number;
    "status_fist": boolean | number;
    "status_fluffy-wing": boolean | number;
    "status_flying-flag": boolean | number;
    "status_frozen-orb": boolean | number;
    "status_grab": boolean | number;
    "status_green": boolean | number;
    "status_grenade": boolean | number;
    "status_half-haze": boolean | number;
    "status_half-heart": boolean | number;
    "status_interdiction": boolean | number;
    "status_lightning-helix": boolean | number;
    "status_ninja-mask": boolean | number;
    "status_overdrive": boolean | number;
    "status_padlock": boolean | number;
    "status_pink": boolean | number;
    "status_pummeled": boolean | number;
    "status_purple": boolean | number;
    "status_radioactive": boolean | number;
    "status_red": boolean | number;
    "status_rolling-bomb": boolean | number;
    "status_screaming": boolean | number;
    "status_sentry-gun": boolean | number;
    "status_skull": boolean | number;
    "status_sleepy": boolean | number;
    "status_snail": boolean | number;
    "status_spanner": boolean | number;
    "status_stopwatch": boolean | number;
    "status_strong": boolean | number;
    "status_three-leaves": boolean | number;
    "status_tread": boolean | number;
    "status_trophy": boolean | number;
    "status_white-tower": boolean | number;
    "status_yellow": boolean | number;

    // legacy fog of war vision
    adv_fow_view_distance: string | number;

    // vision due to light source
    has_bright_light_vision: boolean;

    // modern light model
    emits_bright_light: boolean;
    bright_light_distance: number;
    emits_low_light: boolean;
    low_light_distance: number;
    dim_light_opacity: string;
    lightColor: string;

    // night vision
    has_night_vision: boolean;
    night_vision_distance: number;

    // NOTE: dimming effects are encoded as `Dimming_${dimRange/totalRange}`
    night_vision_effect: "Nocturnal" | string | null;
    night_vision_tint: string | null;

    // token bar location, null means "above"
    bar_location: "overlap_top" | "overlap_bottom" | "bottom" | null;
    compact_bar: "compact" | null;
}

interface Graphic extends Roll20ObjectBase<GraphicImmutableSynchronousGetProperties, never, GraphicMutableSynchronousGetProperties, never> { }

interface CharacterImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "character";
}

interface CharacterImmutableAsynchronousGetProperties {
    readonly _defaulttoken: string;
}

interface CharacterMutableSynchronousGetProperties {
    avatar: string;
    name: string;
    archived: boolean;
    inplayerjournals: string;
    controlledby: string;
}

interface CharacterMutableAsynchronousGetProperties {
    bio: string;
    gmnotes: string;
}

interface Character extends Roll20ObjectBase<CharacterImmutableSynchronousGetProperties, CharacterImmutableAsynchronousGetProperties, CharacterMutableSynchronousGetProperties, CharacterMutableAsynchronousGetProperties> { }

interface AttributeImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "attribute";
    readonly _characterid: string;
}

interface AttributeMutableSynchronousGetProperties {
    name: string;
    current: string|number;
    max: string|number;
}

interface Attribute extends Roll20ObjectBase<AttributeImmutableSynchronousGetProperties, never, AttributeMutableSynchronousGetProperties, never> { }

interface AbilityImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "ability";
    readonly _characterid: string;
}

interface AbilityMutableSynchronousGetProperties {
    name: string;
    description: string;
    action: string;
    istokenaction: boolean;
}

interface Ability extends Roll20ObjectBase<AbilityImmutableSynchronousGetProperties, never, AbilityMutableSynchronousGetProperties, never> { }

interface PageImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "page";
    readonly _zorder: string;
}

interface PageMutableSynchronousGetProperties {
    name: string;
    showgrid: boolean;
    showdarkness: boolean;
    showlighting: boolean;
    width: number;
    height: number;
    snapping_increment: number;
    grid_opacity: number;
    fog_opacity: number;
    background_color: string;
    gridcolor: string;
    grid_type: "square" | "hex" | "hexr";
    scale_number: number;
    scale_units: string;
    gridlabels: boolean;
    diagonaltype: "foure" | "pythagorean" | "threefive" | "manhattan";
    archived: boolean;
    lightupdatedrop: boolean;
    lightenforcelos: boolean;
    lightrestrictmove: boolean;
    lightglobalillum: boolean;
}

interface Page extends Roll20ObjectBase<PageImmutableSynchronousGetProperties, never, PageMutableSynchronousGetProperties, never> { }

interface TurnOrdering {
    readonly id: string;
    readonly pr: number;
    readonly custom: string;
    readonly _pageid: string;
}

interface ChatEventData {
    readonly who: string;
    readonly playerid: string;
    readonly type: "general" | "rollresult" | "gmrollresult" | "emote" | "whisper" | "desc" | "api";
    readonly content: string;
    readonly inlinerolls?: InlineRollSummary[];
    readonly rolltemplate?: string;
}

interface RollResultChatEventData extends ChatEventData {
    readonly origRoll: string;
    readonly signature: string;
}

interface WhisperChatEventData extends ChatEventData {
    readonly target: string;
    readonly target_name: string;
}

interface ApiChatEventData extends ChatEventData {
    readonly selected?: ApiChatEventDataSelectObjectInfo[];
}

interface ApiChatEventDataSelectObjectInfo {
    readonly _id: string;
    readonly _type: ObjectType;
}

interface InlineRollSummary {
    readonly expression: string;
    readonly results: RollSummary;
    readonly rollid: string;
    readonly signature: string;
}

interface RollSummary {
    readonly type: RollType;
    readonly rolls: RollInfo[];
    readonly resultType: RollResultType;
    readonly total: number;
}

interface RollInfo {
    readonly type: RollType;
}

interface GroupRoll extends RollInfo {
    readonly rolls: RollInfo[];
    readonly mods: RollModification;
    readonly resultType: RollResultType;
    readonly results: RollResult[];
}

interface BasicRoll extends RollInfo {
    readonly dice: number;
    readonly sides: number;
    readonly mods: RollModification;
    readonly results: RollResult[];
    readonly table?: string;
}

interface MathExpression extends RollInfo {
    readonly expr: string;
}

interface RollComment extends RollInfo {
    readonly text: string;
}

interface RollModification {
    //should this be inheritance?
    readonly compounding?: RollModificationComparison;
    readonly success?: RollModificationComparison;
}

interface RollModificationComparison {
    readonly comp: string;
    readonly point: number;
}

interface RollResult {
    readonly v: number;
}

interface TableRollResult extends RollResult {
    readonly tableidx: number;
    readonly tableItem: TableItem;
}

interface TableItem {
    readonly name: string;
    readonly avatar: string;
    readonly weight: number;
    readonly id: string;
}

interface FindObjectOptions {
    readonly caseInsensitive: boolean;
}

interface ChatMessageHandlingOptions {
    readonly noarchive?: boolean;
    readonly use3d?: boolean;
}

interface PageChildObjectCreationProperties {
    _pageid: string;
}

interface CharacterChildObjectCreationProperties {
    _characterid: string;
}

interface MacroChildObjectCreationProperties {
    _playerid: string;
}

type TextCreationProperties = PageChildObjectCreationProperties & Partial<TextMutableSynchronousGetProperties>;
type GraphicCreationProperties = PageChildObjectCreationProperties & Partial<GraphicMutableSynchronousGetProperties>;
type CharacterCreationProperties = Partial<CharacterMutableSynchronousGetProperties & CharacterMutableAsynchronousGetProperties>;
type AttributeCreationProperties = CharacterChildObjectCreationProperties & Partial<AttributeMutableSynchronousGetProperties>;
type AbilityCreationProperties = CharacterChildObjectCreationProperties & Partial<AbilityMutableSynchronousGetProperties>;
type HandoutCreationProperties = Partial<HandoutMutableSynchronousGetProperties>;
type MacroCreationProperties = MacroChildObjectCreationProperties & Partial<MacroMutableSynchronousGetProperties>;

/**
 * Creates a new Roll20 object.
 * 
 * @param type The type of Roll20 object to create. Only 'graphic', 'text', 'path', 'character', 'ability', 'attribute', 'handout', 'rollabletable', 'tableitem', and 'macro' may be created.
 * @param properties The initial values to use for the Roll20 object's properties.
 */
declare function createObj(type: "text", properties: TextCreationProperties): Text | undefined;
declare function createObj(type: "graphic", properties: GraphicCreationProperties): Graphic | undefined;
declare function createObj(type: "character", properties: CharacterCreationProperties): Character | undefined;
declare function createObj(type: "attribute", properties: AttributeCreationProperties): Attribute | undefined;
declare function createObj(type: "ability", properties: AbilityCreationProperties): Ability | undefined;
declare function createObj(type: "handout", properties: HandoutCreationProperties): Handout | undefined;
declare function createObj(type: "macro", properties: MacroCreationProperties): Macro | undefined;

/**
 * Gets all Roll20 objects with properties that match a given set of properties.
 * 
 * @param properties A collection of key:value pairs to match with Roll20 objects in the campaign.
 * @param options If options.caseInsensitive is true, string comparisons between Roll20 objects and properties will be case-insensitive.
 */
declare function findObjs(properties: { [property: string]: any }, options?: FindObjectOptions): Roll20Object[];

/**
 * Will execute the provided callback funtion on each object, and if the callback returns true, the object will be included in the result array.
 */
declare function filterObjs(callback: (obj: Roll20Object) => boolean): Roll20Object[];

/**
 * Returns an array of all the objects in the Game (all types). Equivalent to calling filterObjs and just returning true for every object.
 */
declare function getAllObjs(): Roll20Object[];

/**
 * Gets a specific Roll20 object.
 * 
 * @param type The type of Roll20 object to get.
 * @param id The unique id for the Roll20 object to get.
 */
declare function getObj(type: "text", id: string): Text | undefined;
declare function getObj(type: "graphic", id: string): Graphic | undefined;
declare function getObj(type: "character", id: string): Character | undefined;
declare function getObj(type: "attribute", id: string): Attribute | undefined;
declare function getObj(type: "ability", id: string): Ability | undefined;
declare function getObj(type: "player", id: string): Player | undefined;
declare function getObj(type: "macro", id: string): Macro | undefined;
declare function getObj(type: "page", id: string): Page | undefined;

/**
 * Gets the value of an attribute, using the default value from the character sheet if the attribute is not present. value_type is an optional parameter, which you can use to specify "current" or "max".
 * 
 * getAttrByName will only get the value of the attribute, not the attribute object itself. If you wish to reference properties of the attribute other than "current" or "max", or if you wish to change properties of the attribute, you must use one of the other functions above, such as findObjs.
 */
declare function getAttrByName(character_id: string, attribute_name: string, value_type?: "current" | "max"): string;

/**
 * Logs a message to the API console.
 * 
 * @param message The message to post to the API console. The message parameter will be transformed into a String with JSON.stringify.
 */
declare function log(message: any): void;

/**
 * Registers an event handler.
 * 
 * @param event There are five types of event:
 * 
 * * ready
 * * change
 * * add
 * * destroy
 * * chat
 * 
 * With the exception of ready, all event types must also be paired with an object type. For chat, this is always message. For everything else, this is the type property of a Roll20 object. In addition to the object type, change events can also optionally specify a property of the specified Roll20 object to watch.
 * 
 * The 2-3 parts of the event (type, object, and optionally property) are separated by colons. So, valid event strings include but are not limited to "ready", "chat:message", "change:graphic", "change:campaign:playerpageid", "add:character", and "destroy:handout".
 * @param callback The function that will be called when the specified event fires. The parameters passed depend on the event type:
 * 
 * * ready events have no callback parameters.
 * * change events have an obj parameter, which is a reference to the Roll20 object as it exists after the change, and a prev parameter, which is a plain old JavaScript object with properties matching the Roll20 object prior to the change event.
 * * add events have an obj parameter, which is a reference to the new Roll20 object.
 * * destroy events have an obj parameter, which is a reference to the no-longer existing Roll20 object.
 * * chat events have a msg parameter, which contains the details of the message that was sent to the chat.
 */
declare function on(event: "ready", callback: () => void): void;
declare function on(event: "add:graphic", callback: (obj: Graphic) => void): void;
declare function on(event: "chat:message", callback: (msg: ChatEventData) => void): void;
declare function on(event: "change:page", callback: (obj: Page, prev: PageImmutableSynchronousGetProperties & PageMutableSynchronousGetProperties) => void): void;
declare function on(event: "change:graphic", callback: (obj: Graphic, prev: GraphicImmutableSynchronousGetProperties & GraphicMutableSynchronousGetProperties) => void): void;
declare function on(event: "change:character", callback: (obj: Character, prev: CharacterImmutableSynchronousGetProperties & CharacterMutableSynchronousGetProperties) => void): void;
declare function on(event: "change:attribute", callback: (obj: Attribute, prev: AttributeImmutableSynchronousGetProperties & AttributeMutableSynchronousGetProperties) => void): void;
declare function on(event: "change:campaign:playerpageid", callback: (obj: Campaign, prev: CampaignImmutableSynchronousGetProperties & CampaignMutableSynchronousGetProperties) => void): void;
declare function on(event: "change:campaign:turnorder", callback: (obj: Campaign, prev: CampaignImmutableSynchronousGetProperties & CampaignMutableSynchronousGetProperties) => void): void;
declare function on(event: "destroy:graphic", callback: (obj: Graphic) => void): void;
declare function on(event: 'change:handout', callback: (obj: Handout, prev: HandoutImmutableSynchronousGetProperties & HandoutMutableSynchronousGetProperties) => void): void;

/**
 * Sends a chat message.
 * 
 * @param speakingAs The name to attach to the message being sent. If speakingAs is in the format player|player_id or character|character_id, the message will be sent as that player or character. Otherwise, the message will use the given name as though a GM had used the /as command.
 * @param message The message to send to the chat.
 * @param callback If callback is specified, the result of the chat message will be passed to it instead of appearing in the chat. The parameter of the callback method is an array of message objects.
 * @param options If options.noarchive is true, the message will not be added to the chat archive. If options.use3d is true, dice rolls in the message will use the 3D dice feature. Options are not applicable if callback is specified.
 */
declare function sendChat(speakingAs: string, message: string, callback?: (operations: ChatEventData[]) => void, options?: ChatMessageHandlingOptions): void;

/**
 * Returns the Campaign object. Since there is only one campaign, this global always points to the only campaign in the game.
 */
declare function Campaign(): Campaign;

/**
 * Returns true if the referenced player is a GM, else false.
 * @param playerID The ID of a player.
 */
declare function playerIsGM(playerID: string): boolean;

declare function randomInteger(max: number): number;



interface HandoutImmutableSynchronousGetProperties extends Roll20ObjectBaseProperties {
    readonly _type: "handout";
}

interface HandoutMutableSynchronousGetProperties {
    /**
     * URL to an image used for the handout. See the note about avatar and imgsrc restrictions below.
     */
    avatar: string;
    /** 
     * The name of the handout.
     */
    name: string;
    /** 
     * Contains the text in the handout. See the note below about using Notes and GMNotes.
     */
    notes: string;
    /**
     * Contains the text in the handout that only the GM sees. See the note below about using Notes and GMNotes. 
     */
    gmnotes: string;
    /**
     * Comma-delimited list of player ID who can see this handout. Use "all" to display to all players.
     * All Players is represented by having 'all' in the list.
     */
    inplayerjournals: string;
    /**
     * true id archived, otherwise false.
     */
    archived: boolean;
    /**
     * Comma-delimited list of player IDs who can control and edit this handout.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string;
}

interface Handout extends Roll20ObjectBase<HandoutImmutableSynchronousGetProperties, never, HandoutMutableSynchronousGetProperties, never> { }

interface TokenMarkerObject {
    /**
     * The ID of the marker.
     */
    id: string;
    /**
     * Name of the marker.
     */
    name: string;
    /**
     * Tag of the marker. Must prepend 'status_' to reference from a token.
     */
    tag: string;
    /**
     * The url Roll20 references to view the marker.
     */
    url: string;
}
