let func_InitCuriosLootCategories = function() {
    // load the CuriosTags Class for stock tags
    let CuriosTags = Java.loadClass('top.theillusivec4.curios.api.CuriosTags')
    let RING = (function() {
        let slot = 'ring'
        let path = slot
        let ringSlot = ApotheosisRegister.registerCurioSlot(slot)
        let ringGroup = ApotheosisRegister.registSlotGroup(path, ringSlot)
        // If the tag is curios' inner one, can straightly use "CuriosTags" class.
        let ringCategory = ApotheosisRegister.registerLootCategory(path, ringGroup, t => t['is(net.minecraft.tags.TagKey)'](CuriosTags.RING))
    })()
    let NECKLACE = (function() {
        let slot = 'necklace'
        let path = slot
        let necklaceSlot = ApotheosisRegister.registerCurioSlot(slot)
        let necklaceGroup = ApotheosisRegister.registSlotGroup(path, necklaceSlot)
        let necklaceCategory = ApotheosisRegister.registerLootCategory(path, necklaceGroup, t => t['is(net.minecraft.tags.TagKey)'](CuriosTags.NECKLACE))
    })()
    func_InitCuriosLootCategories = null
}