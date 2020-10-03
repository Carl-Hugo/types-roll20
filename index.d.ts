// internal types
declare type PossiblyReadOnlyProperty<T, S extends string> = PropertyOrDefault<T, S, PropertyOrDefault<T, `_${S}`>>
declare type UnderscoreVariants<T extends string> = T extends `_${infer Value}` ? Value | T : T
declare type PropertyOrDefault<Object, Key, Default = unknown> = Key extends keyof Object ? Object[Key] : Default

declare type IfEquals<X, Y, A = X, B = never> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

declare type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];

declare type PathFix<T> = T extends Path ? { path: Path['_path'] } : {}


// Actual types

declare type BasicEvents = 'add' | 'destroy'
declare type AddDestroyEvents = `${BasicEvents}:${ObjectTypes | SubTypes}`
declare type ChangeEvent<T extends ObjectTypes> = `change:${T}` | `change:${T}:${UnderscoreVariants<EventChangableProps<T>>}`
declare type AllChangeEvents = { [T in ObjectTypes]: ChangeEvent<T> }[ObjectTypes]
declare type EventChangableProps<T extends ObjectTypes> = string & keyof Omit<ObjectTypeMap[T], '_type' | '_id'>
declare type ObjectFromCreateDeleteEvent<Event extends AddDestroyEvents> = Event extends `${BasicEvents}:${infer Type & CreatableObjectTypes}`
    ? PropertyOrDefault<ObjectTypes, Type, Graphic>
    : never

declare type ObjectFromChangeEvent<Event extends AllChangeEvents> = Event extends `change:${infer Type & (ObjectTypes | SubTypes)}`
    ? Type
    : Event extends `change:${infer Type & (ObjectTypes | SubTypes)}`
    ? Type
    : never

declare type BuiltInEffect = 'beam' | 'bomb' | 'breath' | 'bubbling' | 'burn' | 'burst' | 'explode' | 'glow' | 'missile' | 'nova' | 'splatter'
declare type EffectColor = 'acid' | 'blood' | 'charm' | 'death' | 'fire' | 'frost' | 'holy' | 'magic' | 'slime' | 'smoke' | 'water'
declare type EffectType<T extends string> = T extends `-${infer S}`
    ? `-${S}` // ids seem to always begin with `-`
    : T extends `${BuiltInEffect}-${EffectColor}` // the below lines seem redundant but without them you lose the nice typehinting
    ? T
    : `${BuiltInEffect}-${EffectColor}`

declare type AnyRoll20Object = { [K in keyof ObjectTypeMap]: Roll20Object<ObjectTypeMap[K]> }[ObjectTypes]
declare type AnyObject = ObjectTypeMap[ObjectTypes]
declare type FindObjType<T> = T extends Record<'_type', infer X & ObjectTypes>
    ? Roll20Object<PropertyOrDefault<ObjectTypeMap, X, ObjectTypeMap[ObjectTypes]>>
    : T extends Record<'type', infer Y & ObjectTypes>
    ? Roll20Object<PropertyOrDefault<ObjectTypeMap, Y, ObjectTypeMap[ObjectTypes]>>
    : AnyRoll20Object

declare type NonRandomCustomFXDefinition = {
    angle: number,
    duration: number
    emissionRate: number,
    gravity: number,
    lifeSpan: number
    maxParticles: number,
    size: number,
    speed: number,
    sizeRandom: number,
    startColour: [number, number, number, number?],
    endColour: [number, number, number, number?]
}

declare type CustomFXDefinition = NonRandomCustomFXDefinition
    & { [T in keyof NonRandomCustomFXDefinition as `${T}Random`]: NonRandomCustomFXDefinition[T] }
    & Record<'onDeath', string>
declare type Point = { x: number, y: number }

