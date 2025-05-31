// This is your namespace for registering AKA fake mod name
const $KEY = global.$KEY = "your_namespace"
const configFilePath = global.configFilePath = "kubejs/config/my_fake_config.json"
const localizationPath = global.localizationPath = "kubejs/assets/your_namespace/lang/en_us.json"

if (Object.keys(ApotheosisRegister) !== 0) {
    const $R
    try {
        $R = ApotheosisRegister.registerNamespace($KEY)
    } catch (error) {
        console.error(`register namespace ${$KEY} failed`);
    }
    StartupEvents.init(event => {
        // Actually register your namespace
        global.neededClass.KubeJS.modEventBus.register($R)
        // Run the function and then actually register evrything you virtually registered above using your namesace
        ApotheosisRegister.InitAllLootCategories()
    })
}
StartupEvents.postInit(event => {
    StartupFunc.loadOrInitConfigObj()
})
const StartupFunc = {}

StartupFunc.loadOrInitConfigObj = function() {
    // Read config
    // fake_config
    // This is a flag to control if we want sort staffs by their spell_power modifier
    let BuiltInRegistries = global.neededClass.BuiltInRegistries
    let ResourceLocation = global.neededClass.ResourceLocation
    let configObj = global.configObj = JsonIO.toObject(JsonIO.readJson(configFilePath))
    if (!configObj
        || configObj["a_fake_config"] === undefined
        || configObj["reforging_logic"] === undefined
        || !configObj.cache
        || !configObj.cache.recorded_irons_items
    ) {
        JsonIO.write(configFilePath, defaultConfigObj)
        configObj = global.configObj = defaultConfigObj
        console.log('config recovered');
    }
    let a_fake_config = global.a_fake_config = configObj.get("a_fake_config")
    let recorded_irons_objs = configObj.cache.recorded_irons_items
    let recorded_irons_items = global.recorded_irons_items = Utils.newMap()
    recorded_irons_items.put(ResourceLocation.tryParse('minecraft:air'), [])
    for (const key in recorded_irons_objs) {
        if (key === "minecraft:air") continue
        let item = BuiltInRegistries.ITEM.get(ResourceLocation.tryParse(key))
        if (item.toString === "minecraft:air") continue
        recorded_irons_items.put(item, recorded_irons_objs[key])
    }
    console.log(`a_fake_config: ${a_fake_config}, recorded_irons_items:${recorded_irons_items}`);
    StartupFunc.loadOrInitConfigObj = null
}