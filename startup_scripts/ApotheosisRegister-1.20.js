const ApotheosisRegister = (function() {
    let MC_VERSION = global.MC_VERSION = Platform.getMcVersion()
    const $KEY = global.$KEY = "your_namespace"
    const configFilePath = global.configFilePath = "kubejs/config/my_fake_config.json"
    const defaultConfigObj = {
        "a_fake_config": true,
        "reforging_logic": true,
        "refresh_on_server_unloaded": false,
        "cache": {
            "recorded_irons_items": {
                "minecraft:air": []
            }
        }
    }
    // Initial part head
    // -------------------------------------------------------------------------------------------------------------------------
    const ApotheosisRegister = {}
            let apotheosisClass
            let neededClass
            let ironsClass
            let curiosClass
    /**
     * [if description]
     *
     * @param   {[type]}  MC_VERSION  [MC_VERSION description]
     * @param   {[type]}  1.20.1      [1.20.1 description]
     *
     * 
     */
    if (MC_VERSION === '1.20.1') {
        try {
            apotheosisClass = global.apotheosisClass = {
                SocketHelper: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.socket.SocketHelper'),
                AffixInstance: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.affix.AffixInstance'),
                ReforgingMenu: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.affix.reforging.ReforgingMenu'),
                AugmentingMenu: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.affix.augmenting.AugmentingMenu'),
                Adventure$Items: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.Adventure$Items'),
                GemInstance: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.socket.gem.GemInstance'),
                LootCategory: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.loot.LootCategory'),
                RegObjHelper: ('dev.shadowsoffire.placebo.registry.RegObjHelper'),
                DeferredHelper: Java.loadClass('dev.shadowsoffire.placebo.registry.DeferredHelper'),
                Apoth: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth'),
                AffixHelper: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.affix.AffixHelper'),
                AffixRegistry: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.affix.AffixRegistry'),
                LootController: Java.loadClass('dev.shadowsoffire.apotheosis.adventure.loot.LootController')
            }
        } catch (error) {
            console.error(`apotheosis class loading error: ${error}`);
        }
    }
        try {
        neededClass = global.neededClass = {
            CompoundTag: Java.loadClass('net.minecraft.nbt.CompoundTag'),
            ListTag: Java.loadClass('net.minecraft.nbt.ListTag'),
            Collections: Java.loadClass('java.util.Collections'),
            Random: Java.loadClass('java.util.Random'),
            SmithingMenu: Java.loadClass('net.minecraft.world.inventory.SmithingMenu'),
            Items: Java.loadClass('net.minecraft.world.item.Items'),
            UUID: Java.loadClass('java.util.UUID'),
            ImmutableMultimap: Java.loadClass('com.google.common.collect.ImmutableMultimap'),
            Style: Java.loadClass('net.minecraft.network.chat.Style'),
            Component: Java.loadClass('net.minecraft.network.chat.Component'),
            TagKey: Java.loadClass('net.minecraft.tags.TagKey'),
            ItemStack: Java.loadClass('net.minecraft.world.item.ItemStack'),
            HolderSet: Java.loadClass('net.minecraft.core.HolderSet'),
            KubeJS: Java.loadClass('dev.latvian.mods.kubejs.KubeJS'),
            Registries: Java.loadClass('net.minecraft.core.registries.Registries'),
            Predicates: Java.loadClass('com.google.common.base.Predicates'),
            EquipmentSlot: Java.loadClass('net.minecraft.world.entity.EquipmentSlot'),
            Pattern: Java.loadClass(`java.util.regex.Pattern`),
            Matcher: Java.loadClass(`java.util.regex.Matcher`),
            BuiltInRegistries: Java.loadClass('net.minecraft.core.registries.BuiltInRegistries'),
            ResourceLocation: Java.loadClass('net.minecraft.resources.ResourceLocation')
        }
        } catch (error) {
            console.error(`common class loading error: ${error}`);
        }

        try {
            ironsClass = global.ironsClass = {
                CastingItem: Java.loadClass('io.redspace.ironsspellbooks.item.CastingItem'),
                SpellBook: Java.loadClass('io.redspace.ironsspellbooks.item.SpellBook'),
                SchoolRegistry: Java.loadClass('io.redspace.ironsspellbooks.api.registry.SchoolRegistry')
            }
        } catch (error) {
            console.error(`irons_spellbooks class loading error: ${error}`);
        }

        try {
            curiosClass = global.curiosClass = {
                CuriosRegistry: Java.loadClass('top.theillusivec4.curios.common.CuriosRegistry'),
                CuriosApi: Java.loadClass("top.theillusivec4.curios.api.CuriosApi"),
                // CurioAttributeModifiers: Java.loadClass('top.theillusivec4.curios.api.CurioAttributeModifiers'),
                SlotContext: Java.loadClass('top.theillusivec4.curios.api.SlotContext'),
                // CuriosImplMixinHooks: Java.loadClass('top.theillusivec4.curios.mixin.CuriosImplMixinHooks')
            }
        } catch (error) {
            console.error(`irons_spellbooks class loading error: ${error}`);
        }
        
        try {
            ApotheosisRegister.registerLootCategory = function(orderRef, name, validator, slots) {
                return apotheosisClass.LootCategory.register(orderRef, name, validator, slots)
            }

    } catch (error) {
        console.error(`ApotheosisRegister loading error: ${error}`);
    }
    return ApotheosisRegister
})()
const Startup_main = (function() {
    // Starts -----------------------------------
    // import global
    let apotheosisClass = global.apotheosisClass
    let neededClass = global.neededClass
    let ironsClass = global.ironsClass
    let curiosClass = global.curiosClass
    // import apotheosisClass
    let AffixHelper = apotheosisClass.AffixHelper
    let LootCategory = apotheosisClass.LootCategory
    let SocketHelper = apotheosisClass.SocketHelper
    // import neededClass
    let EquipmentSlot = neededClass.EquipmentSlot
    let ResourceLocation = neededClass.ResourceLocation
    let BuiltInRegistries = neededClass.BuiltInRegistries
    let Registries = neededClass.Registries
    let TagKey = neededClass.TagKey
    // import curiosClass
    let CuriosApi = curiosClass.CuriosApi
    // import ironsClass
    let CastingItem = ironsClass.CastingItem
    // Ends   -----------------------------------
    const StartupFunc = global.StartupFunc = {}
    StartupFunc.isTagKey = function(itemStack, tagKey) {
        return itemStack.getTags().anyMatch(key => key.equals(tagKey))
    }
    StartupFunc.createItemTagKey = function(namespace, path) {
        return TagKey.create(Registries.ITEM, ResourceLocation.fromNamespaceAndPath(namespace, path));
    }
    StartupFunc.loadOrInitConfigObj = function() {
        // Read config
        let configFilePath = global.configFilePath
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
    /**
     * Actually apply attribute modifiers
     *
     * @param   {[type]}  CurioAttributeModifierEvent
     * @param   {[type]}  event
     *
     *
     */
    ForgeEvents.onEvent('top.theillusivec4.curios.api.event.CurioAttributeModifierEvent', event => {
        let itemStack = event.getItemStack()
        if (itemStack.getOrCreateTag().isEmpty()) return
        let slotContext = event.getSlotContext()
        if (!CuriosApi.getCuriosHelper().isStackValid(slotContext, itemStack)) return
        let category = LootCategory.BY_ID.get(slotContext.identifier())
        if (LootCategory.forItem(itemStack) != category) return
        AffixHelper.getAffixes(itemStack).forEach((_, affixInstance) => {
            affixInstance.addModifiers(null, (attribute, modifier) => event.addModifier(attribute, modifier))
        })
        SocketHelper.getGems(itemStack).forEach(gemInstance => {
            gemInstance.addModifiers(null, (attribute, modifier) => event.addModifier(attribute, modifier))
        })
    })

    /**
     * Register LootCategory
     *
     * @param   {[type]}  tag     [curios tag]
     *
     *
     */
    let tag_spellbook = global.tag_spellbook = StartupFunc.createItemTagKey("curios", "spellbook")
    let tag_ring = global.tag_ring = StartupFunc.createItemTagKey("curios", "ring")
    let tag_necklace = global.tag_ring = StartupFunc.createItemTagKey("curios", "necklace")
    StartupEvents.init(e => {
        ApotheosisRegister.registerLootCategory(null, 'spellbook', t => StartupFunc.isTagKey(t, tag_spellbook), [null])
        ApotheosisRegister.registerLootCategory(null, 'ring', t => StartupFunc.isTagKey(t, tag_ring), [null])
        ApotheosisRegister.registerLootCategory(null, 'necklace', t => StartupFunc.isTagKey(t, tag_necklace), [null])
        // override SWORD, so the staff is staff
        ApotheosisRegister.registerLootCategory(LootCategory.SWORD, 'irons_magic_staff', t => t.getItem() instanceof CastingItem, [EquipmentSlot.MAINHAND])
    })
    StartupEvents.postInit(event => {
        StartupFunc.loadOrInitConfigObj()
    })
})()