declare type ObjectCreateProperties<T extends ObjectTypes> = { [Key in CreatableProp<T>]: CreatableValue<ObjectTypeMap[T], Key> }
declare type CreatableProp<T extends ObjectTypes> = WritableKeys<ObjectTypeMap[T]> | `${ForeignKey<string & keyof ObjectTypeMap[T]>}id`
declare type ForeignKey<T extends string> = T extends '_id' ? never : T extends `_${infer Obj}id` ? Obj : never
declare type CreatableValue<T, K> = K extends keyof T
    ? T[K]
    : K extends `${infer Obj}id`
    ? PropertyOrDefault<T, `_${Obj}id`>
    : unknown

declare type RollType = "V" | "G" | "M" | "R" | "C";
declare type RollResultType = "sum" | "success";
declare type Layer = "gmlayer" | "objects" | "map" | "walls";
declare type SubTypes = 'card' | 'token'

declare type ObjectTypes = keyof ObjectTypeMap
// have to use extract so that TS knows that CreatableObjectTypes is a subset of ObjectTypes
declare type CreatableObjectTypes = Extract<ObjectTypes, 'graphic' | 'text' | 'path' | 'character' | 'ability' | 'attribute' | 'handout' | 'rollabletable' | 'tableitem' | 'macro'>

declare interface Roll20State { }

declare const state: Roll20State

declare type Roll20Message = Roll20GeneralMessage | Roll20RollResultMessage | Roll20WhisperMessage | Roll20WhisperMessage | Roll20ApiMessage
declare type Roll20MessageBase = {
    readonly who: string,
    readonly playerid: string,
    readonly content: string,
    readonly inlinerolls?: InlineRollSummary[],
    readonly rolltemplate?: string
}
declare type Roll20GeneralMessage = Roll20MessageBase & Readonly<{ type: 'general' | 'emote' | 'desc', }>
declare type Roll20RollResultMessage = Roll20MessageBase & Readonly<{ origroll: string, type: 'rollresult' | 'gmrollresult' }>
declare type Roll20WhisperMessage = Roll20MessageBase & Readonly<{ target: string, target_name: string, type: 'whisper' }>
declare type Roll20ApiMessage = Roll20MessageBase & Readonly<{ selected: MessageSelectType[], type: 'api' }>

declare type MessageSelectType = {
    readonly _id: string,
    readonly _pageid?: string,
    readonly _type: ObjectTypes
}

declare interface InlineRollSummary {
    readonly expression: string;
    readonly results: RollSummary;
    readonly rollid: string;
    readonly signature: string;
}

declare interface RollSummary {
    readonly type: RollType;
    readonly rolls: RollInfo[];
    readonly resultType: RollResultType;
    readonly total: number;
}

declare interface RollInfo {
    readonly type: RollType;
}

declare interface GroupRoll extends RollInfo {
    readonly rolls: RollInfo[];
    readonly mods: RollModification;
    readonly resultType: RollResultType;
    readonly results: RollResult[];
}

declare interface BasicRoll extends RollInfo {
    readonly dice: number;
    readonly sides: number;
    readonly mods: RollModification;
    readonly results: RollResult[];
    readonly table?: string;
}

declare interface MathExpression extends RollInfo {
    readonly expr: string;
}

declare interface RollComment extends RollInfo {
    readonly text: string;
}

declare interface RollModification {
    //should this be inheritance?
    readonly compounding?: RollModificationComparison;
    readonly success?: RollModificationComparison;
}

declare interface RollModificationComparison {
    readonly comp: string;
    readonly point: number;
}

declare interface RollResult {
    readonly v: number;
}

declare interface TableRollResult extends RollResult {
    readonly tableidx: number;
    readonly tableItem: TableItem;
}
declare type Roll20Object<T extends ObjectTypeMap[ObjectTypes]> = {
    readonly id: string,
    get<S extends UnderscoreVariants<string & keyof T>>(key: S): PossiblyReadOnlyProperty<T, S>,
    get<S extends UnderscoreVariants<string & keyof T>>(key: UnderscoreVariants<S>, cb: (value: PossiblyReadOnlyProperty<T, S>) => void): void,
    set<S extends WritableKeys<T>>(key: S, value: T[S]): void
    set<S extends WritableKeys<T>>(properties: Partial<{ [Key in S]: T[S] }>): void
    setWithWorker<S extends WritableKeys<T>>(key: S, value: T[S]): void
    setWithWorker<S extends WritableKeys<T>>(properties: Partial<{ [Key in S]: T[S] }>): void
    remove(): void
}

