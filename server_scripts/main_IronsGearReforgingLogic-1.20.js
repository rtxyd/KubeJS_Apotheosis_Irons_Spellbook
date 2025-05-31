const main_IronsGearReforgingLogic = (function() {
    let configObj = global.configObj
    // if (!Platform.isLoaded("irons_spellbooks") || !configObj["reforging_logic"]) return
    // load classes
    let $KEY = global.$KEY = 'irons_spellbooks'
    let neededClass = global.neededClass
    let tag_spellbook = global.tag_spellbook
    let StartupFunc = global.StartupFunc
    let apotheosisClass = global.apotheosisClass
    let ironsClass = global.ironsClass
    let curiosClass = global.curiosClass
    // let WeightedRandom = Java.loadClass('net.minecraft.util.random.WeightedRandom')
    let CastingItem = ironsClass.CastingItem
    let SchoolRegistry = ironsClass.SchoolRegistry
    let CurioBaseItem = ironsClass.CurioBaseItem
    let Components = apotheosisClass.Components
    let ItemAffixes = apotheosisClass.ItemAffixes
    let Affix = apotheosisClass.Affix
    let AugmentingMenu = apotheosisClass.AugmentingMenu
    let ReforgingMenu = apotheosisClass.ReforgingMenu
    let GemInstance = apotheosisClass.GemInstance
    let Adventure$Items = apotheosisClass.Adventure$Items
    let LootController = apotheosisClass.LootController
    let AffixRegistry = apotheosisClass.AffixRegistry
    let AffixHelper = apotheosisClass.AffixHelper
    let AffixInstance = apotheosisClass.AffixInstance
    let ResourceLocation = neededClass.ResourceLocation
    let EquipmentSlot = neededClass.EquipmentSlot
    let SmithingMenu = neededClass.SmithingMenu
    let ItemStack = neededClass.ItemStack
    let Items = neededClass.Items
    let Style = neededClass.Style
    let Random = neededClass.Random
    let Collections = neededClass.Collections
    let CompoundTag = neededClass.CompoundTag
    let Component = neededClass.Component
    let ListTag = neededClass.ListTag
    let ItemAttributeModifiers = neededClass.ItemAttributeModifiers
    let BuiltInRegistries = neededClass.BuiltInRegistries
    let SlotContext = curiosClass.SlotContext
    let CuriosImplMixinHooks = curiosClass.CuriosImplMixinHooks
    let CuriosRegistry = curiosClass.CuriosRegistry
    let CuriosApi = curiosClass.CuriosApi
    let CuriosHelper = CuriosApi.getCuriosHelper()
    let CurioAttributeModifiers = curiosClass.CurioAttributeModifiers
    let jRandom = new Random()
    let finalArray
    const recorded_irons_items = global.recorded_irons_items = Utils.newMap()
    const magicAffixMap = Utils.newMap()
    const menuMap = Utils.newMap()
    Math.clamp = function(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }
    const ServerFunc = {}
    ServerFunc.getAttributeModifiers = function(item, itemStack, equipmentSlot, slotContext, type) {
        switch (type) {
            case 0: return item.getAttributeModifiers(slotContext, UUID.fromString("667ad88f-901d-4691-b2a2-3664e42026d3"), itemStack_0).keys();
            default: return item['getAttributeModifiers(net.minecraft.world.entity.EquipmentSlot,net.minecraft.world.item.ItemStack)'](equipmentSlot, itemStack_0).keys();
        }
    }
    ServerFunc.loadMagicAffixMapFromConfig = function() {
        let magic_affix_map = configObj.cache.magicAffixMap
        
        if (!magic_affix_map) return
        for(const affix_name in magic_affix_map) {
            this_affix_obj = {
                affixes: Utils.newList()
            }
            let this_affix_obj = magic_affix_map[affix_name]
            if (!this_affix_obj || !this_affix_obj.affixes) continue
            for (const affixes in this_affix_obj.affixes) {
                this_affix_obj.affixes.addAll(affixes)
                console.log(this_affix_obj.affixes);
            }
            magicAffixMap.put(affix_name, this_affix_obj)
        }
        ServerFunc.loadMagicAffixMapFromConfig = null
    }
    ServerEvents.loaded(e => {
        let affixesList = AffixRegistry.INSTANCE
        global.fallback_affix = affixesList['holder(net.minecraft.resources.ResourceLocation)'](ResourceLocation.tryParse("irons_spellbooks:affixes/spellbook/attribute/spell_power"))
        ServerFunc.loadMagicAffixMapFromConfig()
        affixesList.getKeys().forEach(key => {
            let value = affixesList.getValue(key)
            if (key.getNamespace().startsWith($KEY)) {
                let path_split = key.getPath().split("/")
                // if (path_split.length <= 3) return
                let this_affix_name = path_split[path_split.length - 1].replace("_spell_power", "")
                let this_affix_obj = magicAffixMap.get(this_affix_name)
                if (!this_affix_obj) {
                    this_affix_obj = {
                        affixes: Utils.newList()
                    }
                    this_affix_obj.affixes.add(value)
                    magicAffixMap.put(this_affix_name, this_affix_obj)
                } else {
                    this_affix_obj.affixes.add(value)
                }
            }
        })
        finalArray = affixesList.getValues().toArray()
        // console.log(finalArray);
        console.log(magicAffixMap);
    })
    if (configObj["reforging_logic"]) {
        PlayerEvents.inventoryOpened(e => {
            let container = e.getInventoryContainer()
            if (container instanceof ReforgingMenu && !menuMap.get(container)) {
                let cached_itemstack = null
                let schedule = e.server.scheduleRepeatingInTicks(5, callback => {
                    if (container) {
                        // part 1
                        let itemStack_0 = container.getSlot(0).getItem()
                        if (itemStack_0.isEmpty()) return
                        let isSpellbook = StartupFunc.isTagKey(itemStack_0, tag_spellbook)
                        if (itemStack_0.getItem() instanceof CastingItem || isSpellbook) {
                            let itemStack_3 = container.getSlot(3).getItem()
                            if (itemStack_3.isEmpty()) return
                            if (!cached_itemstack || !ItemStack.matches(cached_itemstack, itemStack_3)) {
                                cached_itemstack = itemStack_3
                            } else {
                                return
                            }
                            let itemStack_4 = container.getSlot(4).getItem()
                            let itemStack_5 = container.getSlot(5).getItem()
                            let item_stacks = [
                                itemStack_3,
                                itemStack_4,
                                itemStack_5
                            ]
                            let item = itemStack_0.getItem()
                            let item_school_names = recorded_irons_items.get(item)

                            // part 2
                            if (!item_school_names || !item_school_names[0]) {
                                item_school_names = new Set()
                                let player = e.player
                                let modifiers
                                if (isSpellbook) {
                                    let slotContext = new SlotContext('spellbook', player, 0, false, true)
                                    modifiers = item.getAttributeModifiers(slotContext, UUID.fromString("667ad88f-901d-4691-b2a2-3664e42026d3"), itemStack_0).keys()
                                } else {
                                    modifiers = item.getAttributeModifiers(EquipmentSlot.MAINHAND, itemStack_0).keys()
                                }
                                if (modifiers.isEmpty()) return
                                modifiers.forEach(modifier => {
                                    let attribute = modifier
                                    let attrId = BuiltInRegistries.ATTRIBUTE.getKey(attribute);
                                    let path = attrId.getPath()
                                    if (attrId && path.endsWith("spell_power")) {
                                        if (path.length() == 11) {
                                            return
                                        } else {
                                            let schoolName = attrId.getPath().replace("_spell_power", "");
                                            let schoolResource = ResourceLocation.fromNamespaceAndPath(attrId.getNamespace(), schoolName);
                                            let school = SchoolRegistry.getSchool(schoolResource);
                                            console.log(`school: ${school}`);
                                            
                                            if(school) {
                                                item_school_names.add(schoolName)
                                            }
                                        }
                                    }
                                })
                                item_school_names = Array.from(item_school_names)
                                recorded_irons_items.put(item, item_school_names)
                            }
                            else if (item_school_names.length == 0) return
                            // console.log(item_school_names);
                            
                            //part 3
                            item_stacks.forEach(itemStack => {
                                let affixes = Utils.newMap()
                                let removed_affixes = []
                                let flag_fallback = true
                                affixes.putAll(AffixHelper.getAffixes(itemStack))
                                affixes.keySet().forEach(affix_holder => {
                                    let id = affix_holder.getId()
                                    let path = id.getPath()
                                    if (path.endsWith('_spell_power')) {
                                        let path_split = id.getPath().split("/")
                                        // console.log(path_split);
                                        // if (path_split.length <= 3) return false
                                        let this_affix_name = path_split[2]
                                        for (const name of item_school_names) {
                                            if (name + "_spell_power" != this_affix_name) {
                                                removed_affixes.push(affix_holder)
                                                return
                                            }
                                        }
                                    }
                                })
                                console.log(removed_affixes);
                                
                                // part 4
                                // apotheosis choosing mechanic
                                removed_affixes.forEach(removed_affix => {
                                    let level = affixes.get(removed_affix).level()
                                    let rarity = AffixHelper.getRarity(itemStack)
                                    affixes.remove(removed_affix)
                                    console.log(`remove: ${removed_affix}`);
                                    
                                    item_school_names.forEach(name => {
                                        let affix_obj = magicAffixMap.get(name)
                                        let available = affix_obj.affixes
                                        if (available.size() == 0) {
                                            console.error("Failed to replace affix (no affixes available)")
                                            return
                                        }
                                        jRandom.setSeed(e.player.getRandom().nextLong())
                                        Collections.shuffle(available, jRandom)
                                        let selected = available.get(0)
                                        let inst = new AffixInstance(AffixRegistry.INSTANCE['holder(dev.shadowsoffire.placebo.codec.CodecProvider)'](selected), itemStack, rarity, level)
                                        // console.log(selected);
                                        affixes.put(inst.affix(), inst)
                                    })
                                })
                                // end
                                // change the name
                                if (affixes.size() == 0 && flag_fallback) {
                                    console.log(`namelist is 0, fallback`)
                                    let inst = new AffixInstance(global.fallback_affix, itemStack, rarity, level)
                                    affixes.put(inst.affix(), inst)
                                    flag_fallback = false
                                }
                                let nameList = affixes.keySet().iterator()
                                let component = AffixHelper.getName(itemStack)
                                let contents = component.getContents()
                                let name_key = contents.getKey()

                                component = Component.translatable(name_key, nameList.next().get().getName(true), "", affixes.size() > 1 ? nameList.next().get().getName(false) : "").setStyle(component.getStyle())
                                AffixHelper.setAffixes(itemStack, affixes)
                                AffixHelper.setName(itemStack, component)
                            })
                        } else if (CuriosHelper.isStackCurio(itemStack_0)){
                            recorded_irons_items.put(itemStack_0.getItem(), [])
                            return
                        }
                    }
                    else {
                        return callback.clear()
                    }
                })
                menuMap.put(container, schedule)
            }
        })
    }
    PlayerEvents.inventoryClosed(e => {
        let container = e.getInventoryContainer()
        let temp = menuMap.get(container)
        if (temp) {
            if (temp.callback) temp.callback.clear();
            menuMap.remove(container)
        }
        console.log(`${e.player}closed ReforgingMenu`);
    })
    ServerFunc.updateConfig = function() {
        let config_cache = configObj.cache
        let cache_items = config_cache.recorded_irons_items = {}
        let cache_affixes = config_cache.magicAffixMap = {}
        for (const key of recorded_irons_items.keySet()) {
            cache_items[key] = recorded_irons_items.get(key)
        }
        let flag = true
        for (const key of magicAffixMap.keySet()) {
            let this_school_affixes = cache_affixes[key] = []
            for (const affix of magicAffixMap.get(key).affixes)
            {
                let affix_locstr = AffixRegistry.INSTANCE.getKey(affix).toString()
                this_school_affixes.push(affix_locstr)
            }
        }
        console.log(config_cache);
        JsonIO.write(global.configFilePath, configObj)
    }
    ServerEvents.unloaded(e => {
        if (configObj["refresh_on_server_unloaded"]) {
            ServerFunc.updateConfig()
        }
        console.log('unloaded server')
    })
})()