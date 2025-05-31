const main_IronsGearReforgingLogic = (function() {
    let configObj = global.configObj
    if (!Platform.isLoaded("irons_spellbooks") || !configObj["reforging_logic"]) return
    // load classes
    let $KEY = global.$KEY
    let neededClass = global.neededClass
    let tag_spellbook = global.tag_spellbook;
    let apotheosisClass = global.apotheosisClass
    let ironsClass = global.ironsClass
    let curiosClass = global.curiosClass
    let ReforgingMenu = Java.loadClass('dev.shadowsoffire.apotheosis.affix.reforging.ReforgingMenu')
    let WeightedRandom = Java.loadClass('net.minecraft.util.random.WeightedRandom')
    let CastingItem = ironsClass.CastingItem
    let SchoolRegistry = ironsClass.SchoolRegistry
    let CurioBaseItem = ironsClass.CurioBaseItem
    let Components = apotheosisClass.Components
    let ItemAffixes = apotheosisClass.ItemAffixes
    let AffixInstance = apotheosisClass.AffixInstance
    let Affix = apotheosisClass.Affix
    let WorldTier = apotheosisClass.WorldTier
    let LootController = apotheosisClass.LootController
    let AffixRegistry = apotheosisClass.AffixRegistry
    let AffixHelper = apotheosisClass.AffixHelper
    let ResourceLocation = neededClass.ResourceLocation
    let DataComponents = neededClass.DataComponents
    let ItemStack = neededClass.ItemStack
    let Random = neededClass.Random
    let Style = neededClass.Style
    let Component = neededClass.Component
    let ItemAttributeModifiers = neededClass.ItemAttributeModifiers
    let BuiltInRegistries = neededClass.BuiltInRegistries
    let SlotContext = curiosClass.SlotContext
    let CuriosImplMixinHooks = curiosClass.CuriosImplMixinHooks
    let CuriosRegistry = curiosClass.CuriosRegistry
    let CurioAttributeModifiers = curiosClass.CurioAttributeModifiers
    let finalArray
    // let jRandom = new Random()
    const recorded_irons_items = global.recorded_irons_items
    const magicAffixMap = Utils.newMap()
    const reforgingMenuMap = Utils.newMap()
    Math.clamp = function(value, min, max) {
        return Math.min(Math.max(value, min), max)
    }
    const ServerFunc = {}
    // ServerFunc.loadMagicAffixMapFromConfig = function() {
    //     let magic_affix_map = configObj.cache.magicAffixMap
        
    //     if (!magic_affix_map) return
    //     for(const school_name in magic_affix_map) {
    //         this_affix_obj = {
    //             affixes: Utils.newList()
    //         }
    //         let this_affix_obj = magic_affix_map[school_name]
    //         if (!this_affix_obj || !this_affix_obj.affixes) continue
    //         for (const affixes in this_affix_obj.affixes) {
    //             this_affix_obj.affixes.addAll(affixes)
    //             console.log(this_affix_obj.affixes);
    //         }
    //         magicAffixMap.put(school_name, this_affix_obj)
    //     }
    //     ServerFunc.loadMagicAffixMapFromConfig = null
    // }
    ServerEvents.loaded(e => {
        let affixesList = apotheosisClass.AffixRegistry.INSTANCE
        // ServerFunc.loadMagicAffixMapFromConfig()
        affixesList.getKeys().forEach(key => {
            let value = affixesList.getValue(key)
            if (key.getNamespace().startsWith($KEY)) {
                let path_split = key.getPath().split("/")
                if (path_split.length <= 3) return
                let this_school_name = path_split[2]
                let this_affix_obj = magicAffixMap.get(this_school_name)
                if (!this_affix_obj) {
                    this_affix_obj = {
                        affixes: Utils.newList()
                    }
                    this_affix_obj.affixes.add(value)
                    magicAffixMap.put(this_school_name, this_affix_obj)
                } else {
                    this_affix_obj.affixes.add(value)
                }
            }
        })
        finalArray = affixesList.getValues().toArray()
        console.log(finalArray);
        console.log(magicAffixMap);
    })
    PlayerEvents.inventoryOpened(e => {
        let container = e.getInventoryContainer()
        if (container instanceof ReforgingMenu && !reforgingMenuMap.get(container)) {
            let cached_item_stack = null
            let schedule = e.server.scheduleRepeatingInTicks(5, callback => {
                if (container) {
                    // part 1
                    let itemStack_0 = container.getSlot(0).getItem()
                    if (itemStack_0.isEmpty()) return
                    let isSpellbook = itemStack_0['is(net.minecraft.tags.TagKey)'](tag_spellbook)
                    if (itemStack_0.getItem() instanceof CastingItem || isSpellbook) {
                        let itemStack_3 = container.getSlot(3).getItem()
                        if (itemStack_3.isEmpty()) return
                        if (!cached_itemstack || !ItemStack.matches(cached_item_stack, itemStack_3)) {
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
                        if (!item_school_names || item_school_names[0] == null) {
                            item_school_names = new Set()
                            let player = e.player
                            let modifiers
                            if (isSpellbook) {
                                let slotContext = new SlotContext('spellbook', player, 0, false, true)
                                modifiers = item['getAttributeModifiers(top.theillusivec4.curios.api.SlotContext,net.minecraft.resources.ResourceLocation,net.minecraft.world.item.ItemStack)'](slotContext, BuiltInRegistries.ITEM.getKey(item), itemStack_0).keys()
                            } else {
                                modifiers = itemStack_0.getOrDefault(DataComponents.ATTRIBUTE_MODIFIERS, ItemAttributeModifiers.EMPTY).modifiers()
                            }
                            if (modifiers.isEmpty()) return
                            // console.log(modifiers);
                            
                            modifiers.forEach(modifier => {
                                let attribute_holder
                                if (isSpellbook) {
                                    attribute_holder = modifier
                                } else {
                                    attribute_holder = modifier.attribute()
                                }
                                if (!attribute_holder.isBound()) return
                                let attribute = attribute_holder.value();
                                let attrId = BuiltInRegistries.ATTRIBUTE.getKey(attribute);
                                let path = attrId.getPath()
                                if (attrId && path.endsWith("spell_power")) {
                                    if (path.length() == 11) {
                                        return
                                    } else {
                                        let schoolName = attrId.getPath().replace("_spell_power", "");
                                        let schoolResource = ResourceLocation.fromNamespaceAndPath(attrId.getNamespace(), schoolName);
                                        let school = SchoolRegistry.REGISTRY.get(schoolResource);
                                        if(school) {
                                            item_school_names.add(schoolName)
                                        }
                                    }
                                }
                            })
                            item_school_names = Array.from(item_school_names)
                            recorded_irons_items.put(item, item_school_names)
                        }
                        else if (item_school_names.length == 0) {
                            // nerf magic item with no school
                            item_stacks.forEach(itemStack => {
                                let affixes = itemStack.getOrDefault(Components.AFFIXES, ItemAffixes.EMPTY)
                                let builder = affixes.toBuilder()
                                affixes.forEach(affix => {
                                    let level = Math.clamp(affixes.getLevel(removed_affix) * 0.75, 0, Affix.MAX_LEVEL)
                                    builder.put(AffixRegistry.INSTANCE['holder(dev.shadowsoffire.placebo.codec.CodecProvider)'](selected), level)
                                })
                                AffixHelper.setAffixes(itemStack, builder.build())
                            })
                            return
                        }
                        console.log(item_school_names);
                        
                        // part 3
                        item_stacks.forEach(itemStack => {
                            let affixes = itemStack.getOrDefault(Components.AFFIXES, ItemAffixes.EMPTY)
                            let builder = affixes.toBuilder()
                            let removed_affixes = []
                            let nameList = Utils.newList()
                            let flag_fallback = true
                            builder.removeIf(affix_holder => {
                                let id = affix_holder.getId()
                                let namesace = id.getNamespace()
                                
                                if (namesace.startsWith($KEY)) {
                                    let path_split = id.getPath().split("/")
                                    // console.log(path_split);

                                    if (path_split.length <= 3) return false
                                    let this_school_name = path_split[2]
                                    for (const name of item_school_names) {
                                        if (name != this_school_name) {
                                            removed_affixes.push(affix_holder)
                                            return true
                                        }
                                    }
                                }
                                nameList.add(affix_holder.get())
                                return false
                            })
                            // console.log(removed_affixes);
                            let player = e.player

                            // part 4
                            // apotheosis choosing mechanic
                            removed_affixes.forEach(removed_affix => {
                                let level = Math.clamp(affixes.getLevel(removed_affix), 0, Affix.MAX_LEVEL)
                                let rarity = AffixHelper.getRarity(itemStack)
                                item_school_names.forEach(name => {
                                    let affix_obj = magicAffixMap.get(name)
                                    let available = affix_obj.affixes.stream().map(a => a.wrap(WorldTier.getTier(player), player.getLuck())).toList()
                                    let weight = WeightedRandom.getTotalWeight(available)
                                    if (available.size() == 0 && weight == 0) {
                                        console.error("Failed to replace affix (no affixes available)")
                                        return
                                    }
                                    let selected = WeightedRandom.getRandomItem(player.getRandom(), available, weight).get().data()
                                    let selected_holder = AffixRegistry.INSTANCE['holder(dev.shadowsoffire.placebo.codec.CodecProvider)'](selected)
                                    if (!nameList.contains(selected)) {
                                        nameList.add(selected)
                                    }
                                    // console.log(selected);
                                    builder.put(selected_holder, level)
                                })
                            })
                            // end
                            AffixHelper.setAffixes(itemStack, builder.build())
                            // jRandom.setSeed(player.getRandom().nextLong())
                            // change the name
                            if (nameList.size() == 0 && flag_fallback) {
                                console.log(`namelist is 0, fallback`)
                                let fallback_affix = affixesList['holder(net.minecraft.resources.ResourceLocation)'](ResourceLocation.tryParse("your_namespace:magic_item/attribute/spellpower"))
                                nameList.add(fallback_affix.get())
                                flag_fallback = false
                            }
                            // Collections.shuffle(nameList, jRandom)
                            let component = AffixHelper.getName(itemStack)
                            let contents = component.getContents()
                            let name_key = contents.getKey()

                            component = Component.translatable(name_key, nameList.get(0).getName(true), "", nameList.size() > 1 ? nameList.get(1).getName(false) : "").setStyle(component.getStyle())
                            AffixHelper.setName(itemStack, component)
                        })
                    } else {
                        return
                    }
                }
                else {
                    return callback.clear()
                }
            })
            reforgingMenuMap.put(container, schedule)
        }
    })
    PlayerEvents.inventoryClosed(e => {
        let container = e.getInventoryContainer()
        if (container instanceof ReforgingMenu) {
            let temp = reforgingMenuMap.get(container)
            if (temp.callback) temp.callback.clear();
            reforgingMenuMap.remove(container)
        }
        console.log(`${e.player}closed ReforgingMenu`);
    })
    ServerFunc.randomizeAffixName = function(name) {
        let affix_split = name.split("/")
        // console.log(affix_split);
        // there's a problem, so return without change
        let name_extracted = affix_split[affix_split.length - 1]
        return name_extracted
    }
    ServerFunc.updateConfigAndFakeLocalization = function() {
        // let config_cache = configObj.cache
        // let cache_items = config_cache.recorded_irons_items = {}
        // let cache_affixes = config_cache.magicAffixMap = {}
        // let fake_localization = global.fake_localization
        // for (const key of recorded_irons_items.keySet()) {
        //     cache_items[key] = recorded_irons_items.get(key)
        // }
        // let flag = true
        // for (const key of magicAffixMap.keySet()) {
        //     let this_school_affixes = cache_affixes[key] = []
        //     for (const affix of magicAffixMap.get(key).affixes)
        //     {
        //         let affix_locstr = AffixRegistry.INSTANCE.getKey(affix).toString()
        //         this_school_affixes.push(affix_locstr)
        //         let prefix_key = `affix.${affix_locstr}`
        //         let suffix_key = `affix.${affix_locstr}.suffix`
        //         let preffix_value = fake_localization[prefix_key]
        //         if (!preffix_value) {
        //             fake_localization[prefix_key] = ServerFunc.randomizeAffixName(affix_locstr)
        //         }
        //         let suffix_value = fake_localization[suffix_key]
        //         if (!suffix_value) {
        //             fake_localization[suffix_key] = "of " + ServerFunc.randomizeAffixName(affix_locstr)
        //         }
        //     }
        // }
        // console.log(config_cache);
        // JsonIO.write(global.localizationPath, global.fake_localization)
        // JsonIO.write(global.configFilePath, configObj)
    }
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
        if (configObj["update_localization"]) {
            // ServerFunc.updateConfigAndFakeLocalization()
        }
        console.log('unloaded server')
    })
})()