declare type ObjectTypeMap = {
    path: Path,
    text: Roll20Text,
    graphic: Graphic,
    page: Page,
    campaign: CampaignObject,
    player: Player,
    macro: Macro,
    rollabletable: RollableTable,
    tableitem: TableItem,
    character: Character,
    attribute: Attribute,
    ability: Ability,
    handout: Handout,
    deck: Deck,
    card: Card,
    hand: Hand,
    jukeboxtrack: JukeboxTrack,
    customfx: CustomFX,
}


declare function Campaign(): Roll20Object<CampaignObject>
declare function createObj<T extends CreatableObjectTypes>(type: T, props: Partial<ObjectCreateProperties<T>>): Roll20Object<ObjectTypeMap[T]>
declare function getObj<T extends ObjectTypes>(type: T, id: string): Roll20Object<ObjectTypeMap[T]>;
declare function findObjs<
    R extends ObjectTypes,
    T extends Readonly<{ id?: string, type: R } & Partial<PropertyOrDefault<ObjectTypeMap, R, AnyObject>>>
>(attrs: T, options?: { caseInsensitive: boolean }): FindObjType<T>[]
declare function filterObjs(predicate: (obj: AnyRoll20Object) => unknown): AnyRoll20Object[]
declare function getAllObjs(): AnyRoll20Object[]
declare function getAttrByName(characterId: string, attributeName: string, valueType?: 'current' | 'max'): unknown
declare function sendChat(speakingAs: string, input: string, cb?: (ops: Roll20Message) => void, options?: { noarchive: boolean, use3d: boolean }): void
declare function log(item: unknown): void
declare function toFront(obj: AnyRoll20Object): void
declare function toBack(obj: AnyRoll20Object): void
declare function randomInteger(max: number): number
declare function playerIsGM(playerId: string): boolean
declare function setDefaultTokenForCharacter(character: Roll20Object<Character>, token: Roll20Object<Graphic>): void
declare function spawnFx<T extends string>(x: number, y: number, type: EffectType<T>, pageId?: string): void
declare function spawnFxBetweenPoints<T extends string>(point1: Point, point2: Point, type: EffectType<T>, pageId: string): void
declare function spawnFxWithDefinition(x: number, y: number, definitionJSON: CustomFXDefinition, pageId: string): void
declare function playJukeboxPlaylist(playlistId: string): void
declare function stopJukeboxPlaylist(): void
declare function sendPing(left: number, top: number, pageId: string, playerId?: string, moveAll?: boolean, visibleTo?: string | string[]): void
declare function onSheetWorkerComplete(cb: () => void): void

declare function on(event: 'ready', cb: Function): void
declare function on(event: 'chat:message', cb: (msg: Roll20Message) => void): void
declare function on<T extends AddDestroyEvents>(event: T, cb: (obj: Roll20Object<ObjectFromCreateDeleteEvent<T>>) => void): void
declare function on<T extends AllChangeEvents>(event: T, cb: (obj: Roll20Object<ObjectFromChangeEvent<T>>, prev: Readonly<ObjectFromChangeEvent<T>>) => void): void

