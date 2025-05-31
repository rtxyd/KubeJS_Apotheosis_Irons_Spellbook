let func_InitIronsLootCategories = function() {
    // init starts ---------------------------------
    const neededClass = global.neededClass
    const apotheosisClass = global.apotheosisClass
    const ironsClass = global.ironsClass
    let CastingItem = ironsClass.CastingItem
    let SchoolRegistry = ironsClass.SchoolRegistry
    let AffixHelper = apotheosisClass.AffixHelper
    let predicateIronsItem = (function() {
        function predicateIronsItem(itemStack, tag) {
            let flag = false
            if (itemStack.getItem() instanceof CastingItem || tag && itemStack['is(net.minecraft.tags.TagKey)'](tag)) {
                flag = true
            }
            return flag
        }
        return predicateIronsItem
    })()
    // init ends -----------------------------------

    // A example for staff in irons_spellbooks
    // If the thing is basically using vanilla equipment slot type, do this, don't need to create a new slot type.
    // If you want the staff's modifiers available in both hands, you need set as the line below.
    // let group = apotheosisClass.ALObjects$EquipmentSlotGroups.HAND
    // I use "Predicates.alwaysFalse()" here, so you need add following format to "data\apotheosis\data_maps\item\loot_category_overrides.json"
    // As "item's resourceloacation": "apothic_compats:irons_magic_staff", see the data folder here for details.
    let IRONS_EXAMPLE_STAFF = (function() {
        let path = 'irons_example_staff'
        let group = apotheosisClass.ALObjects$EquipmentSlotGroups.MAINHAND
        let category = ApotheosisRegister.registerLootCategory(path, group, neededClass.Predicates.alwaysFalse())
    })()
    let SPELLBOOK = (function() {
        // This is a curio item
        let path = 'spellbook'
        let slot = ApotheosisRegister.registerCurioSlot(path)
        let group = ApotheosisRegister.registSlotGroup(path, slot)
        // If the thing has a tag, you want to identify it by tag
        let tag = neededClass.TagKey.create(neededClass.Registries.ITEM, neededClass.ResourceLocation.fromNamespaceAndPath("curios", "spellbook"))
        global.tag_spellbook = tag
        let category = ApotheosisRegister.registerLootCategory(path, group, t => t['is(net.minecraft.tags.TagKey)'](tag), 900)
    })()
    let IRONS_MAGIC_STAFF = (function() {
        let path = 'irons_magic_staff'
        let group = apotheosisClass.ALObjects$EquipmentSlotGroups.MAINHAND
        let category = ApotheosisRegister.registerLootCategory(path, group, t => predicateIronsItem(t), 900)
    })()
    func_InitIronsLootCategories = null
}
