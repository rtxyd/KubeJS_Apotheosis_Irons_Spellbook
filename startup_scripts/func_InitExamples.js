let func_InitExamples = function() {
    const neededClass = global.neededClass
    const apotheosisClass = global.apotheosisClass
    let EXAMPLE_COMMON = (function() {
        let path = 'example_common'
        // If the thing is genericly working in mainhand, do this
        let exampleGroup = apotheosisClass.ALObjects$EquipmentSlotGroups.MAINHAND
        // Then you need to override the item's LootCategory or use their identification Tag
        // See "data\apotheosis\data_maps\item\loot_category_overrides.json"
        let exampleCategory = ApotheosisRegister.registerLootCategory(path, exampleGroup, neededClass.Predicates.alwaysFalse())
    })()
    let EXAMPLE_CURIO = (function() {
        // The slot name you want to register
        // Caution: better register the name the same with it's real slot name
        // In this case it's just an example
        let slot = 'example_curio'
        // The register path you want to register, here I register the path the same as slot name
        let path = slot
        // Virtually register curio slot, if it's curio
        let exampleSlot = ApotheosisRegister.registerCurioSlot(slot)
        // Virtually register slotGroup with this slot
        let exampleGroup = ApotheosisRegister.registSlotGroup(path, exampleSlot)
        // Virtually register LootCategory with things above
        // If you don't really know how "validator" works, you can put "Predicates.alwaysFalse()"
        // In this case, you need to make an "override" in datapack if you want your item to be identified as this LootCategory
        let exampleCategory = ApotheosisRegister.registerLootCategory(path, exampleGroup, neededClass.Predicates.alwaysFalse())
    })()
    // An example to add Minigun in "pneumaticcraft" an item can be reforged
    if (Platform.isLoaded('pneumaticcraft')) {
        // The item's actual class
        let MinigunItem = Java.loadClass('me.desht.pneumaticcraft.common.item.minigun.MinigunItem')
        let GATLING = (function() {
            let path = 'gatling'
            // If the thing is genericly working in mainhand, do this
            let gatlingGroup = apotheosisClass.ALObjects$EquipmentSlotGroups.MAINHAND
            // If you get the thing's class, you can predicate it by "instanceof"
            let gatlingCategory = ApotheosisRegister.registerLootCategory(path, gatlingGroup, t => t.getItem() instanceof MinigunItem)
        })()
    }
    func_InitExamples = null
}