declare interface Path {
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "path"
    /**
     * ID of the page the object is in. Read-only.
     */
    readonly _pageid: string
    /**
     * A JSON string describing the lines in the path. Read-only, except when creating a new path. See the section on Paths for more information.
     */
    readonly _path: string
    /**
     * Fill color. Use the string "transparent" or a hex color as a string, for example "#000000"
     */
    fill: string
    /**
     * Stroke (border) color.
     */
    stroke: string
    /**
     * Rotation (in degrees).
     */
    rotation: number
    /**
     * Current layer, one of "gmlayer", "objects", "map", or "walls". The walls layer is used for dynamic lighting, and paths on the walls layer will block light.
     */
    layer: string
    /**
     *  
     */
    stroke_width: number
    /**
     *  
     */
    width: number
    /**
     *  
     */
    height: number
    /**
     * Y-coordinate for the center of the path
     */
    top: number
    /**
     * X-coordinate for the center of the path
     */
    left: number
    /**
     *  
     */
    scaleX: number
    /**
     *  
     */
    scaleY: number
    /**
     * Comma-delimited list of player IDs who can control the path. Controlling players may delete the path. If the path was created by a player, that player is automatically included in the list.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string
}

declare interface Roll20Text {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "text"
    /**
     * ID of the page the object is in. Read-only.
     */
    readonly _pageid: string
    /**
     *  
     */
    top: number
    /**
     *  
     */
    left: number
    /**
     *  
     */
    width: number
    /**
     *  
     */
    height: number
    /**
     *  
     */
    text: string
    /**
     * For best results, stick to the preset sizes in the editing menu: 8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40, 56, 72, 100, 200, 300.
     */
    font_size: number
    /**
     *  
     */
    rotation: number
    /**
     *  
     */
    color: string
    /**
     * If this is not set, when later changing the value of the "text" property the font_size will shrink to 8. Possible values (Case is not important): "Arial", "Patrick Hand", "Contrail One", "Shadows Into Light", and "Candal". Specifying an invalid name results in an unnamed, monospaced serif font being used.
     */
    font_family: string
    /**
     * "gmlayer", "objects", "map", or "walls".
     */
    layer: string
    /**
     * Comma-delimited list of player IDs who can control the text. Controlling players may delete the text. If the text was created by a player, that player is automatically included in the list.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string
}

declare interface Graphic {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "graphic"
    /**
     * May be "token" (for tokens and maps) or "card" (for cards). Read-only.
     */
    readonly _subtype: string
    /**
     * Set to an ID if the graphic is a card. Read-only.
     */
    readonly _cardid: string
    /**
     * ID of the page the object is in. Read-only.
     */
    readonly _pageid: string
    /**
     * The URL of the graphic's image. See the note about imgsrc and avatar restrictions below.
     */
    imgsrc?: string
    /**
     * Set to an ID if Bar 1 is linked to a character.
     */
    bar1_link?: string
    /**
     *  
     */
    bar2_link?: string
    /**
     *  
     */
    bar3_link?: string
    /**
     * ID of the character this token represents.
     */
    represents?: string
    /**
     * Number of pixels from the left edge of the map to the center of the graphic.
     */
    left: number
    /**
     * Number of pixels from the top edge of the map to the center of the graphic.
     */
    top: number
    /**
     * Width of the graphic, in pixels.
     */
    width: number
    /**
     * Height of the graphic, in pixels.
     */
    height: number
    /**
     * The orientation of the token in degrees.
     */
    rotation: number
    /**
     * "gmlayer", "objects", "map", or "walls".
     */
    layer: string
    /**
     * This property is changed from the Advanced context menu.
     */
    isdrawing: boolean
    /**
     * Flip vertically.
     */
    flipv: boolean
    /**
     * Flip horizontally.
     */
    fliph: boolean
    /**
     * The token's name.
     */
    name: string
    /**
     * Notes on the token only visible to the GM.
     */
    gmnotes: string
    /**
     * Comma-delimited list of player IDs who can control the graphic. Controlling players may delete the graphic. If the graphic was created by a player, that player is automatically included in the list.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string
    /**
     * Current value of Bar 1. This may be a number or text.
     */
    bar1_value: string | number
    /**
     *  
     */
    bar2_value: string | number
    /**
     *  
     */
    bar3_value: string | number
    /**
     * Maximum value of Bar 1. If _value and _max are both set, a bar may be displayed above the token showing the percentage of Bar 1.
     */
    bar1_max: string | number
    /**
     *  
     */
    bar2_max: string | number
    /**
     *  
     */
    bar3_max: string | number
    /**
     * Radius of the aura, using the units set in the page's settings. May be an integer or a float. Set to the empty string to clear the aura.
     */
    aura1_radius: string | number
    /**
     *  
     */
    aura2_radius: string | number
    /**
     * A hexadecimal color or the aura.
     */
    aura1_color: string
    /**
     *  
     */
    aura2_color: string
    /**
     * Is the aura a circle or a square?
     */
    aura1_square: boolean
    /**
     *  
     */
    aura2_square: boolean
    /**
     * Hexadecimal color, or "transparent". Will tint the color of the graphic.
     */
    tint_color: string
    /**
     * A comma-delimited list of currently active statusmarkers. See the notes below for more information.
     */
    statusmarkers: string
    /**
     * A stringified JSON array containing an object for each token marker currently in the game:. You can find an example below.
     */
    token_markers: string
    /**
     * Whether the token's nameplate is shown.
     */
    showname: boolean
    /**
     * Show the nameplate to all players.
     */
    showplayers_name: boolean
    /**
     * Show Bar 1 to all players.
     */
    showplayers_bar1: boolean
    /**
     *  
     */
    showplayers_bar2: boolean
    /**
     *  
     */
    showplayers_bar3: boolean
    /**
     * Show Aura 1 to all players.
     */
    showplayers_aura1: boolean
    /**
     *  
     */
    showplayers_aura2: boolean
    /**
     * Allow controlling players to edit the token's name. Also shows the nameplate to controlling players, even if showplayers_name is false.
     */
    playersedit_name: boolean
    /**
     * Allow controlling players to edit the token's Bar 1. Also shows Bar 1 to controlling players, even if showplayers_bar1 is false.
     */
    playersedit_bar1: boolean
    /**
     *  
     */
    playersedit_bar2: boolean
    /**
     *  
     */
    playersedit_bar3: boolean
    /**
     * Allow controlling players to edit the token's Aura 1. Also shows Aura 1 to controlling players, even if showplayers_aura1 is false.
     */
    playersedit_aura1: boolean
    /**
     *  
     */
    playersedit_aura2: boolean
    /**
     * Dynamic lighting radius.
     */
    light_radius: string | number
    /**
     * Start of dim light radius. If light_dimradius is the empty string, the token will emit bright light out to the light_radius distance. If light_dimradius has a value, the token will emit bright light out to the light_dimradius value, and dim light from there to the light_radius value.
     */
    light_dimradius: string | number
    /**
     * Show the token's light to all players.
     */
    light_otherplayers: boolean
    /**
     * The light has "sight" for controlling players for the purposes of the "Enforce Line of Sight" setting.
     */
    light_hassight: boolean
    /**
     * Angle (in degrees) of the light's angle. For example, "180" means the light would show only for the front "half" of the "field of vision".
     */
    light_angle: string | number
    /**
     * Angle (in degrees) of the field of vision of the graphic (assuming that light_hassight is set to true)
     */
    light_losangle: string | number
    /**
     * The last move of the token. It's a comma-delimited list of coordinates. For example, "300,400" would mean that the token started its last move at left=300, top=400. It's always assumed that the current top + left values of the token are the "ending point" of the last move. Waypoints are indicated by multiple sets of coordinates. For example, "300,400,350,450,400,500" would indicate that the token started at left=300, top=400, then set a waypoint at left=350, top=450, another waypoint at left=400, top=500, and then finished the move at its current top + left coordinates.
     */
    lastmove: string
    /**
     * Multiplier on the effectiveness of light sources. A multiplier of two would allow the token to see twice as far as a token with a multiplier of one, with the same light source.
     */
    light_multiplier: string | number
    /**
     * The radius around a token where Advanced Fog of War is revealed.
     */
    adv_fow_view_distance: string | number
}

declare interface Page {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "page"
    /**
     * Comma-delimited list of IDs specifying the ordering of objects on the page. toFront and toBack (and their associated context menu items) can re-order this list. Read-only.
     */
    readonly _zorder: string
    /**
     * Page's title.
     */
    name: string
    /**
     * Show the grid on the map.
     */
    showgrid: boolean
    /**
     * Show fog of war on the map.
     */
    showdarkness: boolean
    /**
     * Use dynamic lighting.
     */
    showlighting: boolean
    /**
     * Width in units.
     */
    width: number
    /**
     * Height in units.
     */
    height: number
    /**
     * Size of a grid space in units.
     */
    snapping_increment: number
    /**
     * Opacity of the grid lines.
     */
    grid_opacity: number
    /**
     * Opacity of the fog of war for the GM.
     */
    fog_opacity: number
    /**
     * Hexadecimal color of the map background.
     */
    background_color: string
    /**
     * Hexadecimal color of the grid lines.
     */
    gridcolor: string
    /**
     * One of "square", "hex", or "hexr". (hex corresponds to Hex(V), and hexr corresponds to Hex(H))
     */
    grid_type: string
    /**
     * The distance of one unit.
     */
    scale_number: number
    /**
     * The type of units to use for the scale.
     */
    scale_units: string
    /**
     * Show grid labels for hexagonal grid.
     */
    gridlabels: boolean
    /**
     * One of "foure", "pythagorean" (Euclidean), "threefive", or "manhattan".
     */
    diagonaltype: string
    /**
     * Whether the page has been put into archive storage.
     */
    archived: boolean
    /**
     * Only update Dynamic Lighting when an object is dropped.
     */
    lightupdatedrop: boolean
    /**
     * Enforce Line of Sight for objects.
     */
    lightenforcelos: boolean
    /**
     * Don't allow objects that have sight to move through Dynamic Lighting walls.
     */
    lightrestrictmove: boolean
    /**
     * If true anywhere a token can "see" it is assumed there is bright light present.
     */
    lightglobalillum: boolean
}

declare interface CampaignObject {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object — however, note that there is only one Campaign object, and it can be accessed via Campaign(). Read-only.
     */
    readonly _type: "campaign"
    /**
     * A JSON string of the turn order. See below.
     */
    turnorder: string
    /**
     * ID of the page used for the tracker when the turn order window is open. When set to false, the turn order window closes.
     */
    initiativepage: boolean
    /**
     * ID of the page the player bookmark is set to. Players see this page by default, unless overridden by playerspecificpages below.
     */
    playerpageid: boolean
    /**
     * An object (NOT JSON STRING) of the format: {"player1_id": "page_id", "player2_id": "page_id" ... } Any player set to a page in this object will override the playerpageid.
     */
    playerspecificpages: boolean
    /**
     * A JSON string which contains data about the folder structure of the game. Read-only.
     */
    readonly _journalfolder: string
    /**
     * A JSON string which contains data about the jukebox playlist structure of the game. Read-only.
     */
    readonly _jukeboxfolder: string
}

declare interface Player {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "player"
    /**
     * User ID — site-wide. For example, the player's user page on the wiki is /User:ID, where ID is the same value stored in _d20userid. Read-only.
     */
    readonly _d20userid: string
    /**
     * The player's current display name. May be changed from the user's settings page. Read-only.
     */
    readonly _displayname: string
    /**
     * Read-only.
     */
    readonly _online: boolean
    /**
     * The page id of the last page the player viewed as a GM. This property is not updated for players or GMs that have joined as players. Read-only.
     */
    readonly _lastpage: string
    /**
     * Comma-delimited string of the macros in the player's macro bar. Read-only.
     */
    readonly _macrobar: string
    /**
     * The player or character ID of who the player has selected from the "As" dropdown. When set to the empty string, the player is speaking as him- or herself. When set to a character, the value is "character|ID", where ID is the character's ID. When the GM is speaking as another player, the value is "player|ID", where ID is the player's ID.
     */
    speakingas: string
    /**
     * The color of the square by the player's name, as well as the color of their measurements on the map, their ping circles, etc.
     */
    color: string
    /**
     * Whether the player's macro bar is showing.
     */
    showmacrobar: boolean
}

declare interface Macro {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "macro"
    /**
     * The ID of the player that created this macro. Read-only.
     */
    readonly _playerid: string
    /**
     * The macro's name.
     */
    name: string
    /**
     * The text of the macro.
     */
    action: string
    /**
     * Comma-delimited list of player IDs who may view the macro in addition to the player that created it.
     * All Players is represented by having 'all' in the list.
     */
    visibleto: string
    /**
     * Is this macro a token action that should show up when tokens are selected?
     */
    istokenaction: boolean
}

declare interface RollableTable {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "rollabletable"
    /**
     *  
     */
    name: string
    /**
     *  
     */
    showplayers: boolean
}

declare interface TableItem {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "tableitem"
    /**
     * ID of the table this item belongs to. Read-only.
     */
    readonly _rollabletableid: string
    /**
     * URL to an image used for the table item. See the note about avatar and imgsrc restrictions below.
     */
    avatar: string
    /**
     *  
     */
    name: string
    /**
     * Weight of the table item compared to the other items in the same table. Simply put, an item with weight 3 is three times more likely to be selected when rolling on the table than an item with weight 1.
     */
    weight: number
}

declare interface Character {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "character"
    /**
     * URL to an image used for the character. See the note about avatar and imgsrc restrictions below.
     */
    avatar: string
    /**
     *  
     */
    name: string
    /**
     * The character's biography. See the note below about accessing the Notes, GMNotes, and bio fields.
     */
    bio: string
    /**
     * Notes on the character only viewable by the GM. See the note below about accessing the Notes, GMNotes, and bio fields.
     */
    gmnotes: string
    /**
     *  
     */
    archived: boolean
    /**
     * Comma-delimited list of player ID who can view this character. Use "all" to give all players the ability to view.
     * All Players is represented by having 'all' in the list.
     */
    inplayerjournals: string
    /**
     * Comma-delimited list of player IDs who can control and edit this character. Use "all" to give all players the ability to edit.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string
    /**
     * A JSON string that contains the data for the Character's default token if one is set. Note that this is a "blob" similar to "bio" and "notes", so you must pass a callback function to get(). Read-only.
     */
    readonly _defaulttoken: string
}

declare interface Attribute {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "attribute"
    /**
     * ID of the character this attribute belongs to. Read-only. Mandatory when using createObj.
     */
    readonly _characterid: string
    /**
     *  
     */
    name: string
    /**
     * The current value of the attribute can be accessed in chat and macros with the syntax @{Character Name|Attribute Name} or in abilities with the syntax @{Attribute Name}.
     */
    current: string | number
    /**
     * The max value of the attribute can be accessed in chat and macros with the syntax @{Character Name|Attribute Name|max} or in abilities with the syntax @{Attribute Name|max}.
     */
    max: string | number
}

declare interface Ability {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "ability"
    /**
     * The character this ability belongs to. Read-only. Mandatory when using createObj.
     */
    readonly _characterid: string
    /**
     *  
     */
    name: string
    /**
     * The description does not appear in the character sheet  interface.
     */
    description: string
    /**
     * The text of the ability.
     */
    action: string
    /**
     * Is this ability a token action that should show up when tokens linked to its parent Character are selected?
     */
    istokenaction: boolean
}

declare interface Handout {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "handout"
    /**
     * URL to an image used for the handout. See the note about avatar and imgsrc restrictions below.
     */
    avatar: string
    /**
     *  
     */
    name: string
    /**
     * Contains the text in the handout. See the note below about using Notes and GMNotes.
     */
    notes: string
    /**
     * Contains the text in the handout that only the GM sees. See the note below about using Notes and GMNotes.
     */
    gmnotes: string
    /**
     * Comma-delimited list of player ID who can see this handout. Use "all" to display to all players.
     * All Players is represented by having 'all' in the list.
     */
    inplayerjournals: string
    /**
     *  
     */
    archived: boolean
    /**
     * Comma-delimited list of player IDs who can control and edit this handout.
     * All Players is represented by having 'all' in the list.
     */
    controlledby: string
}

declare interface Deck {
    /**
     * id of the deck
     */
    readonly _id: string
    /**
     *  
     */
    readonly _type: "deck"
    /**
     * name of the deck
     */
    name: string
    /**
     * a comma-delimited list of cards which are currently in the deck (including those which have been played to the tabletop/hands). Changes when the deck is shuffled.
     */
    readonly _currentDeck: string
    /**
     * the current index of our place in the deck, 'what card will be drawn next?'
     */
    readonly _currentIndex: number
    /**
     * show the current card on top of the deck
     */
    readonly _currentCardShown: boolean
    /**
     * show the deck to the players
     */
    showplayers: boolean
    /**
     * can players draw cards?
     */
    playerscandraw: boolean
    /**
     * the 'back' of the cards for this deck
     */
    avatar: string
    /**
     * show the deck on the gameboard (is the deck currently visible?)
     */
    shown: boolean
    /**
     * can players see the number of cards in other player's hands?
     */
    players_seenumcards: boolean
    /**
     * can players see the fronts of cards when looking in other player's hands?
     */
    players_seefrontofcards: boolean
    /**
     * can the GM see the number of cards in each player's hand?
     */
    gm_seenumcards: boolean
    /**
     * can the GM see the fronts of cards when looking in each player's hand?
     */
    gm_seefrontofcards: boolean
    /**
     * are there an 'infinite' number of cards in this deck?
     */
    infinitecards: boolean
    /**
     * internally used to advance the deck when drawing cards.
     */
    readonly _cardSequencer: number
    /**
     * how are cards from this deck played to the tabletop? 'faceup' or 'facedown'.
     */
    cardsplayed: string
    /**
     * what's the default height for cards played to the tabletop?
     */
    defaultheight: string
    /**
     *  
     */
    defaultwidth: string
    /**
     * what type of discard pile does this deck have? 'none' = no discard pile, 'choosebacks' = allow players to see backs of cards and choose one, 'choosefronts' = see fronts and choose, 'drawtop' = draw the most recently discarded card, 'drawbottom' = draw the oldest discarded card.
     */
    discardpilemode: string
    /**
     * what's the current discard pile for this deck? comma-delimited list of cards. These are cards which have been removed from play and will not be put back into the deck on a shuffle until a recall is performed.
     */
    readonly _discardPile: string
}

declare interface Card {
    /**
     * Name of the card
     */
    name: string
    /**
     * Front of the card
     */
    avatar: string
    /**
     * ID of the deck
     */
    readonly _deckid: string
    /**
     *  
     */
    readonly _type: "card"
    /**
     *  
     */
    readonly _id: string
}

declare interface Hand {
    /**
     * comma-delimited list of cards currently in the hand. Note that this is no longer read only. Ideally, it should only be adjusted with the card deck functions.
     */
    readonly currentHand: string
    /**
     *  
     */
    readonly _type: "hand"
    /**
     * ID of the player to whom the hand belongs
     */
    readonly _parentid: string
    /**
     *  
     */
    readonly _id: string
    /**
     * when player opens hand, is the view 'bydeck' or 'bycard'?
     */
    currentView: string
}

declare interface JukeboxTrack {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "jukeboxtrack"
    /**
     * Boolean used to determine whether or not the track is playing. Setting this to "true" and softstop to "false" plays a track.
     */
    playing: boolean
    /**
     * Boolean used to determine whether or not a non-looped track has finished at least once. This must be set to "false" to ensure that a track will play.
     */
    softstop: boolean
    /**
     * The visible label for the track in the jukebox tab.
     */
    title: string
    /**
     * The volume level of the track. Note that this must be set to an integer (not a string), or you may break functionality. Values from 0-100 (percentage).
     */
    volume: number
    /**
     * Should the track be looped? Set to true if so.
     */
    loop: boolean
}

declare interface CustomFX {
    /**
     * A unique ID for this object. Globally unique across all objects in this game. Read-only.
     */
    readonly _id: string
    /**
     * Can be used to identify the object type or search for the object. Read-only.
     */
    readonly _type: "custfx"
    /**
     * The visible name for the FX in the FX Listing.
     */
    name: string
    /**
     * Javascript object describing the FX.
     */
    definition: CustomFXDefinition
}
